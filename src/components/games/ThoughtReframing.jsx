import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowRight, CheckCircle, Lightbulb, Trophy } from "lucide-react";

const distortions = [
  { id: "catastrophizing", label: "Catastrophizing", emoji: "💥", desc: "Expecting the worst outcome" },
  { id: "mind-reading", label: "Mind Reading", emoji: "🧠", desc: "Assuming you know what others think" },
  { id: "all-or-nothing", label: "All-or-Nothing", emoji: "⚖️", desc: "Seeing things in extremes" },
  { id: "should-statements", label: "Should Statements", emoji: "👆", desc: "Rigid rules about how things must be" },
  { id: "emotional-reasoning", label: "Emotional Reasoning", emoji: "💔", desc: "Feelings = facts" },
  { id: "overgeneralization", label: "Overgeneralization", emoji: "🔄", desc: "One bad event means it always happens" },
  { id: "filtering", label: "Mental Filtering", emoji: "🔎", desc: "Focusing only on negatives" },
  { id: "personalization", label: "Personalization", emoji: "🎯", desc: "Blaming yourself for everything" },
];

const STEPS = [
  { id: "catch", title: "Catch the Thought", subtitle: "Step 1 of 4", color: "from-red-400 to-orange-400" },
  { id: "check", title: "Check the Distortion", subtitle: "Step 2 of 4", color: "from-orange-400 to-yellow-400" },
  { id: "evidence", title: "Examine the Evidence", subtitle: "Step 3 of 4", color: "from-yellow-400 to-green-400" },
  { id: "reframe", title: "Create a Balanced Thought", subtitle: "Step 4 of 4", color: "from-green-400 to-teal-400" },
];

const prompts = [
  "I always mess everything up.",
  "Nobody likes me.",
  "I'll never be good enough.",
  "Things will never get better.",
  "I can't handle this.",
  "Everyone is judging me.",
];

export default function ThoughtReframing({ onComplete }) {
  const [step, setStep] = useState(0);
  const [thought, setThought] = useState("");
  const [selected, setSelected] = useState([]);
  const [proEvidence, setProEvidence] = useState("");
  const [againstEvidence, setAgainstEvidence] = useState("");
  const [reframe, setReframe] = useState("");
  const [done, setDone] = useState(false);
  const [beliefBefore, setBeliefBefore] = useState(80);
  const [beliefAfter, setBeliefAfter] = useState(50);

  const currentStep = STEPS[step];

  const toggleDistortion = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const canProceed = () => {
    if (step === 0) return thought.trim().length > 5;
    if (step === 1) return selected.length > 0;
    if (step === 2) return proEvidence.trim().length > 3 && againstEvidence.trim().length > 3;
    if (step === 3) return reframe.trim().length > 5;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else setDone(true);
  };

  if (done) {
    const reduction = beliefBefore - beliefAfter;
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-2">Thought Reframed! 🎉</h2>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 mb-6 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Original Thought</p>
                <p className="text-gray-600 italic mb-4">"{thought}"</p>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Balanced Thought</p>
                <p className="text-green-700 font-semibold">"{reframe}"</p>
              </div>
              {reduction > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                  <p className="text-purple-700 font-bold">🧠 You reduced belief in the negative thought by {reduction}%!</p>
                  <p className="text-purple-500 text-sm mt-1">This is exactly how CBT rewires the brain over time.</p>
                </div>
              )}
              <p className="text-gray-600 mb-4 font-medium">How do you feel now?</p>
              <div className="grid grid-cols-5 gap-2">
                {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                  <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-green-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-indigo-500" />
          <div>
            <h1 className="text-2xl font-black text-gray-900">Thought Detective</h1>
            <p className="text-gray-500 text-sm">Cognitive Behavioral Therapy · Evidence-based</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= step ? `bg-gradient-to-r ${s.color}` : "bg-gray-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${currentStep.color} mb-4`}>
                  {currentStep.subtitle}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{currentStep.title}</h2>

                {/* Step 0: Catch the thought */}
                {step === 0 && (
                  <div>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Write down the negative thought that's bothering you. Be specific and honest — there's no judgment here.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-amber-700 text-sm font-medium">💡 <strong>Why this works:</strong> Externalizing thoughts activates the prefrontal cortex, reducing amygdala reactivity (Lieberman et al., 2007)</p>
                    </div>
                    <textarea
                      value={thought}
                      onChange={e => setThought(e.target.value)}
                      placeholder="e.g. I always mess things up, nobody likes me..."
                      className="w-full border-2 border-gray-200 rounded-xl p-4 text-gray-800 min-h-[100px] focus:border-indigo-400 focus:outline-none resize-none text-lg"
                    />
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Or try a common one:</p>
                      <div className="flex flex-wrap gap-2">
                        {prompts.map(p => (
                          <button key={p} onClick={() => setThought(p)}
                            className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 transition-colors">
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">How strongly do you believe this thought? <span className="font-bold text-indigo-600">{beliefBefore}%</span></p>
                      <input type="range" min="0" max="100" value={beliefBefore} onChange={e => setBeliefBefore(Number(e.target.value))}
                        className="w-full accent-indigo-500" />
                    </div>
                  </div>
                )}

                {/* Step 1: Identify distortions */}
                {step === 1 && (
                  <div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border-l-4 border-indigo-400">
                      <p className="text-gray-700 italic">"{thought}"</p>
                    </div>
                    <p className="text-gray-600 mb-2">Which thinking traps do you spot? Select all that apply:</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-amber-700 text-sm">💡 Naming distortions reduces their power — this is cognitive defusion from ACT therapy</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {distortions.map(d => (
                        <motion.button
                          key={d.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleDistortion(d.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selected.includes(d.id)
                              ? "border-indigo-500 bg-indigo-50 shadow-md"
                              : "border-gray-200 hover:border-indigo-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{d.emoji}</span>
                            {selected.includes(d.id) && <CheckCircle className="w-4 h-4 text-indigo-500 ml-auto" />}
                          </div>
                          <p className="font-bold text-sm text-gray-800">{d.label}</p>
                          <p className="text-xs text-gray-500">{d.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Evidence */}
                {step === 2 && (
                  <div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border-l-4 border-orange-400">
                      <p className="text-gray-700 italic">"{thought}"</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-amber-700 text-sm">💡 Socratic questioning — finding real-world evidence — is the core of CBT's effectiveness (Beck, 1979)</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-red-600 mb-2">🔴 Evidence FOR this thought being true:</label>
                        <textarea value={proEvidence} onChange={e => setProEvidence(e.target.value)}
                          placeholder="Facts that support this thought..."
                          className="w-full border-2 border-red-200 rounded-xl p-3 min-h-[80px] focus:border-red-400 focus:outline-none resize-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-green-600 mb-2">🟢 Evidence AGAINST this thought being true:</label>
                        <textarea value={againstEvidence} onChange={e => setAgainstEvidence(e.target.value)}
                          placeholder="Facts that contradict this thought... (times it wasn't true, exceptions, etc.)"
                          className="w-full border-2 border-green-200 rounded-xl p-3 min-h-[80px] focus:border-green-400 focus:outline-none resize-none text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Reframe */}
                {step === 3 && (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-red-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-red-600 mb-1">Original thought</p>
                        <p className="text-sm text-gray-700 italic">"{thought}"</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-green-600 mb-1">Distortions found</p>
                        <p className="text-sm text-gray-700">{selected.map(id => distortions.find(d => d.id === id)?.label).join(", ")}</p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                      <p className="text-amber-700 text-sm">💡 A balanced thought isn't forced positivity — it's realistic, kind, and takes all evidence into account</p>
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Write a more balanced version of this thought:</label>
                    <textarea value={reframe} onChange={e => setReframe(e.target.value)}
                      placeholder='e.g. "Sometimes I make mistakes, but I also succeed. I can learn from this."'
                      className="w-full border-2 border-green-200 rounded-xl p-4 min-h-[100px] focus:border-green-400 focus:outline-none resize-none text-gray-800" />
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">How strongly do you now believe the original thought? <span className="font-bold text-green-600">{beliefAfter}%</span></p>
                      <input type="range" min="0" max="100" value={beliefAfter} onChange={e => setBeliefAfter(Number(e.target.value))}
                        className="w-full accent-green-500" />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-12 text-base font-bold disabled:opacity-40"
                >
                  {step < 3 ? "Continue" : "Complete Exercise"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}