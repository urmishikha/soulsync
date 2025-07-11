"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Sparkles, Camera, Shirt, Sun, Cloud, Snowflake, Heart, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getWeatherData } from "@/lib/weather-service"
import { getPersonalizedResponse } from "@/lib/ai-service"
import { personas } from "@/components/persona-selector"

interface StyleRecommendation {
  category: string
  items: string[]
  colors: string[]
  vibe: string
  occasion: string
}

interface OutfitIdea {
  id: string
  name: string
  pieces: string[]
  colors: string[]
  vibe: string
  weather: string
  occasion: string
  confidence: number
}

export default function StylePage() {
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [selectedOccasion, setSelectedOccasion] = useState("casual")
  const [selectedVibe, setSelectedVibe] = useState("comfortable")
  const [bodyType, setBodyType] = useState("")
  const [colorPreferences, setColorPreferences] = useState<string[]>([])
  const [stylePersonality, setStylePersonality] = useState("")
  const [outfitRecommendations, setOutfitRecommendations] = useState<OutfitIdea[]>([])
  const [loading, setLoading] = useState(false)
  const [aiStyleAdvice, setAiStyleAdvice] = useState("")

  const occasions = [
    { id: "casual", name: "Casual Day", icon: "☀️" },
    { id: "work", name: "Work/Professional", icon: "💼" },
    { id: "date", name: "Date Night", icon: "💕" },
    { id: "party", name: "Party/Event", icon: "🎉" },
    { id: "workout", name: "Workout", icon: "💪" },
    { id: "cozy", name: "Cozy Home", icon: "🏠" },
  ]

  const vibes = [
    { id: "comfortable", name: "Comfortable", color: "from-green-400 to-blue-400" },
    { id: "edgy", name: "Edgy", color: "from-gray-600 to-black" },
    { id: "romantic", name: "Romantic", color: "from-pink-400 to-red-400" },
    { id: "minimalist", name: "Minimalist", color: "from-gray-400 to-gray-600" },
    { id: "boho", name: "Boho", color: "from-orange-400 to-yellow-400" },
    { id: "preppy", name: "Preppy", color: "from-blue-400 to-indigo-400" },
  ]

  const colorPalettes = [
    { name: "Warm Neutrals", colors: ["#F5E6D3", "#E8B4A0", "#D4A574", "#C19A6B"] },
    { name: "Cool Tones", colors: ["#B8D4E3", "#A8C8EC", "#7FB3D3", "#5B9BD5"] },
    { name: "Earth Tones", colors: ["#8B7355", "#A0956B", "#B5A584", "#D4C5A9"] },
    { name: "Pastels", colors: ["#FFE5E5", "#E5F3FF", "#E5FFE5", "#FFF5E5"] },
    { name: "Bold & Bright", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"] },
  ]

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      const weather = await getWeatherData()
      setCurrentWeather(weather)
    } catch (error) {
      console.error("Failed to load weather:", error)
    }
  }

  const generateOutfitRecommendations = async () => {
    setLoading(true)

    try {
      // Generate AI-powered outfit recommendations
      const recommendations = await generateAIOutfits()
      setOutfitRecommendations(recommendations)

      // Get personalized style advice
      const persona = personas[0] // Use first persona as default
      const styleContext = `Occasion: ${selectedOccasion}, Vibe: ${selectedVibe}, Weather: ${currentWeather?.description || "mild"}`
      const aiResponse = await getPersonalizedResponse(persona, "inspired", currentWeather, styleContext)
      setAiStyleAdvice(aiResponse.message)
    } catch (error) {
      console.error("Failed to generate recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAIOutfits = async (): Promise<OutfitIdea[]> => {
    // Simulate AI outfit generation based on inputs
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const outfitTemplates = {
      casual: [
        {
          name: "Cozy Chic",
          pieces: ["Oversized sweater", "High-waisted jeans", "White sneakers", "Crossbody bag"],
          colors: ["Cream", "Denim blue", "White"],
          vibe: "comfortable",
          confidence: 95,
        },
        {
          name: "Effortless Cool",
          pieces: ["Graphic tee", "Mom jeans", "Denim jacket", "Canvas sneakers"],
          colors: ["Black", "Blue", "White"],
          vibe: "edgy",
          confidence: 88,
        },
      ],
      work: [
        {
          name: "Power Professional",
          pieces: ["Blazer", "Tailored trousers", "Button-down shirt", "Pointed flats"],
          colors: ["Navy", "White", "Black"],
          vibe: "minimalist",
          confidence: 92,
        },
      ],
      date: [
        {
          name: "Romantic Evening",
          pieces: ["Midi dress", "Heeled sandals", "Delicate jewelry", "Small clutch"],
          colors: ["Blush pink", "Gold"],
          vibe: "romantic",
          confidence: 90,
        },
      ],
    }

    const templates = outfitTemplates[selectedOccasion as keyof typeof outfitTemplates] || outfitTemplates.casual

    return templates.map((template, index) => ({
      id: `outfit_${index}`,
      ...template,
      weather: currentWeather?.description || "mild",
      occasion: selectedOccasion,
    }))
  }

  const getWeatherIcon = (description: string) => {
    if (description?.toLowerCase().includes("sun")) return <Sun className="w-5 h-5 text-yellow-500" />
    if (description?.toLowerCase().includes("cloud")) return <Cloud className="w-5 h-5 text-gray-500" />
    if (description?.toLowerCase().includes("rain")) return <Cloud className="w-5 h-5 text-blue-500" />
    if (description?.toLowerCase().includes("snow")) return <Snowflake className="w-5 h-5 text-blue-300" />
    return <Sun className="w-5 h-5 text-yellow-500" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-gray-800">AI Style Assistant</h1>
              <p className="text-sm text-gray-600">Discover your perfect look for any occasion</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Weather Context */}
        {currentWeather && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <div className="flex items-center gap-3">
                {getWeatherIcon(currentWeather.description)}
                <div>
                  <p className="font-medium text-gray-800">Today's Weather</p>
                  <p className="text-sm text-gray-600">
                    {currentWeather.description}, {currentWeather.temperature}°F - Perfect for styling!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Style Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Tell Me About Your Style
            </h2>

            <div className="space-y-6">
              {/* Occasion */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">What's the occasion?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {occasions.map((occasion) => (
                    <Button
                      key={occasion.id}
                      variant={selectedOccasion === occasion.id ? "default" : "outline"}
                      onClick={() => setSelectedOccasion(occasion.id)}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <span className="text-lg">{occasion.icon}</span>
                      <span className="text-xs">{occasion.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">What vibe are you going for?</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {vibes.map((vibe) => (
                    <Button
                      key={vibe.id}
                      variant={selectedVibe === vibe.id ? "default" : "outline"}
                      onClick={() => setSelectedVibe(vibe.id)}
                      className="h-auto py-3"
                    >
                      {vibe.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Preferences */}
              <div>
                <h3 className="font-medium text-gray-800 mb-3">Favorite color palette?</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {colorPalettes.map((palette) => (
                    <div
                      key={palette.name}
                      className="cursor-pointer p-3 rounded-lg border-2 border-transparent hover:border-purple-300 transition-all"
                      onClick={() => setColorPreferences(palette.colors)}
                    >
                      <div className="flex gap-1 mb-2">
                        {palette.colors.map((color, index) => (
                          <div key={index} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 text-center">{palette.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <Button
                  onClick={generateOutfitRecommendations}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {loading ? (
                    <>
                      <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Your Perfect Looks...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate My Style Recommendations
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Style Advice */}
        {aiStyleAdvice && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Your Personal Style Guru Says:
              </h3>
              <p className="text-gray-700 italic">"{aiStyleAdvice}"</p>
            </Card>
          </motion.div>
        )}

        {/* Outfit Recommendations */}
        {outfitRecommendations.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Shirt className="w-6 h-6 text-indigo-500" />
                Your Perfect Outfits
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfitRecommendations.map((outfit) => (
                  <motion.div
                    key={outfit.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {outfit.confidence}% match
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Pieces:</p>
                        <div className="space-y-1">
                          {outfit.pieces.map((piece, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                              {piece}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Colors:</p>
                        <div className="flex gap-2">
                          {outfit.colors.map((color, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Vibe: {outfit.vibe}</span>
                        <span>Weather: {outfit.weather}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Save This Look
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Style Tips */}
              <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">✨ Pro Styling Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium mb-1">Accessorizing:</p>
                    <p>
                      Add one statement piece to elevate any outfit - a bold necklace, colorful scarf, or unique bag.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Color Coordination:</p>
                    <p>Follow the 60-30-10 rule: 60% neutral, 30% secondary color, 10% accent color.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Fit is Everything:</p>
                    <p>Well-fitted basics always look more expensive than ill-fitting designer pieces.</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Confidence Boost:</p>
                    <p>Wear what makes YOU feel amazing - confidence is your best accessory!</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
