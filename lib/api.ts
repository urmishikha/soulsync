import type { WeatherData, MusicData, AIResponse } from './types'
import { localStorageManager } from './storage'

// Weather API Service
export class WeatherService {
  private static readonly API_KEY = typeof window !== 'undefined' ? 
    (window as any).ENV?.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo' : 'demo'
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5'

  static async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData | null> {
    try {
      // Check cache first
      const cacheKey = `weather_${lat}_${lon}`
      const cached = localStorageManager.getCache(cacheKey)
      if (cached) return cached

      // Get location if not provided
      if (!lat || !lon) {
        const position = await this.getUserLocation()
        lat = position.latitude
        lon = position.longitude
      }

      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=imperial`
      )

      if (!response.ok) {
        // Fallback to demo data if API fails
        return this.getDemoWeatherData()
      }

      const data = await response.json()
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        location: data.name,
        timestamp: new Date()
      }

      // Cache for 30 minutes
      localStorageManager.saveCache(cacheKey, weatherData, 1800000)
      return weatherData
    } catch (error) {
      console.warn('Weather API error:', error)
      return this.getDemoWeatherData()
    }
  }

  private static async getUserLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }),
        () => {
          // Default to New York if location denied
          resolve({ latitude: 40.7128, longitude: -74.0060 })
        },
        { timeout: 10000 }
      )
    })
  }

  private static getDemoWeatherData(): WeatherData {
    const conditions = [
      { condition: 'Clear', description: 'sunny', temp: 72, icon: '01d' },
      { condition: 'Clouds', description: 'partly cloudy', temp: 68, icon: '02d' },
      { condition: 'Rain', description: 'light rain', temp: 65, icon: '10d' }
    ]
    const weather = conditions[Math.floor(Math.random() * conditions.length)]
    
    return {
      temperature: weather.temp,
      condition: weather.condition,
      description: weather.description,
      humidity: 60,
      windSpeed: 5,
      icon: weather.icon,
      location: 'Your Area',
      timestamp: new Date()
    }
  }
}

// Music Service (Spotify Web API fallback to Last.fm)
export class MusicService {
  private static readonly LASTFM_API_KEY = typeof window !== 'undefined' ? 
    (window as any).ENV?.NEXT_PUBLIC_LASTFM_API_KEY || 'demo' : 'demo'
  private static readonly LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

  static async getTrendingTrack(): Promise<MusicData | null> {
    try {
      const cacheKey = 'trending_music'
      const cached = localStorageManager.getCache(cacheKey)
      if (cached) return cached

      // Try Last.fm trending tracks
      const response = await fetch(
        `${this.LASTFM_BASE_URL}?method=chart.gettoptracks&api_key=${this.LASTFM_API_KEY}&format=json&limit=10`
      )

      if (!response.ok) {
        return this.getDemoMusicData()
      }

      const data = await response.json()
      const tracks = data.tracks.track
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)]

      const musicData: MusicData = {
        title: randomTrack.name,
        artist: randomTrack.artist.name,
        genre: 'Popular',
        mood: this.getMoodFromTrack(randomTrack.name),
        energy: Math.random() * 0.5 + 0.5, // 0.5-1.0
        danceability: Math.random() * 0.4 + 0.3, // 0.3-0.7
        timestamp: new Date()
      }

      // Cache for 1 hour
      localStorageManager.saveCache(cacheKey, musicData, 3600000)
      return musicData
    } catch (error) {
      console.warn('Music API error:', error)
      return this.getDemoMusicData()
    }
  }

  static async searchTrack(query: string): Promise<MusicData[]> {
    try {
      const response = await fetch(
        `${this.LASTFM_BASE_URL}?method=track.search&track=${encodeURIComponent(query)}&api_key=${this.LASTFM_API_KEY}&format=json&limit=5`
      )

      if (!response.ok) return []

      const data = await response.json()
      const tracks = data.results.trackmatches.track

      return tracks.map((track: any) => ({
        title: track.name,
        artist: track.artist,
        genre: 'Search Result',
        timestamp: new Date()
      }))
    } catch (error) {
      console.warn('Music search error:', error)
      return []
    }
  }

  private static getMoodFromTrack(title: string): string {
    const moodKeywords = {
      happy: ['love', 'sunshine', 'good', 'dance', 'party', 'joy'],
      calm: ['peaceful', 'quiet', 'soft', 'gentle', 'slow'],
      energetic: ['power', 'rock', 'energy', 'fast', 'pump'],
      sad: ['blue', 'crying', 'lonely', 'hurt', 'pain'],
      romantic: ['love', 'heart', 'kiss', 'together', 'forever']
    }

    const titleLower = title.toLowerCase()
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return mood
      }
    }
    return 'neutral'
  }

  private static getDemoMusicData(): MusicData {
    const demoTracks = [
      { title: 'Golden Hour', artist: 'Jvke', genre: 'Pop', mood: 'peaceful' },
      { title: 'Flowers', artist: 'Miley Cyrus', genre: 'Pop', mood: 'empowering' },
      { title: 'Anti-Hero', artist: 'Taylor Swift', genre: 'Pop', mood: 'reflective' },
      { title: 'As It Was', artist: 'Harry Styles', genre: 'Pop', mood: 'nostalgic' },
      { title: 'Stay', artist: 'The Kid LAROI', genre: 'Pop', mood: 'romantic' }
    ]
    
    const track = demoTracks[Math.floor(Math.random() * demoTracks.length)]
    return {
      ...track,
      energy: Math.random() * 0.5 + 0.5,
      danceability: Math.random() * 0.4 + 0.3,
      timestamp: new Date()
    }
  }
}

// AI Service for persona interactions
export class AIService {
  static async getPersonaResponse(
    personaId: string,
    mood: string,
    weatherData?: WeatherData,
    musicData?: MusicData,
    recentEntries?: string[]
  ): Promise<AIResponse> {
    try {
      // For now, generate contextual responses based on persona and current data
      const response = this.generateContextualResponse(personaId, mood, weatherData, musicData, recentEntries)
      
      // Cache the response for a short time
      const cacheKey = `ai_response_${personaId}_${mood}`
      localStorageManager.saveCache(cacheKey, response, 900000) // 15 minutes
      
      return response
    } catch (error) {
      console.warn('AI Service error:', error)
      return this.getFallbackResponse(personaId)
    }
  }

  static async getRecommendations(
    personaId: string,
    mood: string,
    currentHour: number
  ): Promise<{ activities: string[]; selfCare: string[]; creative: string[] }> {
    const recommendations = this.generateRecommendations(personaId, mood, currentHour)
    return recommendations
  }

  private static generateContextualResponse(
    personaId: string,
    mood: string,
    weather?: WeatherData,
    music?: MusicData,
    recentEntries?: string[]
  ): AIResponse {
    const personas = {
      'soft-girl': {
        responses: [
          "You're glowing today, angel! ✨",
          "Sending you the softest vibes, beautiful 💕",
          "Today feels like a cotton candy dream 🌸"
        ],
        suggestions: ["Try some bubble tea and cozy reading", "Paint your nails a pretty pastel", "Make a vision board"],
        stickers: ["🌸", "💕", "✨", "🦋", "☁️"]
      },
      'chaotic-neutral': {
        responses: [
          "Chaos energy activated 💀⚡",
          "Today's vibe: beautifully unhinged",
          "Plot twist: you're the main character"
        ],
        suggestions: ["Reorganize everything at 3am", "Try that weird TikTok recipe", "Start 5 new hobbies"],
        stickers: ["💀", "⚡", "🔮", "👁️", "🌙"]
      },
      'wellness-bestie': {
        responses: [
          "Take a deep breath, lovely 🌿",
          "Your energy is beautiful today",
          "Time for some gentle self-care"
        ],
        suggestions: ["Morning meditation", "Herbal tea ritual", "Gentle yoga flow"],
        stickers: ["🌿", "🧘", "☘️", "💚", "✨"]
      },
      'indie-overthinker': {
        responses: [
          "The aesthetics are immaculate today 🍂",
          "This moment feels like a song",
          "Contemplative energy is strong"
        ],
        suggestions: ["Journal with coffee", "Discover new indie artists", "Read poetry"],
        stickers: ["🍂", "☕", "📚", "🎵", "💭"]
      },
      'minimalist-ai': {
        responses: [
          "Optimal clarity achieved",
          "Focus mode: activated",
          "Efficiency levels: maximum"
        ],
        suggestions: ["Declutter digital space", "Single-task focus", "Mindful breathing"],
        stickers: ["⚪", "▫️", "⭐", "💫", "◽"]
      }
    }

    const persona = personas[personaId as keyof typeof personas] || personas['soft-girl']
    let message = persona.responses[Math.floor(Math.random() * persona.responses.length)]

    // Add weather context
    if (weather) {
      if (weather.condition === 'Rain') {
        message += ` Perfect cozy weather for some ${personaId === 'soft-girl' ? 'hot chocolate and journaling' : 'indoor vibes'} 🌧️`
      } else if (weather.condition === 'Clear') {
        message += ` This sunshine is giving ${personaId === 'soft-girl' ? 'golden hour energy' : 'main character vibes'} ☀️`
      }
    }

    // Add music context
    if (music) {
      message += ` "${music.title}" would be perfect for this mood! 🎵`
    }

    return {
      message,
      suggestions: persona.suggestions,
      mood: mood,
      stickers: persona.stickers,
      timestamp: new Date()
    }
  }

  private static generateRecommendations(
    personaId: string,
    mood: string,
    currentHour: number
  ): { activities: string[]; selfCare: string[]; creative: string[] } {
    const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'
    
    const baseRecommendations = {
      activities: [
        'Take a mindful walk',
        'Listen to your favorite playlist',
        'Try a new recipe',
        'Call a friend'
      ],
      selfCare: [
        'Practice deep breathing',
        'Take a warm bath',
        'Do gentle stretches',
        'Drink herbal tea'
      ],
      creative: [
        'Write in your journal',
        'Try watercolor painting',
        'Make a mood board',
        'Take aesthetic photos'
      ]
    }

    // Personalize based on persona
    if (personaId === 'soft-girl') {
      baseRecommendations.selfCare.push('Face mask and skincare ritual', 'Make a cozy reading nook')
      baseRecommendations.creative.push('Create fairy lights setup', 'Make flower arrangements')
    } else if (personaId === 'wellness-bestie') {
      baseRecommendations.selfCare.push('Meditation session', 'Prepare nutritious meal')
      baseRecommendations.activities.push('Yoga practice', 'Nature journaling')
    }

    return baseRecommendations
  }

  private static getFallbackResponse(personaId: string): AIResponse {
    return {
      message: "You're amazing just as you are! ✨",
      suggestions: ["Take some time for yourself", "Do something that brings you joy"],
      mood: "supportive",
      stickers: ["✨", "💕", "🌟"],
      timestamp: new Date()
    }
  }
}

// Real-time updates service
export class RealtimeService {
  private static listeners: Map<string, Function[]> = new Map()

  static subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  static emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(data))
    }
  }

  static async startRealtimeUpdates(): Promise<void> {
    // Update weather every 30 minutes
    setInterval(async () => {
      const weather = await WeatherService.getCurrentWeather()
      if (weather) {
        this.emit('weather-update', weather)
      }
    }, 1800000)

    // Update music recommendations every hour
    setInterval(async () => {
      const music = await MusicService.getTrendingTrack()
      if (music) {
        this.emit('music-update', music)
      }
    }, 3600000)

    // Generate new AI insights every 2 hours
    setInterval(() => {
      this.emit('ai-insight', {
        type: 'motivation',
        message: 'You\'re doing great! Keep being amazing! ✨',
        timestamp: new Date()
      })
    }, 7200000)
  }
}