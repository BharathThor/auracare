import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function GratitudeChain({ onComplete }) {
  const [chain, setChain] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const [step, setStep] = useState(1);

  const addToChain = () => {
    if (currentItem.trim()) {
      setChain([...chain, currentItem.trim()]);
      setCurrentItem("");
    }
  };

  const prompts = [
    "Something small that made you smile today",
    "A person who has helped you recently",
    "Something about your body that works well",
    "A skill or ability you have",
    "Something beautiful you saw today",
    "A challenge you overcame",
    "Something you're looking forward to",
    "A comfort you have access to",
    "Something kind someone did for you",
    "A lesson you learned"
  ];

  if (chain.length >= 5 && step === 1) {
    setStep(2);
  }

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beautiful Chain!</h2>
            
            <div className="mb-8">
              <p className="text-gray-600 mb-6">Your gratitude chain:</p>
              <div className="space-y-3">
                {chain.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4"
                  >
                    <p className="text-gray-700">
                      <span className="font-bold text-yellow-600">Link {index + 1}:</span> {item}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Research shows that regular gratitude practice rewires your brain to notice more positive things. 
              How do you feel after reflecting on these?
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
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">⛓️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Build Your Gratitude Chain</h2>
            <p className="text-gray-600 mb-4">
              Add at least 5 links to create a chain of gratitude
            </p>
            <div className="inline-flex items-center gap-2 bg-yellow-50 border-2 border-yellow-200 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-800 font-semibold">
                {chain.length}/5 links
              </span>
            </div>
          </div>

          <div className="mb-8">
            {chain.length > 0 && (
              <div className="space-y-2 mb-6">
                {chain.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 flex-1">{item}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-purple-900 font-medium mb-2">💡 {prompts[chain.length % prompts.length]}</p>
            </div>

            <div className="flex gap-3">
              <Input
                value={currentItem}
                onChange={(e) => setCurrentItem(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addToChain()}
                placeholder="Type something you're grateful for..."
                className="h-14 text-base border-purple-200 focus:border-purple-400"
              />
              <Button
                onClick={addToChain}
                disabled={!currentItem.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-700">
              <strong>Science says:</strong> Daily gratitude practice increases happiness by 25% 
              and improves sleep quality
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}