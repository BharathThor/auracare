import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy } from "lucide-react";

// Mindful Memory: Match calming image pairs with increasing difficulty
const CARD_SETS = {
  1: ["🌸","🌸","🌿","🌿","🌊","🌊","☀️","☀️"],
  2: ["🌸","🌸","🌿","🌿","🌊","🌊","☀️","☀️","🦋","🦋","🍃","🍃"],
  3: ["🌸","🌸","🌿","🌿","🌊","🌊","☀️","☀️","🦋","🦋","🍃","🍃","🌙","🌙","⭐","⭐"],
  4: ["🌸","🌸","🌿","🌿","🌊","🌊","☀️","☀️","🦋","🦋","🍃","🍃","🌙","🌙","⭐","⭐","🌺","🌺","🍀","🍀"],
};

const LEVELS = [
  { id: 1, name: "Seedling", pairs: 4, flipTime: 1200, xp: 20 },
  { id: 2, name: "Sprout", pairs: 6, flipTime: 1000, xp: 40 },
  { id: 3, name: "Bloom", pairs: 8, flipTime: 800, xp: 65 },
  { id: 4, name: "Flourish", pairs: 10, flipTime: 600, xp: 100 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MindfulMemory({ onComplete }) {
  const [screen, setScreen] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem("memory_unlocked");
    if (s) setUnlockedLevels(JSON.parse(s));
  }, []);

  const startLevel = (level) => {
    const set = CARD_SETS[level.id];
    const sliced = set.slice(0, level.pairs * 2);
    setCards(shuffle(sliced).map((emoji, i) => ({ id: i, emoji })));
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSelectedLevel(level);
    setScreen("playing");
  };

  const flipCard = (idx) => {
    if (isChecking) return;
    if (flipped.includes(idx)) return;
    if (matched.includes(idx)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);
      const [a, b] = newFlipped;
      if (cards[a].emoji === cards[b].emoji) {
        const newMatched = [...matched, a, b];
        setMatched(newMatched);
        setFlipped([]);
        setIsChecking(false);
        if (newMatched.length === cards.length) {
          setTimeout(() => {
            const nextId = selectedLevel.id + 1;
            const nu = [...new Set([...unlockedLevels, nextId <= 4 ? nextId : selectedLevel.id])];
            setUnlockedLevels(nu);
            localStorage.setItem("memory_unlocked", JSON.stringify(nu));
            setScreen("complete");
          }, 800);
        }
      } else {
        setTimeout(() => { setFlipped([]); setIsChecking(false); }, selectedLevel.flipTime);
      }
    }
  };

  if (screen === "levels") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-4xl font-black text-gray-900 mb-2">Mindful Memory</h2>
            <p className="text-gray-600">Match calm nature pairs to train focus & mindfulness</p>
          </div>
          <div className="grid gap-4">
            {LEVELS.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              return (
                <motion.div key={level.id} whileHover={isUnlocked ? { scale: 1.02 } : {}}
                  onClick={() => isUnlocked && startLevel(level)}
                  className={`flex items-center justify-between p-5 rounded-2xl border-2 ${
                    isUnlocked ? "bg-white border-teal-200 cursor-pointer hover:border-teal-500 hover:shadow-xl" : "bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed"
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-green-400 flex items-center justify-center text-white font-black text-xl">
                      {level.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{level.name}</h3>
                      <p className="text-gray-500 text-sm">{level.pairs} pairs • {level.flipTime}ms flip time</p>
                    </div>
                  </div>
                  <p className="text-yellow-600 font-bold">+{level.xp} XP</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "playing") {
    const cols = selectedLevel.pairs <= 4 ? 4 : selectedLevel.pairs <= 6 ? 4 : 5;
    return (
      <div className="min-h-screen p-6 flex flex-col items-center bg-gradient-to-br from-green-50 to-teal-50">
        <div className="flex justify-between items-center w-full max-w-2xl mb-6">
          <div className="text-center bg-white rounded-xl p-3 shadow-md px-6">
            <p className="text-xs text-gray-500">Moves</p>
            <p className="text-2xl font-black text-teal-600">{moves}</p>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900">Level {selectedLevel.id}: {selectedLevel.name}</h2>
            <p className="text-gray-500 text-sm">{matched.length / 2}/{selectedLevel.pairs} matched</p>
          </div>
          <div className="text-center bg-white rounded-xl p-3 shadow-md px-6">
            <p className="text-xs text-gray-500">Left</p>
            <p className="text-2xl font-black text-purple-600">{selectedLevel.pairs - matched.length / 2}</p>
          </div>
        </div>

        <div
          className="grid gap-3 w-full max-w-2xl"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(idx);
            const isMatchedCard = matched.includes(idx);
            return (
              <motion.button
                key={card.id}
                onClick={() => flipCard(idx)}
                whileHover={!isFlipped ? { scale: 1.05 } : {}}
                whileTap={!isFlipped ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center border-2 shadow-md transition-all ${
                  isMatchedCard
                    ? "border-green-400 bg-green-100 scale-95"
                    : isFlipped
                    ? "border-teal-400 bg-white"
                    : "border-gray-200 bg-gradient-to-br from-teal-400 to-green-400 cursor-pointer hover:shadow-xl"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isFlipped ? (
                    <motion.span key="front" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.2 }}>
                      {card.emoji}
                    </motion.span>
                  ) : (
                    <motion.span key="back" className="text-white text-2xl" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }}>
                      🌀
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-lg w-full border-none shadow-2xl bg-white/90">
        <CardContent className="p-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-2">Level {selectedLevel?.id} Complete! 🎉</h2>
          <p className="text-gray-600 mb-2">Solved in {moves} moves</p>
          <p className="text-yellow-600 font-bold mb-4">+{selectedLevel?.xp} XP earned!</p>
          {selectedLevel?.id < 4 && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 mb-4">
              <p className="text-green-700 font-semibold">🔓 Level {selectedLevel.id + 1} Unlocked!</p>
            </div>
          )}
          <p className="text-gray-600 mb-4">How do you feel?</p>
          <div className="grid grid-cols-5 gap-2">
            {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
              <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-teal-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}