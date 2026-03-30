import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const pageMessages = {
  "/Dashboard": [
    "Hey! I'm Mochi 🐰 Your little wellness buddy! Let's make today wonderful!",
    "You showed up today — that's already a win! 🌟",
    "Complete a challenge and earn XP! You've got this! ⚡",
    "Every small step counts. I'm cheering for you! 💜"
  ],
  "/Games": [
    "Ooh games! My favourite! Pick one and let's play! 🎮",
    "These aren't just games — they're superpowers for your mind! 🦸",
    "Level up your mental wellness! Which one calls to you? ⭐",
    "I love the breathing game. It makes me feel so floaty! 🫁"
  ],
  "/Assessment": [
    "Take a deep breath... I'll be right here with you 💜",
    "There are no wrong answers. Just be honest with yourself 🌸",
    "This helps me understand you better so I can help more! 🧠",
  ],
  "/Profile": [
    "Look how far you've come! So proud of you! 🏆",
    "Your wellness journey is unique and beautiful! ✨",
    "Your achievements are shining bright! 🌟",
  ],
  "/Helplines": [
    "Reaching out takes courage. You are incredibly brave! 💪",
    "Help is always available. You are never alone! 🤝",
  ],
  default: [
    "Hi! I'm Mochi! 🐰 I'm here to cheer you on!",
    "Remember: small steps lead to big changes! 🌱",
    "You've got this! I believe in you! 💜",
    "Hop hop! Let's make progress today! 🐾",
  ]
};

export default function Mascot() {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [bounce, setBounce] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  const hiddenPaths = ["/", "/Landing", "/Onboarding"];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.includes("Landing") || location.pathname.includes("Onboarding"))) {
    return null;
  }

  useEffect(() => {
    const messages = pageMessages[location.pathname] || pageMessages.default;
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
    setIsMinimized(false);
    const timer = setTimeout(() => setIsMinimized(true), 6000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Ear wiggle
  useEffect(() => {
    const interval = setInterval(() => {
      setWiggle(true);
      setTimeout(() => setWiggle(false), 800);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => { setDismissed(false); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl z-50 text-2xl hover:scale-110 transition-transform border-4 border-white"
        title="Bring Mochi back!"
      >
        🐰
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Speech bubble */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-[220px] border-2 border-pink-200"
          >
            {/* Bubble tail */}
            <div className="absolute -bottom-3 right-7 w-0 h-0"
              style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "12px solid white" }} />
            <div className="absolute -bottom-4 right-6 w-0 h-0"
              style={{ borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "14px solid #fbcfe8" }} />

            <button onClick={() => setIsMinimized(true)} className="absolute top-2 right-2 text-gray-300 hover:text-gray-500 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </button>

            <p className="text-sm text-gray-700 leading-relaxed pr-4">{message}</p>

            <button onClick={() => setDismissed(true)} className="mt-2 text-xs text-gray-300 hover:text-gray-500 underline transition-colors">
              Hide Mochi
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rabbit Avatar */}
      <motion.button
        animate={{ y: bounce ? [-10, 0] : 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
        onClick={() => setIsMinimized(m => !m)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 flex items-center justify-center"
        title={isMinimized ? "Chat with Mochi!" : "Hide message"}
      >
        {/* Rabbit body */}
        <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative overflow-visible">
          {/* Ears */}
          <motion.div
            animate={{ rotate: wiggle ? [0, -15, 15, -8, 8, 0] : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-5 left-2 flex gap-3"
          >
            <div className="w-3.5 h-7 bg-gradient-to-t from-pink-300 to-pink-100 rounded-full border-2 border-pink-200 shadow-sm" style={{ transform: "rotate(-8deg)" }}>
              <div className="w-1.5 h-4 bg-pink-400 rounded-full mx-auto mt-0.5" />
            </div>
            <div className="w-3.5 h-7 bg-gradient-to-t from-pink-300 to-pink-100 rounded-full border-2 border-pink-200 shadow-sm" style={{ transform: "rotate(8deg)" }}>
              <div className="w-1.5 h-4 bg-pink-400 rounded-full mx-auto mt-0.5" />
            </div>
          </motion.div>

          {/* Face */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Eyes */}
            <div className="flex gap-2 mb-0.5">
              <motion.div
                animate={{ scaleY: bounce ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 bg-gray-800 rounded-full"
              />
              <motion.div
                animate={{ scaleY: bounce ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="w-2.5 h-2.5 bg-gray-800 rounded-full"
              />
            </div>
            {/* Cheek blushes */}
            <div className="flex gap-4 -mt-0.5 mb-0.5">
              <div className="w-3 h-1.5 bg-pink-400 rounded-full opacity-60" />
              <div className="w-3 h-1.5 bg-pink-400 rounded-full opacity-60" />
            </div>
            {/* Nose & mouth */}
            <div className="flex flex-col items-center">
              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
              <div className="w-3 h-1 border-b-2 border-gray-600 rounded-b-full" />
            </div>
          </div>
        </div>

        {/* Notification dot when minimized */}
        {isMinimized && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white"
          />
        )}
      </motion.button>
    </div>
  );
}