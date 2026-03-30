import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, CheckCircle, Lock, Trophy } from "lucide-react";

// Based on Borkovec's (1983) Stimulus Control Therapy for worry & GAD treatment protocols
const WORRY_TYPES = [
  { id: "hypothetical", label: "Hypothetical", emoji: "💭", desc: "What if... scenarios that may never happen", color: "from-purple-400 to-indigo-400", strategy: "Postpone and schedule time — can't be solved now" },
  { id: "current", label: "Current Problem", emoji: "🔧", desc: "Real problems you can actually act on", color: "from-orange-400 to-red-400", strategy: "Identify one tiny action step you can take today" },
  { id: "past", label: "Past Event", emoji: "⏮️", desc: "Ruminating over something that already happened", color: "from-gray-400 to-slate-500", strategy: "Self-compassion: what would you say to a friend?" },
  { id: "others", label: "Others' Actions", emoji: "👥", desc: "Worrying about what others think or do", color: "from-pink-400 to-rose-400", strategy: "Separate what's in your control from what isn't" },
];

export default function WorryTime({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | dump | sort | container | action
  const [worries, setWorries] = useState([]);
  const [input, setInput] = useState("");
  const [sortedWorries, setSortedWorries] = useState([]);
  const [actionSteps, setActionSteps] = useState({});
  const [containerLocked, setContainerLocked] = useState(false);
  const [worryTime, setWorryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (worryTime === null || timeLeft <= 0) { if (timeLeft === 0 && worryTime !== null) setContainerLocked(true); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, worryTime]);

  const addWorry = () => {
    if (input.trim()) { setWorries(p => [...p, { text: input.trim(), id: Date.now() }]); setInput(""); }
  };

  const removeWorry = (id) => setWorries(p => p.filter(w => w.id !== id));

  const sortWorry = (worry, type) => {
    setSortedWorries(p => [...p.filter(w => w.id !== worry.id), { ...worry, type }]);
  };

  const unsortedWorries = worries.filter(w => !sortedWorries.find(s => s.id === w.id));
  const allSorted = worries.length > 0 && unsortedWorries.length === 0;

  const startWorryTime = (minutes) => {
    setWorryTime(minutes);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Worry Time Container</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Instead of fighting your worries (which makes them stronger), we'll give them a designated space — then lock the container.
              </p>
              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-xl">
                  <span className="text-2xl">1️⃣</span>
                  <div><p className="font-bold text-gray-800 text-sm">Brain dump</p><p className="text-gray-500 text-xs">Get all worries out of your head</p></div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-2xl">2️⃣</span>
                  <div><p className="font-bold text-gray-800 text-sm">Sort & understand</p><p className="text-gray-500 text-xs">Categorize each worry by type</p></div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-pink-50 rounded-xl">
                  <span className="text-2xl">3️⃣</span>
                  <div><p className="font-bold text-gray-800 text-sm">Lock them in</p><p className="text-gray-500 text-xs">Time-box worrying — then move on</p></div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                <p className="text-amber-700 text-sm">🧠 <strong>Borkovec (1983):</strong> Scheduled worry reduces total daily worry time by 35% — the brain accepts postponement when it knows worry has a designated slot</p>
              </div>
              <Button onClick={() => setPhase("dump")} className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold">
                Begin ⏰
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (phase === "dump") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Brain Dump</h2>
          <p className="text-gray-500 text-sm mb-4">Write down every worry that's on your mind. Don't filter — let it all out.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <p className="text-amber-700 text-sm">💡 Write fast. Don't analyze yet. Getting it out of your head is the first relief.</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addWorry(); }}
              placeholder="What's on your mind right now..."
              className="flex-1 border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none text-gray-800" />
            <Button onClick={addWorry} disabled={!input.trim()} className="bg-purple-600 hover:bg-purple-700 px-5">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2 mb-6">
            {worries.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-purple-100">
                <span className="text-gray-400 text-sm font-bold">{i + 1}</span>
                <p className="flex-1 text-gray-800 text-sm">{w.text}</p>
                <button onClick={() => removeWorry(w.id)}><Trash2 className="w-4 h-4 text-gray-300 hover:text-red-400" /></button>
              </motion.div>
            ))}
          </div>

          {worries.length === 0 && (
            <div className="text-center py-10 text-gray-300">
              <p className="text-5xl mb-3">📝</p>
              <p>Add your first worry above</p>
            </div>
          )}

          <Button onClick={() => setPhase("sort")} disabled={worries.length < 1}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold disabled:opacity-40">
            Sort My Worries →
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "sort") {
    const worryToSort = worries.find(w => !sortedWorries.find(s => s.id === w.id));

    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-gray-900">Sort Worries</h2>
            <p className="text-sm text-gray-500">{sortedWorries.length}/{worries.length} sorted</p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(sortedWorries.length / worries.length) * 100}%` }} />
          </div>

          {worryToSort && (
            <AnimatePresence mode="wait">
              <motion.div key={worryToSort.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-purple-200 mb-5 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Worry {sortedWorries.length + 1}</p>
                  <p className="text-xl text-gray-900 font-semibold">"{worryToSort.text}"</p>
                </div>
                <p className="text-gray-600 font-medium mb-3 text-center">What type of worry is this?</p>
                <div className="grid grid-cols-2 gap-3">
                  {WORRY_TYPES.map(type => (
                    <motion.button key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={() => sortWorry(worryToSort, type)}
                      className={`p-4 rounded-2xl bg-gradient-to-br ${type.color} text-white text-left shadow-md hover:shadow-xl transition-shadow`}>
                      <div className="text-2xl mb-1">{type.emoji}</div>
                      <p className="font-bold">{type.label}</p>
                      <p className="text-white/70 text-xs">{type.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {allSorted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-green-700 font-bold">All worries sorted!</p>
              </div>
              <div className="space-y-2 mb-4">
                {WORRY_TYPES.map(type => {
                  const typeWorries = sortedWorries.filter(w => w.type.id === type.id);
                  if (!typeWorries.length) return null;
                  return (
                    <div key={type.id} className={`p-3 rounded-xl bg-gradient-to-r ${type.color} text-white`}>
                      <p className="font-bold text-sm">{type.emoji} {type.label} ({typeWorries.length})</p>
                      <p className="text-xs text-white/80 mt-0.5">Strategy: {type.strategy}</p>
                    </div>
                  );
                })}
              </div>
              <Button onClick={() => setPhase("container")} className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 font-bold">
                Lock Them In a Container →
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "container") {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-8 text-center">
              <AnimatePresence>
                {!containerLocked ? (
                  <motion.div key="open" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Worry Time Container</h2>
                    <p className="text-gray-600 mb-6">Choose how long you'll let yourself worry. When the time is up, the container locks — and you agree to let these go until tomorrow.</p>
                    <div className="bg-indigo-50 rounded-xl p-4 mb-6 text-left">
                      {sortedWorries.map((w, i) => (
                        <p key={w.id} className="text-sm text-gray-700 mb-1">• {w.text}</p>
                      ))}
                    </div>
                    {worryTime === null ? (
                      <div>
                        <p className="text-gray-600 font-bold mb-4">How long will you worry?</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[5, 10, 15].map(min => (
                            <Button key={min} onClick={() => startWorryTime(min)}
                              variant="outline" className="h-14 font-bold border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50">
                              {min} min
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-5xl font-black text-purple-600 mb-2">{formatTime(timeLeft)}</div>
                        <p className="text-gray-500 text-sm">Worry time remaining. When it ends, the container locks.</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="locked" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-black text-gray-900 mb-3">Container Locked!</h2>
                    <p className="text-gray-600 mb-4">Your worries are contained. You agree to postpone them until tomorrow's worry time.</p>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                      <p className="text-green-700 text-sm">If a worry tries to return, remind yourself: "That's already in the container. I'll deal with it tomorrow."</p>
                    </div>
                    <p className="text-gray-600 mb-4 font-medium">How do you feel?</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                        <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-purple-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}