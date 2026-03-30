
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AssessmentQuestion from "../components/assessment/AssessmentQuestion";

export default function Assessment() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 15 unique, thoughtful mental health assessment questions for a person with the following profile:
        - Name: ${userData.preferred_name || userData.full_name}
        - Age: ${userData.age}
        - Gender: ${userData.gender}
        - Profession: ${userData.profession}
        - Additional context: ${userData.additional_info || "None provided"}
        
        The questions should:
        1. Be adaptive and personalized to this profile
        2. Cover various aspects: mood, anxiety, stress, sleep, social connections, self-esteem, coping mechanisms
        3. Use empathetic, non-clinical language
        4. Include a mix of scaled responses (1-5) and open-ended questions
        5. Be varied and not repetitive
        6. Each question should have a type (scale or text) and for scale questions, include labels for 1 and 5
        
        Return ONLY a JSON array with this structure:
        [
          {
            "id": 1,
            "question": "question text",
            "type": "scale" or "text",
            "scale_low_label": "label for 1" (only for scale),
            "scale_high_label": "label for 5" (only for scale)
          }
        ]`,
        response_json_schema: {
          type: "object",
          properties: {
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  question: { type: "string" },
                  type: { type: "string", enum: ["scale", "text"] },
                  scale_low_label: { type: "string" },
                  scale_high_label: { type: "string" }
                },
                required: ["id", "question", "type"]
              }
            }
          },
          required: ["questions"]
        }
      });

      setQuestions(result.questions);
      setResponses(new Array(result.questions.length).fill(null));
    } catch (error) {
      console.error("Error loading assessment:", error);
    }
    setLoading(false);
  };

  const handleAnswer = (answer) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = answer;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const analyzeResults = async () => {
    setAnalyzing(true);
    
    try {
      const questionAnswerPairs = questions.map((q, i) => ({
        question: q.question,
        answer: String(responses[i]) // Changed this line: Ensure answer is a string
      }));

      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this mental health assessment for ${user.preferred_name || user.full_name}, 
        age ${user.age}, ${user.gender}, ${user.profession}.
        
        Responses:
        ${JSON.stringify(questionAnswerPairs, null, 2)}
        
        Additional context about the person:
        ${user.additional_info || "No additional information provided"}
        
        Provide:
        1. Primary mental health state (anxiety, depression, stress, burnout, or general_wellness)
        2. Severity level (mild, moderate, or significant)
        3. Any secondary concerns
        4. Warm, empathetic feedback (200-300 words) that:
           - Acknowledges their feelings
           - Validates their experience
           - Offers hope and encouragement
           - Suggests next steps
           - Uses their name
        
        Be compassionate and supportive. This is not a diagnosis, but supportive guidance.`,
        response_json_schema: {
          type: "object",
          properties: {
            mental_health_state: {
              type: "object",
              properties: {
                primary_state: {
                  type: "string",
                  enum: ["anxiety", "depression", "stress", "burnout", "general_wellness"]
                },
                severity: {
                  type: "string",
                  enum: ["mild", "moderate", "significant"]
                },
                secondary_states: {
                  type: "array",
                  items: { type: "string" }
                }
              },
              required: ["primary_state", "severity", "secondary_states"]
            },
            empathetic_feedback: { type: "string" }
          },
          required: ["mental_health_state", "empathetic_feedback"]
        }
      });

      await base44.entities.Assessment.create({
        user_email: user.email,
        responses: questionAnswerPairs,
        mental_health_state: analysis.mental_health_state,
        empathetic_feedback: analysis.empathetic_feedback,
        date_taken: new Date().toISOString()
      });

      await base44.auth.updateMe({
        last_assessment_date: new Date().toISOString().split('T')[0]
      });

      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error analyzing assessment:", error);
    }
    
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Preparing your personalized assessment...</p>
        </div>
      </div>
    );
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyzing your responses...</h2>
            <p className="text-gray-600 mb-6">
              Our AI is carefully reviewing your answers to provide personalized insights and support.
            </p>
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQuestion] !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mental Wellness Assessment</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AssessmentQuestion
              question={questions[currentQuestion]}
              answer={responses[currentQuestion]}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 border-purple-300 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg disabled:opacity-50"
          >
            {isLastQuestion ? "Complete Assessment" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
