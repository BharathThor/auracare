import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Gamepad2, ArrowRight, Brain } from "lucide-react";

const gamesForState = {
  anxiety: [
    { id: "breathing-biofeedback", name: "Breathing Biofeedback", icon: "🫁" },
    { id: "thought-reframing", name: "Thought Detective", icon: "🔍" },
    { id: "grounding-54321", name: "5-4-3-2-1 Grounding", icon: "🌟" }
  ],
  depression: [
    { id: "mood-lifter", name: "Mood Lifter Activities", icon: "🎯" },
    { id: "gratitude-chain", name: "Gratitude Chain", icon: "⛓️" },
    { id: "achievement-tracker", name: "Small Wins Tracker", icon: "🏆" }
  ],
  stress: [
    { id: "worry-time", name: "Worry Time Container", icon: "⏰" },
    { id: "body-scan", name: "Interactive Body Scan", icon: "🧠" },
    { id: "stress-ball", name: "Stress Release Ball", icon: "⚽" }
  ],
  burnout: [
    { id: "energy-matrix", name: "Energy Management", icon: "⚡" },
    { id: "boundary-practice", name: "Boundary Practice", icon: "🛡️" },
    { id: "rest-reminder", name: "Rest & Recovery", icon: "💤" }
  ],
  general_wellness: [
    { id: "emotion-wheel", name: "Emotion Wheel", icon: "🎨" },
    { id: "mood-tracker", name: "Mood Tracker", icon: "📊" },
    { id: "social-connection", name: "Connection Builder", icon: "💝" }
  ]
};

export default function QuickAccessGames({ mentalState }) {
  const recommendedGames = gamesForState[mentalState?.primary_state] || gamesForState.general_wellness;

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Gamepad2 className="w-6 h-6 text-purple-500" />
            Recommended for You
          </CardTitle>
          <Link to={createPageUrl("Games")}>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          {recommendedGames.map((game) => (
            <Link key={game.id} to={createPageUrl(`GameDetail?id=${game.id}`)}>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-4xl">{game.icon}</div>
                  <div className="bg-blue-100 p-1.5 rounded-lg">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors text-sm">
                  {game.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}