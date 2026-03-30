import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressiveRelaxation({ onComplete, gameName, gameIcon }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [phase, setPhase] = useState("tense");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const steps = [
    { name: "Feet & Toes", instruction: "Curl your toes tightly", icon: "🦶" },
    { name: "Calves", instruction: "Point your toes upward", icon: "🦵" },
    { name: "Thighs", instruction: "Tighten your thigh muscles", icon: "💪" },
    { name: "Abdomen", instruction: "Pull your belly button in", icon: "⭕" },
    { name: "Chest", instruction: "Take a deep breath and hold", icon: "🫁" },
    { name: "Hands", instruction: "Make tight fists", icon: "✊" },
    { name: "Arms", instruction: "Flex your biceps", icon: "💪" },
    { name: "Shoulders", instruction: "Raise shoulders to ears", icon: "🤷" },
    { name: "Neck", instruction: "Gently tilt head back", icon: "🗣️" },
    { name: "Face", instruction: "Scrunch all facial muscles", icon: "😖" }
  ];

  useEffect(() => {
    if (currentStep === -1) return;
    if (currentStep >= steps.length) return;

    const timing = phase === "tense" ? 5000 : 10000;
    
    const timer = setTimeout(() => {
      if (phase === "tense") {
        setPhase("release");
        if (soundEnabled) {
          const utterance = new SpeechSynthesisUtterance(`Release and relax your ${steps[currentStep].name}`);
          utterance.rate = 0.8;
          window.speechSynthesis.speak(utterance);
        }
      } else {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setPhase("tense");
          if (soundEnabled) {
            const utterance = new SpeechSynthesisUtterance(`Tense your ${steps[currentStep + 1].name}. ${steps[currentStep + 1].instruction}`);
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
          }
        } else {
          setCurrentStep(steps.length);
        }
      }
    }, timing);

    return () => clearTimeout(timer);
  }, [currentStep, phase, soundEnabled]);

  if (currentStep === -1) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">{gameIcon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{gameName}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Find a comfortable position. We'll systematically tense and release each muscle group, 
              starting from your feet and moving up to your face. Listen to the voice guidance and follow along.
            </p>
            <Button
              onClick={() => {
                setCurrentStep(0);
                if (soundEnabled) {
                  const utterance = new SpeechSynthesisUtterance(`Let's begin. Tense your ${steps[0].name}. ${steps[0].instruction}`);
                  utterance.rate = 0.8;
                  window.speechSynthesis.speak(utterance);
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
            >
              Start Relaxation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep >= steps.length) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🧘</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Deeply Relaxed</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've completed the full body relaxation. Notice the difference in how your body feels.
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

      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">Step {currentStep + 1} of {steps.length}</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={`${currentStep}-${phase}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="text-9xl mb-6">{step.icon}</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{step.name}</h2>
          
          {phase === "tense" ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <p className="text-2xl font-semibold text-red-800 mb-2">TENSE</p>
              <p className="text-lg text-gray-700">{step.instruction}</p>
              <p className="text-sm text-gray-500 mt-4">Hold for 5 seconds</p>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
              <p className="text-2xl font-semibold text-green-800 mb-2">RELEASE & RELAX</p>
              <p className="text-lg text-gray-700">Let go completely. Feel the tension melt away.</p>
              <p className="text-sm text-gray-500 mt-4">Breathe and relax for 10 seconds</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}