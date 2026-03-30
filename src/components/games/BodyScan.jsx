import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ChevronRight, Trophy } from "lucide-react";

const bodyParts = [
  { id: "scalp", label: "Scalp & Forehead", emoji: "🧠", instruction: "Notice any tightness or wrinkles in your forehead. Allow your eyebrows to soften and relax completely.", tension_tip: "We often furrow our brows without realizing it. Let it go." },
  { id: "eyes", label: "Eyes & Face", emoji: "👁️", instruction: "Soften the muscles around your eyes. Notice your jaw — let it drop slightly if it feels clenched.", tension_tip: "The jaw holds enormous tension. Allow it to relax naturally." },
  { id: "neck", label: "Neck & Shoulders", emoji: "🤷", instruction: "Feel the weight of your head. Slowly drop your shoulders away from your ears. Notice any tightness here.", tension_tip: "Shoulders are the body's stress carriers. They can drop further than you think." },
  { id: "chest", label: "Chest & Heart", emoji: "❤️", instruction: "Place a hand on your chest if you like. Feel it rise and fall with each breath. Breathe into any tightness you find.", tension_tip: "Anxiety often lives in the chest. Slow, full breaths here signal safety to your nervous system." },
  { id: "belly", label: "Belly & Abdomen", emoji: "🌀", instruction: "Let your belly be soft and relaxed — not held in. Feel it expand as you breathe in, fall as you breathe out.", tension_tip: "We often unconsciously hold our stomachs in. Let go of that control completely." },
  { id: "hands", label: "Arms & Hands", emoji: "🤲", instruction: "Notice the temperature in your hands. Let your fingers uncurl. Feel any tingling or heaviness in your arms.", tension_tip: "Hands often hold tension — especially if you've been gripping a phone or keyboard." },
  { id: "hips", label: "Hips & Pelvis", emoji: "🦴", instruction: "Feel the weight of your pelvis against the surface beneath you. Let your hips soften and widen with gravity.", tension_tip: "Trauma and stress are often stored in the hips. Even sitting differently can release tension here." },
  { id: "legs", label: "Thighs & Knees", emoji: "🦵", instruction: "Scan down through your thighs and knees. Notice any areas of holding or discomfort. Breathe into them gently.", tension_tip: "The legs often tense when we're preparing to 'flee' — even when there's no real threat." },
  { id: "feet", label: "Feet & Toes", emoji: "🦶", instruction: "Feel your feet on the floor or floating. Wiggle your toes gently. Notice the sensations in your soles.", tension_tip: "Grounding yourself through your feet sends a signal to the brain that you are safe and supported." },
];

export default function BodyScan({ onComplete }) {
  const [step, setStep] = useState(-1); // -1 = intro
  const [notes, setNotes] = useState({});
  const [tension, setTension] = useState({});
  const [soundOn, setSoundOn] = useState(true);
  const [done, setDone] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("in");
  const breathRef = useRef(null);

  useEffect(() => {
    if (step < 0 || step >= bodyParts.length) return;
    const part = bodyParts[step];
    if (soundOn && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(part.instruction);
      u.rate = 0.75; u.pitch = 0.9; u.volume = 0.8;
      window.speechSynthesis.speak(u);
    }
  }, [step, soundOn]);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); clearTimeout(breathRef.current); };
  }, []);

  const startBreathing = () => {
    setIsBreathing(true);
    let phase = "in";
    const cycle = () => {
      setBreathPhase(phase);
      breathRef.current = setTimeout(() => {
        phase = phase === "in" ? "out" : "in";
        cycle();
      }, phase === "in" ? 4000 : 6000);
    };
    cycle();
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    clearTimeout(breathRef.current);
  };

  const handleNext = () => {
    if (step < bodyParts.length - 1) setStep(s => s + 1);
    else setDone(true);
  };

  const highTensionParts = Object.entries(tension).filter(([, v]) => v >= 3).map(([k]) => bodyParts.find(b => b.id === k)?.label);

  if (done) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-2">Body Scan Complete 🌿</h2>
              <p className="text-gray-600 mb-4">You've moved through your whole body with awareness.</p>
              {highTensionParts.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 text-left">
                  <p className="text-orange-700 font-bold text-sm mb-1">Areas of higher tension noticed:</p>
                  <p className="text-orange-600 text-sm">{highTensionParts.join(", ")}</p>
                  <p className="text-orange-500 text-xs mt-2">These areas benefit most from gentle movement, heat, or breath-work.</p>
                </div>
              )}
              <div className="bg-teal-50 rounded-xl p-4 mb-6">
                <p className="text-teal-700 text-sm">🧠 <strong>Science:</strong> MBSR (Mindfulness-Based Stress Reduction) body scans have been shown to reduce cortisol levels and improve sleep quality in as few as 8 sessions (Kabat-Zinn, 1994)</p>
              </div>
              <p className="text-gray-600 mb-4 font-medium">How do you feel?</p>
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

  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-blue-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🫀</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Interactive Body Scan</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">
                A guided mindfulness practice that moves awareness through each part of your body — releasing stored tension and stress.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
                <p className="text-amber-800 text-sm">🧠 This is the core technique of MBSR — proven to reduce anxiety, chronic pain, and improve immune function.</p>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700 font-medium">Voice guidance</p>
                <button onClick={() => setSoundOn(!soundOn)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${soundOn ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {soundOn ? <><Volume2 className="w-4 h-4" /> ON</> : <><VolumeX className="w-4 h-4" /> OFF</>}
                </button>
              </div>
              <Button onClick={() => setStep(0)} className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-500 font-bold">
                Begin Body Scan 🌿
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const part = bodyParts[step];
  const tensionVal = tension[part.id] || 0;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      <div className="max-w-xl mx-auto">
        {/* Sound toggle */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500 text-sm">Step {step + 1} of {bodyParts.length}</p>
          <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow">
            {soundOn ? <Volume2 className="w-5 h-5 text-teal-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-6">
          {bodyParts.map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${i < step ? "bg-teal-400" : i === step ? "bg-teal-600" : "bg-gray-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="text-6xl mb-3"
                  >
                    {part.emoji}
                  </motion.div>
                  <h2 className="text-2xl font-black text-gray-900">{part.label}</h2>
                </div>

                <div className="bg-teal-50 rounded-2xl p-5 mb-5">
                  <p className="text-teal-800 text-base leading-relaxed">{part.instruction}</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
                  <p className="text-blue-600 text-xs">💡 {part.tension_tip}</p>
                </div>

                {/* Tension rating */}
                <div className="mb-5">
                  <label className="text-sm font-bold text-gray-700 block mb-3">How much tension do you feel here?</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">None</span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button key={v} onClick={() => setTension(p => ({ ...p, [part.id]: v }))}
                          className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                            tensionVal === v ? "bg-teal-500 text-white shadow-md scale-110" :
                            tensionVal > v ? "bg-teal-200 text-teal-700" : "bg-gray-100 text-gray-400 hover:bg-teal-50"
                          }`}>
                          {v}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">High</span>
                  </div>
                </div>

                {/* Breathing button */}
                {!isBreathing ? (
                  <button onClick={startBreathing}
                    className="w-full text-sm text-teal-600 hover:text-teal-800 font-medium bg-teal-50 rounded-xl py-3 mb-4 border border-teal-200 transition-colors">
                    🫁 Add a breathing cycle here
                  </button>
                ) : (
                  <div className="mb-4 text-center">
                    <motion.div
                      animate={{ scale: breathPhase === "in" ? 1.5 : 1 }}
                      transition={{ duration: breathPhase === "in" ? 4 : 6, ease: "easeInOut" }}
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-blue-400 mx-auto flex items-center justify-center text-white font-bold shadow-lg mb-2"
                    >
                      {breathPhase === "in" ? "In" : "Out"}
                    </motion.div>
                    <button onClick={stopBreathing} className="text-xs text-gray-400 hover:text-gray-600 underline">Stop breathing guide</button>
                  </div>
                )}

                <Button onClick={handleNext}
                  className="w-full h-12 bg-gradient-to-r from-teal-500 to-blue-500 font-bold hover:opacity-90">
                  {step < bodyParts.length - 1 ? `Move to ${bodyParts[step + 1].label}` : "Complete Body Scan ✓"}
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}