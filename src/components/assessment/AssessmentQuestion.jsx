import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function AssessmentQuestion({ question, answer, onAnswer }) {
  if (question.type === "scale") {
    return (
      <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 leading-relaxed">
            {question.question}
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{question.scale_low_label}</span>
              <span>{question.scale_high_label}</span>
            </div>
            
            <div className="flex gap-3 justify-between">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAnswer(value)}
                  className={`flex-1 h-16 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    answer === value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  {value}
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
      <CardContent className="p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 leading-relaxed">
          {question.question}
        </h2>
        
        <Textarea
          value={answer || ""}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Take your time to share your thoughts..."
          className="min-h-40 text-base border-purple-200 focus:border-purple-400 resize-none"
        />
        
        <p className="text-sm text-gray-500 mt-3">
          There are no wrong answers. This is a safe space for your honest thoughts.
        </p>
      </CardContent>
    </Card>
  );
}