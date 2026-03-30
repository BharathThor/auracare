import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function GratitudeJournal({ onComplete }) {
  const [entries, setEntries] = useState(["", "", ""]);
  const [step, setStep] = useState(0);

  const questions = [
    "What are you grateful for today?",
    "Why does this matter to you?",
    "How did it make you feel?"
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeJournal();
    }
  };

  const completeJournal = () => {
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">✨</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beautiful Reflections</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for taking time to appreciate the good in your life. How do you feel?
            </p>
            <div className="grid grid-cols-5 gap-3">
              {[
                { value: "very_low", emoji: "😢" },
                { value: "low", emoji: "😟" },
                { value: "neutral", emoji: "😐" },
                { value: "good", emoji: "🙂" },
                { value: "very_good", emoji: "😊" }
              ].map((mood) => (
                <Button
                  key={mood.value}
                  variant="outline"
                  className="h-20 text-4xl border-2 hover:border-purple-400 hover:bg-purple-50"
                  onClick={() => onComplete(mood.value)}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">📝</div>
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i <= step ? "bg-purple-500" : "bg-gray-300"}`}
                />
              ))}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{questions[step]}</h2>
          </div>

          <Textarea
            value={entries[step]}
            onChange={(e) => {
              const newEntries = [...entries];
              newEntries[step] = e.target.value;
              setEntries(newEntries);
            }}
            placeholder="Take your time to reflect..."
            className="min-h-48 text-base border-purple-200 focus:border-purple-400 mb-6"
          />

          <Button
            onClick={handleNext}
            disabled={!entries[step].trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
          >
            {step === 2 ? "Complete" : "Next"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}