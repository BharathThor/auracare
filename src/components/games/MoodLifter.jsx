import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle, ArrowRight, Trophy, Sparkles } from "lucide-react";

// Based on Behavioral Activation Therapy (BAT) — one of the most effective treatments for depression
const ACTIVITY_BANKS = [
  {
    category: "Movement", emoji: "🏃", color: "from-orange-400 to-red-400",
    science: "Exercise releases BDNF — the brain's 'miracle grow' for neurons",
    activities: [
      { name: "5-min walk around your space", minutes: 5, mood_boost: 7 },
      { name: "10 jumping jacks or stretches", minutes: 2, mood_boost: 5 },
      { name: "Dance to one song you love", minutes: 4, mood_boost: 9 },
      { name: "Shoulder rolls & neck stretches", minutes: 3, mood_boost: 4 },
    ]
  },
  {
    category: "Connection", emoji: "💬", color: "from-pink-400 to-rose-400",
    science: "Social connection activates the same reward pathways as food and warmth",
    activities: [
      { name: "Text someone 'thinking of you'", minutes: 1, mood_boost: 8 },
      { name: "Call a friend or family member", minutes: 10, mood_boost: 10 },
      { name: "Give someone a genuine compliment", minutes: 2, mood_boost: 7 },
      { name: "Write a letter you may never send", minutes: 10, mood_boost: 6 },
    ]
  },
  {
    category: "Mastery", emoji: "🎯", color: "from-indigo-400 to-purple-400",
    science: "Completing tasks (even tiny ones) restores the brain's sense of control",
    activities: [
      { name: "Clear one cluttered surface", minutes: 5, mood_boost: 6 },
      { name: "Write down 3 things you did today", minutes: 3, mood_boost: 5 },
      { name: "Learn one new word or fact", minutes: 5, mood_boost: 4 },
      { name: "Organize one drawer or folder", minutes: 10, mood_boost: 7 },
    ]
  },
  {
    category: "Pleasure", emoji: "☕", color: "from-yellow-400 to-amber-400",
    science: "Intentional pleasure scheduling (not waiting to feel like it) fights anhedonia",
    activities: [
      { name: "Make a hot drink and drink it mindfully", minutes: 5, mood_boost: 6 },
      { name: "Read a chapter or a few pages", minutes: 10, mood_boost: 5 },
      { name: "Listen to a favourite song fully", minutes: 4, mood_boost: 8 },
      { name: "Look at photos that make you smile", minutes: 5, mood_boost: 7 },
    ]
  },
  {
    category: "Creativity", emoji: "🎨", color: "from-teal-400 to-cyan-400",
    science: "Creative acts stimulate dopamine and build psychological resilience",
    activities: [
      { name: "Doodle or sketch freely for 5 minutes", minutes: 5, mood_boost: 6 },
      { name: "Write 3 lines of poetry or a micro-story", minutes: 5, mood_boost: 7 },
      { name: "Hum or sing something", minutes: 3, mood_boost: 8 },
      { name: "Take 5 interesting photos with your phone", minutes: 5, mood_boost: 5 },
    ]
  },
  {
    category: "Mindfulness", emoji: "🌿", color: "from-green-400 to-emerald-400",
    science: "5 min of mindfulness shrinks the amygdala and reduces depressive rumination",
    activities: [
      { name: "Watch clouds, trees, or the sky for 3 minutes", minutes: 3, mood_boost: 5 },
      { name: "Notice 5 beautiful things around you", minutes: 3, mood_boost: 6 },
      { name: "Slow breath: 4-in, 4-hold, 6-out × 5", minutes: 4, mood_boost: 7 },
      { name: "Body scan: notice sensations without judgment", minutes: 5, mood_boost: 6 },
    ]
  },
];

export default function MoodLifter({ onComplete }) {
  const [phase, setPhase] = useState("pick"); // pick | commit | do | reflect
  const [chosenCategory, setChosenCategory] = useState(null);
  const [chosenActivity, setChosenActivity] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [moodBefore, setMoodBefore] = useState(3);
  const [reflection, setReflection] = useState("");
  const [timer, setTimer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const startTimer = (minutes) => {
    let secs = minutes * 60;
    setSecondsLeft(secs);
    setTimerRunning(true);
    const interval = setInterval(() => {
      secs--;
      setSecondsLeft(secs);
      if (secs <= 0) { clearInterval(interval); setTimerRunning(false); setCompleted(true); }
    }, 1000);
    setTimer(interval);
  };

  const skipTimer = () => {
    if (timer) clearInterval(timer);
    setTimerRunning(false);
    setCompleted(true);
  };

  const formatTime = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  if (phase === "pick") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-2xl font-black text-gray-900">Mood Lifter</h1>
          </div>
          <p className="text-gray-500 mb-2 text-sm">Behavioral Activation Therapy · Choose what to do, then do it</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <p className="text-amber-800 text-sm">🧠 Mood before activity: <strong>{moodBefore}/10</strong></p>
            <input type="range" min="1" max="10" value={moodBefore} onChange={e => setMoodBefore(Number(e.target.value))} className="w-full accent-amber-500 mt-1" />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-4">What feels most accessible right now?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ACTIVITY_BANKS.map(cat => (
              <motion.button key={cat.category} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setChosenCategory(cat); setPhase("commit"); }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${cat.color} text-white text-left shadow-lg hover:shadow-xl transition-all`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{cat.activities.length} options</span>
                </div>
                <h3 className="font-black text-xl mb-1">{cat.category}</h3>
                <p className="text-white/80 text-xs leading-relaxed">{cat.science}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "commit") {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-xl mx-auto">
          <button onClick={() => setPhase("pick")} className="text-gray-500 hover:text-gray-700 mb-4 text-sm">← Back</button>
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${chosenCategory.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
            {chosenCategory.emoji}
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Choose your {chosenCategory.category} activity</h2>
          <p className="text-gray-500 text-sm mb-6">Pick the one that feels most doable right now — the goal is just to start.</p>

          <div className="space-y-3">
            {chosenCategory.activities.map(act => (
              <motion.button key={act.name} whileHover={{ scale: 1.01, x: 4 }} whileTap={{ scale: 0.99 }}
                onClick={() => { setChosenActivity(act); setPhase("do"); }}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-100 hover:border-yellow-300 hover:shadow-lg transition-all text-left shadow-md">
                <div>
                  <p className="font-bold text-gray-900">{act.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">⏱️ ~{act.minutes} min</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Mood boost</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i < Math.round(act.mood_boost / 2) ? "bg-yellow-400" : "bg-gray-200"}`} />
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "do") {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-md w-full">
          <Card className="border-none shadow-2xl bg-white/90">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4"
              >
                {chosenCategory.emoji}
              </motion.div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">{chosenActivity.name}</h2>
              <p className="text-gray-500 text-sm mb-6">
                Commit to doing this for {chosenActivity.minutes} minute{chosenActivity.minutes > 1 ? "s" : ""}. You can stop after that.
              </p>

              {!timerRunning && !completed && (
                <Button onClick={() => startTimer(chosenActivity.minutes)}
                  className={`w-full h-14 text-lg font-black bg-gradient-to-r ${chosenCategory.color} border-0 mb-3`}>
                  ▶ Start Timer ({chosenActivity.minutes} min)
                </Button>
              )}

              {timerRunning && (
                <div className="mb-6">
                  <motion.div
                    key={secondsLeft}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-black text-gray-900 mb-4"
                  >
                    {formatTime(secondsLeft)}
                  </motion.div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${chosenCategory.color}`}
                      style={{ width: `${((chosenActivity.minutes * 60 - secondsLeft) / (chosenActivity.minutes * 60)) * 100}%` }}
                    />
                  </div>
                  <p className="text-gray-500 text-sm mb-4">Go do it! We'll wait here 💪</p>
                  <button onClick={skipTimer} className="text-xs text-gray-400 hover:text-gray-600 underline">
                    Mark as done
                  </button>
                </div>
              )}

              {completed && !timerRunning && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-green-700 font-black text-xl mb-4">You did it! 🎉</p>
                  <div className="bg-green-50 rounded-xl p-4 mb-4 text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Quick reflection</p>
                    <textarea value={reflection} onChange={e => setReflection(e.target.value)}
                      placeholder="How did that feel? Even just a few words..."
                      className="w-full border-2 border-green-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-green-400 min-h-[60px]" />
                  </div>
                  <p className="text-gray-600 mb-3 font-medium">How's your mood now?</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[{v:"very_low",e:"😢"},{v:"low",e:"😟"},{v:"neutral",e:"😐"},{v:"good",e:"🙂"},{v:"very_good",e:"😊"}].map(m => (
                      <Button key={m.v} variant="outline" className="h-16 text-3xl border-2 hover:border-yellow-400" onClick={() => onComplete(m.v)}>{m.e}</Button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-4 bg-amber-50 rounded-xl p-3">
                <p className="text-amber-700 text-xs">💡 {chosenCategory.science}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
}