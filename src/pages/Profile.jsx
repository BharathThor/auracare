import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, LogOut, TrendingUp, Calendar, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const { data: assessments = [] } = useQuery({
    queryKey: ['userAssessments', user?.email],
    queryFn: () => user ? base44.entities.Assessment.filter({ user_email: user.email }) : [],
    enabled: !!user
  });

  const { data: gameProgress = [] } = useQuery({
    queryKey: ['gameProgress', user?.email],
    queryFn: () => user ? base44.entities.GameProgress.filter({ user_email: user.email }) : [],
    enabled: !!user
  });

  useEffect(() => {
    if (user) {
      setFormData({
        preferred_name: user.preferred_name || "",
        age: user.age || "",
        gender: user.gender || "",
        profession: user.profession || "",
        additional_info: user.additional_info || ""
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        ...formData,
        age: parseInt(formData.age)
      });
      refetchUser();
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    base44.auth.logout(window.location.origin);
  };

  const genderOptions = [
    "Male", "Female", "Non-binary", "Transgender", "Genderqueer", 
    "Genderfluid", "Agender", "Two-Spirit", "Prefer not to say", "Prefer to self-describe"
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <User className="w-10 h-10 text-purple-500" />
            Your Profile
          </h1>
          <p className="text-lg text-gray-600">Manage your information and track your progress</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  {!editing ? (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      className="border-purple-300 hover:bg-purple-50"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditing(false)}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user.email} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_name">Preferred Name</Label>
                  <Input
                    id="preferred_name"
                    value={formData.preferred_name}
                    onChange={(e) => setFormData({...formData, preferred_name: e.target.value})}
                    disabled={!editing}
                    className={!editing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      disabled={!editing}
                      className={!editing ? "bg-gray-50" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender Identity</Label>
                    {editing ? (
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({...formData, gender: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {genderOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={formData.gender} disabled className="bg-gray-50" />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({...formData, profession: e.target.value})}
                    disabled={!editing}
                    className={!editing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_info">Additional Information</Label>
                  <Textarea
                    id="additional_info"
                    value={formData.additional_info}
                    onChange={(e) => setFormData({...formData, additional_info: e.target.value})}
                    disabled={!editing}
                    className={!editing ? "bg-gray-50 min-h-24" : "min-h-24"}
                  />
                </div>

                <div className="pt-6 border-t">
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  Progress Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Assessments Taken</span>
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{assessments.length}</p>
                </div>

                <div className="p-4 bg-pink-50 rounded-xl border border-pink-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Games Completed</span>
                    <Gamepad2 className="w-4 h-4 text-pink-500" />
                  </div>
                  <p className="text-3xl font-bold text-pink-600">{gameProgress.length}</p>
                </div>

                {user.last_assessment_date && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Last Assessment</span>
                      <Calendar className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-lg font-bold text-blue-600">
                      {format(new Date(user.last_assessment_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {gameProgress.length > 0 && (
              <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameProgress.slice(0, 5).map((progress, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{progress.game_name}</span>
                        <span className="text-gray-500 text-xs">
                          {format(new Date(progress.completed_date), 'MMM d')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}