import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Lock } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { id: "first_game", icon: "🎮", name: "First Step", desc: "Complete your first game", condition: (g) => g.length >= 1 },
  { id: "five_games", icon: "⭐", name: "Explorer", desc: "Play 5 games", condition: (g) => g.length >= 5 },
  { id: "ten_games", icon: "🌟", name: "Dedicated", desc: "Play 10 games", condition: (g) => g.length >= 10 },
  { id: "mood_up", icon: "📈", name: "Mood Booster", desc: "Improve mood after a game", condition: (g) => g.some(gm => {
    const moods = ["very_low", "low", "neutral", "good", "very_good"];
    return moods.indexOf(gm.mood_after) > moods.indexOf(gm.mood_before);
  })},
  { id: "diverse", icon: "🌈", name: "Well Rounded", desc: "Try 5 different games", condition: (g) => new Set(g.map(gm => gm.game_id)).size >= 5 },
  { id: "assessor", icon: "🧠", name: "Self-Aware", desc: "Complete 2 assessments", condition: (g, a) => a.length >= 2 },
  { id: "level5", icon: "🏆", name: "Wellness Warrior", desc: "Reach Level 5", condition: (g, a, u) => (u?.level || 1) >= 5 },
  { id: "streak7", icon: "🔥", name: "On Fire", desc: "7-day streak", condition: (g) => {
    const dates = [...new Set(g.map(gm => new Date(gm.completed_date).toISOString().split('T')[0]))].sort().reverse();
    let streak = 0;
    let expected = new Date().toISOString().split('T')[0];
    for (const date of dates) {
      if (date === expected) { streak++; const d = new Date(expected); d.setDate(d.getDate() - 1); expected = d.toISOString().split('T')[0]; }
      else break;
    }
    return streak >= 7;
  }}
];

export default function AchievementBadges({ gameProgress, assessments, user }) {
  const earned = badges.filter(b => b.condition(gameProgress, assessments, user));
  const locked = badges.filter(b => !b.condition(gameProgress, assessments, user));

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Achievements
          <span className="ml-auto text-sm font-normal text-gray-500">{earned.length}/{badges.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Earned */}
        {earned.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Unlocked 🎉</p>
            <div className="grid grid-cols-4 gap-2">
              {earned.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: i * 0.1 }}
                  className="flex flex-col items-center p-2 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl"
                  title={badge.desc}
                >
                  <span className="text-2xl mb-1">{badge.icon}</span>
                  <span className="text-xs text-gray-700 text-center font-medium leading-tight">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {earned.length === 0 ? "Start earning badges!" : "Next to unlock"}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {locked.slice(0, 4).map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center p-2 bg-gray-50 border-2 border-gray-200 rounded-xl opacity-50"
                title={badge.desc}
              >
                <div className="relative">
                  <span className="text-2xl blur-sm">{badge.icon}</span>
                  <Lock className="w-3 h-3 text-gray-400 absolute -bottom-0.5 -right-0.5" />
                </div>
                <span className="text-xs text-gray-400 text-center font-medium leading-tight mt-1">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>

        {earned.length === 0 && (
          <div className="mt-4 text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-sm text-purple-600 font-medium">Complete your first activity to earn badges! 🎯</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}