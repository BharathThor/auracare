import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

const pageMessages = {
  "/Dashboard": [
    "Hey there! I'm Mochi 🐼 Your wellness buddy! Let's crush today's challenges!",
    "You showed up today — that's already a win! 🌟",
    "I believe in you! Complete a challenge and earn XP! ⚡",
    "Every small step counts. You're doing amazing! 💜"
  ],
  "/Games": [
    "Ooh games! My favorite! Pick one and let's play! 🎮",
    "These aren't just games — they're superpowers for your mind! 🦸",
    "Level up your mental wellness! Which game calls to you? ⭐",
    "I've played all these games. The breathing one is chef's kiss! 🫁"
  ],
  "/Assessment": [
    "Take a deep breath... I'll be right here with you 💜",
    "There are no wrong answers. Be honest with yourself! 🌸",
    "This helps me understand how to help you better! 🧠",
  ],
  "/Profile": [
    "Look how far you've come! So proud of you! 🏆",
    "Your wellness journey is unique and beautiful! ✨",
  ],
  "/Helplines": [
    "Reaching out takes courage. You're incredibly brave! 💪",
    "Help is always available. You're never alone! 🤝",
  ],
  default: [
    "Hi! I'm Mochi! 🐼 I'm here to cheer you on!",
    "Remember: small steps lead to big changes! 🌱",
    "You've got this! I believe in you! 💜",
  ]
};

const moods = {
  happy: "😄",
  excited: "🤩",
  calm: "😌",
  thinking: "🤔",
  cheering: "🎉"
};

export default function Mascot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("happy");
  const [bounce, setBounce] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Don't show on Landing or Onboarding
  const hiddenPaths = ["/", "/Landing", "/Onboarding"];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.includes("Landing") || location.pathname.includes("Onboarding"))) {
    return null;
  }

  useEffect(() => {
    const messages = pageMessages[location.pathname] || pageMessages.default;
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMsg);
    setIsOpen(true);
    setIsMinimized(false);

    // Auto-minimize after 6 seconds
    const timer = setTimeout(() => setIsMinimized(true), 6000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Random bounce
  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const moodEmoji = "🐼";

  if (dismissed) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => { setDismissed(false); setIsMinimized(false); setIsOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl z-50 text-2xl hover:scale-110 transition-transform"
      >
        🐼
      </motion.button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="relative bg-white rounded-2xl shadow-2xl p-4 max-w-56 border-2 border-purple-200"
          >
            {/* Speech bubble tail */}
            <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-white" style={{ borderTopWidth: 12 }} />
            <div className="absolute -bottom-4 right-7 w-0 h-0 border-l-10 border-r-10 border-t-12 border-l-transparent border-r-transparent border-t-purple-200" style={{ borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 14 }} />

            <button
              onClick={() => setIsMinimized(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <ChevronDown className="w-4 h-4" />
            </button>

            <p className="text-sm text-gray-700 leading-relaxed pr-4">{message}</p>

            <button
              onClick={() => setDismissed(true)}
              className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Hide Mochi
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Avatar */}
      <motion.button
        animate={{
          y: bounce ? [-8, 0] : 0,
          rotate: bounce ? [-5, 5, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        onClick={() => {
          if (isMinimized) {
            setIsMinimized(false);
            setIsOpen(true);
          } else {
            setIsMinimized(true);
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl text-3xl border-4 border-white relative"
      >
        🐼
        {/* Wiggle ears */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="absolute -top-1 -left-1 text-xs"
        >
          🌸
        </motion.div>
      </motion.button>
    </div>
  );
}