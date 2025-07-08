export interface User {
  id: string
  name: string
  email?: string
  preferences: UserPreferences
  createdAt: Date
  lastActive: Date
}

export interface UserPreferences {
  selectedPersona: string
  selectedTheme: string
  location?: string
  timezone: string
  notifications: {
    dailyReminder: boolean
    moodReminder: boolean
    weeklyInsights: boolean
  }
  privacy: {
    shareAnalytics: boolean
    publicEntries: boolean
  }
}

export interface JournalEntry {
  id: string
  userId: string
  title?: string
  date: Date
  mood: MoodData
  elements: JournalElement[]
  weather?: WeatherData
  music?: MusicData
  template?: string
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface JournalElement {
  id: string
  type: "text" | "image" | "sticker" | "mood" | "voice" | "photo"
  content: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  style?: {
    fontSize?: number
    fontFamily?: string
    color?: string
    rotation?: number
    opacity?: number
  }
  metadata?: any
}

export interface MoodData {
  primary: string
  secondary?: string[]
  intensity: number // 1-10
  factors: string[]
  emoji: string
  color: string
  timestamp: Date
}

export interface WeatherData {
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  icon: string
  location: string
  timestamp: Date
}

export interface MusicData {
  title: string
  artist: string
  album?: string
  genre?: string
  mood?: string
  energy?: number
  danceability?: number
  spotifyUrl?: string
  appleMusicUrl?: string
  timestamp: Date
}

export interface AIResponse {
  message: string
  suggestions: string[]
  mood: string
  stickers: string[]
  templateRecommendation?: string
  timestamp: Date
}

export interface Analytics {
  userId: string
  period: 'day' | 'week' | 'month' | 'year'
  moodTrends: MoodTrend[]
  activityStats: ActivityStats
  insights: Insight[]
  generatedAt: Date
}

export interface MoodTrend {
  date: Date
  averageMood: number
  dominantEmoji: string
  factors: string[]
}

export interface ActivityStats {
  totalEntries: number
  averageEntriesPerDay: number
  mostActiveTime: string
  favoriteThemes: string[]
  favoritePersonas: string[]
  wordCount: number
}

export interface Insight {
  type: 'mood' | 'activity' | 'weather' | 'music' | 'pattern'
  title: string
  description: string
  recommendation?: string
  confidence: number
  dataPoints: number
}

export interface RealtimeUpdate {
  type: 'mood' | 'weather' | 'music' | 'ai_response' | 'recommendation'
  data: any
  timestamp: Date
}