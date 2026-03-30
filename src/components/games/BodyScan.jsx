import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function BodyScan({ onComplete }) {
  const [currentPart, setCurrentPart] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [clickedParts, setClickedParts] = useState(new Set());

  const bodyParts = [
    { id: "feet", name: "Feet & Toes", instruction: "Notice any tension in your feet. Wiggle your toes. Relax.", y: 380, x: 200 },
    { id: "legs", name: "Legs", instruction: "Feel the weight of your legs. Let them sink down. Release.", y: 280, x: 200 },
    { id: "hips", name: "Hips & Lower Back", instruction: "Notice any tightness in your hips. Breathe into this area.", y: 200, x: 200 },
    { id: "stomach", name: "Stomach & Chest", instruction: "Feel your belly rise and fall with each breath. Soften.", y: 140, x: 200 },
    { id: "hands", name: "Hands & Arms", instruction: "Notice your hands. Open and close them gently. Relax.", y: 180, x: 120 },
    { id: "shoulders", name: "Shoulders & Neck", instruction: "Drop your shoulders away from your ears. Release tension.", y: 100, x: 200 },
    { id: "face", name: "Face & Head", instruction: "Relax your jaw. Soften your forehead. Let go.", y: 40, x: 200 }
  ];

  const handlePartClick = (index) => {
    if (index !== currentPart) return;
    
    setClickedParts(new Set([...clickedParts, index]));
    
    if (soundEnabled) {
      const part = bodyParts[index];
      const utterance = new SpeechSynthesisUtterance(part.instruction);
      utterance.rate = 0.7;
      window.speechSynthesis.speak(utterance);
    }
    
    setTimeout(() => {
      if (index < bodyParts.length - 1) {
        setCurrentPart(index + 1);
      } else {
        setCurrentPart(bodyParts.length);
      }
    }, 5000);
  };

  if (currentPart >= bodyParts.length) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🧠</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Body Scan Complete</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've brought mindful awareness to your entire body. This practice helps reduce stress 
              and increases body-mind connection.
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

  const part = bodyParts[currentPart];

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

      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Interactive Body Scan</h2>
          <p className="text-gray-600">Click on the highlighted body part to begin</p>
          <div className="mt-4">
            <div className="inline-flex gap-2">
              {bodyParts.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    clickedParts.has(index) ? "bg-green-500" : 
                    index === currentPart ? "bg-purple-500" :
                    "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Body Illustration */}
          <div className="relative h-[500px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 flex items-center justify-center">
            <svg viewBox="0 0 400 500" className="w-full h-full">
              {/* Simple body outline */}
              <ellipse cx="200" cy="40" rx="40" ry="50" fill={clickedParts.has(6) ? "#10B981" : currentPart === 6 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <rect x="180" y="90" width="40" height="60" rx="10" fill={clickedParts.has(5) ? "#10B981" : currentPart === 5 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <rect x="175" y="140" width="50" height="80" rx="15" fill={clickedParts.has(3) ? "#10B981" : currentPart === 3 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <rect x="170" y="200" width="60" height="100" rx="20" fill={clickedParts.has(2) ? "#10B981" : currentPart === 2 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <rect x="165" y="280" width="70" height="120" rx="25" fill={clickedParts.has(1) ? "#10B981" : currentPart === 1 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <ellipse cx="200" cy="430" rx="50" ry="30" fill={clickedParts.has(0) ? "#10B981" : currentPart === 0 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              
              {/* Arms */}
              <rect x="90" y="140" width="80" height="100" rx="20" fill={clickedParts.has(4) ? "#10B981" : currentPart === 4 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              <rect x="230" y="140" width="80" height="100" rx="20" fill={clickedParts.has(4) ? "#10B981" : currentPart === 4 ? "#A855F7" : "#D1D5DB"} stroke="#6B7280" strokeWidth="2" opacity="0.8" />
              
              {/* Click indicator */}
              {currentPart < bodyParts.length && (
                <motion.circle
                  cx={part.x}
                  cy={part.y}
                  r="20"
                  fill="none"
                  stroke="#A855F7"
                  strokeWidth="3"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
            </svg>
            
            {/* Click button over current part */}
            {currentPart < bodyParts.length && (
              <Button
                onClick={() => handlePartClick(currentPart)}
                className="absolute bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 shadow-2xl"
                style={{
                  top: `${(part.y / 500) * 100}%`,
                  left: `${(part.x / 400) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                Click
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div>
            <motion.div
              key={currentPart}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{part.name}</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">{part.instruction}</p>
              
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  Take your time. Breathe deeply. Notice any sensations without judgment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}