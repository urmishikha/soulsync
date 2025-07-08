"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Palette, BookOpen, TrendingUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { PersonaSelector, personas, type AIPersona } from "@/components/persona-selector"
import { ThemeSelector, themes, type AestheticTheme } from "@/components/theme-selector"
import { VibeReading } from "@/components/vibe-reading"



export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(personas[0])
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>(themes[0])
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className={`min-h-screen transition-all duration-1000 ${selectedTheme.colors.background}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-15 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            SoulSync
          </h1>
          <p className="text-gray-600 text-lg">{getGreeting()}, beautiful soul ✨</p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowPersonaSelector(true)}
              className="bg-white/70 backdrop-blur-sm border-0"
            >
              {selectedPersona.emoji} {selectedPersona.name}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowThemeSelector(true)}
              className="bg-white/70 backdrop-blur-sm border-0"
            >
              <Palette className="w-4 h-4 mr-2" />
              {selectedTheme.name}
            </Button>
          </div>
        </motion.div>

        {/* Today's Vibe Reading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <VibeReading persona={selectedPersona} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Link href="/journal">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border-0 cursor-pointer"
            >
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold text-gray-800 mb-1">Journal</h3>
              <p className="text-xs text-gray-600">Write & decorate</p>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border-0 cursor-pointer"
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold text-gray-800 mb-1">Insights</h3>
            <p className="text-xs text-gray-600">Mood patterns</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border-0 cursor-pointer"
          >
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <h3 className="font-semibold text-gray-800 mb-1">Wellness</h3>
            <p className="text-xs text-gray-600">Track & nourish</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border-0 cursor-pointer"
          >
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="font-semibold text-gray-800 mb-1">Style</h3>
            <p className="text-xs text-gray-600">AI stylist</p>
          </motion.div>
        </motion.div>

        {/* Recent Entries Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Moments ✨</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { date: "Yesterday", mood: "🌸", preview: "Had the most peaceful morning walk..." },
                { date: "2 days ago", mood: "☀️", preview: "Tried that new recipe and it was amazing!" },
                { date: "3 days ago", mood: "✨", preview: "Finished my watercolor painting today..." },
              ].map((entry, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/50 rounded-lg p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{entry.mood}</span>
                    <span className="text-sm text-gray-600">{entry.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{entry.preview}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <PersonaSelector
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
        isOpen={showPersonaSelector}
        onClose={() => setShowPersonaSelector(false)}
      />

      <ThemeSelector
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />
    </div>
  )
}
