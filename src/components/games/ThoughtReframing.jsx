import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Lightbulb, X, Check } from "lucide-react";

export default function ThoughtReframing({ onComplete }) {
  const [step, setStep] = useState(1);
  const [thought, setThought] = useState("");
  const [distortions, setDistortions] = useState([]);
  const [evidence, setEvidence] = useState({ for: "", against: "" });
  const [reframe, setReframe] = useState("");

  const cognitiveDistortions = [
    { id: "all-or-nothing", name: "All-or-Nothing", desc: "Seeing things in black and white" },
    { id: "overgeneralization", name: "Overgeneralization", desc: "One event means everything" },
    { id: "mental-filter", name: "Mental Filter", desc: "Focusing only on negatives" },
    { id: "catastrophizing", name: "Catastrophizing", desc: "Expecting the worst" },
    { id: "emotional-reasoning", name: "Emotional Reasoning", desc: "Feelings = facts" },
    { id: "should-statements", name: "Should Statements", desc: "Rigid rules for self" },
    { id: "labeling", name: "Labeling", desc: "Defining self negatively" },
    { id: "personalization", name: "Personalization", desc: "Blaming yourself" }
  ];

  const toggleDistortion = (id) => {
    if (distortions.includes(id)) {
      setDistortions(distortions.filter(d => d !== id));
    } else {
      setDistortions([...distortions, id]);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Catch the Thought</h2>
              <p className="text-gray-600">
                What negative or unhelpful thought has been bothering you?
              </p>
            </div>

            <Textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Example: 'I'm terrible at everything I do' or 'Everyone thinks I'm stupid'"
              className="min-h-32 text-base border-purple-200 focus:border-purple-400 mb-6"
            />

            <Button
              onClick={() => setStep(2)}
              disabled={!thought.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Investigate This Thought
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-4xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Identify Thinking Traps</h2>
              <p className="text-gray-600">
                Which cognitive distortions might be at play? (Select all that apply)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {cognitiveDistortions.map((distortion) => (
                <motion.button
                  key={distortion.id}
                  onClick={() => toggleDistortion(distortion.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    distortions.includes(distortion.id)
                      ? "border-purple-500 bg-purple-50 shadow-lg"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{distortion.name}</h3>
                    {distortions.includes(distortion.id) && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{distortion.desc}</p>
                </motion.button>
              ))}
            </div>

            <Button
              onClick={() => setStep(3)}
              disabled={distortions.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">⚖️</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Examine the Evidence</h2>
              <p className="text-gray-600">Let's look at this thought objectively</p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
              <p className="text-gray-700 italic">"{thought}"</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Evidence FOR this thought:
                </label>
                <Textarea
                  value={evidence.for}
                  onChange={(e) => setEvidence({ ...evidence, for: e.target.value })}
                  placeholder="What facts support this thought?"
                  className="min-h-24 border-red-200 focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Evidence AGAINST this thought:
                </label>
                <Textarea
                  value={evidence.against}
                  onChange={(e) => setEvidence({ ...evidence, against: e.target.value })}
                  placeholder="What facts challenge this thought?"
                  className="min-h-24 border-green-200 focus:border-green-400"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep(4)}
              disabled={!evidence.for.trim() || !evidence.against.trim()}
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <Lightbulb className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a Balanced Thought</h2>
              <p className="text-gray-600">
                Based on the evidence, write a more balanced, realistic thought
              </p>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-2">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700"><span className="font-semibold">Old thought:</span> {thought}</p>
              </div>
            </div>

            <Textarea
              value={reframe}
              onChange={(e) => setReframe(e.target.value)}
              placeholder="Example: 'While I struggle with some things, I'm also good at many things. I'm learning and growing.'"
              className="min-h-32 text-base border-green-200 focus:border-green-400 mb-6"
            />

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tips for balanced thinking:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use words like "sometimes" instead of "always"</li>
                <li>• Acknowledge both strengths and weaknesses</li>
                <li>• Focus on what you can control</li>
                <li>• Be kind to yourself</li>
              </ul>
            </div>

            <Button
              onClick={() => setStep(5)}
              disabled={!reframe.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Complete
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Great Detective Work!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You've challenged a negative thought and created a more balanced perspective. 
            Practice this technique whenever negative thoughts arise.
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