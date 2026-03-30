import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Star, Lock, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LEVELS = [
  {
    id: 1, name: "Beginner", subtitle: "Box Breathing", emoji: "🌱",
    pattern: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    cycles: 4, description: "4-4-4-4 box breathing — used by Navy SEALs", xp: 30,
    color: "from-blue-400 to-cyan-400"
  },
  {
    id: 2, name: "Intermediate", subtitle: "4-7-8 Technique", emoji: "🌿",
    pattern: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    cycles: 4, description: "4-7-8 breathing — deep sleep activator", xp: 50,
    color: "from-purple-400 to-indigo-400"
  },
  {
    id: 3, name: "Advanced", subtitle: "Coherent Breathing", emoji: "🌳",
    pattern: { inhale: 6, hold1: 2, exhale: 10, hold2: 2 },
    cycles: 5, description: "6-2-10-2 — maximum HRV optimization", xp: 80,
    color: "from-emerald-400 to-teal-400"
  }
];

export default function BreathingBiofeedback({ onComplete, gameName, gameIcon }) {
  const [screen, setScreen] = useState("levels"); // levels | ready | playing | complete
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [phase, setPhase] = useState("inhale");
  const [cycleCount, setCycleCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [calmness, setCalmness] = useState(20);
  const [particles, setParticles] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("breathing_unlocked");
    if (stored) setUnlockedLevels(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (screen !== "playing" || !selectedLevel) return;
    const level = selectedLevel;
    const pattern = level.pattern;
    const phaseDurations = { inhale: pattern.inhale, hold1: pattern.hold1, exhale: pattern.exhale, hold2: pattern.hold2 };
    const phaseOrder = ["inhale", "hold1", "exhale", "hold2"].filter(p => phaseDurations[p] > 0);
    const duration = phaseDurations[phase] * 1000;

    setCountdown(phaseDurations[phase]);
    const countInterval = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1000);

    if (soundEnabled) {
      const labels = { inhale: "Breathe in", hold1: "Hold", exhale: "Breathe out", hold2: "Hold" };
      const u = new SpeechSynthesisUtterance(labels[phase]);
      u.rate = 0.8; window.speechSynthesis.speak(u);
    }

    // Spawn particles on exhale
    if (phase === "exhale") {
      const p = Array.from({ length: 5 }).map((_, i) => ({ id: Date.now() + i, x: Math.random() * 100, delay: i * 0.3 }));
      setParticles(p);
      setTimeout(() => setParticles([]), 3000);
    }

    timerRef.current = setTimeout(() => {
      const curIdx = phaseOrder.indexOf(phase);
      const nextPhase = phaseOrder[(curIdx + 1) % phaseOrder.length];
      if (nextPhase === "inhale" || (pattern.hold2 === 0 && nextPhase === phaseOrder[0] && phase === "exhale")) {
        const newCycle = cycleCount + (phase === phaseOrder[phaseOrder.length - 1] || (pattern.hold2 === 0 && phase === "exhale") ? 1 : 0);
        if (newCycle >= level.cycles && (phase === phaseOrder[phaseOrder.length - 1])) {
          setCalmness(90); setScreen("complete");
        } else {
          setCycleCount(c => {
            if (phase === phaseOrder[phaseOrder.length - 1]) {
              const nc = c + 1;
              if (nc >= level.cycles) { setCalmness(90); setScreen("complete"); return nc; }
              setCalmness(prev => Math.min(90, prev + 15));
              return nc;
            }
            return c;
          });
          setPhase(nextPhase);
        }
      } else {
        setPhase(nextPhase);
      }
    }, duration);

    return () => { clearTimeout(timerRef.current); clearInterval(countInterval); };
  }, [phase, screen]);

  const startLevel = (level) => {
    setSelectedLevel(level);
    setCycleCount(0);
    setCalmness(20);
    setPhase("inhale");
    setScreen("playing");
  };

  const handleComplete = (mood) => {
    // Unlock next level
    if (selectedLevel) {
      const nextId = selectedLevel.id + 1;
      const newUnlocked = [...new Set([...unlockedLevels, nextId <= 3 ? nextId : selectedLevel.id])];
      setUnlockedLevels(newUnlocked);
      localStorage.setItem("breathing_unlocked", JSON.stringify(newUnlocked));
    }
    onComplete(mood);
  };

  const phaseInfo = {
    inhale: { text: "Breathe In 🌬️", color: "from-blue-400 to-cyan-500" },
    hold1: { text: "Hold 🔵", color: "from-purple-400 to-indigo-500" },
    exhale: { text: "Breathe Out 💨", color: "from-green-400 to-emerald-500" },
    hold2: { text: "Hold 🟡", color: "from-yellow-400 to-orange-400" }
  };

  // LEVEL SELECT SCREEN
  if (screen === "levels") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🫁</div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Breathing Biofeedback</h2>
            <p className="text-gray-600">Master your breath, master your mind</p>
          </div>

          <div className="grid gap-4">
            {LEVELS.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              return (
                <motion.div
                  key={level.id}
                  whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  whileTap={isUnlocked ? { scale: 0.98 } : {}}
                  onClick={() => isUnlocked && startLevel(level)}
                  className={`relative rounded-2xl p-6 border-2 transition-all overflow-hidden ${
                    isUnlocked
                      ? "border-blue-300 bg-white cursor-pointer hover:shadow-xl hover:border-blue-500"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${level.color}`} />
                  <div className="flex items-center justify-between ml-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{level.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">Level {level.id}: {level.name}</h3>
                          {!isUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        </div>
                        <p className="text-purple-600 font-semibold">{level.subtitle}</p>
                        <p className="text-sm text-gray-500">{level.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        {Array.from({length: 3}).map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < level.id ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-yellow-600 font-bold text-sm">+{level.xp} XP</span>
                      {isUnlocked && (
                        <div className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                          PLAY →
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // PLAYING SCREEN
  if (screen === "playing") {
    const level = selectedLevel;
    const info = phaseInfo[phase];
    const isExpanding = phase === "inhale" || phase === "hold1";

    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50">
        <Button variant="outline" size="icon" className="absolute top-6 right-6 z-10"
          onClick={() => setSoundEnabled(!soundEnabled)}>
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </Button>

        {/* Floating particles on exhale */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div key={p.id} initial={{ opacity: 1, y: 0, x: `${p.x}vw` }}
              animate={{ opacity: 0, y: -200 }} transition={{ duration: 2, delay: p.delay }}
              className="absolute bottom-1/2 text-2xl pointer-events-none">
              💨
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="text-center z-10">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              {Array.from({ length: level.cycles }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all ${
                  i < cycleCount ? "bg-green-500 scale-100" : i === cycleCount ? "bg-purple-500 scale-125 shadow-lg" : "bg-gray-200"
                }`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">{cycleCount}/{level.cycles} cycles • Level {level.id}</p>
          </div>

          {/* Main Circle */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            {/* Outer glow rings */}
            {[1.8, 1.6, 1.4].map((scale, i) => (
              <motion.div key={i}
                animate={{ scale: isExpanding ? scale : 1, opacity: isExpanding ? 0.15 - i*0.04 : 0 }}
                transition={{ duration: phase === "inhale" ? level.pattern.inhale : level.pattern.exhale, ease: "easeInOut" }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${info.color}`}
              />
            ))}

            <motion.div
              animate={{ scale: isExpanding ? 1.5 : 0.9 }}
              transition={{ duration: phase === "inhale" ? level.pattern.inhale : phase === "exhale" ? level.pattern.exhale : 0.5, ease: "easeInOut" }}
              className={`absolute inset-8 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center shadow-2xl`}
            >
              <div className="text-white text-center">
                <p className="text-4xl font-black mb-2">{info.text}</p>
                <p className="text-6xl font-black">{countdown}</p>
              </div>
            </motion.div>
          </div>

          {/* Calmness bar */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Calm Level</span><span>{calmness}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                animate={{ width: `${calmness}%` }} transition={{ duration: 0.5 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE SCREEN
  if (screen === "complete") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-lg w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Level {selectedLevel?.id} Complete! 🎉</h2>
            <p className="text-gray-600 mb-2">+{selectedLevel?.xp} XP earned</p>
            {selectedLevel?.id < 3 && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 mb-6">
                <p className="text-green-700 font-semibold">🔓 Level {selectedLevel.id + 1} Unlocked!</p>
              </div>
            )}
            <p className="text-gray-600 mb-6">How do you feel now?</p>
            <div className="grid grid-cols-5 gap-3">
              {[{ value: "very_low", e: "😢" },{ value: "low", e: "😟" },{ value: "neutral", e: "😐" },{ value: "good", e: "🙂" },{ value: "very_good", e: "😊" }].map(m => (
                <Button key={m.value} variant="outline" className="h-20 text-4xl border-2 hover:border-purple-400 hover:bg-purple-50" onClick={() => handleComplete(m.value)}>{m.e}</Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}