import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Star, Trophy, Sparkles, Heart, Trash2 } from "lucide-react";

// Based on Self-Efficacy Theory (Bandura, 1977) & Positive Reinforcement for depression
const CATEGORIES = [
  { id: "did", emoji: "✅", label: "Things I Did", color: "from-green-400 to-teal-400", prompt: "What did you actually do today, no matter how small?", examples: ["Got out of bed", "Showered", "Replied to a message", "Made coffee"] },
  { id: "tried", emoji: "💪", label: "Things I Tried", color: "from-blue-400 to-indigo-400", prompt: "What did you attempt, even if it didn't go perfectly?", examples: ["Tried to exercise", "Attempted to meditate", "Started a conversation"] },
  { id: "felt", emoji: "💚", label: "Moments I Felt OK", color: "from-pink-400 to-rose-400", prompt: "Any moments, however brief, when you felt okay or even good?", examples: ["Laughed at something", "Felt calm for a moment", "Enjoyed a meal"] },
  { id: "helped", emoji: "🤝", label: "How I Helped", color: "from-yellow-400 to-amber-400", prompt: "Did you do something kind for someone (including yourself)?", examples: ["Listened to a friend", "Was patient with myself", "Held a door"] },
];

const compassionMessages = [
  "You're doing better than you think. 💜",
  "Small steps are still steps forward. 🌱",
  "Being here, trying — that matters. ✨",
  "You survived 100% of your hard days so far. 💪",
  "Progress isn't always visible. Trust the process. 🌊",
];

export default function AchievementTracker({ onComplete }) {
  const [entries, setEntries] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [phase, setPhase] = useState("intro"); // intro | collect | celebrate
  const [msgIdx] = useState(Math.floor(Math.random() * compassionMessages.length));
  const [selectedWin, setSelectedWin] = useState(null);
  const [selfCompassion, setSelfCompassion] = useState("");

  const allEntries = Object.entries(entries).flatMap(([catId, items]) =>
    (items || []).map(item => ({ ...item, catId }))
  );

  const addEntry = () => {
    if (!inputVal.trim() || !activeCategory) return;
    setEntries(prev => ({
      ...prev,
      [activeCategory]: [...(prev[activeCategory] || []), { text: inputVal.trim(), id: Date.now(), star: false }]
    }));
    setInputVal("");
  };

  const toggleStar = (catId, id) => {
    setEntries(prev => ({
      ...prev,
      [catId]: prev[catId].map(e => e.id === id ? { ...e, star: !e.star } : e)
    }));
  };

  const removeEntry = (catId, id) => {
    setEntries(prev => ({ ...prev, [catId]: prev[catId].filter(e => e.id !== id) }));
  };

  const totalEntries = allEntries.length;
  const starredEntries = allEntries.filter(e => e.star);

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-green-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Small Wins Tracker</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Depression tells you that you did nothing today. This exercise challenges that lie by finding the wins you actually had.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-left">
                <p className="text-amber-800 text-sm">🧠 <strong>Bandura (1977):</strong> Recognizing small wins builds self-efficacy — the belief that you <em>can</em> act effectively. This directly combats learned helplessness in depression.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-purple-700 italic text-sm">"{compassionMessages[msgIdx]}"</p>
              </div>
              <Button onClick={() => setPhase("collect")} className="w-full h-12 bg-gradient-to-r from-yellow-500 to-green-500 font-bold">
                Find My Wins 🏆
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (phase === "celebrate" && selectedWin) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <motion.div animate={{ rotate: [0, -10, 10, -5, 5, 0] }} transition={{ duration: 0.6 }}>
                <Star className="w-16 h-16 text-yellow-500 fill-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Celebrate This Win! 🎉</h2>
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-4">
                <p className="text-xl text-gray-800 font-semibold">"{selectedWin.text}"</p>
              </div>
              <p className="text-gray-600 mb-3 font-medium">Write something kind to yourself about this win:</p>
              <textarea value={selfCompassion} onChange={e => setSelfCompassion(e.target.value)}
                placeholder='e.g. "I showed up even when it was hard. That took strength."'
                className="w-full border-2 border-yellow-200 rounded-xl p-4 min-h-[80px] resize-none focus:border-yellow-400 focus:outline-none text-gray-800 mb-4" />
              <Button onClick={() => setPhase("collect")} variant="outline" className="w-full mb-3">Back to My Wins</Button>
              <Button onClick={() => { setPhase("collect"); setSelectedWin(null); }}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 font-bold">
                Save & Continue ✓
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 to-green-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Your Wins Today</h2>
            <p className="text-gray-500 text-sm">{totalEntries} wins found so far</p>
          </div>
          {totalEntries > 0 && (
            <Button onClick={() => setPhase("done")} className="bg-gradient-to-r from-yellow-500 to-green-500 font-bold">
              I'm Done ✓
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {CATEGORIES.map(cat => {
            const catEntries = entries[cat.id] || [];
            const isActive = activeCategory === cat.id;
            return (
              <motion.div key={cat.id} whileHover={{ y: -2 }}>
                <Card className={`border-2 transition-all ${isActive ? "border-purple-400 shadow-xl" : "border-gray-100 hover:border-gray-200 shadow-md"} bg-white cursor-pointer`}
                  onClick={() => setActiveCategory(isActive ? null : cat.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-sm`}>
                        {cat.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">{cat.label}</h3>
                        <p className="text-xs text-gray-400">{catEntries.length} entries</p>
                      </div>
                      {catEntries.length > 0 && (
                        <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
                          {catEntries.length}
                        </div>
                      )}
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                          <p className="text-xs text-gray-500 mb-2">{cat.prompt}</p>
                          <div className="flex gap-2 mb-2">
                            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") addEntry(); }}
                              autoFocus
                              placeholder={cat.examples[Math.floor(Math.random() * cat.examples.length)]}
                              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-purple-400 focus:outline-none"
                              onClick={e => e.stopPropagation()} />
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); addEntry(); }} disabled={!inputVal.trim()}
                              className={`bg-gradient-to-r ${cat.color} border-0 px-3`}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {cat.examples.map(ex => (
                              <button key={ex} onClick={e => { e.stopPropagation(); setInputVal(ex); }}
                                className="text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 px-2 py-1 rounded-full border">
                                {ex}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-1">
                            {catEntries.map(entry => (
                              <div key={entry.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                <button onClick={e => { e.stopPropagation(); toggleStar(cat.id, entry.id); }}>
                                  <Star className={`w-4 h-4 ${entry.star ? "text-yellow-500 fill-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} />
                                </button>
                                <p className="text-sm text-gray-700 flex-1">{entry.text}</p>
                                {entry.star && (
                                  <button onClick={e => { e.stopPropagation(); setSelectedWin(entry); setPhase("celebrate"); }}
                                    className="text-xs text-purple-500 hover:text-purple-700 font-bold">Celebrate!</button>
                                )}
                                <button onClick={e => { e.stopPropagation(); removeEntry(cat.id, entry.id); }}>
                                  <Trash2 className="w-3 h-3 text-gray-300 hover:text-red-400" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {totalEntries > 0 && (
          <Card className="border-none shadow-xl bg-gradient-to-r from-yellow-400 to-green-400 text-white mb-6">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="font-black text-xl">{totalEntries} wins today!</p>
              <p className="text-white/80 text-sm mt-1">Star your best ones, then celebrate them 🌟</p>
            </CardContent>
          </Card>
        )}

        {totalEntries >= 3 && (
          <div>
            <p className="text-gray-600 mb-4 font-medium text-center">How do you feel reflecting on these?</p>
            <div className="grid grid-cols-5 gap-2">
              {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-yellow-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}