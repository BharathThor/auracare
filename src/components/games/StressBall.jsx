import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap } from "lucide-react";

const LEVELS = [
  { id: 1, name: "Warm Up", target: 15, timeLimit: null, color: "from-yellow-400 to-orange-400", xp: 20, desc: "Squeeze 15 times, no rush!" },
  { id: 2, name: "Speed Round", target: 20, timeLimit: 15, color: "from-orange-400 to-red-400", xp: 35, desc: "20 squeezes in 15 seconds!" },
  { id: 3, name: "Endurance", target: 50, timeLimit: 30, color: "from-red-400 to-pink-500", xp: 60, desc: "50 squeezes in 30 seconds!" },
  { id: 4, name: "Frenzy", target: 100, timeLimit: 45, color: "from-pink-500 to-purple-500", xp: 100, desc: "100 squeezes in 45 seconds!" },
  { id: 5, name: "BEAST MODE", target: 200, timeLimit: 60, color: "from-purple-500 to-indigo-600", xp: 200, desc: "200 squeezes in 60 seconds! 💪" }
];

export default function StressBall({ onComplete, gameName, gameIcon }) {
  const [screen, setScreen] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [squeezes, setSqueezes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [particles, setParticles] = useState([]);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const lastSqueeze = useRef(null);
  const comboTimer = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("stressball_unlocked");
    if (stored) setUnlockedLevels(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (screen !== "playing" || !selectedLevel?.timeLimit) return;
    if (timeLeft === 0) { setFailed(squeezes < selectedLevel.target); setScreen("complete"); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen]);

  const startLevel = (level) => {
    setSelectedLevel(level);
    setSqueezes(0);
    setCombo(0);
    setMaxCombo(0);
    setFailed(false);
    setTimeLeft(level.timeLimit);
    setScreen("playing");
  };

  const handleSqueeze = () => {
    if (screen !== "playing") return;
    const now = Date.now();
    
    // Combo system
    if (lastSqueeze.current && now - lastSqueeze.current < 500) {
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
    } else {
      setCombo(0);
    }
    lastSqueeze.current = now;
    clearTimeout(comboTimer.current);
    comboTimer.current = setTimeout(() => setCombo(0), 600);

    setIsSqueezing(true);
    setTimeout(() => setIsSqueezing(false), 150);

    // Particles
    const p = { id: now, x: 40 + Math.random() * 20, emoji: ["💥","⚡","✨","💢","🔥"][Math.floor(Math.random()*5)] };
    setParticles(prev => [...prev.slice(-8), p]);
    setTimeout(() => setParticles(prev => prev.filter(pp => pp.id !== p.id)), 800);

    const newCount = squeezes + 1;
    setSqueezes(newCount);
    
    if (newCount >= selectedLevel.target) {
      const nextId = selectedLevel.id + 1;
      const newUnlocked = [...new Set([...unlockedLevels, nextId <= 5 ? nextId : selectedLevel.id])];
      setUnlockedLevels(newUnlocked);
      localStorage.setItem("stressball_unlocked", JSON.stringify(newUnlocked));
      setFailed(false);
      setScreen("complete");
    }
  };

  if (screen === "levels") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">⚽</div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Stress Release Ball</h2>
            <p className="text-gray-600">Squeeze your stress away — with levels!</p>
          </div>
          <div className="grid gap-4">
            {LEVELS.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              return (
                <motion.div key={level.id} whileHover={isUnlocked ? { scale: 1.02, x: 4 } : {}}
                  onClick={() => isUnlocked && startLevel(level)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                    isUnlocked ? "bg-white border-orange-200 cursor-pointer hover:border-orange-400 hover:shadow-xl" : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                      {level.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{level.name}</h3>
                      <p className="text-gray-500 text-sm">{level.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-600 font-bold">+{level.xp} XP</p>
                    {isUnlocked && <p className="text-xs text-orange-500 font-bold mt-1">TAP TO PLAY →</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "playing") {
    const level = selectedLevel;
    const progress = (squeezes / level.target) * 100;
    const timeUrgent = timeLeft !== null && timeLeft <= 5;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative select-none"
        style={{ background: "linear-gradient(135deg, #fff7ed, #fef3c7)" }}>
        
        {/* Floating particles */}
        <AnimatePresence>
          {particles.map(p => (
            <motion.div key={p.id} className="absolute text-3xl pointer-events-none z-20"
              style={{ left: `${p.x}%`, top: "50%" }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -80, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}>
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Header */}
        <div className="text-center mb-6 z-10">
          <h2 className="text-2xl font-black text-gray-900">Level {level.id}: {level.name}</h2>
          {timeLeft !== null && (
            <p className={`text-4xl font-black mt-2 ${timeUrgent ? "text-red-500 animate-pulse" : "text-orange-500"}`}>
              ⏱️ {timeLeft}s
            </p>
          )}
        </div>

        {/* Progress */}
        <div className="w-full max-w-sm mb-6 z-10">
          <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
            <span>{squeezes} squeezes</span><span>Target: {level.target}</span>
          </div>
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div className={`h-full bg-gradient-to-r ${level.color} rounded-full`}
              animate={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.1 }} />
          </div>
          {combo > 2 && (
            <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="text-center mt-2 text-orange-600 font-black text-lg">
              🔥 {combo}x COMBO!
            </motion.p>
          )}
        </div>

        {/* Stress Ball */}
        <motion.button
          onMouseDown={handleSqueeze}
          onTouchStart={(e) => { e.preventDefault(); handleSqueeze(); }}
          animate={{ scale: isSqueezing ? 0.75 : 1 }}
          transition={{ duration: 0.1 }}
          className={`w-56 h-56 rounded-full bg-gradient-to-br ${level.color} shadow-2xl cursor-pointer flex items-center justify-center border-8 border-white/50 active:scale-75 z-10`}
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          <span className="text-7xl pointer-events-none select-none">⚽</span>
        </motion.button>

        <p className="mt-6 text-gray-500 font-medium z-10">TAP / CLICK RAPIDLY!</p>
      </div>
    );
  }

  // COMPLETE
  const won = !failed;
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-lg w-full border-none shadow-2xl bg-white/90">
        <CardContent className="p-10 text-center">
          <div className="text-7xl mb-4">{won ? "🏆" : "😅"}</div>
          <h2 className="text-3xl font-black mb-2">{won ? `Level ${selectedLevel?.id} Cleared! 🎉` : "So Close! Try Again?"}</h2>
          <p className="text-gray-600 mb-2">{squeezes} squeezes • Best combo: {maxCombo}x</p>
          {won && <p className="text-yellow-600 font-bold mb-4">+{selectedLevel?.xp} XP earned!</p>}
          {won && selectedLevel?.id < 5 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 mb-4">
              <p className="text-green-700 font-semibold">🔓 Level {selectedLevel.id + 1} Unlocked!</p>
            </div>
          )}
          {!won && (
            <Button onClick={() => startLevel(selectedLevel)} className="w-full mb-4 bg-gradient-to-r from-orange-500 to-red-500">
              Retry Level {selectedLevel?.id}
            </Button>
          )}
          <p className="text-gray-600 mb-4">How do you feel?</p>
          <div className="grid grid-cols-5 gap-2">
            {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
              <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-orange-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}