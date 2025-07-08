"use client"

import { useState, useEffect, useCallback } from 'react'
import type { WeatherData, MusicData, AIResponse } from '@/lib/types'
import { WeatherService, MusicService, AIService, RealtimeService } from '@/lib/api'
import { useUser } from './useUser'

interface LoadingState {
  weather: boolean
  music: boolean
  ai: boolean
}

export function useRealtimeData() {
  const { user } = useUser()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [music, setMusic] = useState<MusicData | null>(null)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [loading, setLoading] = useState<LoadingState>({
    weather: true,
    music: true,
    ai: true
  })

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return

      try {
        // Load weather
        setLoading(prev => ({ ...prev, weather: true }))
        const weatherData = await WeatherService.getCurrentWeather()
        setWeather(weatherData)
        setLoading(prev => ({ ...prev, weather: false }))

        // Load music
        setLoading(prev => ({ ...prev, music: true }))
        const musicData = await MusicService.getTrendingTrack()
        setMusic(musicData)
        setLoading(prev => ({ ...prev, music: false }))

        // Get AI response
        setLoading(prev => ({ ...prev, ai: true }))
        const currentHour = new Date().getHours()
        const mood = currentHour < 12 ? 'energetic' : currentHour < 18 ? 'focused' : 'peaceful'
        const aiData = await AIService.getPersonaResponse(
          user.preferences.selectedPersona,
          mood,
          weatherData || undefined,
          musicData || undefined
        )
        setAiResponse(aiData)
        setLoading(prev => ({ ...prev, ai: false }))
      } catch (error) {
        console.error('Failed to load real-time data:', error)
        setLoading({ weather: false, music: false, ai: false })
      }
    }

    loadInitialData()
  }, [user])

  // Subscribe to real-time updates
  useEffect(() => {
    const weatherUnsub = RealtimeService.subscribe('weather-update', (data: WeatherData) => {
      setWeather(data)
    })

    const musicUnsub = RealtimeService.subscribe('music-update', (data: MusicData) => {
      setMusic(data)
    })

    const aiUnsub = RealtimeService.subscribe('ai-insight', (data: AIResponse) => {
      setAiResponse(data)
    })

    // Start real-time updates
    RealtimeService.startRealtimeUpdates()

    return () => {
      weatherUnsub()
      musicUnsub()
      aiUnsub()
    }
  }, [])

  const refreshWeather = useCallback(async () => {
    setLoading(prev => ({ ...prev, weather: true }))
    try {
      const weatherData = await WeatherService.getCurrentWeather()
      setWeather(weatherData)
    } catch (error) {
      console.error('Failed to refresh weather:', error)
    } finally {
      setLoading(prev => ({ ...prev, weather: false }))
    }
  }, [])

  const refreshMusic = useCallback(async () => {
    setLoading(prev => ({ ...prev, music: true }))
    try {
      const musicData = await MusicService.getTrendingTrack()
      setMusic(musicData)
    } catch (error) {
      console.error('Failed to refresh music:', error)
    } finally {
      setLoading(prev => ({ ...prev, music: false }))
    }
  }, [])

  const getNewAIResponse = useCallback(async (mood: string) => {
    if (!user) return
    
    setLoading(prev => ({ ...prev, ai: true }))
    try {
      const aiData = await AIService.getPersonaResponse(
        user.preferences.selectedPersona,
        mood,
        weather || undefined,
        music || undefined
      )
      setAiResponse(aiData)
    } catch (error) {
      console.error('Failed to get AI response:', error)
    } finally {
      setLoading(prev => ({ ...prev, ai: false }))
    }
  }, [user, weather, music])

  const getRecommendations = useCallback(async (mood: string) => {
    if (!user) return null
    
    const currentHour = new Date().getHours()
    return await AIService.getRecommendations(
      user.preferences.selectedPersona,
      mood,
      currentHour
    )
  }, [user])

  return {
    weather,
    music,
    aiResponse,
    loading,
    refreshWeather,
    refreshMusic,
    getNewAIResponse,
    getRecommendations
  }
}