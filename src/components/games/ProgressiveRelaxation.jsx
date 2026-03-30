import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Trophy } from "lucide-react";

const muscleGroups = [
  { name: "Hands & Forearms", emoji: "🤜", tense: "Make a tight fist with both hands", release: "Open your hands wide, let them go completely limp", duration: 7 },
  { name: "Upper Arms", emoji: "💪", tense: "Bend your elbows and flex your biceps hard", release: "Let your arms drop and hang loose", duration: 7 },
  { name: "Shoulders", emoji: "🤷", tense: "Shrug your shoulders up to your ears as high as they'll go", release: "Let your shoulders drop down completely — feel the release", duration: 7 },
  { name: "Forehead & Scalp", emoji: "🧠", tense: "Raise your eyebrows as high as possible, wrinkling your forehead", release: "Let your forehead smooth out — feel it become flat and soft", duration: 6 },
  { name: "Eyes & Face", emoji: "😬", tense: "Squeeze your eyes shut tightly, scrunch your whole face", release: "Relax every muscle in your face — let it become completely slack", duration: 6 },
  { name: "Jaw & Neck", emoji: "😤", tense: "Clench your jaw, press your tongue to the roof of your mouth", release: "Let your jaw drop slightly, tongue rest softly — feel the relief", duration: 7 },
  { name: "Chest & Breath", emoji: "❤️", tense: "Take a deep breath and hold it — feel the tension in your chest", release: "Let the breath go slowly — feel the warmth spread through your chest", duration: 8 },
  { name: "Abdomen", emoji: "🌀", tense: "Tighten your stomach muscles, pull your belly button to your spine", release: "Let your belly be completely soft, relaxed, unguarded", duration: 7 },
  { name: "Thighs & Glutes", emoji: "🦵", tense: "Squeeze your thighs and buttocks as tightly as possible", release: "Let them go — feel the weight of your body supported by the surface below", duration: 7 },
  { name: "Calves & Feet", emoji: "🦶", tense: "Point your toes away from you and curl them, tensing your calves", release: "Let your feet relax — notice the warm, heavy feeling in your legs", duration: 7 },
];

const TENSE_DURATION = 7; // seconds to tense

export default function ProgressiveRelaxation({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | active | complete
  const [step, setStep] = useState(0);
  const [subPhase, setSubPhase] = useState("tense"); // tense | release
  const [countdown, setCountdown] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const [relaxation, setRelaxation] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== "active") return;
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else {
      if (subPhase === "tense") {
        // Move to release
        setSubPhase("release");
        const releaseDur = muscleGroups[step].duration;
        setCountdown(releaseDur);
        speak("Release. Let it all go.");
      } else {
        // Next muscle group or done
        setRelaxation(prev => Math.min(100, prev + 10));
        if (step < muscleGroups.length - 1) {
          const next = step + 1;
          setStep(next);
          setSubPhase("tense");
          setCountdown(TENSE_DURATION);
          speak(`Now, ${muscleGroups[next].tense}`);
        } else {
          setPhase("complete");
        }
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [countdown, phase]);

  const speak = (text) => {
    if (!soundOn || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.75; u.pitch = 0.9; u.volume = 0.8;
    window.speechSynthesis.speak(u);
  };

  const startExercise = () => {
    setPhase("active");
    setStep(0);
    setSubPhase("tense");
    setCountdown(TENSE_DURATION);
    speak(muscleGroups[0].tense);
  };

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); clearTimeout(timerRef.current); };
  }, []);

  if (phase === "intro") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <div className="text-6xl mb-4">🧘</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">Progressive Muscle Relaxation</h1>
              <p className="text-gray-600 mb-4 leading-relaxed">
                By intentionally tensing and then releasing each muscle group, you teach your body what deep relaxation feels like — and how to get there.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-left">
                <p className="text-amber-800 text-sm">🧠 <strong>Jacobson (1929), modernized:</strong> PMR reduces cortisol, improves sleep quality, and reduces anxiety as effectively as medication in mild-moderate cases.</p>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700 font-medium">Voice guidance</p>
                <button onClick={() => setSoundOn(!soundOn)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${soundOn ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {soundOn ? <><Volume2 className="w-4 h-4" /> ON</> : <><VolumeX className="w-4 h-4" /> OFF</>}
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">🕐 ~{Math.round(muscleGroups.reduce((a, g) => a + TENSE_DURATION + g.duration + 2, 0) / 60)} minutes · Find a comfortable seated or lying position</p>
              <Button onClick={startExercise} className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 font-black text-lg">
                <Play className="w-5 h-5 mr-2" /> Begin Relaxation
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-10 text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-gray-900 mb-2">Fully Relaxed 🌸</h2>
              <p className="text-gray-600 mb-4">You've completed all {muscleGroups.length} muscle groups. Your nervous system is in rest-and-digest mode now.</p>
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Relaxation level achieved</p>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${relaxation}%` }}
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                </div>
                <p className="text-purple-600 font-black text-2xl mt-2">{relaxation}%</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <p className="text-purple-700 text-sm">💡 <strong>For best results:</strong> Practice PMR daily for 3 weeks. Your body will learn to relax more deeply and quickly each time.</p>
              </div>
              <p className="text-gray-600 mb-4 font-medium">How do you feel?</p>
              <div className="grid grid-cols-5 gap-2">
                {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                  <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-purple-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const muscle = muscleGroups[step];
  const isTensing = subPhase === "tense";
  const totalDuration = isTensing ? TENSE_DURATION : muscle.duration;
  const progress = ((totalDuration - countdown) / totalDuration) * 100;

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Sound toggle */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-500 text-sm font-medium">Group {step + 1}/{muscleGroups.length}</p>
          <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-full bg-white shadow">
            {soundOn ? <Volume2 className="w-5 h-5 text-purple-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
          </button>
        </div>

        {/* Relaxation bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Relaxation</span><span>{relaxation}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
              animate={{ width: `${relaxation}%` }} transition={{ duration: 1 }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={`${step}-${subPhase}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1">
            <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm h-full">
              <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                <div>
                  {/* Phase indicator */}
                  <div className={`inline-block px-5 py-2 rounded-full text-sm font-black mb-6 ${
                    isTensing ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    {isTensing ? "🔴 TENSE" : "🟢 RELEASE"}
                  </div>

                  {/* Emoji */}
                  <motion.div
                    animate={isTensing ? { scale: [1, 1.1, 1], rotate: [-2, 2, -2, 0] } : { scale: [1, 0.95, 1] }}
                    transition={{ repeat: Infinity, duration: isTensing ? 0.8 : 2 }}
                    className="text-8xl mb-4"
                  >
                    {muscle.emoji}
                  </motion.div>

                  <h2 className="text-2xl font-black text-gray-900 mb-4">{muscle.name}</h2>

                  {/* Instruction */}
                  <div className={`rounded-2xl p-5 mb-6 ${isTensing ? "bg-red-50" : "bg-green-50"}`}>
                    <p className={`text-base leading-relaxed font-medium ${isTensing ? "text-red-700" : "text-green-700"}`}>
                      {isTensing ? muscle.tense : muscle.release}
                    </p>
                  </div>
                </div>

                {/* Countdown */}
                <div>
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <motion.circle cx="50" cy="50" r="42" fill="none"
                        stroke={isTensing ? "#ef4444" : "#22c55e"}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        animate={{ strokeDashoffset: `${2 * Math.PI * 42 * (1 - progress / 100)}` }}
                        transition={{ duration: 0.9 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-4xl font-black text-gray-900">{countdown}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">{isTensing ? "seconds of tension" : "seconds of release"}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}