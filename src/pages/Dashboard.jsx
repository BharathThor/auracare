import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, RefreshCw, Loader2, Zap, Trophy, Target, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MentalHealthInsight from "../components/dashboard/MentalHealthInsight";
import DailyRecommendations from "../components/dashboard/DailyRecommendations";
import QuickAccessGames from "../components/dashboard/QuickAccessGames";
import StreakCounter from "../components/dashboard/StreakCounter";
import DailyChallenge from "../components/dashboard/DailyChallenge";
import MoodCheckin from "../components/dashboard/MoodCheckin";
import WellnessStats from "../components/dashboard/WellnessStats";
import AchievementBadges from "../components/dashboard/AchievementBadges";

export default function Dashboard() {
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);
  const [xpGained, setXpGained] = useState(null);

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['assessments', user?.email],
    queryFn: () => user ? base44.entities.Assessment.filter({ user_email: user.email }, '-date_taken', 1) : [],
    enabled: !!user
  });

  const { data: gameProgress = [] } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: () => user ? base44.entities.GameProgress.filter({ user_email: user.email }, '-completed_date', 30) : [],
    enabled: !!user
  });

  const { data: recommendations = [], refetch: refetchRecommendations } = useQuery({
    queryKey: ['recommendations', user?.email],
    queryFn: async () => {
      if (!user) return [];
      const today = new Date().toISOString().split('T')[0];
      return base44.entities.DailyRecommendation.filter({ user_email: user.email, date: today });
    },
    enabled: !!user
  });

  const latestAssessment = assessments[0];
  const todayRecommendation = recommendations[0];

  const awardXP = async (amount, reason) => {
    if (!user) return;
    const currentXP = user.total_xp || 0;
    const currentLevel = user.level || 1;
    const newXP = currentXP + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    await base44.auth.updateMe({ total_xp: newXP, level: newLevel });
    refetchUser();
    setXpGained({ amount, reason });
    setTimeout(() => setXpGained(null), 3000);
  };

  const generateDailyRecommendations = async () => {
    if (!user || !latestAssessment) return;
    setGeneratingRecommendations(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate 5 personalized daily wellness recommendations for ${user.preferred_name || user.full_name}.
        Mental health profile: Primary state: ${latestAssessment.mental_health_state.primary_state}, Severity: ${latestAssessment.mental_health_state.severity}.
        Create 5 actionable recs across: mindfulness, physical, social, creative, rest. Each with id, title, description, category, duration.
        Also include motivational_message.`,
        response_json_schema: {
          type: "object",
          properties: {
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" }, title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string", enum: ["mindfulness", "physical", "social", "creative", "rest"] },
                  duration: { type: "string" }
                },
                required: ["id", "title", "description", "category", "duration"]
              }
            },
            motivational_message: { type: "string" }
          },
          required: ["recommendations", "motivational_message"]
        }
      });
      const today = new Date().toISOString().split('T')[0];
      await base44.entities.DailyRecommendation.create({
        user_email: user.email, date: today,
        recommendations: result.recommendations.map(r => ({ ...r, completed: false })),
        motivational_message: result.motivational_message
      });
      refetchRecommendations();
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
    setGeneratingRecommendations(false);
  };

  useEffect(() => {
    if (user && !user.onboarding_completed) {
      window.location.href = createPageUrl("Onboarding");
    }
  }, [user]);

  useEffect(() => {
    if (user && latestAssessment && recommendations.length === 0) {
      generateDailyRecommendations();
    }
  }, [user, latestAssessment, recommendations]);

  if (!user || !latestAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <Brain className="w-16 h-16 text-purple-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AuraCare</h2>
            <p className="text-gray-600 mb-6">Let's start with a quick assessment to understand how you're feeling.</p>
            <Link to={createPageUrl("Assessment")}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Take Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const level = user.level || 1;
  const totalXP = user.total_xp || 0;
  const xpForNextLevel = level * 200;
  const xpProgress = ((totalXP % 200) / 200) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* XP Toast */}
      <AnimatePresence>
        {xpGained && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -60 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-8 py-4 rounded-full shadow-2xl font-bold text-lg flex items-center gap-3"
          >
            <Zap className="w-6 h-6" />
            +{xpGained.amount} XP — {xpGained.reason}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Level */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Hey, {user.preferred_name || user.full_name} 💜
              </h1>
              <p className="text-gray-600 mt-1">Your wellness journey continues. Keep going!</p>
            </div>

            {/* Level Badge */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-purple-100 min-w-64">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {level}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Level {level} Wellness Warrior</p>
                    <p className="text-xs text-gray-500">{totalXP} XP total</p>
                  </div>
                </div>
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{totalXP % 200}/{200} XP to Level {level + 1}</p>
            </div>
          </div>
        </motion.div>

        {/* Top Row: Streak + Mood Check-in + Stats */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <StreakCounter user={user} gameProgress={gameProgress} onXP={awardXP} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <MoodCheckin user={user} onXP={awardXP} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <WellnessStats gameProgress={gameProgress} assessments={assessments} />
          </motion.div>
        </div>

        {/* Daily Challenges */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-5">
          <DailyChallenge user={user} onXP={awardXP} mentalState={latestAssessment.mental_health_state} />
        </motion.div>

        {/* Mental Health Insight + Assessment */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <MentalHealthInsight assessment={latestAssessment} user={user} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
            <AchievementBadges gameProgress={gameProgress} assessments={assessments} user={user} />
          </motion.div>
        </div>

        {/* Daily Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-5">
          {generatingRecommendations ? (
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your personalized recommendations...</p>
              </CardContent>
            </Card>
          ) : todayRecommendation ? (
            <DailyRecommendations
              recommendation={todayRecommendation}
              onRefresh={generateDailyRecommendations}
              refetchRecommendations={refetchRecommendations}
              onXP={awardXP}
            />
          ) : null}
        </motion.div>

        {/* Quick Access Games */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <QuickAccessGames mentalState={latestAssessment.mental_health_state} />
        </motion.div>
      </div>
    </div>
  );
}