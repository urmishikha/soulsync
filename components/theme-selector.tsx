"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Sparkles, Moon, Zap, Heart } from "lucide-react"

export interface AestheticTheme {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  stickers: string[]
  templates: string[]
  preview: string
}

export const themes: AestheticTheme[] = [
  {
    id: "dark-academia",
    name: "Dark Academia",
    description: "Scholarly, mysterious, and intellectually romantic",
    icon: <BookOpen className="w-5 h-5" />,
    colors: {
      primary: "from-amber-700 to-orange-800",
      secondary: "from-amber-100 to-orange-100",
      accent: "bg-amber-50",
      background: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50",
      text: "text-amber-900",
    },
    fonts: {
      heading: "font-serif",
      body: "font-serif",
    },
    stickers: ["📚", "🕯️", "🍂", "☕", "🖋️", "📜", "🏛️", "🌙", "⚡", "🔥"],
    templates: ["Library Study Session", "Autumn Contemplation", "Late Night Thoughts", "Coffee & Philosophy"],
    preview: "Candlelit libraries and handwritten letters...",
  },
  {
    id: "pastel-kpop",
    name: "Pastel K-Pop",
    description: "Dreamy, colorful, and effortlessly cute",
    icon: <Heart className="w-5 h-5" />,
    colors: {
      primary: "from-pink-400 via-purple-400 to-blue-400",
      secondary: "from-pink-100 via-purple-100 to-blue-100",
      accent: "bg-pink-50",
      background: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
      text: "text-purple-800",
    },
    fonts: {
      heading: "font-sans",
      body: "font-sans",
    },
    stickers: ["💖", "🌸", "✨", "🦋", "🌈", "💫", "🎀", "☁️", "🌙", "💝"],
    templates: ["Bias Appreciation", "Concert Memories", "Aesthetic Mood", "Friendship Goals"],
    preview: "Soft pastels and dreamy vibes...",
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    description: "Retro-futuristic with neon dreams and 80s nostalgia",
    icon: <Zap className="w-5 h-5" />,
    colors: {
      primary: "from-cyan-400 via-purple-500 to-pink-500",
      secondary: "from-cyan-100 via-purple-100 to-pink-100",
      accent: "bg-cyan-50",
      background: "bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50",
      text: "text-purple-900",
    },
    fonts: {
      heading: "font-mono",
      body: "font-sans",
    },
    stickers: ["🌴", "🌊", "🌅", "💎", "⚡", "🔮", "👾", "📼", "🎵", "🌙"],
    templates: ["Neon Dreams", "Retro Vibes", "Digital Sunset", "Synthwave Mood"],
    preview: "Neon grids and digital sunsets...",
  },
  {
    id: "cottagecore",
    name: "Cottagecore",
    description: "Cozy, natural, and romantically rustic",
    icon: <Sparkles className="w-5 h-5" />,
    colors: {
      primary: "from-green-500 to-yellow-600",
      secondary: "from-green-100 to-yellow-100",
      accent: "bg-green-50",
      background: "bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50",
      text: "text-green-800",
    },
    fonts: {
      heading: "font-serif",
      body: "font-serif",
    },
    stickers: ["🌻", "🍄", "🌿", "🐝", "🌾", "🥖", "🕯️", "🌸", "🦋", "☘️"],
    templates: ["Garden Journal", "Baking Adventures", "Nature Walk", "Cozy Evening"],
    preview: "Wildflowers and handmade crafts...",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, focused, and elegantly simple",
    icon: <Moon className="w-5 h-5" />,
    colors: {
      primary: "from-gray-600 to-slate-700",
      secondary: "from-gray-100 to-slate-100",
      accent: "bg-gray-50",
      background: "bg-gradient-to-br from-gray-50 to-slate-50",
      text: "text-gray-800",
    },
    fonts: {
      heading: "font-sans",
      body: "font-sans",
    },
    stickers: ["⚪", "⚫", "▫️", "▪️", "◽", "◾", "🔳", "🔲", "⭐", "💫"],
    templates: ["Daily Reflection", "Goal Setting", "Mindful Moments", "Clean Slate"],
    preview: "Less is more, focus on what matters...",
  },
  {
    id: "y2k-cyber",
    name: "Y2K Cyber",
    description: "Futuristic, metallic, and digitally bold",
    icon: <Zap className="w-5 h-5" />,
    colors: {
      primary: "from-blue-500 via-cyan-500 to-teal-500",
      secondary: "from-blue-100 via-cyan-100 to-teal-100",
      accent: "bg-blue-50",
      background: "bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50",
      text: "text-blue-900",
    },
    fonts: {
      heading: "font-mono",
      body: "font-mono",
    },
    stickers: ["💎", "⚡", "🔮", "👾", "🤖", "💫", "🌐", "📱", "💻", "🎮"],
    templates: ["Digital Dreams", "Cyber Thoughts", "Tech Mood", "Future Vibes"],
    preview: "Chrome and holograms...",
  },
]

interface ThemeSelectorProps {
  selectedTheme: AestheticTheme
  onThemeChange: (theme: AestheticTheme) => void
  isOpen: boolean
  onClose: () => void
}

export function ThemeSelector({ selectedTheme, onThemeChange, isOpen, onClose }: ThemeSelectorProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

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
        className="bg-white rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Aesthetic ✨</h2>
          <p className="text-gray-600">Pick a theme that matches your vibe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredTheme(theme.id)}
              onHoverEnd={() => setHoveredTheme(null)}
            >
              <Card
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  selectedTheme.id === theme.id ? "ring-2 ring-purple-400 bg-purple-50" : "hover:shadow-lg"
                }`}
                onClick={() => onThemeChange(theme)}
              >
                {/* Theme Preview */}
                <div
                  className={`h-20 rounded-lg mb-4 bg-gradient-to-r ${theme.colors.primary} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  <div className="absolute bottom-2 left-2 text-white text-xs font-medium">{theme.preview}</div>
                </div>

                <div className="text-center mb-3">
                  <h3
                    className={`font-semibold ${theme.colors.text} flex items-center justify-center gap-2 ${theme.fonts.heading}`}
                  >
                    {theme.icon}
                    {theme.name}
                  </h3>
                  {selectedTheme.id === theme.id && <Badge className="mt-1">Current</Badge>}
                </div>

                <p className={`text-sm text-gray-600 mb-3 text-center ${theme.fonts.body}`}>{theme.description}</p>

                {(hoveredTheme === theme.id || selectedTheme.id === theme.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    {/* Sticker Preview */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Stickers:</p>
                      <div className="flex flex-wrap gap-1">
                        {theme.stickers.slice(0, 8).map((sticker, idx) => (
                          <span key={idx} className="text-sm">
                            {sticker}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Template Preview */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Templates:</p>
                      <div className="flex flex-wrap gap-1">
                        {theme.templates.slice(0, 2).map((template, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {template}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose} className="px-8">
            Apply Theme ✨
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
