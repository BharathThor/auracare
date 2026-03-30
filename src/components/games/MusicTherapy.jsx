import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

export default function MusicTherapy({ onComplete }) {
  const [playing, setPlaying] = useState(null);
  const [listenTime, setListenTime] = useState(0);

  const sounds = [
    { id: "rain", name: "Gentle Rain", emoji: "🌧️", description: "Soothing rainfall sounds" },
    { id: "ocean", name: "Ocean Waves", emoji: "🌊", description: "Calming sea sounds" },
    { id: "forest", name: "Forest Birds", emoji: "🌲", description: "Peaceful nature sounds" },
    { id: "white-noise", name: "White Noise", emoji: "🌫️", description: "Steady background sound" },
    { id: "meditation", name: "Meditation Bell", emoji: "🔔", description: "Mindful chimes" },
    { id: "piano", name: "Soft Piano", emoji: "🎹", description: "Gentle melodies" }
  ];

  React.useEffect(() => {
    if (playing) {
      const timer = setInterval(() => {
        setListenTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playing]);

  if (listenTime >= 120) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-2xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <div className="text-7xl mb-6">🎵</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Peaceful Moment</h2>
            <p className="text-gray-600 mb-8 text-lg">
              You've listened for 2 minutes. How do you feel now?
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
      <Card className="max-w-4xl w-full border-none shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🎵</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Calming Sounds</h2>
            <p className="text-gray-600 text-lg mb-4">
              Choose a soundscape and listen for at least 2 minutes
            </p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.floor(listenTime / 60)}:{(listenTime % 60).toString().padStart(2, '0')} / 2:00
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {sounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => setPlaying(playing === sound.id ? null : sound.id)}
                className={`p-6 rounded-2xl border-2 transition-all text-center ${
                  playing === sound.id
                    ? "border-purple-500 bg-purple-50 shadow-lg"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <div className="text-5xl mb-3">{sound.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{sound.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{sound.description}</p>
                <div className="flex items-center justify-center gap-2 text-purple-600">
                  {playing === sound.id ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span className="text-sm font-medium">Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">Play</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}