import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Battery, Plus, Trash2, Trophy, ArrowRight } from "lucide-react";

// Based on Jim Loehr & Tony Schwartz's "The Power of Full Engagement" + Burnout research by Maslach
const DRAINER_EXAMPLES = [
  "Endless scrolling", "Negative news", "Toxic relationships",
  "Overcommitting", "Poor sleep", "Skipping meals", "Caffeine cycles",
  "Cluttered environment", "Comparison on social media", "Unresolved conflicts"
];

const RECHARGER_EXAMPLES = [
  "Spending time in nature", "Physical movement", "Deep sleep",
  "Creative hobbies", "Quality time with loved ones", "Reading for pleasure",
  "Meditation or prayer", "Acts of kindness", "Music", "Cooking a meal"
];

const phases = [
  { id: "intro", title: "Energy Matrix" },
  { id: "drain", title: "What drains you?" },
  { id: "recharge", title: "What recharges you?" },
  { id: "matrix", title: "Your Energy Map" },
  { id: "plan", title: "Your Action Plan" },
];

export default function EnergyMatrix({ onComplete }) {
  const [phase, setPhase] = useState("intro");
  const [drainers, setDrainers] = useState([]);
  const [rechargers, setRechargers] = useState([]);
  const [drainInput, setDrainInput] = useState("");
  const [rechargeInput, setRechargeInput] = useState("");
  const [commitments, setCommitments] = useState([]);
  const [commitment, setCommitment] = useState("");

  const addDrainer = (val) => {
    const v = val || drainInput;
    if (v.trim() && drainers.length < 8) { setDrainers(p => [...p, v.trim()]); setDrainInput(""); }
  };

  const addRecharger = (val) => {
    const v = val || rechargeInput;
    if (v.trim() && rechargers.length < 8) { setRechargers(p => [...p, v.trim()]); setRechargeInput(""); }
  };

  const addCommitment = () => {
    if (commitment.trim()) { setCommitments(p => [...p, commitment.trim()]); setCommitment(""); }
  };

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <Zap className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-black text-gray-900 mb-3">Energy Management Matrix</h1>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Burnout isn't just about doing too much. It's about giving more energy than you're recovering.
                <br /><br />
                This exercise maps what's draining you vs. what restores you — so you can rebalance.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-800 text-sm">🧠 <strong>Research:</strong> Loehr & Schwartz found that managing <em>energy</em> (not time) is the key to sustained high performance and wellbeing. Recharge activities are as important as work.</p>
              </div>
              <Button onClick={() => setPhase("drain")} className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 font-bold">
                Map My Energy ⚡
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (phase === "drain") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Battery className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Energy Drainers</h2>
              <p className="text-gray-500 text-sm">What consistently takes energy without giving back?</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
            <p className="text-red-700 text-sm">💡 Think: activities, people, habits, or situations that leave you feeling worse, exhausted, or depleted</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input value={drainInput} onChange={e => setDrainInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addDrainer(); }}
              placeholder="Add your own drainer..."
              className="flex-1 border-2 border-red-200 rounded-xl px-4 py-3 focus:border-red-400 focus:outline-none text-gray-800" />
            <Button onClick={() => addDrainer()} disabled={!drainInput.trim()} className="bg-red-500 hover:bg-red-600 px-5">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {drainers.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Your drainers ({drainers.length})</p>
              <div className="flex flex-wrap gap-2">
                {drainers.map((d, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 bg-red-100 border border-red-200 text-red-800 px-3 py-1.5 rounded-full text-sm font-medium">
                    🔴 {d}
                    <button onClick={() => setDrainers(p => p.filter((_, idx) => idx !== i))} className="hover:text-red-600 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-3">Quick-add common ones:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {DRAINER_EXAMPLES.filter(e => !drainers.includes(e)).slice(0, 6).map(ex => (
              <button key={ex} onClick={() => addDrainer(ex)}
                className="text-xs border border-red-200 bg-white hover:bg-red-50 text-red-700 px-3 py-1.5 rounded-full transition-colors">
                + {ex}
              </button>
            ))}
          </div>

          <Button onClick={() => setPhase("recharge")} disabled={drainers.length < 2}
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 font-bold disabled:opacity-40">
            Next: What Recharges You? →
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "recharge") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Zap className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Energy Rechargers</h2>
              <p className="text-gray-500 text-sm">What restores, energizes, or fulfills you?</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5">
            <p className="text-green-700 text-sm">💡 These are activities that leave you feeling better than when you started — even if they require effort</p>
          </div>

          <div className="flex gap-2 mb-4">
            <input value={rechargeInput} onChange={e => setRechargeInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addRecharger(); }}
              placeholder="Add your own recharger..."
              className="flex-1 border-2 border-green-200 rounded-xl px-4 py-3 focus:border-green-400 focus:outline-none text-gray-800" />
            <Button onClick={() => addRecharger()} disabled={!rechargeInput.trim()} className="bg-green-500 hover:bg-green-600 px-5">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {rechargers.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Your rechargers ({rechargers.length})</p>
              <div className="flex flex-wrap gap-2">
                {rechargers.map((d, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="flex items-center gap-1.5 bg-green-100 border border-green-200 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
                    🟢 {d}
                    <button onClick={() => setRechargers(p => p.filter((_, idx) => idx !== i))} className="hover:text-green-600 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500 mb-3">Quick-add common ones:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {RECHARGER_EXAMPLES.filter(e => !rechargers.includes(e)).slice(0, 6).map(ex => (
              <button key={ex} onClick={() => addRecharger(ex)}
                className="text-xs border border-green-200 bg-white hover:bg-green-50 text-green-700 px-3 py-1.5 rounded-full transition-colors">
                + {ex}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPhase("drain")} className="flex-shrink-0">← Back</Button>
            <Button onClick={() => setPhase("matrix")} disabled={rechargers.length < 2}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-teal-500 font-bold disabled:opacity-40">
              See My Energy Map →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "matrix") {
    const balance = rechargers.length - drainers.length;
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 to-amber-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Your Energy Map</h2>
          <p className="text-gray-500 text-sm mb-6 text-center">Here's how your energy flows</p>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Battery className="w-5 h-5 text-red-500" />
                  <h3 className="font-black text-red-700">Draining ({drainers.length})</h3>
                </div>
                <div className="space-y-2">
                  {drainers.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm text-red-800">
                      🔴 {d}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-green-500" />
                  <h3 className="font-black text-green-700">Recharging ({rechargers.length})</h3>
                </div>
                <div className="space-y-2">
                  {rechargers.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm text-green-800">
                      🟢 {r}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={`rounded-2xl p-5 mb-6 ${balance >= 0 ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}>
            <p className="font-black text-xl mb-1">
              {balance > 2 ? "⚡ Good energy balance!" : balance >= 0 ? "⚠️ Just about balanced" : "🔴 More drainers than rechargers"}
            </p>
            <p className={`text-sm ${balance >= 0 ? "text-green-700" : "text-red-700"}`}>
              {balance > 2
                ? "You have a solid mix. Keep scheduling your rechargers consistently."
                : balance >= 0
                ? "You're borderline. Adding even one more recharger to your week would help significantly."
                : "This is a recipe for burnout. Let's build an action plan to add more recovery to your days."}
            </p>
          </div>

          <Button onClick={() => setPhase("plan")} className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 font-bold">
            Build My Action Plan →
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "plan") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-xl mx-auto">
          <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Your Action Plan</h2>
          <p className="text-gray-500 text-sm mb-6">Choose 1-3 things you'll commit to doing differently this week</p>

          <div className="flex gap-2 mb-4">
            <input value={commitment} onChange={e => setCommitment(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") addCommitment(); }}
              placeholder={`e.g. Schedule 30 min of ${rechargers[0] || "recharging"} daily`}
              className="flex-1 border-2 border-purple-200 rounded-xl px-4 py-3 focus:border-purple-400 focus:outline-none text-gray-800 text-sm" />
            <Button onClick={addCommitment} disabled={!commitment.trim()} className="bg-purple-500 hover:bg-purple-600 px-5">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {rechargers.slice(0, 3).map((r, i) => (
            <button key={i} onClick={() => setCommitment(`Do more of: ${r}`)}
              className="block w-full text-left text-xs border border-purple-200 bg-white hover:bg-purple-50 text-purple-700 px-4 py-2 rounded-xl mb-2 transition-colors">
              💡 Suggestion: "Schedule time for: {r}"
            </button>
          ))}

          {commitments.length > 0 && (
            <div className="mt-4 space-y-2 mb-6">
              {commitments.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 bg-purple-100 rounded-xl px-4 py-3">
                  <span className="text-purple-500 font-black">{i + 1}.</span>
                  <p className="text-purple-800 text-sm flex-1">{c}</p>
                  <button onClick={() => setCommitments(p => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="w-4 h-4 text-purple-400 hover:text-purple-600" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <p className="text-gray-600 mb-4 font-medium mt-4">How do you feel after this reflection?</p>
          <div className="grid grid-cols-5 gap-2">
            {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
              <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-purple-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}