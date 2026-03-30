import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

const moods = [
  { value: 1, emoji: "😭", label: "Terrible", color: "from-blue-500 to-blue-700" },
  { value: 2, emoji: "😟", label: "Bad", color: "from-indigo-400 to-indigo-600" },
  { value: 3, emoji: "😐", label: "Okay", color: "from-purple-400 to-purple-600" },
  { value: 4, emoji: "🙂", label: "Good", color: "from-pink-400 to-pink-600" },
  { value: 5, emoji: "😊", label: "Great", color: "from-green-400 to-emerald-600" }
];

export default function MoodCheckin({ user, onXP }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [todayMood, setTodayMood] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`mood_${user?.email}_${today}`);
    if (stored) {
      setTodayMood(JSON.parse(stored));
      setSubmitted(true);
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    const today = new Date().toISOString().split('T')[0];
    const moodData = moods.find(m => m.value === selectedMood);
    localStorage.setItem(`mood_${user?.email}_${today}`, JSON.stringify(moodData));
    setTodayMood(moodData);
    setSubmitted(true);
    onXP && onXP(10, "Mood check-in done!");
  };

  if (submitted && todayMood) {
    return (
      <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
          <div className="text-6xl mb-3">{todayMood.emoji}</div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Feeling {todayMood.label} today</h3>
          <p className="text-gray-500 text-sm mb-4">Mood logged ✓ +10 XP earned</p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${todayMood.color} text-white text-sm font-medium shadow-md`}>
            <Check className="w-4 h-4" />
            Check-in complete
          </div>
          <p className="text-xs text-gray-400 mt-4">Come back tomorrow to check in again</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Daily Mood Check-in</h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">+10 XP</span>
        </div>

        <p className="text-gray-600 text-sm mb-5">How are you feeling right now?</p>

        <div className="grid grid-cols-5 gap-2 mb-5">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                selectedMood === mood.value
                  ? `border-purple-500 bg-gradient-to-br ${mood.color} text-white shadow-lg`
                  : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className={`text-xs font-medium ${selectedMood === mood.value ? "text-white" : "text-gray-600"}`}>
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selectedMood}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
        >
          Log My Mood
        </Button>
      </CardContent>
    </Card>
  );
}