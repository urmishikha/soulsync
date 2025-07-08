"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Cloud, Flame, Sparkles, Coffee, Music } from "lucide-react"

export interface JournalTemplate {
  id: string
  name: string
  mood: string
  emoji: string
  icon: React.ReactNode
  description: string
  colors: string
  elements: Array<{
    type: "text" | "sticker" | "mood" | "image"
    content: string
    position: { x: number; y: number }
  }>
  tags: string[]
}

export const templates: JournalTemplate[] = [
  {
    id: "falling-in-love",
    name: "Falling in Love",
    mood: "Romantic",
    emoji: "💕",
    icon: <Heart className="w-4 h-4" />,
    description: "Capture those butterfly moments and heart-fluttering feelings",
    colors: "from-pink-400 to-rose-400",
    elements: [
      { type: "mood", content: "💕 Heart is full", position: { x: 50, y: 50 } },
      { type: "text", content: "Today I felt...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "🦋", position: { x: 250, y: 80 } },
      { type: "sticker", content: "✨", position: { x: 300, y: 150 } },
    ],
    tags: ["love", "romance", "feelings", "relationships"],
  },
  {
    id: "rainy-day",
    name: "Rainy Day Vibes",
    mood: "Cozy",
    emoji: "🌧️",
    icon: <Cloud className="w-4 h-4" />,
    description: "Perfect for those contemplative, cozy indoor moments",
    colors: "from-blue-400 to-indigo-400",
    elements: [
      { type: "mood", content: "🌧️ Cozy and contemplative", position: { x: 50, y: 50 } },
      { type: "text", content: "Listening to the rain...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "☕", position: { x: 250, y: 80 } },
      { type: "sticker", content: "📚", position: { x: 300, y: 150 } },
    ],
    tags: ["cozy", "rain", "indoor", "peaceful"],
  },
  {
    id: "burnt-out",
    name: "Burnt Out",
    mood: "Overwhelmed",
    emoji: "😮‍💨",
    icon: <Flame className="w-4 h-4" />,
    description: "A safe space to process stress and overwhelm",
    colors: "from-orange-400 to-red-400",
    elements: [
      { type: "mood", content: "😮‍💨 Feeling overwhelmed", position: { x: 50, y: 50 } },
      { type: "text", content: "I need to remember...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "🕯️", position: { x: 250, y: 80 } },
      { type: "text", content: "Self-care checklist:", position: { x: 100, y: 200 } },
    ],
    tags: ["stress", "overwhelm", "self-care", "mental health"],
  },
  {
    id: "creative-flow",
    name: "Creative Flow",
    mood: "Inspired",
    emoji: "✨",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Capture those magical moments of creative inspiration",
    colors: "from-purple-400 to-pink-400",
    elements: [
      { type: "mood", content: "✨ Creative energy flowing", position: { x: 50, y: 50 } },
      { type: "text", content: "Ideas brewing...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "🎨", position: { x: 250, y: 80 } },
      { type: "sticker", content: "💡", position: { x: 300, y: 150 } },
    ],
    tags: ["creativity", "inspiration", "art", "ideas"],
  },
  {
    id: "morning-ritual",
    name: "Morning Ritual",
    mood: "Peaceful",
    emoji: "☀️",
    icon: <Coffee className="w-4 h-4" />,
    description: "Start your day with intention and gratitude",
    colors: "from-yellow-400 to-orange-400",
    elements: [
      { type: "mood", content: "☀️ Fresh start energy", position: { x: 50, y: 50 } },
      { type: "text", content: "Today I'm grateful for...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "☕", position: { x: 250, y: 80 } },
      { type: "text", content: "Intention for today:", position: { x: 100, y: 200 } },
    ],
    tags: ["morning", "gratitude", "intention", "routine"],
  },
  {
    id: "concert-memories",
    name: "Concert Memories",
    mood: "Euphoric",
    emoji: "🎵",
    icon: <Music className="w-4 h-4" />,
    description: "Preserve those unforgettable live music moments",
    colors: "from-indigo-400 to-purple-400",
    elements: [
      { type: "mood", content: "🎵 Music in my soul", position: { x: 50, y: 50 } },
      { type: "text", content: "The energy was incredible...", position: { x: 100, y: 120 } },
      { type: "sticker", content: "🎤", position: { x: 250, y: 80 } },
      { type: "sticker", content: "⭐", position: { x: 300, y: 150 } },
    ],
    tags: ["music", "concert", "memories", "euphoria"],
  },
]

interface TemplateGalleryProps {
  onTemplateSelect: (template: JournalTemplate) => void
  isOpen: boolean
  onClose: () => void
}

export function TemplateGallery({ onTemplateSelect, isOpen, onClose }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", "love", "cozy", "stress", "creativity", "morning", "music"]

  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((template) => template.tags.some((tag) => tag.includes(selectedCategory)))

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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Journal Templates ✨</h2>
          <p className="text-gray-600">Choose a template that matches your current mood</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredTemplates.map((template) => (
            <motion.div key={template.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => {
                  onTemplateSelect(template)
                  onClose()
                }}
              >
                {/* Template Preview */}
                <div
                  className={`h-32 rounded-lg mb-4 bg-gradient-to-r ${template.colors} relative overflow-hidden p-4`}
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  <div className="relative z-10">
                    <div className="text-white text-lg mb-2">{template.emoji}</div>
                    <div className="text-white text-xs opacity-80">Preview layout...</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {template.icon}
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  </div>

                  <p className="text-sm text-gray-600">{template.description}</p>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.mood}
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose} className="px-8">
            Start Fresh Page ✨
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
