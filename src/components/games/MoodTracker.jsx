import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function MoodTracker({ onComplete }) {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");

  const moods = [
    { value: "very_low", emoji: "😢", label: "Very Low", color: "from-blue-400 to-blue-600" },
    { value: "low", emoji: "😟", label: "Low", color: "from-indigo-400 to-indigo-600" },
    { value: "neutral", emoji: "😐", label: "Neutral", color: "from-purple-400 to-purple-600" },
    { value: "good", emoji: "🙂", label: "Good", color: "from-pink-400 to-pink-600" },
    { value: "very_good", emoji: "😊", label: "Very Good", color: "from-green-400 to-green-600" }
  ];

  if (mood && note) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mood Recorded</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for checking in with yourself.
            </p>
            <Button
              onClick={() => onComplete(mood)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg"
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
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">😊</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How are you feeling?</h2>
            <p className="text-gray-600 text-lg">Track your emotional state</p>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  mood === m.value
                    ? `border-purple-500 bg-gradient-to-br ${m.color} text-white shadow-xl`
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className={`text-sm font-medium ${mood === m.value ? "text-white" : "text-gray-700"}`}>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          {mood && (
            <div className="space-y-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's contributing to how you feel? (optional)"
                className="min-h-32 text-base border-purple-200 focus:border-purple-400"
              />
              <Button
                onClick={() => note && onComplete(mood)}
                disabled={!note}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
              >
                Save Mood Check
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}