import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Clock, ExternalLink, Heart } from "lucide-react";
import { motion } from "framer-motion";

const indianHelplines = [
  {
    name: "Kiran Mental Health Helpline",
    number: "1800-599-0019",
    description: "24/7 toll-free mental health rehabilitation helpline by Ministry of Social Justice",
    availability: "24/7",
    languages: "Multiple Indian languages",
    category: "Government",
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Snehi",
    number: "91-22-2772 6771",
    alternateNumber: "91-22-2772 6773",
    description: "Crisis intervention center providing emotional support",
    availability: "10 AM - 10 PM (Mon-Sat)",
    location: "Mumbai",
    category: "Crisis Support",
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    alternateNumber: "1800-2333-330",
    description: "Mental health support and counseling services",
    availability: "24/7",
    languages: "English, Hindi",
    category: "Counseling",
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "iCall",
    number: "91-22-2556 3291",
    email: "icall@tiss.edu",
    description: "Psychosocial helpline by TISS for various mental health concerns",
    availability: "10 AM - 8 PM (Mon-Sat)",
    category: "Counseling",
    color: "from-orange-500 to-red-500"
  },
  {
    name: "Sumaitri",
    number: "011-23389090",
    description: "Delhi-based crisis intervention center",
    availability: "2 PM - 10 PM",
    location: "Delhi",
    category: "Crisis Support",
    color: "from-pink-500 to-rose-500"
  },
  {
    name: "Parivarthan",
    number: "080-65514444",
    description: "Counseling and mental health services",
    availability: "10 AM - 6 PM",
    location: "Bangalore",
    category: "Counseling",
    color: "from-indigo-500 to-purple-500"
  },
  {
    name: "The Live Love Laugh Foundation",
    number: "091-22-6464-3000",
    description: "Dedicated to mental health awareness and support",
    availability: "10 AM - 8 PM (Mon-Sat)",
    category: "Support",
    color: "from-teal-500 to-blue-500"
  },
  {
    name: "Connecting Trust",
    number: "91-40-2323-5350",
    description: "Emotional support helpline",
    availability: "12 PM - 8 PM",
    location: "Hyderabad",
    category: "Crisis Support",
    color: "from-violet-500 to-purple-500"
  }
];

const emergencyNumbers = [
  {
    name: "National Emergency Number",
    number: "112",
    description: "All-in-one emergency number for immediate assistance"
  },
  {
    name: "Police",
    number: "100",
    description: "For immediate police assistance"
  },
  {
    name: "Ambulance",
    number: "102",
    description: "Medical emergency services"
  }
];

export default function Helplines() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center gap-3">
            <Phone className="w-10 h-10 text-purple-500" />
            Emergency Support & Helplines
          </h1>
          <p className="text-lg text-gray-600">
            Immediate professional help is always available. You are not alone.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="border-none shadow-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Heart className="w-6 h-6" />
                In Crisis? Get Help Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-6 text-lg">
                If you're having thoughts of self-harm or suicide, please reach out immediately. These services are available 24/7.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {emergencyNumbers.map((service, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">{service.name}</h3>
                    <a href={`tel:${service.number}`} className="text-3xl font-bold text-white block mb-2">
                      {service.number}
                    </a>
                    <p className="text-white/80 text-sm">{service.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mental Health Helplines in India</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {indianHelplines.map((helpline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (index * 0.05) }}
              >
                <Card className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                  <div className={`h-2 bg-gradient-to-r ${helpline.color}`} />
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{helpline.name}</CardTitle>
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                        {helpline.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {helpline.description}
                    </p>

                    <div className="space-y-2">
                      <a 
                        href={`tel:${helpline.number}`}
                        className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-purple-900">{helpline.number}</span>
                      </a>
                      
                      {helpline.alternateNumber && (
                        <a 
                          href={`tel:${helpline.alternateNumber}`}
                          className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-purple-600" />
                          <span className="font-bold text-purple-900">{helpline.alternateNumber}</span>
                        </a>
                      )}
                    </div>

                    {helpline.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                        <a href={`mailto:${helpline.email}`} className="hover:text-purple-600">
                          {helpline.email}
                        </a>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        {helpline.availability}
                      </div>
                      {helpline.location && (
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {helpline.location}
                        </div>
                      )}
                    </div>

                    {helpline.languages && (
                      <p className="text-xs text-gray-500">
                        Languages: {helpline.languages}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="border-none shadow-lg bg-purple-50 border-purple-200">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Remember</h3>
              <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Reaching out for help is a sign of strength, not weakness. These helplines are staffed with trained professionals who understand what you're going through. Your call is confidential, and you deserve support.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}