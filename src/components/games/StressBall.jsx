import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function StressBall({ onComplete, gameName, gameIcon }) {
  const [squeezes, setSqueezes] = useState(0);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const ballRef = useRef(null);

  const handleSqueeze = () => {
    setIsSqueezing(true);
    setSqueezes(squeezes + 1);
    setTimeout(() => setIsSqueezing(false), 200);
  };

  if (squeezes >= 20) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Great Release!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've squeezed the stress ball {squeezes} times. Feeling more relaxed?
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

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Squeeze the Stress Away</h2>
        <p className="text-gray-600 mb-8 text-lg">Click or tap repeatedly to release tension</p>
        
        <div className="mb-8">
          <p className="text-6xl font-bold text-purple-600 mb-2">{squeezes}</p>
          <p className="text-gray-500">squeezes / 20</p>
          <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto mt-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${(squeezes / 20) * 100}%` }}
            />
          </div>
        </div>

        <motion.button
          ref={ballRef}
          onClick={handleSqueeze}
          animate={{
            scale: isSqueezing ? 0.8 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="w-64 h-64 rounded-full bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 shadow-2xl cursor-pointer hover:shadow-3xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-white text-6xl"
        >
          ⚽
        </motion.button>

        <p className="text-gray-500 mt-8 text-sm">
          Keep squeezing to release physical and emotional tension
        </p>
      </div>
    </div>
  );
}