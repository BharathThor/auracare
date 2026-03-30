import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function ColorMoodGame({ onComplete, gameName, gameIcon }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [drawing, setDrawing] = useState(false);
  const [reflection, setReflection] = useState("");
  const [step, setStep] = useState(1);

  const colors = [
    { name: "Calm Blue", color: "#3B82F6", mood: "peaceful" },
    { name: "Energetic Orange", color: "#F97316", mood: "energetic" },
    { name: "Happy Yellow", color: "#EAB308", mood: "joyful" },
    { name: "Balanced Green", color: "#22C55E", mood: "balanced" },
    { name: "Creative Purple", color: "#A855F7", mood: "creative" },
    { name: "Passionate Red", color: "#EF4444", mood: "passionate" },
    { name: "Gentle Pink", color: "#EC4899", mood: "gentle" },
    { name: "Grounded Brown", color: "#92400E", mood: "grounded" }
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-4xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{gameIcon}</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Mood Color</h2>
              <p className="text-gray-600 text-lg">
                Which color represents how you're feeling right now?
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {colors.map((colorOption) => (
                <motion.button
                  key={colorOption.name}
                  onClick={() => setSelectedColor(colorOption)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-6 rounded-2xl border-4 transition-all ${
                    selectedColor?.name === colorOption.name
                      ? "border-purple-500 shadow-xl"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: colorOption.color }}
                >
                  <p className="text-white font-semibold text-lg drop-shadow-lg">
                    {colorOption.name}
                  </p>
                </motion.button>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedColor}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div 
                className="w-24 h-24 rounded-full mx-auto mb-4 shadow-xl"
                style={{ backgroundColor: selectedColor.color }}
              />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Express Yourself</h2>
              <p className="text-gray-600 text-lg">
                Why did you choose {selectedColor.name}? What does this color mean to you today?
              </p>
            </div>

            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Take your time to reflect on your feelings..."
              className="min-h-40 text-base border-purple-200 focus:border-purple-400 mb-6"
            />

            <Button
              onClick={() => setStep(3)}
              disabled={!reflection.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Complete
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10 text-center">
          <div className="text-7xl mb-6">🎨</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Beautiful Expression!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You've taken time to connect with your emotions. How do you feel now?
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