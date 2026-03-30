import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart } from "lucide-react";

const stateColors = {
  anxiety: "bg-yellow-100 text-yellow-800 border-yellow-300",
  depression: "bg-blue-100 text-blue-800 border-blue-300",
  stress: "bg-red-100 text-red-800 border-red-300",
  burnout: "bg-orange-100 text-orange-800 border-orange-300",
  general_wellness: "bg-green-100 text-green-800 border-green-300"
};

const severityColors = {
  mild: "bg-green-100 text-green-800",
  moderate: "bg-yellow-100 text-yellow-800",
  significant: "bg-red-100 text-red-800"
};

export default function MentalHealthInsight({ assessment, user }) {
  const { mental_health_state, empathetic_feedback } = assessment;

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Brain className="w-6 h-6 text-purple-500" />
          Your Mental Wellness Insight
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Badge className={`${stateColors[mental_health_state.primary_state]} border text-base px-4 py-2`}>
            Primary: {mental_health_state.primary_state.replace('_', ' ')}
          </Badge>
          <Badge className={`${severityColors[mental_health_state.severity]} text-base px-4 py-2`}>
            Severity: {mental_health_state.severity}
          </Badge>
        </div>

        {mental_health_state.secondary_states?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Also experiencing:</p>
            <div className="flex flex-wrap gap-2">
              {mental_health_state.secondary_states.map((state, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {state}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-start gap-3 mb-4">
            <Heart className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">A message for you</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {empathetic_feedback}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}