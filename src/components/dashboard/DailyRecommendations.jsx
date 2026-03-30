import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const categoryColors = {
  mindfulness: "bg-purple-100 text-purple-800",
  physical: "bg-green-100 text-green-800",
  social: "bg-blue-100 text-blue-800",
  creative: "bg-pink-100 text-pink-800",
  rest: "bg-indigo-100 text-indigo-800"
};

export default function DailyRecommendations({ recommendation, onRefresh, refetchRecommendations }) {
  const handleToggleComplete = async (itemId) => {
    const updatedRecommendations = recommendation.recommendations.map(rec =>
      rec.id === itemId ? { ...rec, completed: !rec.completed } : rec
    );

    await base44.entities.DailyRecommendation.update(recommendation.id, {
      recommendations: updatedRecommendations
    });

    refetchRecommendations();
  };

  const completedCount = recommendation.recommendations.filter(r => r.completed).length;
  const totalCount = recommendation.recommendations.length;

  return (
    <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl mb-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Today's Wellness Practices
            </CardTitle>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="border-purple-300 hover:bg-purple-50"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border border-purple-100">
          <p className="text-gray-700 italic leading-relaxed">
            "{recommendation.motivational_message}"
          </p>
        </div>

        <div className="space-y-3">
          {recommendation.recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                rec.completed
                  ? 'bg-purple-50 border-purple-200'
                  : 'bg-white border-gray-200 hover:border-purple-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={rec.completed}
                  onCheckedChange={() => handleToggleComplete(rec.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${rec.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {rec.title}
                    </h3>
                    <Badge className={`${categoryColors[rec.category]} text-xs`}>
                      {rec.category}
                    </Badge>
                  </div>
                  <p className={`text-sm mb-2 ${rec.completed ? 'text-gray-500' : 'text-gray-600'}`}>
                    {rec.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {rec.duration}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}