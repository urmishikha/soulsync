"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Heart, Moon, Sun, Star, Coffee, Music } from "lucide-react"
import type { AIPersona } from "./persona-selector"

interface VibeCard {
  id: string
  name: string
  emoji: string
  icon: React.ReactNode
  energy: string
  message: string
  color: string
  actionPrompt: string
}

interface DailyVibe {
  overall: string
  energy: "high" | "medium" | "low" | "chaotic"
  aesthetic: string
  mainCharacterEnergy: string
  zodiacVibe: string
  tarotCard: VibeCard
  memeEnergy: string
  selfCarePrompt: string
  creativePrompt: string
  socialMedia: string
  outfit: string
  food: string
  music: string
}

const vibeCards: VibeCard[] = [
  {
    id: "main-character",
    name: "Main Character Energy",
    emoji: "✨",
    icon: <Sparkles className="w-5 h-5" />,
    energy: "confident",
    message: "You're the protagonist of your own story today bestie",
    color: "from-yellow-400 to-pink-400",
    actionPrompt: "Take that selfie, make that bold choice, you're GLOWING ✨"
  },
  {
    id: "soft-launch",
    name: "Soft Launch Vibes",
    emoji: "🌸",
    icon: <Heart className="w-5 h-5" />,
    energy: "gentle",
    message: "Today's energy is subtle but powerful",
    color: "from-pink-300 to-rose-300",
    actionPrompt: "Share the little moments, enjoy the quiet magic 🌸"
  },
  {
    id: "chaotic-good",
    name: "Chaotic Good",
    emoji: "⚡",
    icon: <Zap className="w-5 h-5" />,
    energy: "electric",
    message: "Your energy is unhinged but in the best way",
    color: "from-purple-400 to-blue-400",
    actionPrompt: "Embrace the chaos, make impulsive good decisions ⚡"
  },
  {
    id: "dark-academia",
    name: "Dark Academia Feels",
    emoji: "📚",
    icon: <Moon className="w-5 h-5" />,
    energy: "contemplative",
    message: "You're giving mysterious intellectual energy",
    color: "from-amber-600 to-orange-700",
    actionPrompt: "Light a candle, read poetry, be mysterious 🕯️"
  },
  {
    id: "golden-hour",
    name: "Golden Hour Soul",
    emoji: "🌅",
    icon: <Sun className="w-5 h-5" />,
    energy: "radiant",
    message: "Your aura is literally glowing right now",
    color: "from-orange-300 to-yellow-400",
    actionPrompt: "Chase sunsets, take golden hour photos 🌅"
  },
  {
    id: "indie-sleaze",
    name: "Indie Sleaze Revival",
    emoji: "🎵",
    icon: <Music className="w-5 h-5" />,
    energy: "nostalgic",
    message: "2014 Tumblr energy but make it current",
    color: "from-indigo-400 to-purple-500",
    actionPrompt: "Curate that playlist, wear something vintage 🎵"
  }
]

const generateDailyVibe = (persona: AIPersona): DailyVibe => {
  const randomCard = vibeCards[Math.floor(Math.random() * vibeCards.length)]
  const energyLevels = ["high", "medium", "low", "chaotic"] as const
  const randomEnergy = energyLevels[Math.floor(Math.random() * energyLevels.length)]
  
  const aesthetics = [
    "sunburnt main character at a cottagecore brunch",
    "tired but trendy indie girl winter",
    "chaotic neutral energy with soft girl undertones", 
    "dark academia student who discovered self-care",
    "Y2K cyber princess in her healing era",
    "coquette girl who reads philosophy"
  ]
  
  const zodiacVibes = [
    "Mercury is in microwave, but your intuition is serving",
    "The stars said 'slay' and they meant it literally",
    "Venus is having a moment and so are you",
    "Your birth chart is giving main character energy",
    "The universe is conspiring for your glow up",
    "Cosmic energy says: you're THAT girl today"
  ]
  
  const memeEnergies = [
    "That girl who has her life together (at least on social media)",
    "Chronically online but make it aesthetic",
    "Unhinged but in a cute way",
    "Sad girl hours turned into boss babe era",
    "Delulu is the solulu and you're living proof",
    "Academic weapon with emotional intelligence"
  ]

  const getPersonaSpecificPrompt = () => {
    switch (persona.id) {
      case "soft-girl":
        return {
          selfCare: "Strawberry matcha latte and that skincare routine you've been wanting to try 🌸",
          creative: "Start that pink aesthetic Pinterest board you've been thinking about ✨",
          social: "Post that soft launch photo with flower captions 🌺",
          outfit: "Flowy dress with delicate jewelry, give cottagecore princess 👗",
          food: "Acai bowl with edible flowers and heart-shaped fruit 💖",
          music: "Lo-fi study beats mixed with Lana Del Rey energy 🎵"
        }
      case "chaotic-neutral":
        return {
          selfCare: "Rage room session or that weird face mask from TikTok 💀",
          creative: "Start 3 new projects and abandon 2 of them (this is the way) ⚡",
          social: "Post that cryptic story that makes people wonder 🔮",
          outfit: "Something that shouldn't work but absolutely does 🖤",
          food: "That weird recipe you bookmarked at 3am - today's the day 🌙",
          music: "Playlist that goes from Taylor Swift to death metal 🎭"
        }
      case "wellness-bestie":
        return {
          selfCare: "Morning meditation and that herbal tea blend 🌿",
          creative: "Journal about your growth journey with pressed flowers 🌱",
          social: "Share your mindful moment - inspire the timeline ☘️",
          outfit: "Earth tones that make you feel grounded and centered 🍃",
          food: "Nourishing bowl with intention and gratitude 🥗",
          music: "Nature sounds mixed with healing frequencies 🧘"
        }
      case "indie-overthinker":
        return {
          selfCare: "Revisit that poem that made you cry (in a good way) 📚",
          creative: "Write in that journal while listening to Phoebe Bridgers 🎸",
          social: "Quote that book everyone's been sleeping on 📖",
          outfit: "Vintage cardigan and docs - give intellectual mystery ☕",
          food: "Coffee shop pastry that tastes like nostalgia 🥐",
          music: "Indie folk that hits different at 2am 🌙"
        }
      case "minimalist-ai":
        return {
          selfCare: "Declutter one space, feel the calm 🤍",
          creative: "Design something with clean lines and intention ⚪",
          social: "That aesthetic grid post with perfect spacing 📱",
          outfit: "Capsule wardrobe piece that does everything ⚫",
          food: "Simple ingredients, complex flavors ⚪",
          music: "Ambient sounds for focused productivity 🎯"
        }
      default:
        return {
          selfCare: "Do something that fills your cup ✨",
          creative: "Make something beautiful today 🎨",
          social: "Share your energy with the world 📱",
          outfit: "Whatever makes you feel most like yourself 👗",
          food: "Something that nourishes your soul 🍃",
          music: "Soundtrack for your main character moment 🎵"
        }
    }
  }

  const prompts = getPersonaSpecificPrompt()
  
  return {
    overall: aesthetics[Math.floor(Math.random() * aesthetics.length)],
    energy: randomEnergy,
    aesthetic: aesthetics[Math.floor(Math.random() * aesthetics.length)],
    mainCharacterEnergy: randomCard.message,
    zodiacVibe: zodiacVibes[Math.floor(Math.random() * zodiacVibes.length)],
    tarotCard: randomCard,
    memeEnergy: memeEnergies[Math.floor(Math.random() * memeEnergies.length)],
    selfCarePrompt: prompts.selfCare,
    creativePrompt: prompts.creative,
    socialMedia: prompts.social,
    outfit: prompts.outfit,
    food: prompts.food,
    music: prompts.music
  }
}

interface VibeReadingProps {
  persona: AIPersona
  isExpanded?: boolean
}

export function VibeReading({ persona, isExpanded = false }: VibeReadingProps) {
  const [dailyVibe, setDailyVibe] = useState<DailyVibe | null>(null)
  const [isFullReading, setIsFullReading] = useState(isExpanded)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    // Generate vibe reading when component mounts or persona changes
    setDailyVibe(generateDailyVibe(persona))
  }, [persona])

  const refreshVibe = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setDailyVibe(generateDailyVibe(persona))
      setIsGenerating(false)
    }, 1000)
  }

  if (!dailyVibe) return null

  return (
    <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-xl">
      <div className="text-center mb-6">
        <motion.div
          className="text-4xl mb-2"
          animate={{ 
            rotate: isGenerating ? [0, 360] : [0, 5, -5, 0],
            scale: isGenerating ? [1, 1.1, 1] : [1, 1.05, 1]
          }}
          transition={{ 
            duration: isGenerating ? 1 : 3, 
            repeat: isGenerating ? Number.POSITIVE_INFINITY : Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
        >
          {dailyVibe.tarotCard.emoji}
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Today's Vibe Check ✨</h2>
        <p className="text-gray-600 text-lg italic">
          You're giving <span className="font-semibold text-purple-700">{dailyVibe.overall}</span>
        </p>
      </div>

      {/* Main Vibe Card */}
      <motion.div
        className={`rounded-xl p-6 mb-6 bg-gradient-to-r ${dailyVibe.tarotCard.color} text-white relative overflow-hidden`}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {dailyVibe.tarotCard.icon}
            <h3 className="text-xl font-bold">{dailyVibe.tarotCard.name}</h3>
            <Badge className="bg-white/20 text-white border-white/30">
              {dailyVibe.energy} energy
            </Badge>
          </div>
          <p className="text-lg mb-3">{dailyVibe.tarotCard.message}</p>
          <p className="text-sm opacity-90">{dailyVibe.tarotCard.actionPrompt}</p>
        </div>
      </motion.div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          className="bg-white/50 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-gray-700">Cosmic Check</span>
          </div>
          <p className="text-sm text-gray-600">{dailyVibe.zodiacVibe}</p>
        </motion.div>

        <motion.div
          className="bg-white/50 rounded-xl p-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-700">Meme Status</span>
          </div>
          <p className="text-sm text-gray-600">{dailyVibe.memeEnergy}</p>
        </motion.div>
      </div>

      {isFullReading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="font-medium text-gray-700 text-sm">Self-Care</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.selfCarePrompt}</p>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="font-medium text-gray-700 text-sm">Create</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.creativePrompt}</p>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coffee className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-700 text-sm">Nourish</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.food}</p>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">👗</span>
                <span className="font-medium text-gray-700 text-sm">Fit Check</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.outfit}</p>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Music className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-700 text-sm">Soundtrack</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.music}</p>
            </motion.div>

            <motion.div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">📱</span>
                <span className="font-medium text-gray-700 text-sm">Post Energy</span>
              </div>
              <p className="text-xs text-gray-600">{dailyVibe.socialMedia}</p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => setIsFullReading(!isFullReading)}
          className="bg-white/70 backdrop-blur-sm border-0"
        >
          {isFullReading ? "Show Less" : "Full Reading"} 🔮
        </Button>
        <Button
          onClick={refreshVibe}
          disabled={isGenerating}
          className="bg-white/70 backdrop-blur-sm border-0 text-gray-700 hover:bg-white/80"
        >
          {isGenerating ? "Channeling..." : "New Vibe"} ✨
        </Button>
      </div>
    </Card>
  )
}