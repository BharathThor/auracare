import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function BreathingExercise({ onComplete, gameName, gameIcon }) {
  const [phase, setPhase] = useState("ready");
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const totalCycles = 5;

  useEffect(() => {
    if (phase === "ready") return;

    const phases = [
      { name: "inhale", duration: 4000, text: "Breathe In", instruction: "Through your nose for 4 seconds" },
      { name: "hold", duration: 7000, text: "Hold", instruction: "Keep your breath for 7 seconds" },
      { name: "exhale", duration: 8000, text: "Breathe Out", instruction: "Through your mouth for 8 seconds" }
    ];

    let currentPhaseIndex = phases.findIndex(p => p.name === phase);
    
    const timer = setTimeout(() => {
      if (phase === "exhale") {
        if (cycleCount + 1 >= totalCycles) {
          setPhase("complete");
        } else {
          setCycleCount(cycleCount + 1);
          setPhase("inhale");
        }
      } else {
        setPhase(phases[currentPhaseIndex + 1].name);
      }
    }, phases[currentPhaseIndex].duration);

    if (soundEnabled && phase !== "complete") {
      const utterance = new SpeechSynthesisUtterance(phases[currentPhaseIndex].text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }

    return () => clearTimeout(timer);
  }, [phase, cycleCount, soundEnabled]);

  const startExercise = () => {
    setPhase("inhale");
    setCycleCount(0);
  };

  const getCircleSize = () => {
    if (phase === "inhale") return "scale-150";
    if (phase === "hold") return "scale-150";
    if (phase === "exhale") return "scale-100";
    return "scale-100";
  };

  const getPhaseInfo = () => {
    const phases = {
      inhale: { text: "Breathe In", instruction: "Through your nose for 4 seconds", color: "from-blue-400 to-cyan-400" },
      hold: { text: "Hold", instruction: "Keep your breath for 7 seconds", color: "from-purple-400 to-pink-400" },
      exhale: { text: "Breathe Out", instruction: "Through your mouth for 8 seconds", color: "from-green-400 to-emerald-400" }
    };
    return phases[phase] || phases.inhale;
  };

  if (phase === "ready") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">{gameIcon}</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{gameName}</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The 4-7-8 breathing technique activates your parasympathetic nervous system, 
              helping you relax deeply. Follow the visual cues and listen to the voice guidance.
            </p>
            <Button
              onClick={startExercise}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
            >
              Start Breathing Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beautiful Work!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've completed {totalCycles} breathing cycles. How do you feel now?
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

  const phaseInfo = getPhaseInfo();

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

      <div className="text-center">
        <div className="mb-8">
          <p className="text-sm text-gray-600 mb-2">Cycle {cycleCount + 1} of {totalCycles}</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000"
              style={{ width: `${((cycleCount) / totalCycles) * 100}%` }}
            />
          </div>
        </div>

        <div className="relative w-80 h-80 mx-auto mb-8">
          <motion.div
            animate={{ scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseInfo.color} opacity-60 blur-xl`}
          />
          <motion.div
            animate={{ scale: phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1 }}
            transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 8 : 0.5, ease: "easeInOut" }}
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${phaseInfo.color} flex items-center justify-center shadow-2xl`}
          >
            <div className="text-white text-center">
              <p className="text-4xl font-bold mb-2">{phaseInfo.text}</p>
              <p className="text-lg opacity-90">{phaseInfo.instruction}</p>
            </div>
          </motion.div>
        </div>

        <p className="text-gray-600 text-lg">
          Focus on your breath and let go of any tension
        </p>
      </div>
    </div>
  );
}