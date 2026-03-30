import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Target, Zap, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const challengesByState = {
  anxiety: [
    { id: "c1", title: "Box Breathing Master", desc: "Complete 3 full rounds of box breathing", gameId: "breathing-biofeedback", xp: 30, icon: "🫁", time: "5 min" },
    { id: "c2", title: "Thought Investigator", desc: "Challenge one negative thought using the thought detective", gameId: "thought-reframing", xp: 40, icon: "🔍", time: "10 min" },
    { id: "c3", title: "Grounding Champion", desc: "Complete the full 5-4-3-2-1 grounding exercise", gameId: "grounding-54321", xp: 25, icon: "🌟", time: "5 min" }
  ],
  depression: [
    { id: "c4", title: "Action Hero", desc: "Complete 1 mood-lifting activity from your list", gameId: "mood-lifter", xp: 35, icon: "🎯", time: "15 min" },
    { id: "c5", title: "Gratitude Architect", desc: "Build a gratitude chain of 5+ links", gameId: "gratitude-chain", xp: 25, icon: "⛓️", time: "10 min" },
    { id: "c6", title: "Win Collector", desc: "Log 3 small victories from your day", gameId: "achievement-tracker", xp: 20, icon: "🏆", time: "5 min" }
  ],
  stress: [
    { id: "c7", title: "Worry Warrior", desc: "Complete a worry time session", gameId: "worry-time", xp: 30, icon: "⏰", time: "10 min" },
    { id: "c8", title: "Body Whisperer", desc: "Complete the full interactive body scan", gameId: "body-scan", xp: 40, icon: "🧠", time: "10 min" },
    { id: "c9", title: "Tension Buster", desc: "Squeeze the stress ball 20 times", gameId: "stress-ball", xp: 15, icon: "⚽", time: "5 min" }
  ],
  burnout: [
    { id: "c10", title: "Energy Mapper", desc: "Map your energy drainers and rechargers", gameId: "energy-matrix", xp: 35, icon: "⚡", time: "10 min" },
    { id: "c11", title: "Boundary Builder", desc: "Practice setting a boundary", gameId: "boundary-practice", xp: 30, icon: "🛡️", time: "10 min" },
    { id: "c12", title: "Rest Champion", desc: "Complete a full rest & recovery session", gameId: "rest-reminder", xp: 25, icon: "💤", time: "10 min" }
  ],
  general_wellness: [
    { id: "c13", title: "Emotion Explorer", desc: "Complete the emotion wheel exercise", gameId: "emotion-wheel", xp: 25, icon: "🎨", time: "10 min" },
    { id: "c14", title: "Mood Tracker", desc: "Track your mood with notes", gameId: "mood-tracker", xp: 20, icon: "📊", time: "5 min" },
    { id: "c15", title: "Connection Maker", desc: "Build your social connection plan", gameId: "social-connection", xp: 30, icon: "💝", time: "10 min" }
  ]
};

export default function DailyChallenge({ user, onXP, mentalState }) {
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [expandedChallenge, setExpandedChallenge] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const storageKey = `challenges_${user?.email}_${today}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setCompletedChallenges(JSON.parse(stored));
  }, [user]);

  const primaryState = mentalState?.primary_state || "general_wellness";
  const challenges = challengesByState[primaryState] || challengesByState.general_wellness;

  const totalXP = challenges.reduce((sum, c) => sum + c.xp, 0);
  const earnedXP = challenges.filter(c => completedChallenges.includes(c.id)).reduce((sum, c) => sum + c.xp, 0);
  const allComplete = completedChallenges.length >= challenges.length;

  const markComplete = (challenge) => {
    if (completedChallenges.includes(challenge.id)) return;
    const updated = [...completedChallenges, challenge.id];
    setCompletedChallenges(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    onXP && onXP(challenge.xp, `${challenge.title} completed!`);
  };

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-5">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <Target className="w-7 h-7" />
            <div>
              <h3 className="font-bold text-xl">Daily Challenges</h3>
              <p className="text-white/80 text-sm">Personalized for your {primaryState.replace("_", " ")} journey</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black">{earnedXP}/{totalXP}</div>
            <div className="text-white/80 text-sm flex items-center gap-1 justify-end">
              <Zap className="w-4 h-4" /> XP earned
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${totalXP > 0 ? (earnedXP / totalXP) * 100 : 0}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between text-white/80 text-xs mt-1">
            <span>{completedChallenges.length}/{challenges.length} completed</span>
            {allComplete && <span className="font-bold">🎉 All done!</span>}
          </div>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="grid md:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => {
            const isCompleted = completedChallenges.includes(challenge.id);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                  isCompleted
                    ? "border-green-400 bg-green-50"
                    : "border-purple-100 hover:border-purple-300 hover:shadow-md bg-gradient-to-br from-purple-50 to-pink-50"
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}
                <div className="p-5">
                  <div className="text-4xl mb-3">{challenge.icon}</div>
                  <h4 className={`font-bold text-base mb-1 ${isCompleted ? "text-green-800" : "text-gray-900"}`}>
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">{challenge.desc}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{challenge.time}</span>
                      <span className="flex items-center gap-1 text-yellow-600 font-bold"><Zap className="w-3 h-3" />+{challenge.xp} XP</span>
                    </div>
                  </div>

                  {!isCompleted ? (
                    <Link to={createPageUrl(`GameDetail?id=${challenge.gameId}`)}>
                      <Button
                        onClick={() => markComplete(challenge)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm h-9"
                      >
                        Start Challenge
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="w-full border-green-400 text-green-700 text-sm h-9" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed!
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}