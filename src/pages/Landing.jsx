import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Brain, Gamepad2, Phone, Sparkles, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Dynamic mental health evaluation that adapts to your unique profile and needs",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Gamepad2,
      title: "Therapeutic Games",
      description: "Science-backed activities with voice guidance designed to support your wellness journey",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Sparkles,
      title: "Daily Wellness",
      description: "Personalized recommendations and practices tailored to your mental health state",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Emergency Support",
      description: "Instant access to professional Indian mental health helplines when you need them most",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Inclusive & Safe",
      description: "LGBTQ+ friendly space that celebrates all identities with complete privacy",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Your Privacy Matters",
      description: "Your data is protected and never shared. Your journey is yours alone",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-purple-200/50 mb-8 shadow-lg">
              <Heart className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Your Mental Wellness Companion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
              AuraCare
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light italic">
              A friend for your thoughts
            </p>
            
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              An AI-powered companion that understands your mental wellness journey through personalized assessments, therapeutic activities, and compassionate support—always here when you need it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Onboarding")}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-6 text-lg rounded-xl">
                  <Heart className="w-5 h-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              
              <Link to={createPageUrl("Helplines")}>
                <Button size="lg" variant="outline" className="border-2 border-purple-300 hover:bg-purple-50 text-purple-700 px-8 py-6 text-lg rounded-xl transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Everything you need for mental wellness
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Evidence-based tools and compassionate support, designed with inclusivity at heart
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100/50 shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to prioritize your mental wellness?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join AuraCare today and take the first step towards a healthier, happier you
            </p>
            <Link to={createPageUrl("Onboarding")}>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg rounded-xl font-semibold">
                Get Started Free
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-purple-100/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-purple-500" />
            <span className="text-2xl font-bold text-gray-900">AuraCare</span>
          </div>
          <p className="text-gray-600 mb-2">Your mental wellness matters. You are not alone.</p>
          <p className="text-sm text-gray-500">
            AuraCare is a supportive companion, not a replacement for professional mental health care.
          </p>
        </div>
      </div>
    </div>
  );
}