import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function BreathingBiofeedback({ onComplete, gameName, gameIcon }) {
  const [phase, setPhase] = useState("ready");
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [heartRate, setHeartRate] = useState(85);
  const [calmness, setCalmness] = useState(30);
  const totalCycles = 6;

  useEffect(() => {
    if (phase === "ready") return;

    const phases = [
      { name: "inhale", duration: 4000, text: "Breathe In", count: 4 },
      { name: "hold1", duration: 4000, text: "Hold", count: 4 },
      { name: "exhale", duration: 4000, text: "Breathe Out", count: 4 },
      { name: "hold2", duration: 4000, text: "Hold", count: 4 }
    ];

    let currentPhaseIndex = phases.findIndex(p => p.name === phase);
    
    const timer = setTimeout(() => {
      if (phase === "hold2") {
        if (cycleCount + 1 >= totalCycles) {
          setPhase("complete");
        } else {
          setCycleCount(cycleCount + 1);
          setPhase("inhale");
          setHeartRate(Math.max(60, heartRate - 3));
          setCalmness(Math.min(100, calmness + 12));
        }
      } else {
        setPhase(phases[currentPhaseIndex + 1].name);
      }
    }, phases[currentPhaseIndex].duration);

    if (soundEnabled && phase !== "complete") {
      const utterance = new SpeechSynthesisUtterance(phases[currentPhaseIndex].text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }

    return () => clearTimeout(timer);
  }, [phase, cycleCount, soundEnabled]);

  const startExercise = () => {
    setPhase("inhale");
    setCycleCount(0);
  };

  const getPhaseInfo = () => {
    const phases = {
      inhale: { text: "Breathe In", color: "from-blue-400 to-cyan-400", instruction: "Slowly through your nose" },
      hold1: { text: "Hold", color: "from-purple-400 to-pink-400", instruction: "Keep your lungs full" },
      exhale: { text: "Breathe Out", color: "from-green-400 to-emerald-400", instruction: "Slowly through your mouth" },
      hold2: { text: "Hold", color: "from-yellow-400 to-orange-400", instruction: "Empty lungs relaxed" }
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
            <p className="text-gray-600 mb-6 leading-relaxed">
              Box breathing (4-4-4-4) is used by Navy SEALs and emergency responders to quickly calm the nervous system. 
              Watch your biofeedback metrics improve in real-time.
            </p>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">How it works:</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• Breathe in for 4 seconds</li>
                <li>• Hold for 4 seconds</li>
                <li>• Breathe out for 4 seconds</li>
                <li>• Hold for 4 seconds</li>
                <li>• Repeat 6 cycles</li>
              </ul>
            </div>
            <Button
              onClick={startExercise}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
            >
              Start Box Breathing
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Excellent Work!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                <p className="text-3xl font-bold text-red-600">{heartRate}</p>
                <p className="text-xs text-green-600 mt-1">↓ 25 BPM</p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <span className="text-4xl mb-2 block">🧘</span>
                <p className="text-sm text-gray-600 mb-1">Calmness</p>
                <p className="text-3xl font-bold text-blue-600">{calmness}%</p>
                <p className="text-xs text-green-600 mt-1">↑ 70%</p>
              </div>
            </div>

            <p className="text-gray-600 mb-8">How do you feel now?</p>
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

      <div className="text-center max-w-4xl w-full">
        {/* Biofeedback Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Cycle</p>
            <p className="text-2xl font-bold text-purple-600">{cycleCount + 1}/{totalCycles}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{heartRate}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-1">Calmness</p>
            <p className="text-2xl font-bold text-blue-600">{calmness}%</p>
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="relative w-96 h-96 mx-auto mb-8">
          <motion.div
            animate={{ 
              scale: (phase === "inhale" || phase === "hold1") ? 1.5 : 1,
              rotate: cycleCount * 90
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseInfo.color} opacity-60 blur-xl`}
          />
          <motion.div
            animate={{ 
              scale: (phase === "inhale" || phase === "hold1") ? 1.5 : 1,
              rotate: cycleCount * 90
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className={`absolute inset-8 rounded-full bg-gradient-to-br ${phaseInfo.color} flex items-center justify-center shadow-2xl`}
          >
            <div className="text-white text-center">
              <p className="text-5xl font-bold mb-3">{phaseInfo.text}</p>
              <p className="text-xl opacity-90">{phaseInfo.instruction}</p>
            </div>
          </motion.div>

          {/* Count indicators in corners */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            4
          </div>
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
            4
          </div>
        </div>

        <p className="text-gray-600 text-lg">
          Notice your body relaxing with each breath
        </p>
      </div>
    </div>
  );
}