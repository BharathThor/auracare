import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// Import all game components
import BreathingBiofeedback from "../components/games/BreathingBiofeedback";
import ThoughtReframing from "../components/games/ThoughtReframing";
import GroundingExercise from "../components/games/GroundingExercise";
import ProgressiveRelaxation from "../components/games/ProgressiveRelaxation";
import MoodLifter from "../components/games/MoodLifter";
import GratitudeChain from "../components/games/GratitudeChain";
import AchievementTracker from "../components/games/AchievementTracker";
import WorryTime from "../components/games/WorryTime";
import BodyScan from "../components/games/BodyScan";
import StressBall from "../components/games/StressBall";
import EnergyMatrix from "../components/games/EnergyMatrix";
import BoundaryPractice from "../components/games/BoundaryPractice";
import RestReminder from "../components/games/RestReminder";
import EmotionWheel from "../components/games/EmotionWheel";
import MoodTracker from "../components/games/MoodTracker";
import SocialConnection from "../components/games/SocialConnection";

const gameComponents = {
  "breathing-biofeedback": BreathingBiofeedback,
  "thought-reframing": ThoughtReframing,
  "grounding-54321": GroundingExercise,
  "progressive-relaxation": ProgressiveRelaxation,
  "mood-lifter": MoodLifter,
  "gratitude-chain": GratitudeChain,
  "achievement-tracker": AchievementTracker,
  "worry-time": WorryTime,
  "body-scan": BodyScan,
  "stress-ball": StressBall,
  "energy-matrix": EnergyMatrix,
  "boundary-practice": BoundaryPractice,
  "rest-reminder": RestReminder,
  "emotion-wheel": EmotionWheel,
  "mood-tracker": MoodTracker,
  "social-connection": SocialConnection
};

const gameInfo = {
  "breathing-biofeedback": {
    name: "Breathing Biofeedback",
    icon: "🫁",
    description: "Visual biofeedback system that helps you master anxiety-reducing breathing patterns",
  },
  "thought-reframing": {
    name: "Thought Detective",
    icon: "🔍",
    description: "CBT-based game to identify and challenge negative thought patterns",
  },
  "grounding-54321": {
    name: "5-4-3-2-1 Grounding",
    icon: "🌟",
    description: "Sensory grounding exercise to anchor you in the present moment",
  },
  "progressive-relaxation": {
    name: "Body Tension Release",
    icon: "🧘",
    description: "Interactive progressive muscle relaxation with visual guidance",
  },
  "mood-lifter": {
    name: "Mood Lifter Activities",
    icon: "🎯",
    description: "Behavioral activation game based on proven depression treatment",
  },
  "gratitude-chain": {
    name: "Gratitude Chain Builder",
    icon: "⛓️",
    description: "Build neural pathways for positive thinking through interactive gratitude practice",
  },
  "achievement-tracker": {
    name: "Small Wins Tracker",
    icon: "🏆",
    description: "Celebrate daily accomplishments to combat negative self-perception",
  },
  "worry-time": {
    name: "Worry Time Container",
    icon: "⏰",
    description: "Schedule and contain worries using proven anxiety reduction technique",
  },
  "body-scan": {
    name: "Interactive Body Scan",
    icon: "🧠",
    description: "Mindfulness meditation with clickable body parts for focused awareness",
  },
  "stress-ball": {
    name: "Stress Release Ball",
    icon: "⚽",
    description: "Physical tension release through interactive clicking game",
  },
  "energy-matrix": {
    name: "Energy Management Matrix",
    icon: "⚡",
    description: "Identify energy drainers and rechargers to prevent burnout",
  },
  "boundary-practice": {
    name: "Boundary Practice Game",
    icon: "🛡️",
    description: "Practice saying no and setting healthy boundaries through scenarios",
  },
  "rest-reminder": {
    name: "Rest & Recovery",
    icon: "💤",
    description: "Guided rest practices with permission to pause and recover",
  },
  "emotion-wheel": {
    name: "Emotion Identification Wheel",
    icon: "🎨",
    description: "Interactive wheel to identify and process complex emotions",
  },
  "mood-tracker": {
    name: "Mood Pattern Tracker",
    icon: "📊",
    description: "Track mood patterns to identify triggers and trends",
  },
  "social-connection": {
    name: "Connection Builder",
    icon: "💝",
    description: "Plan meaningful social connections to combat isolation",
  }
};

export default function GameDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [moodBefore, setMoodBefore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id');
  const game = gameInfo[gameId];
  const GameComponent = gameComponents[gameId];

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const handleStartGame = (mood) => {
    setMoodBefore(mood);
    setStartTime(new Date());
    setGameStarted(true);
  };

  const handleCompleteGame = async (moodAfter) => {
    if (!user || !moodBefore) return;

    const endTime = new Date();
    const durationMinutes = Math.round((endTime - startTime) / 1000 / 60);

    await base44.entities.GameProgress.create({
      user_email: user.email,
      game_id: gameId,
      game_name: game.name,
      completed_date: endTime.toISOString(),
      duration_minutes: durationMinutes,
      mood_before: moodBefore,
      mood_after: moodAfter
    });

    navigate(createPageUrl("Games"));
  };

  if (!game || !GameComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
        <Card className="max-w-md border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <p className="text-gray-600 mb-4">Game not found</p>
            <Button onClick={() => navigate(createPageUrl("Games"))}>
              Back to Games
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto py-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Games"))}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="text-7xl mb-4">{game.icon}</div>
                <CardTitle className="text-3xl">{game.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-center text-lg">
                  {game.description}
                </p>

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    How are you feeling right now?
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[
                      { value: "very_low", emoji: "😢", label: "Very Low" },
                      { value: "low", emoji: "😟", label: "Low" },
                      { value: "neutral", emoji: "😐", label: "Neutral" },
                      { value: "good", emoji: "🙂", label: "Good" },
                      { value: "very_good", emoji: "😊", label: "Very Good" }
                    ].map((mood) => (
                      <Button
                        key={mood.value}
                        variant="outline"
                        className="h-24 flex flex-col gap-2 border-2 hover:border-purple-400 hover:bg-purple-50"
                        onClick={() => handleStartGame(mood.value)}
                      >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-xs">{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <GameComponent onComplete={handleCompleteGame} gameName={game.name} gameIcon={game.icon} />
    </div>
  );
}