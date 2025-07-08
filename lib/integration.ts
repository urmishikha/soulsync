import { WeatherService, MusicService, AIService, RealtimeService } from './api'
import { AnalyticsService } from './analytics'
import { storage, localStorageManager, initStorage, exportUserData } from './storage'
import type { User, JournalEntry, WeatherData, MusicData, AIResponse, Analytics } from './types'

export class SoulSyncApp {
  private static instance: SoulSyncApp
  private initialized = false

  static getInstance(): SoulSyncApp {
    if (!this.instance) {
      this.instance = new SoulSyncApp()
    }
    return this.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      await initStorage()
      await RealtimeService.startRealtimeUpdates()
      this.initialized = true
      console.log('SoulSync initialized successfully')
    } catch (error) {
      console.error('Failed to initialize SoulSync:', error)
      throw error
    }
  }

  // User Management
  async getOrCreateUser(): Promise<User> {
    let user = localStorageManager.getUser()
    
    if (!user) {
      user = {
        id: 'user_' + Date.now(),
        name: 'Beautiful Soul',
        preferences: {
          selectedPersona: 'soft-girl',
          selectedTheme: 'dark-academia',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notifications: {
            dailyReminder: true,
            moodReminder: true,
            weeklyInsights: true
          },
          privacy: {
            shareAnalytics: false,
            publicEntries: false
          }
        },
        createdAt: new Date(),
        lastActive: new Date()
      }
      localStorageManager.saveUser(user)
    }

    return user
  }

  // Journal Operations
  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    await storage.saveJournalEntry(entry)
    
    // Update recent entries cache
    const recentEntries = await storage.getJournalEntries(entry.userId, 10)
    localStorageManager.saveRecentEntries(recentEntries)

    // Trigger analytics update
    setTimeout(async () => {
      const analytics = await AnalyticsService.generateAnalytics(entry.userId, 'week')
      await AnalyticsService.saveAnalytics(analytics)
    }, 1000)
  }

  async getJournalEntries(userId: string, limit = 50): Promise<JournalEntry[]> {
    return await storage.getJournalEntries(userId, limit)
  }

  async deleteJournalEntry(id: string): Promise<void> {
    await storage.deleteJournalEntry(id)
  }

  // Real-time Data
  async getCurrentWeather(): Promise<WeatherData | null> {
    return await WeatherService.getCurrentWeather()
  }

  async getTrendingMusic(): Promise<MusicData | null> {
    return await MusicService.getTrendingTrack()
  }

  async getAIResponse(
    personaId: string,
    mood: string,
    weather?: WeatherData,
    music?: MusicData
  ): Promise<AIResponse> {
    return await AIService.getPersonaResponse(personaId, mood, weather, music)
  }

  async getRecommendations(personaId: string, mood: string) {
    const currentHour = new Date().getHours()
    return await AIService.getRecommendations(personaId, mood, currentHour)
  }

  // Analytics
  async getAnalytics(userId: string, period: 'week' | 'month' | 'year'): Promise<Analytics> {
    return await AnalyticsService.getOrGenerateAnalytics(userId, period)
  }

  // Data Export
  async exportAllData(userId: string): Promise<Blob> {
    return await exportUserData(userId)
  }

  // Real-time Subscriptions
  subscribeToWeatherUpdates(callback: (weather: WeatherData) => void): () => void {
    return RealtimeService.subscribe('weather-update', callback)
  }

  subscribeToMusicUpdates(callback: (music: MusicData) => void): () => void {
    return RealtimeService.subscribe('music-update', callback)
  }

  subscribeToAIInsights(callback: (insight: AIResponse) => void): () => void {
    return RealtimeService.subscribe('ai-insight', callback)
  }

  // Utility Methods
  generateUniqueId(): string {
    return Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9)
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  getTimeBasedGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  getMoodFromTime(): string {
    const hour = new Date().getHours()
    if (hour < 8) return 'sleepy'
    if (hour < 12) return 'energetic'
    if (hour < 17) return 'focused'
    if (hour < 21) return 'reflective'
    return 'peaceful'
  }
}

// Export singleton instance
export const soulSync = SoulSyncApp.getInstance()

// Helper functions for easy access
export const createJournalEntry = (
  userId: string,
  mood: string,
  elements: any[] = [],
  weather?: WeatherData,
  music?: MusicData
): JournalEntry => ({
  id: soulSync.generateUniqueId(),
  userId,
  date: new Date(),
  mood: {
    primary: mood,
    intensity: 7,
    factors: [],
    emoji: '😊',
    color: 'from-blue-400 to-purple-400',
    timestamp: new Date()
  },
  elements,
  weather,
  music,
  tags: [],
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date()
})

export const initializeSoulSync = async (): Promise<void> => {
  await soulSync.initialize()
}

// Export all services for direct access if needed
export {
  WeatherService,
  MusicService,
  AIService,
  RealtimeService,
  AnalyticsService,
  storage,
  localStorageManager
}