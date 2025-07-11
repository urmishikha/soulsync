"use client"

import { useState, useEffect } from "react"
import { getWeatherData } from "@/lib/weather-service"
import { getTodaysVibeMusic } from "@/lib/music-service"
import { getMoodBasedRecipe } from "@/lib/recipe-service"
import { getCreativePrompt } from "@/lib/creative-service"
import { getPersonalizedResponse } from "@/lib/ai-service"
import type { AIPersona } from "@/components/persona-selector"
import type { AestheticTheme } from "@/components/theme-selector"

interface DynamicContent {
  weather: any
  music: any
  recipe: any
  creative: any
  aiResponse: any
  loading: boolean
  error: string | null
}

export function useDynamicContent(selectedPersona: AIPersona, selectedTheme: AestheticTheme, currentMood: string) {
  const [content, setContent] = useState<DynamicContent>({
    weather: null,
    music: null,
    recipe: null,
    creative: null,
    aiResponse: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    loadDynamicContent()
  }, [selectedPersona.id, selectedTheme.id, currentMood])

  const loadDynamicContent = async () => {
    setContent((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Load all dynamic content in parallel
      const [weather, music, recipe, creative] = await Promise.all([
        getWeatherData(),
        getTodaysVibeMusic(currentMood),
        getMoodBasedRecipe(currentMood, "sunny"),
        getCreativePrompt(currentMood, selectedTheme.id),
      ])

      // Get AI response based on all the context
      const aiResponse = await getPersonalizedResponse(
        selectedPersona,
        currentMood,
        weather,
        `Theme: ${selectedTheme.name}`,
      )

      setContent({
        weather,
        music,
        recipe,
        creative,
        aiResponse,
        loading: false,
        error: null,
      })
    } catch (error) {
      setContent((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load dynamic content",
      }))
    }
  }

  const refreshContent = () => {
    loadDynamicContent()
  }

  return { ...content, refreshContent }
}
