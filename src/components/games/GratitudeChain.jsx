import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Trophy, Sparkles, ChevronRight } from "lucide-react";

const categories = [
  { id: "people", emoji: "👥", label: "People", color: "from-pink-400 to-rose-400", prompts: ["Who made you smile recently?", "Who helped you when you needed it?", "Who do you feel safe with?"] },
  { id: "experiences", emoji: "🌟", label: "Experiences", color: "from-yellow-400 to-orange-400", prompts: ["What's a good memory from this week?", "What experience are you looking forward to?", "What challenge helped you grow?"] },
  { id: "simple", emoji: "☕", label: "Simple Joys", color: "from-green-400 to-teal-400", prompts: ["What small comfort do you enjoy daily?", "What simple pleasure often goes unnoticed?", "What sensation feels good today?"] },
  { id: "strengths", emoji: "💪", label: "Your Strengths", color: "from-blue-400 to-indigo-400", prompts: ["What are you getting better at?", "What quality do you have that helps others?", "What did you handle well recently?"] },
  { id: "nature", emoji: "🌿", label: "Nature & Beauty", color: "from-emerald-400 to-cyan-400", prompts: ["What beautiful thing did you notice today?", "What in the natural world are you grateful for?", "What weather or season do you appreciate?"] },
];

const CHAIN_TARGET = 5;

const scienceFacts = [
  "Gratitude activates the brain's reward center, releasing dopamine (Emmons & McCullough, 2003)",
  "3 weeks of daily gratitude journaling measurably increases happiness (Seligman et al., 2005)",
  "Gratitude reduces cortisol (the stress hormone) by up to 23% (McCraty, 2015)",
  "People who practice gratitude report 25% higher life satisfaction (Lyubomirsky, 2008)",
  "Gratitude strengthens social bonds and increases prosocial behavior (Algoe, 2012)",
];

export default function GratitudeChain({ onComplete }) {
  const [entries, setEntries] = useState([]);
  const [currentCat, setCurrentCat] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro | pick | write | chain | done

  useEffect(() => {
    const interval = setInterval(() => setFactIdx(i => (i + 1) % scienceFacts.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const addEntry = () => {
    if (!inputVal.trim() || !currentCat) return;
    const newEntry = { text: inputVal.trim(), category: currentCat, id: Date.now() };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    setInputVal("");
    setCurrentCat(null);
    if (newEntries.length >= CHAIN_TARGET) setDone(true);
    else setPhase("chain");
  };

  const usedCats = entries.map(e => e.category.id);
  const availableCats = categories.filter(c => !usedCats.includes(c.id));

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-50 p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">💝</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Gratitude Chain Builder</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                You'll build a chain of <strong>{CHAIN_TARGET} things you're grateful for</strong>, one at a time, across different life areas.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <AnimatePresence mode="wait">
                  <motion.p key={factIdx} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                    className="text-amber-800 text-sm">
                    🧠 <strong>Science:</strong> {scienceFacts[factIdx]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <Button onClick={() => setPhase("pick")} className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-500 font-bold text-base">
                Start Building My Chain 💛
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-pink-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10">
              <div className="text-center mb-6">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
                <h2 className="text-3xl font-black text-gray-900">Chain Complete! 🎉</h2>
                <p className="text-gray-500 mt-1">Your gratitude practice just rewired your brain a little</p>
              </div>
              <div className="space-y-3 mb-6">
                {entries.map((entry, i) => (
                  <motion.div key={entry.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${entry.category.color} text-white shadow-md`}>
                    <span className="text-2xl">{entry.category.emoji}</span>
                    <div>
                      <p className="text-xs font-bold opacity-80">{entry.category.label}</p>
                      <p className="font-semibold">{entry.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="bg-pink-50 rounded-xl p-4 mb-6">
                <p className="text-pink-700 text-sm text-center">💡 Save this list — re-reading it when you feel low provides an instant mood boost</p>
              </div>
              <p className="text-gray-600 mb-4 font-medium text-center">How do you feel?</p>
              <div className="grid grid-cols-5 gap-2">
                {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                  <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-yellow-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 to-pink-50">
      <div className="max-w-xl mx-auto">
        {/* Chain so far */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {entries.map((entry, i) => (
            <React.Fragment key={entry.id}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br ${entry.category.color} flex items-center justify-center text-xl shadow-md`} title={entry.text}>
                {entry.category.emoji}
              </div>
              {i < entries.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
            </React.Fragment>
          ))}
          {entries.length > 0 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
          {Array.from({ length: CHAIN_TARGET - entries.length }).map((_, i) => (
            <React.Fragment key={`empty-${i}`}>
              <div className={`flex-shrink-0 w-10 h-10 rounded-full border-3 border-dashed border-gray-300 flex items-center justify-center text-gray-300 ${i === 0 ? "border-yellow-400 animate-pulse" : ""}`}>
                {i === 0 ? "✨" : "○"}
              </div>
              {i < CHAIN_TARGET - entries.length - 1 && <ChevronRight className="w-4 h-4 text-gray-200 flex-shrink-0" />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mb-6">{entries.length}/{CHAIN_TARGET} links in your chain</p>

        <AnimatePresence mode="wait">
          {(phase === "pick" || phase === "chain") && !currentCat && (
            <motion.div key="pick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="border-none shadow-xl bg-white/90">
                <CardContent className="p-6">
                  <h2 className="text-xl font-black text-gray-900 mb-2">Choose a life area</h2>
                  <p className="text-gray-500 text-sm mb-5">What would you like to feel grateful for right now?</p>
                  <div className="grid grid-cols-1 gap-3">
                    {availableCats.map(cat => (
                      <motion.button key={cat.id} whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { setCurrentCat(cat); setPromptIdx(0); setPhase("write"); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${cat.color} text-white shadow-md text-left hover:shadow-xl transition-shadow`}>
                        <span className="text-3xl">{cat.emoji}</span>
                        <div>
                          <p className="font-bold text-lg">{cat.label}</p>
                          <p className="text-white/80 text-xs">{cat.prompts[0]}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 ml-auto opacity-70" />
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {phase === "write" && currentCat && (
            <motion.div key="write" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="border-none shadow-xl bg-white/90">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${currentCat.color} text-white font-bold mb-4`}>
                    <span>{currentCat.emoji}</span> {currentCat.label}
                  </div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">{currentCat.prompts[promptIdx]}</h2>
                  <p className="text-gray-500 text-sm mb-4">Write the first thing that comes to mind — there's no wrong answer.</p>
                  <textarea
                    autoFocus
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && inputVal.trim()) { e.preventDefault(); addEntry(); } }}
                    placeholder="I'm grateful for..."
                    className="w-full border-2 border-gray-200 rounded-xl p-4 min-h-[90px] text-gray-800 focus:outline-none resize-none text-lg"
                    style={{ borderColor: "transparent", boxShadow: "0 0 0 2px #e5e7eb" }}
                    onFocus={e => e.target.style.boxShadow = "0 0 0 2px #f59e0b"}
                    onBlur={e => e.target.style.boxShadow = "0 0 0 2px #e5e7eb"}
                  />
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setPromptIdx(i => (i + 1) % currentCat.prompts.length)} className="flex-shrink-0">
                      Different prompt 🔄
                    </Button>
                    <Button onClick={addEntry} disabled={!inputVal.trim()}
                      className={`flex-1 font-bold bg-gradient-to-r ${currentCat.color} border-0 disabled:opacity-40`}>
                      <Plus className="w-4 h-4 mr-1" /> Add to Chain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}