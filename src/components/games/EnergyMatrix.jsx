import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Zap, ZapOff } from "lucide-react";
import { motion } from "framer-motion";

export default function EnergyMatrix({ onComplete }) {
  const [drainers, setDrainers] = useState([]);
  const [rechargers, setRechargers] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [mode, setMode] = useState("drain");
  const [step, setStep] = useState(1);

  const addItem = () => {
    if (!currentInput.trim()) return;
    
    if (mode === "drain") {
      setDrainers([...drainers, currentInput.trim()]);
    } else {
      setRechargers([...rechargers, currentInput.trim()]);
    }
    setCurrentInput("");
  };

  const canContinue = drainers.length >= 3 && rechargers.length >= 3;

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-4xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Energy Matrix</h2>
              <p className="text-gray-600">Understanding what drains and recharges you</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ZapOff className="w-6 h-6 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Energy Drainers</h3>
                </div>
                <ul className="space-y-2">
                  {drainers.map((item, index) => (
                    <li key={index} className="text-gray-700 bg-white rounded-lg p-3 shadow-sm">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-900">Energy Rechargers</h3>
                </div>
                <ul className="space-y-2">
                  {rechargers.map((item, index) => (
                    <li key={index} className="text-gray-700 bg-white rounded-lg p-3 shadow-sm">
                      ✓ {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Action Plan for Burnout Prevention:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Minimize or eliminate one energy drainer this week</li>
                <li>• Schedule at least one energy recharger daily</li>
                <li>• Notice when you're running low and take action</li>
                <li>• Set boundaries around your biggest energy drainers</li>
              </ul>
            </div>

            <p className="text-center text-gray-600 mb-8">
              How helpful was this exercise in understanding your energy?
            </p>

            <div className="grid grid-cols-5 gap-3">
              {[
                { value: "very_low", emoji: "😢" },
                { value: "low", emoji: "😟" },
                { value: "neutral", emoji: "😐" },
                { value: "good", emoji: "🙂" },
                { value: "very_good", emoji: "😊" }
              ].map((mood) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  className="h-20 text-4xl border-2 hover:border-purple-400 hover:bg-purple-50"
                  onClick={() => onComplete(mood.value)}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-3xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">⚡</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Energy Management Matrix</h2>
            <p className="text-gray-600">
              Identify what drains and recharges your energy to prevent burnout
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setMode("drain")}
              variant={mode === "drain" ? "default" : "outline"}
              className={mode === "drain" ? "flex-1 bg-red-500 hover:bg-red-600" : "flex-1"}
            >
              <ZapOff className="w-4 h-4 mr-2" />
              Energy Drainers ({drainers.length})
            </Button>
            <Button
              onClick={() => setMode("recharge")}
              variant={mode === "recharge" ? "default" : "outline"}
              className={mode === "recharge" ? "flex-1 bg-green-500 hover:bg-green-600" : "flex-1"}
            >
              <Zap className="w-4 h-4 mr-2" />
              Energy Rechargers ({rechargers.length})
            </Button>
          </div>

          <div className={`p-6 rounded-xl border-2 mb-6 ${
            mode === "drain" ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
          }`}>
            <h3 className="font-semibold text-gray-900 mb-3">
              {mode === "drain" ? "What drains your energy?" : "What recharges your energy?"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {mode === "drain" 
                ? "Examples: Toxic people, endless meetings, social media, clutter, negativity"
                : "Examples: Nature walks, good sleep, creative hobbies, supportive friends, exercise"
              }
            </p>

            <div className="flex gap-3 mb-4">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                placeholder={mode === "drain" ? "Add an energy drainer..." : "Add an energy recharger..."}
                className="h-12 text-base"
              />
              <Button
                onClick={addItem}
                className={mode === "drain" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {(mode === "drain" ? drainers : rechargers).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg p-3 shadow-sm"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Add at least 3 items to each category. Awareness is the first step to managing your energy.
            </p>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!canContinue}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
          >
            View My Matrix
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}