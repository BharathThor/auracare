import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";

export default function WellnessStats({ gameProgress, assessments }) {
  // Build last 7 days activity
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = gameProgress.filter(g =>
      new Date(g.completed_date).toISOString().split('T')[0] === dateStr
    ).length;
    return {
      day: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()],
      count,
      isToday: i === 6
    };
  });

  const totalGames = gameProgress.length;
  const thisWeek = last7Days.reduce((sum, d) => sum + d.count, 0);
  const assessmentCount = assessments.length;

  const stats = [
    { label: "Games Played", value: totalGames, icon: "🎮", color: "text-purple-600" },
    { label: "This Week", value: thisWeek, icon: "📅", color: "text-blue-600" },
    { label: "Assessments", value: assessmentCount, icon: "🧠", color: "text-pink-600" }
  ];

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm h-full">
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Weekly Activity</h3>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-gray-50 rounded-xl p-3"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} barSize={22}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {last7Days.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.count > 0 ? (entry.isToday ? "#A855F7" : "#D8B4FE") : "#F3F4F6"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-gray-400 -mt-1">Activities per day</p>
      </CardContent>
    </Card>
  );
}