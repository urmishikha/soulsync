"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Skull, Leaf, Music, Bot } from "lucide-react"

export interface AIPersona {
  id: string
  name: string
  emoji: string
  icon: React.ReactNode
  description: string
  vibe: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  sampleResponse: string
  stickers: string[]
}

export const personas: AIPersona[] = [
  {
    id: "soft-girl",
    name: "Soft Girl Bestie",
    emoji: "💖",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Sweet, nurturing, and aesthetically dreamy",
    vibe: "Gentle encouragement with pink vibes and cozy energy",
    colors: {
      primary: "from-pink-400 to-rose-400",
      secondary: "from-pink-100 to-rose-100",
      accent: "bg-pink-50",
      background: "bg-gradient-to-br from-pink-50 to-rose-50",
    },
    sampleResponse:
      "Aww babe, you're glowing today! ✨ Maybe try some strawberry matcha and that cute floral dress? 🌸💕",
    stickers: ["🌸", "💖", "✨", "🦋", "🌺", "💝", "🎀", "☁️", "🌙", "💫"],
  },
  {
    id: "chaotic-neutral",
    name: "Chaotic Neutral",
    emoji: "💀",
    icon: <Skull className="w-5 h-5" />,
    description: "Unpredictable, witty, and delightfully unhinged",
    vibe: "Random wisdom with dark humor and unexpected insights",
    colors: {
      primary: "from-purple-600 to-indigo-600",
      secondary: "from-gray-700 to-slate-700",
      accent: "bg-slate-100",
      background: "bg-gradient-to-br from-slate-100 to-gray-100",
    },
    sampleResponse:
      "Mood: cryptid energy 💀 Today's vibe is 'feral but make it fashion.' Try that weird recipe you bookmarked at 3am.",
    stickers: ["💀", "🔮", "⚡", "🌙", "🖤", "👁️", "🕷️", "⭐", "🌪️", "🔥"],
  },
  {
    id: "wellness-bestie",
    name: "Chill Wellness Bestie",
    emoji: "🧘",
    icon: <Leaf className="w-5 h-5" />,
    description: "Mindful, grounding, and holistically supportive",
    vibe: "Gentle guidance focused on balance and self-care",
    colors: {
      primary: "from-green-400 to-emerald-400",
      secondary: "from-green-100 to-emerald-100",
      accent: "bg-green-50",
      background: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
    sampleResponse:
      "Take a deep breath, love 🌿 Your energy feels scattered today. How about some herbal tea and gentle stretching?",
    stickers: ["🌿", "🧘", "☘️", "🌱", "🍃", "🌾", "🕯️", "💚", "🌸", "✨"],
  },
  {
    id: "indie-overthinker",
    name: "Indie Overthinker",
    emoji: "🎸",
    icon: <Music className="w-5 h-5" />,
    description: "Introspective, artistic, and beautifully melancholic",
    vibe: "Deep thoughts with indie music recs and artistic inspiration",
    colors: {
      primary: "from-amber-500 to-orange-500",
      secondary: "from-amber-100 to-orange-100",
      accent: "bg-amber-50",
      background: "bg-gradient-to-br from-amber-50 to-orange-50",
    },
    sampleResponse:
      "That Phoebe Bridgers song hits different today, doesn't it? 🎵 Maybe journal about that feeling while it's still raw.",
    stickers: ["🎵", "📚", "🍂", "☕", "🎸", "📝", "🌙", "💭", "🕯️", "🎨"],
  },
  {
    id: "minimalist-ai",
    name: "Minimalist AI",
    emoji: "🤖",
    icon: <Bot className="w-5 h-5" />,
    description: "Clean, efficient, and elegantly simple",
    vibe: "Precise insights with clean aesthetics and focused clarity",
    colors: {
      primary: "from-gray-600 to-slate-600",
      secondary: "from-gray-100 to-slate-100",
      accent: "bg-gray-50",
      background: "bg-gradient-to-br from-gray-50 to-slate-50",
    },
    sampleResponse: "Status: Optimal. Suggestion: Green tea + focused work session. Efficiency: 87% today.",
    stickers: ["⚪", "⚫", "▫️", "▪️", "◽", "◾", "🔳", "🔲", "⭐", "💫"],
  },
]

interface PersonaSelectorProps {
  selectedPersona: AIPersona
  onPersonaChange: (persona: AIPersona) => void
  isOpen: boolean
  onClose: () => void
}

export function PersonaSelector({ selectedPersona, onPersonaChange, isOpen, onClose }: PersonaSelectorProps) {
  const [hoveredPersona, setHoveredPersona] = useState<string | null>(null)

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your AI Bestie ✨</h2>
          <p className="text-gray-600">Pick the vibe that matches your energy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {personas.map((persona) => (
            <motion.div
              key={persona.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredPersona(persona.id)}
              onHoverEnd={() => setHoveredPersona(null)}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selectedPersona.id === persona.id ? "ring-2 ring-purple-400 bg-purple-50" : "hover:shadow-lg"
                }`}
                onClick={() => onPersonaChange(persona)}
              >
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{persona.emoji}</div>
                  <h3 className="font-semibold text-gray-800 flex items-center justify-center gap-2">
                    {persona.icon}
                    {persona.name}
                  </h3>
                  {selectedPersona.id === persona.id && <Badge className="mt-1">Current</Badge>}
                </div>

                <p className="text-sm text-gray-600 mb-3 text-center">{persona.description}</p>

                <div className="space-y-2">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${persona.colors.primary}`} />

                  {(hoveredPersona === persona.id || selectedPersona.id === persona.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <p className="text-xs text-gray-500 italic">"{persona.sampleResponse}"</p>
                      <div className="flex flex-wrap gap-1">
                        {persona.stickers.slice(0, 5).map((sticker, idx) => (
                          <span key={idx} className="text-sm">
                            {sticker}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={onClose} className="px-8">
            Perfect! Let's go ✨
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
