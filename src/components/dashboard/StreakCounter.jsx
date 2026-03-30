import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { differenceInCalendarDays, parseISO } from "date-fns";

export default function StreakCounter({ user, gameProgress, onXP }) {
  const [streak, setStreak] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    if (!gameProgress || gameProgress.length === 0) return;

    // Calculate streak from game activity
    const dates = gameProgress.map(g =>
      new Date(g.completed_date).toISOString().split('T')[0]
    );
    const uniqueDates = [...new Set(dates)].sort().reverse();

    let s = 0;
    const today = new Date().toISOString().split('T')[0];
    let expected = today;

    for (const date of uniqueDates) {
      if (date === expected) {
        s++;
        const d = new Date(expected);
        d.setDate(d.getDate() - 1);
        expected = d.toISOString().split('T')[0];
      } else {
        break;
      }
    }
    setStreak(s);

    if (s > 0 && s % 7 === 0 && !celebrated) {
      onXP && onXP(50, `${s}-day streak!`);
      setCelebrated(true);
    }
  }, [gameProgress]);

  const milestones = [1, 3, 7, 14, 30];
  const nextMilestone = milestones.find(m => m > streak) || 30;
  const progress = (streak / nextMilestone) * 100;

  const flameColor = streak >= 7 ? "text-orange-500" : streak >= 3 ? "text-yellow-500" : "text-gray-400";

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Daily Streak</h3>
          <Flame className={`w-6 h-6 ${flameColor}`} />
        </div>

        <div className="text-center mb-4">
          <motion.div
            key={streak}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative inline-block"
          >
            <div className={`text-7xl font-black bg-gradient-to-br ${
              streak >= 7 ? "from-orange-400 to-red-500" :
              streak >= 3 ? "from-yellow-400 to-orange-400" :
              "from-gray-300 to-gray-400"
            } bg-clip-text text-transparent`}>
              {streak}
            </div>
          </motion.div>
          <p className="text-gray-600 font-medium">day{streak !== 1 ? "s" : ""} in a row 🔥</p>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{streak} days</span>
            <span>Next: {nextMilestone} days</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        <div className="flex gap-1 justify-center">
          {milestones.map(m => (
            <div
              key={m}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                streak >= m
                  ? "bg-gradient-to-br from-orange-400 to-red-500 border-orange-400 text-white"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              {m}
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-gray-500 mt-3">
          {streak === 0 ? "Complete any activity to start your streak!" :
           streak < 3 ? "Keep going! 3 days = bonus XP" :
           streak < 7 ? "Amazing! 7 days = 50 bonus XP" :
           "You're on fire! Keep it up! 🔥"}
        </p>
      </CardContent>
    </Card>
  );
}