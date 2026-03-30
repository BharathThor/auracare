import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Calendar, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import MentalHealthInsight from "../components/dashboard/MentalHealthInsight";
import DailyRecommendations from "../components/dashboard/DailyRecommendations";
import QuickAccessGames from "../components/dashboard/QuickAccessGames";

export default function Dashboard() {
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: assessments = [], refetch: refetchAssessments } = useQuery({
    queryKey: ['assessments', user?.email],
    queryFn: () => user ? base44.entities.Assessment.filter({ user_email: user.email }, '-date_taken', 1) : [],
    enabled: !!user
  });

  const { data: recommendations = [], refetch: refetchRecommendations } = useQuery({
    queryKey: ['recommendations', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date().toISOString().split('T')[0];
      const recs = await base44.entities.DailyRecommendation.filter({ 
        user_email: user.email,
        date: today
      });
      return recs;
    },
    enabled: !!user
  });

  const latestAssessment = assessments[0];

  const generateDailyRecommendations = async () => {
    if (!user || !latestAssessment) return;
    
    setGeneratingRecommendations(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 personalized daily wellness recommendations for ${user.preferred_name || user.full_name}.
        
        Their mental health profile:
        - Primary state: ${latestAssessment.mental_health_state.primary_state}
        - Severity: ${latestAssessment.mental_health_state.severity}
        - Secondary concerns: ${latestAssessment.mental_health_state.secondary_states.join(', ')}
        - Age: ${user.age}, Profession: ${user.profession}
        
        Create 5 specific, actionable recommendations across different categories:
        - mindfulness (breathing, meditation, grounding)
        - physical (movement, exercise, walks)
        - social (connection, communication)
        - creative (art, journaling, music)
        - rest (sleep hygiene, relaxation)
        
        Each recommendation should:
        1. Be specific and actionable
        2. Have a realistic duration (5-30 minutes)
        3. Be suitable for their current mental state
        4. Include a motivational title
        
        Also include an uplifting motivational message for today.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { 
                    type: "string",
                    enum: ["mindfulness", "physical", "social", "creative", "rest"]
                  },
                  duration: { type: "string" }
                },
                required: ["id", "title", "description", "category", "duration"]
              }
            },
            motivational_message: { type: "string" }
          },
          required: ["recommendations", "motivational_message"]
        }
      });

      const today = new Date().toISOString().split('T')[0];
      
      await base44.entities.DailyRecommendation.create({
        user_email: user.email,
        date: today,
        recommendations: result.recommendations.map(r => ({ ...r, completed: false })),
        motivational_message: result.motivational_message
      });

      refetchRecommendations();
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    
    setGeneratingRecommendations(false);
  };

  useEffect(() => {
    if (user && !user.onboarding_completed) {
      window.location.href = createPageUrl("Onboarding");
    }
  }, [user]);

  useEffect(() => {
    if (user && latestAssessment && recommendations.length === 0) {
      generateDailyRecommendations();
    }
  }, [user, latestAssessment, recommendations]);

  if (!user || !latestAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AuraCare</h2>
            <p className="text-gray-600 mb-6">
              Let's start your wellness journey with a quick assessment to understand how you're feeling.
            </p>
            <Link to={createPageUrl("Assessment")}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Take Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todayRecommendation = recommendations[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.preferred_name || user.full_name} 💜
          </h1>
          <p className="text-lg text-gray-600">
            Here's your personalized wellness dashboard for today
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <MentalHealthInsight assessment={latestAssessment} user={user} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="w-5 h-5" />
                  Last Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">
                  {format(new Date(latestAssessment.date_taken), 'MMM d, yyyy')}
                </p>
                <p className="text-white/90 mb-6">
                  Regular check-ins help us support you better
                </p>
                <Link to={createPageUrl("Assessment")}>
                  <Button variant="secondary" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          {generatingRecommendations ? (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your personalized recommendations...</p>
              </CardContent>
            </Card>
          ) : todayRecommendation ? (
            <DailyRecommendations 
              recommendation={todayRecommendation} 
              onRefresh={generateDailyRecommendations}
              refetchRecommendations={refetchRecommendations}
            />
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <QuickAccessGames mentalState={latestAssessment.mental_health_state} />
        </motion.div>
      </div>
    </div>
  );
}