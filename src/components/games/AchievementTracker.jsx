import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";

export default function AchievementTracker({ onComplete }) {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement("");
    }
  };

  const completeActivity = () => {
    if (achievements.length >= 3) {
      setAchievements([...achievements, "completed"]);
    }
  };

  if (achievements.includes("completed")) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're Amazing!</h2>
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <p className="text-lg text-gray-700 mb-4">Your wins today:</p>
              <ul className="space-y-2">
                {achievements.filter(a => a !== "completed").map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2 justify-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-gray-600 mb-8">How do you feel celebrating these wins?</p>
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
            <div className="text-7xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Celebrate Your Wins</h2>
            <p className="text-gray-600 text-lg">
              List at least 3 things you accomplished today, no matter how small
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{achievement}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mb-6">
            <Input
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addAchievement()}
              placeholder="e.g., Made my bed, sent an email, drank water..."
              className="h-14 text-base border-purple-200 focus:border-purple-400"
            />
            <Button
              onClick={addAchievement}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={completeActivity}
            disabled={achievements.length < 3}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg disabled:opacity-50"
          >
            Complete ({achievements.length}/3)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}