import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function MoodLifter({ onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [completedActivity, setCompletedActivity] = useState(null);

  const activityCategories = [
    {
      name: "Physical Movement",
      icon: "🏃",
      activities: [
        { id: "walk", name: "10-minute walk", impact: "high" },
        { id: "stretch", name: "5-minute stretch", impact: "medium" },
        { id: "dance", name: "Dance to one song", impact: "high" },
        { id: "yoga", name: "Simple yoga pose", impact: "medium" }
      ]
    },
    {
      name: "Social Connection",
      icon: "💬",
      activities: [
        { id: "text-friend", name: "Text a friend", impact: "high" },
        { id: "call-family", name: "Call family member", impact: "high" },
        { id: "smile-stranger", name: "Smile at someone", impact: "medium" },
        { id: "compliment", name: "Give a compliment", impact: "medium" }
      ]
    },
    {
      name: "Self-Care",
      icon: "🛁",
      activities: [
        { id: "shower", name: "Take a shower", impact: "high" },
        { id: "skincare", name: "Skincare routine", impact: "medium" },
        { id: "tidy", name: "Tidy one space", impact: "medium" },
        { id: "water", name: "Drink water", impact: "low" }
      ]
    },
    {
      name: "Creative Expression",
      icon: "🎨",
      activities: [
        { id: "draw", name: "Doodle for 5 min", impact: "high" },
        { id: "music", name: "Listen to favorite song", impact: "medium" },
        { id: "journal", name: "Write 3 sentences", impact: "medium" },
        { id: "photo", name: "Take a photo", impact: "low" }
      ]
    },
    {
      name: "Mindfulness",
      icon: "🧘",
      activities: [
        { id: "breathe", name: "3 deep breaths", impact: "medium" },
        { id: "gratitude", name: "Name 3 good things", impact: "high" },
        { id: "nature", name: "Look outside", impact: "low" },
        { id: "tea", name: "Mindful tea/coffee", impact: "medium" }
      ]
    }
  ];

  const handleSelectActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      if (selectedActivities.length < 3) {
        setSelectedActivities([...selectedActivities, activityId]);
      }
    }
  };

  const getAllActivities = () => {
    return activityCategories.flatMap(cat => 
      cat.activities.map(act => ({ ...act, category: cat.name, icon: cat.icon }))
    );
  };

  if (step === 1) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-4xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mood Lifter Activities</h2>
              <p className="text-gray-600 mb-2">
                Choose 3 small activities to do today. Starting small is the key!
              </p>
              <p className="text-sm text-purple-600 font-medium">
                Selected: {selectedActivities.length}/3
              </p>
            </div>

            <div className="space-y-6">
              {activityCategories.map((category) => (
                <div key={category.name}>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.name}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {category.activities.map((activity) => {
                      const isSelected = selectedActivities.includes(activity.id);
                      const impactColors = {
                        high: "border-green-300 bg-green-50",
                        medium: "border-blue-300 bg-blue-50",
                        low: "border-purple-300 bg-purple-50"
                      };
                      
                      return (
                        <motion.button
                          key={activity.id}
                          onClick={() => handleSelectActivity(activity.id)}
                          disabled={!isSelected && selectedActivities.length >= 3}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? "border-purple-500 bg-purple-100 shadow-lg"
                              : impactColors[activity.impact]
                          } ${!isSelected && selectedActivities.length >= 3 ? "opacity-50" : ""}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{activity.name}</span>
                            {isSelected && (
                              <Check className="w-5 h-5 text-purple-600" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{activity.impact} impact</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={selectedActivities.length !== 3}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-14 text-lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
    const selectedActivityObjects = getAllActivities().filter(act => 
      selectedActivities.includes(act.id)
    );

    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">🎯</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Action Plan</h2>
              <p className="text-gray-600">
                Complete at least one of these activities within the next hour
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {selectedActivityObjects.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{activity.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{activity.name}</h3>
                      <p className="text-sm text-gray-600">{activity.category}</p>
                    </div>
                    <Button
                      onClick={() => {
                        setCompletedActivity(activity);
                        setStep(3);
                      }}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Done
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Start with the easiest one. The goal is to take action, 
                no matter how small. Movement creates momentum!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10 text-center">
          <div className="text-7xl mb-6">🌟</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Awesome!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You completed an activity! Each small step helps build momentum against depression. 
            How do you feel after doing this?
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