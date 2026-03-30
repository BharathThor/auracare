import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Volume2, VolumeX, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function GroundingExercise({ onComplete, gameName, gameIcon }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [responses, setResponses] = useState({});

  const steps = [
    { number: 5, sense: "see", icon: "👁️", question: "Name 5 things you can see around you", placeholder: "e.g., a blue lamp, my phone, the window..." },
    { number: 4, sense: "touch", icon: "✋", question: "Name 4 things you can touch", placeholder: "e.g., soft blanket, cool desk, warm cup..." },
    { number: 3, sense: "hear", icon: "👂", question: "Name 3 things you can hear", placeholder: "e.g., birds chirping, distant traffic, my breathing..." },
    { number: 2, sense: "smell", icon: "👃", question: "Name 2 things you can smell", placeholder: "e.g., coffee, fresh air, perfume..." },
    { number: 1, sense: "taste", icon: "👅", question: "Name 1 thing you can taste", placeholder: "e.g., mint from toothpaste, coffee..." }
  ];

  const handleNext = () => {
    if (soundEnabled && currentStep < steps.length) {
      const utterance = new SpeechSynthesisUtterance(steps[currentStep].question);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(steps.length);
    }
  };

  const handleResponse = (stepIndex, value) => {
    setResponses({ ...responses, [stepIndex]: value });
  };

  if (currentStep >= steps.length) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Grounded & Present</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've successfully anchored yourself in the present moment. How do you feel now?
            </p>
            <div className="grid grid-cols-5 gap-3">
              {[
                { value: "very_low", emoji: "😢" },
                { value: "low", emoji: "😟" },
                { value: "neutral", emoji: "😐" },
                { value: "good", emoji: "🙂" },
                { value: "very_good", emoji: "😊" }
              ].map((mood) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  className="h-20 text-4xl border-2 hover:border-purple-400 hover:bg-purple-50"
                  onClick={() => onComplete(mood.value)}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen p-6 flex items-center justify-center relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-6 right-6"
        onClick={() => setSoundEnabled(!soundEnabled)}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </Button>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{step.icon}</div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-white text-3xl font-bold mb-4">
                {step.number}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{step.question}</h2>
            </div>

            <div className="space-y-4">
              {Array.from({ length: step.number }).map((_, index) => (
                <div key={index} className="relative">
                  <Input
                    placeholder={`${index + 1}. ${step.placeholder}`}
                    value={responses[`${currentStep}-${index}`] || ""}
                    onChange={(e) => handleResponse(`${currentStep}-${index}`, e.target.value)}
                    className="h-14 text-base border-purple-200 focus:border-purple-400 pr-12"
                  />
                  {responses[`${currentStep}-${index}`] && (
                    <Check className="absolute right-4 top-4 w-6 h-6 text-green-500" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index <= currentStep ? "bg-purple-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={!Array.from({ length: step.number }).every((_, i) => responses[`${currentStep}-${i}`])}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
              >
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}