import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Heart, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferred_name: "",
    age: "",
    gender: "",
    profession: "",
    additional_info: ""
  });

  const genderOptions = [
    "Male",
    "Female",
    "Non-binary",
    "Transgender",
    "Genderqueer",
    "Genderfluid",
    "Agender",
    "Two-Spirit",
    "Prefer not to say",
    "Prefer to self-describe"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await base44.auth.updateMe({
        ...formData,
        age: parseInt(formData.age),
        onboarding_completed: true
      });
      
      navigate(createPageUrl("Assessment"));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Welcome to AuraCare
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Let's get to know you better so we can provide personalized support
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="preferred_name" className="text-base font-medium text-gray-700">
                  What would you like us to call you? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preferred_name"
                  required
                  value={formData.preferred_name}
                  onChange={(e) => setFormData({...formData, preferred_name: e.target.value})}
                  placeholder="Your preferred name"
                  className="h-12 text-base border-purple-200 focus:border-purple-400"
                />
                <p className="text-sm text-gray-500">This helps us personalize your experience</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-base font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    required
                    min="13"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    placeholder="Your age"
                    className="h-12 text-base border-purple-200 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base font-medium text-gray-700">
                    Gender Identity <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    required
                    value={formData.gender}
                    onValueChange={(value) => setFormData({...formData, gender: value})}
                  >
                    <SelectTrigger className="h-12 text-base border-purple-200 focus:border-purple-400">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession" className="text-base font-medium text-gray-700">
                  Profession/Occupation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="profession"
                  required
                  value={formData.profession}
                  onChange={(e) => setFormData({...formData, profession: e.target.value})}
                  placeholder="e.g., Student, Software Engineer, Teacher"
                  className="h-12 text-base border-purple-200 focus:border-purple-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info" className="text-base font-medium text-gray-700">
                  Anything else you'd like to share? (Optional)
                </Label>
                <Textarea
                  id="additional_info"
                  value={formData.additional_info}
                  onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                  placeholder="Sleep habits, location, interests, or anything that might help us support you better..."
                  className="min-h-24 text-base border-purple-200 focus:border-purple-400 resize-none"
                />
                <p className="text-sm text-gray-500">This information helps us tailor recommendations to you</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">Privacy Promise</p>
                  <p className="text-sm text-gray-600">
                    Your information is private and secure. We use it only to personalize your wellness journey.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                {loading ? "Saving..." : (
                  <>
                    Continue to Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}