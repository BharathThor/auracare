import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle2 } from "lucide-react";

export default function WorryTime({ onComplete }) {
  const [step, setStep] = useState(1);
  const [worries, setWorries] = useState("");
  const [actionable, setActionable] = useState([]);
  const [nonActionable, setNonActionable] = useState([]);

  const handleCategorize = () => {
    // This would typically use AI to categorize, but for now we'll ask the user
    setStep(2);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Worry Time Container</h2>
              <p className="text-gray-600">
                Write down all your worries. This designated "worry time" helps contain anxious thoughts.
              </p>
            </div>

            <Textarea
              value={worries}
              onChange={(e) => setWorries(e.target.value)}
              placeholder="List everything that's worrying you right now...&#10;&#10;• Work deadlines&#10;• Health concerns&#10;• Financial stress&#10;• Relationships&#10;&#10;Get it all out!"
              className="min-h-64 text-base border-orange-200 focus:border-orange-400 mb-6"
            />

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>How it works:</strong> By scheduling worry time, you train your brain to postpone 
                anxious thoughts to this specific time, reducing overall anxiety throughout the day.
              </p>
            </div>

            <Button
              onClick={handleCategorize}
              disabled={!worries.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Sort My Worries
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Worries Contained!</h2>
            
            <div className="text-left mb-8 space-y-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ✅ What You Can Control
                </h3>
                <p className="text-gray-600 text-sm">
                  For these worries, create an action plan. What's one small step you can take?
                </p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🌊 What You Can't Control
                </h3>
                <p className="text-gray-600 text-sm">
                  For these worries, practice acceptance. You've acknowledged them, now let them go.
                </p>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Your worries are documented. Come back tomorrow for another worry session if needed. 
              How do you feel after organizing your thoughts?
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
}