import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Ear, Hand, Wind, Utensils, CheckCircle, Trophy } from "lucide-react";

const senses = [
  {
    id: "see", icon: Eye, emoji: "👁️", sense: "See", color: "from-blue-400 to-cyan-400",
    count: 5, prompt: "Name 5 things you can SEE right now",
    tip: "Look around slowly. Notice colors, shapes, textures, light.",
    examples: ["a chair", "a window", "my hands", "a plant", "the ceiling"]
  },
  {
    id: "touch", icon: Hand, emoji: "✋", sense: "Touch", color: "from-green-400 to-teal-400",
    count: 4, prompt: "Name 4 things you can TOUCH or FEEL",
    tip: "Notice textures, temperature, pressure on your body.",
    examples: ["the chair under me", "my clothing", "the ground beneath my feet", "my breath"]
  },
  {
    id: "hear", icon: Ear, emoji: "👂", sense: "Hear", color: "from-purple-400 to-indigo-400",
    count: 3, prompt: "Name 3 things you can HEAR",
    tip: "Listen for background sounds — traffic, birds, HVAC, your breath.",
    examples: ["my breathing", "distant traffic", "silence itself"]
  },
  {
    id: "smell", icon: Wind, emoji: "👃", sense: "Smell", color: "from-pink-400 to-rose-400",
    count: 2, prompt: "Name 2 things you can SMELL",
    tip: "Take a slow breath through your nose. Notice any scents.",
    examples: ["fresh air", "my skin"]
  },
  {
    id: "taste", icon: Utensils, emoji: "👅", sense: "Taste", color: "from-orange-400 to-amber-400",
    count: 1, prompt: "Name 1 thing you can TASTE",
    tip: "Notice any lingering taste in your mouth right now.",
    examples: ["water", "nothing — just noticing"]
  },
];

export default function GroundingExercise({ onComplete }) {
  const [senseIdx, setSenseIdx] = useState(0);
  const [inputs, setInputs] = useState({});
  const [current, setCurrent] = useState([""]);
  const [done, setDone] = useState(false);
  const [showBreath, setShowBreath] = useState(true);
  const [breathPhase, setBreathPhase] = useState("in");
  const breathRef = useRef(null);

  // 3-breath intro
  useEffect(() => {
    let count = 0;
    const cycle = () => {
      setBreathPhase("in");
      breathRef.current = setTimeout(() => {
        setBreathPhase("out");
        breathRef.current = setTimeout(() => {
          count++;
          if (count < 3) cycle();
          else setShowBreath(false);
        }, 4000);
      }, 4000);
    };
    cycle();
    return () => clearTimeout(breathRef.current);
  }, []);

  const sense = senses[senseIdx];
  const filledItems = current.filter(v => v.trim().length > 0);
  const canAddMore = filledItems.length < sense.count;

  const updateItem = (i, val) => {
    setCurrent(prev => { const n = [...prev]; n[i] = val; return n; });
  };

  const addItem = () => {
    if (canAddMore) setCurrent(prev => [...prev, ""]);
  };

  const handleNext = () => {
    const saved = { ...inputs, [sense.id]: current.filter(v => v.trim()) };
    setInputs(saved);
    if (senseIdx < senses.length - 1) {
      setSenseIdx(i => i + 1);
      setCurrent([""]);
    } else {
      setDone(true);
    }
  };

  if (showBreath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-800 mb-8">Let's ground ourselves first</h2>
          <motion.div
            animate={{ scale: breathPhase === "in" ? 1.6 : 1 }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 mx-auto flex items-center justify-center shadow-2xl"
          >
            <p className="text-white font-black text-xl">{breathPhase === "in" ? "Breathe In" : "Breathe Out"}</p>
          </motion.div>
          <p className="text-gray-500 mt-6 text-lg">3 deep breaths to begin...</p>
        </div>
      </div>
    );
  }

  if (done) {
    const totalItems = Object.values(inputs).flat();
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-2">Grounded! 🌟</h2>
              <p className="text-gray-600 mb-4">You engaged all 5 senses — your nervous system is calmer now.</p>
              <div className="bg-teal-50 rounded-2xl p-4 mb-6 text-left">
                {senses.map(s => (
                  <div key={s.id} className="mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase">{s.sense}</p>
                    <p className="text-sm text-gray-700">{(inputs[s.id] || []).join(" · ") || "—"}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-3 mb-6">
                <p className="text-blue-700 text-sm">🧠 <strong>Science:</strong> The 5-4-3-2-1 technique activates the sensory cortex and interrupts the amygdala's threat response, providing immediate anxiety relief (Grohol, 2019)</p>
              </div>
              <p className="text-gray-600 mb-4 font-medium">How do you feel now?</p>
              <div className="grid grid-cols-5 gap-2">
                {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                  <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-teal-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      <div className="max-w-xl mx-auto">
        {/* Sense progress */}
        <div className="flex gap-2 mb-6">
          {senses.map((s, i) => (
            <div key={i} className={`flex-1 h-3 rounded-full transition-all duration-500 ${
              i < senseIdx ? "bg-teal-400" : i === senseIdx ? `bg-gradient-to-r ${s.color}` : "bg-gray-200"
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={senseIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${sense.color} flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg`}>
                    {sense.emoji}
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">{sense.prompt}</h2>
                  <p className="text-gray-500 text-sm mt-2">{sense.tip}</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
                  <p className="text-amber-700 text-xs">💡 Take your time. Even noticing small details counts.</p>
                </div>

                <div className="space-y-3 mb-4">
                  {current.map((val, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${sense.color} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                          {i + 1}
                        </div>
                        <input
                          autoFocus={i === current.length - 1}
                          value={val}
                          onChange={e => updateItem(i, e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && val.trim() && canAddMore) addItem(); }}
                          placeholder={sense.examples[i] ? `e.g. ${sense.examples[i]}` : "..."}
                          className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:border-teal-400 focus:outline-none"
                        />
                        {val.trim() && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {canAddMore && filledItems.length > 0 && current[current.length - 1].trim() !== "" && (
                  <button onClick={addItem} className="text-sm text-teal-600 hover:text-teal-700 font-medium mb-4 flex items-center gap-1">
                    + Add another ({sense.count - filledItems.length} more to go)
                  </button>
                )}

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>{filledItems.length}/{sense.count} named</span>
                  <span>Sense {senseIdx + 1} of {senses.length}</span>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={filledItems.length < Math.min(1, sense.count)}
                  className={`w-full h-12 font-bold bg-gradient-to-r ${sense.color} hover:opacity-90 border-0 disabled:opacity-40`}
                >
                  {senseIdx < senses.length - 1 ? `Next Sense: ${senses[senseIdx + 1].sense} →` : "Complete Grounding ✓"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}