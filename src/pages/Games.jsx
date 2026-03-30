import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gamepad2, Volume2, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const allGames = [
  {
    id: "breathing-biofeedback",
    name: "Breathing Biofeedback",
    icon: "🫁",
    category: "Anxiety Relief",
    hasVoice: true,
    duration: "5-10 min",
    description: "Visual biofeedback with 3 levels — box breathing, 4-7-8, coherent breathing",
    color: "from-blue-500 to-cyan-500",
    scientificBasis: "Box breathing activates parasympathetic nervous system",
    hasLevels: true
  },
  {
    id: "bubble-pop",
    name: "Bubble Pop Therapy",
    icon: "🫧",
    category: "Anxiety Relief",
    hasVoice: false,
    duration: "5 min",
    description: "Pop calm bubbles, avoid worry bubbles! 5 levels of increasing speed",
    color: "from-purple-500 to-pink-500",
    scientificBasis: "Attention training reduces anxiety rumination",
    hasLevels: true
  },
  {
    id: "thought-reframing",
    name: "Thought Detective",
    icon: "🔍",
    category: "Anxiety Relief",
    hasVoice: false,
    duration: "10 min",
    description: "CBT-based game to identify and challenge negative thought patterns",
    color: "from-indigo-500 to-purple-500",
    scientificBasis: "Cognitive Behavioral Therapy technique"
  },
  {
    id: "grounding-54321",
    name: "5-4-3-2-1 Grounding",
    icon: "🌟",
    category: "Anxiety Relief",
    hasVoice: true,
    duration: "5 min",
    description: "Sensory grounding exercise to anchor you in the present moment",
    color: "from-teal-500 to-blue-500",
    scientificBasis: "Evidence-based grounding technique"
  },
  {
    id: "mindful-memory",
    name: "Mindful Memory",
    icon: "🧠",
    category: "Stress Management",
    hasVoice: false,
    duration: "5-10 min",
    description: "Match calming nature pairs — 4 levels, trains focus and mindfulness",
    color: "from-green-500 to-teal-500",
    scientificBasis: "Working memory training reduces stress",
    hasLevels: true
  },
  {
    id: "stress-ball",
    name: "Stress Release Ball",
    icon: "⚽",
    category: "Stress Management",
    hasVoice: false,
    duration: "5 min",
    description: "Squeeze to release tension — 5 levels from chill to BEAST MODE!",
    color: "from-orange-500 to-red-500",
    scientificBasis: "Physical release of cortisol",
    hasLevels: true
  },
  {
    id: "worry-time",
    name: "Worry Time Container",
    icon: "⏰",
    category: "Stress Management",
    hasVoice: false,
    duration: "10 min",
    description: "Schedule and contain worries using proven anxiety reduction technique",
    color: "from-red-500 to-orange-500",
    scientificBasis: "Scheduled worry technique from CBT"
  },
  {
    id: "progressive-relaxation",
    name: "Body Tension Release",
    icon: "🧘",
    category: "Stress Management",
    hasVoice: true,
    duration: "15 min",
    description: "Interactive progressive muscle relaxation with voice guidance",
    color: "from-purple-500 to-pink-500",
    scientificBasis: "Jacobson's Progressive Muscle Relaxation"
  },
  {
    id: "mood-lifter",
    name: "Mood Lifter Activities",
    icon: "🎯",
    category: "Depression Support",
    hasVoice: false,
    duration: "15 min",
    description: "Behavioral activation game based on proven depression treatment",
    color: "from-yellow-500 to-orange-500",
    scientificBasis: "Behavioral Activation Therapy"
  },
  {
    id: "gratitude-chain",
    name: "Gratitude Chain Builder",
    icon: "⛓️",
    category: "Depression Support",
    hasVoice: false,
    duration: "10 min",
    description: "Build neural pathways for positive thinking",
    color: "from-pink-500 to-rose-500",
    scientificBasis: "Positive psychology research"
  },
  {
    id: "achievement-tracker",
    name: "Small Wins Tracker",
    icon: "🏆",
    category: "Depression Support",
    hasVoice: false,
    duration: "5 min",
    description: "Celebrate daily accomplishments to combat negative self-perception",
    color: "from-indigo-500 to-purple-500",
    scientificBasis: "Self-efficacy and positive reinforcement"
  },
  {
    id: "energy-matrix",
    name: "Energy Management Matrix",
    icon: "⚡",
    category: "Burnout Recovery",
    hasVoice: false,
    duration: "10 min",
    description: "Identify energy drainers and rechargers to prevent burnout",
    color: "from-yellow-500 to-amber-500",
    scientificBasis: "Energy management for burnout prevention"
  },
  {
    id: "body-scan",
    name: "Interactive Body Scan",
    icon: "🫀",
    category: "Burnout Recovery",
    hasVoice: true,
    duration: "10 min",
    description: "Mindfulness meditation with clickable body parts",
    color: "from-teal-500 to-blue-500",
    scientificBasis: "MBSR (Mindfulness-Based Stress Reduction)"
  },
  {
    id: "emotion-wheel",
    name: "Emotion Identification Wheel",
    icon: "🎨",
    category: "General Wellness",
    hasVoice: false,
    duration: "10 min",
    description: "Interactive wheel to identify and process complex emotions",
    color: "from-pink-500 to-purple-500",
    scientificBasis: "Plutchik's wheel of emotions"
  },
  {
    id: "mood-tracker",
    name: "Mood Pattern Tracker",
    icon: "📊",
    category: "General Wellness",
    hasVoice: false,
    duration: "5 min",
    description: "Track mood patterns to identify triggers and trends",
    color: "from-green-500 to-teal-500",
    scientificBasis: "Self-monitoring for mental health"
  }
];

export default function Games() {
  const categories = [...new Set(allGames.map(g => g.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <Gamepad2 className="w-10 h-10 text-purple-500" />
            Therapeutic Games
          </h1>
          <p className="text-lg text-gray-600">
            Evidence-based interactive activities designed by mental health professionals
          </p>
        </motion.div>

        {categories.map((category, categoryIndex) => {
          const categoryGames = allGames.filter(g => g.category === category);
          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.1) }}
                  >
                    <Link to={createPageUrl(`GameDetail?id=${game.id}`)}>
                      <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm group cursor-pointer overflow-hidden h-full">
                        <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-5xl">{game.icon}</div>
                            <div className="flex gap-2 flex-wrap justify-end">
                              {game.hasLevels && (
                                <div className="bg-yellow-100 px-2 py-1 rounded-lg">
                                  <span className="text-xs font-bold text-yellow-700">⭐ LEVELS</span>
                                </div>
                              )}
                              {game.hasVoice && (
                                <div className="bg-purple-100 p-1.5 rounded-lg">
                                  <Volume2 className="w-4 h-4 text-purple-600" />
                                </div>
                              )}
                              <div className="bg-blue-100 p-1.5 rounded-lg">
                                <Brain className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{game.description}</p>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-4">
                            <p className="text-xs text-blue-800 flex items-center gap-2">
                              <Sparkles className="w-3 h-3" />
                              {game.scientificBasis}
                            </p>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">⏱️ {game.duration}</span>
                            {game.hasVoice && <span className="text-purple-600 font-medium">Voice Guided</span>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}