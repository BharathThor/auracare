import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

// New fun game: Pop the anxiety bubbles, avoid worry bubbles!
const LEVELS = [
  { id: 1, name: "Calm Waters", duration: 30, spawnRate: 1200, goodRatio: 0.8, xp: 25, targetScore: 10 },
  { id: 2, name: "Growing Waves", duration: 40, spawnRate: 900, goodRatio: 0.7, xp: 40, targetScore: 20 },
  { id: 3, name: "Storm", duration: 45, spawnRate: 700, goodRatio: 0.6, xp: 65, targetScore: 35 },
  { id: 4, name: "Tempest", duration: 50, spawnRate: 500, goodRatio: 0.5, xp: 90, targetScore: 55 },
  { id: 5, name: "Zen Master", duration: 60, spawnRate: 350, goodRatio: 0.45, xp: 150, targetScore: 80 }
];

const GOOD_BUBBLES = ["😌","🌸","✨","💜","🌿","☀️","🌈","💆"];
const BAD_BUBBLES = ["😰","😟","💭","😤","🌀","😣"];

let bubbleId = 0;

export default function BubblePop({ onComplete }) {
  const [screen, setScreen] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [missedGood, setMissedGood] = useState([]);

  useEffect(() => {
    const s = localStorage.getItem("bubblepop_unlocked");
    if (s) setUnlockedLevels(JSON.parse(s));
  }, []);

  // Timer
  useEffect(() => {
    if (screen !== "playing") return;
    if (timeLeft <= 0) { setScreen("complete"); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen]);

  // Spawn bubbles
  useEffect(() => {
    if (screen !== "playing" || !selectedLevel) return;
    const level = selectedLevel;
    const interval = setInterval(() => {
      const isGood = Math.random() < level.goodRatio;
      const emoji = isGood
        ? GOOD_BUBBLES[Math.floor(Math.random() * GOOD_BUBBLES.length)]
        : BAD_BUBBLES[Math.floor(Math.random() * BAD_BUBBLES.length)];
      const newBubble = {
        id: ++bubbleId, isGood, emoji,
        x: 5 + Math.random() * 80,
        size: 50 + Math.random() * 35,
        speed: 3 + Math.random() * 3
      };
      setBubbles(prev => [...prev, newBubble]);

      // Remove after rising off screen
      setTimeout(() => {
        setBubbles(prev => {
          const exists = prev.find(b => b.id === newBubble.id);
          if (exists && newBubble.isGood) {
            // Missed a good bubble — lose a life
            setLives(l => {
              const nl = l - 1;
              if (nl <= 0) setScreen("complete");
              return nl;
            });
          }
          return prev.filter(b => b.id !== newBubble.id);
        });
      }, (newBubble.speed + 1) * 1000);
    }, level.spawnRate);

    return () => clearInterval(interval);
  }, [screen, selectedLevel]);

  const popBubble = (bubble) => {
    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    if (bubble.isGood) {
      setScore(s => s + 1);
    } else {
      // Popped a bad bubble — boom, lose life
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setScreen("complete");
        return nl;
      });
    }
  };

  const startLevel = (level) => {
    setSelectedLevel(level);
    setScore(0);
    setLives(3);
    setBubbles([]);
    setTimeLeft(level.duration);
    setScreen("playing");
  };

  const handleFinish = (mood) => {
    if (selectedLevel && score >= selectedLevel.targetScore) {
      const nextId = selectedLevel.id + 1;
      const nu = [...new Set([...unlockedLevels, nextId <= 5 ? nextId : selectedLevel.id])];
      setUnlockedLevels(nu);
      localStorage.setItem("bubblepop_unlocked", JSON.stringify(nu));
    }
    onComplete(mood);
  };

  if (screen === "levels") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🫧</div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Bubble Pop Therapy</h2>
            <p className="text-gray-600">Pop calm bubbles 😌 Avoid worry bubbles 😰</p>
          </div>
          <div className="grid gap-4">
            {LEVELS.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              return (
                <motion.div key={level.id} whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  onClick={() => isUnlocked && startLevel(level)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 ${
                    isUnlocked ? "bg-white border-purple-200 cursor-pointer hover:border-purple-500 hover:shadow-xl" : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{GOOD_BUBBLES[level.id - 1]}</div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Level {level.id}: {level.name}</h3>
                      <p className="text-gray-500 text-sm">{level.duration}s • Pop {level.targetScore} calm bubbles to win</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-600 font-bold">+{level.xp} XP</p>
                    {isUnlocked && <p className="text-purple-500 font-bold text-xs mt-1">PLAY →</p>}
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
    const won = score >= selectedLevel.targetScore;

    return (
      <div className="min-h-screen relative overflow-hidden select-none"
        style={{ background: "linear-gradient(180deg, #e0f2fe 0%, #f0fdf4 100%)" }}>
        
        {/* HUD */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-1 text-2xl">
            {Array.from({length: 3}).map((_, i) => (
              <span key={i}>{i < lives ? "❤️" : "🖤"}</span>
            ))}
          </div>
          <div className="text-center">
            <p className="font-black text-2xl text-purple-600">{score}/{selectedLevel.targetScore}</p>
            <p className="text-xs text-gray-500">Pop calm bubbles!</p>
          </div>
          <div className={`text-2xl font-black ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-600"}`}>
            ⏱️{timeLeft}s
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-24 left-0 right-0 text-center z-10 pointer-events-none">
          <p className="text-sm text-gray-500">😌✨💜 = Pop! &nbsp;&nbsp;&nbsp; 😰😤💭 = Avoid!</p>
        </div>

        {/* Bubbles */}
        <AnimatePresence>
          {bubbles.map(bubble => (
            <motion.button
              key={bubble.id}
              initial={{ y: "100vh", x: `${bubble.x}vw`, opacity: 1 }}
              animate={{ y: "-20vh", x: `${bubble.x}vw`, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: bubble.speed, ease: "linear" }}
              onClick={() => popBubble(bubble)}
              className={`absolute flex items-center justify-center rounded-full border-4 font-bold shadow-xl transition-transform hover:scale-110 active:scale-90 ${
                bubble.isGood
                  ? "border-purple-300 bg-purple-100/80"
                  : "border-red-300 bg-red-100/80"
              }`}
              style={{ width: bubble.size, height: bubble.size, fontSize: bubble.size * 0.4, bottom: 0, left: 0, top: "auto" }}
            >
              {bubble.emoji}
            </motion.button>
          ))}
        </AnimatePresence>

        {/* Won early overlay */}
        {won && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/30">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-10 text-center shadow-2xl">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-black mb-4">Level Complete!</h2>
              <Button onClick={() => setScreen("complete")} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Collect Reward! +{selectedLevel.xp} XP
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // COMPLETE
  const passed = score >= selectedLevel.targetScore && lives > 0;
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-lg w-full border-none shadow-2xl bg-white/90">
        <CardContent className="p-10 text-center">
          <div className="text-7xl mb-4">{passed ? "🏆" : "😅"}</div>
          <h2 className="text-3xl font-black mb-2">{passed ? "Amazing! Level Cleared!" : "Game Over!"}</h2>
          <p className="text-gray-600 mb-2">Score: {score}/{selectedLevel.targetScore}</p>
          {passed && <p className="text-yellow-600 font-bold mb-4">+{selectedLevel.xp} XP earned!</p>}
          {!passed && (
            <Button onClick={() => startLevel(selectedLevel)} className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600">
              Try Again 💪
            </Button>
          )}
          <p className="text-gray-600 mb-4">How do you feel?</p>
          <div className="grid grid-cols-5 gap-2">
            {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
              <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-purple-400" onClick={() => handleFinish(m.v)}>{m.e}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}