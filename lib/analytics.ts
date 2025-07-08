import type { JournalEntry, Analytics, MoodTrend, Insight, ActivityStats } from './types'
import { storage } from './storage'

export class AnalyticsService {
  static async generateAnalytics(userId: string, period: 'week' | 'month' | 'year'): Promise<Analytics> {
    const entries = await storage.getJournalEntries(userId, 1000) // Get more entries for analytics
    const periodEntries = this.filterEntriesByPeriod(entries, period)
    
    const moodTrends = this.calculateMoodTrends(periodEntries, period)
    const activityStats = this.calculateActivityStats(periodEntries)
    const insights = this.generateInsights(periodEntries, moodTrends, activityStats)

    return {
      userId,
      period,
      moodTrends,
      activityStats,
      insights,
      generatedAt: new Date()
    }
  }

  private static filterEntriesByPeriod(entries: JournalEntry[], period: 'week' | 'month' | 'year'): JournalEntry[] {
    const now = new Date()
    const cutoffDate = new Date()

    switch (period) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
    }

    return entries.filter(entry => new Date(entry.date) >= cutoffDate)
  }

  private static calculateMoodTrends(entries: JournalEntry[], period: 'week' | 'month' | 'year'): MoodTrend[] {
    const trends: MoodTrend[] = []
    const groupedEntries = this.groupEntriesByDate(entries, period)

    for (const [dateStr, dayEntries] of Object.entries(groupedEntries)) {
      const date = new Date(dateStr)
      const moodIntensities = dayEntries.map(entry => entry.mood.intensity)
      const averageMood = moodIntensities.reduce((sum, intensity) => sum + intensity, 0) / moodIntensities.length

      // Find most common emoji
      const emojiCounts: { [emoji: string]: number } = {}
      dayEntries.forEach(entry => {
        emojiCounts[entry.mood.emoji] = (emojiCounts[entry.mood.emoji] || 0) + 1
      })
      const dominantEmoji = Object.entries(emojiCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '😊'

      // Collect all factors
      const factors = Array.from(new Set(
        dayEntries.flatMap(entry => entry.mood.factors)
      ))

      trends.push({
        date,
        averageMood,
        dominantEmoji,
        factors
      })
    }

    return trends.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  private static groupEntriesByDate(entries: JournalEntry[], period: 'week' | 'month' | 'year'): { [date: string]: JournalEntry[] } {
    const grouped: { [date: string]: JournalEntry[] } = {}

    entries.forEach(entry => {
      const date = new Date(entry.date)
      let key: string

      switch (period) {
        case 'week':
          key = date.toISOString().split('T')[0] // Daily grouping for week
          break
        case 'month':
          key = date.toISOString().split('T')[0] // Daily grouping for month
          break
        case 'year':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` // Monthly grouping for year
          break
      }

      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(entry)
    })

    return grouped
  }

  private static calculateActivityStats(entries: JournalEntry[]): ActivityStats {
    const totalEntries = entries.length
    const dayRange = this.getDayRange(entries)
    const averageEntriesPerDay = totalEntries / Math.max(dayRange, 1)

    // Find most active time
    const hourCounts: { [hour: string]: number } = {}
    entries.forEach(entry => {
      const hour = new Date(entry.createdAt).getHours()
      const timeSlot = this.getTimeSlot(hour)
      hourCounts[timeSlot] = (hourCounts[timeSlot] || 0) + 1
    })
    const mostActiveTime = Object.entries(hourCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'morning'

    // Count theme usage (this would need to be tracked in journal entries)
    const favoriteThemes = this.extractTopItems(entries.map(e => e.template).filter((template): template is string => Boolean(template)), 3)
    
    // Count persona usage (would need tracking)
    const favoritePersonas = ['soft-girl', 'wellness-bestie', 'indie-overthinker'] // Default for now

    // Calculate word count
    const wordCount = entries.reduce((total, entry) => {
      const textElements = entry.elements.filter(el => el.type === 'text')
      const words = textElements.reduce((sum, el) => {
        return sum + (el.content.split(/\s+/).length || 0)
      }, 0)
      return total + words
    }, 0)

    return {
      totalEntries,
      averageEntriesPerDay: Math.round(averageEntriesPerDay * 10) / 10,
      mostActiveTime,
      favoriteThemes,
      favoritePersonas,
      wordCount
    }
  }

  private static getDayRange(entries: JournalEntry[]): number {
    if (entries.length === 0) return 1

    const dates = entries.map(entry => new Date(entry.date).getTime())
    const minDate = Math.min(...dates)
    const maxDate = Math.max(...dates)
    
    return Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1
  }

  private static getTimeSlot(hour: number): string {
    if (hour < 6) return 'early morning'
    if (hour < 12) return 'morning'
    if (hour < 17) return 'afternoon'
    if (hour < 21) return 'evening'
    return 'night'
  }

  private static extractTopItems(items: string[], limit: number): string[] {
    const counts: { [item: string]: number } = {}
    items.forEach(item => {
      counts[item] = (counts[item] || 0) + 1
    })

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([item]) => item)
  }

  private static generateInsights(
    entries: JournalEntry[],
    moodTrends: MoodTrend[],
    activityStats: ActivityStats
  ): Insight[] {
    const insights: Insight[] = []

    // Mood pattern insights
    if (moodTrends.length >= 7) {
      const recentMoods = moodTrends.slice(-7).map(t => t.averageMood)
      const trend = this.calculateTrend(recentMoods)
      
      if (trend > 0.5) {
        insights.push({
          type: 'mood',
          title: 'Positive Mood Trend',
          description: 'Your mood has been consistently improving over the past week! 📈',
          recommendation: 'Keep doing what you\'re doing - your self-care routine seems to be working!',
          confidence: 0.8,
          dataPoints: recentMoods.length
        })
      } else if (trend < -0.5) {
        insights.push({
          type: 'mood',
          title: 'Mood Dip Detected',
          description: 'Your mood has been lower than usual lately.',
          recommendation: 'Consider reaching out to friends, practicing extra self-care, or trying a new activity.',
          confidence: 0.7,
          dataPoints: recentMoods.length
        })
      }
    }

    // Activity pattern insights
    if (activityStats.averageEntriesPerDay > 1) {
      insights.push({
        type: 'activity',
        title: 'Consistent Journaling',
        description: `You're averaging ${activityStats.averageEntriesPerDay} entries per day - amazing consistency! ✨`,
        recommendation: 'Your regular journaling habit is building great self-awareness!',
        confidence: 0.9,
        dataPoints: activityStats.totalEntries
      })
    }

    // Time pattern insights
    const timeInsights = this.getTimeBasedInsights(activityStats.mostActiveTime)
    if (timeInsights) {
      insights.push(timeInsights)
    }

    // Word count insights
    if (activityStats.wordCount > 1000) {
      insights.push({
        type: 'activity',
        title: 'Expressive Writer',
        description: `You've written ${activityStats.wordCount} words across your entries!`,
        recommendation: 'Your detailed self-expression shows deep self-reflection skills.',
        confidence: 0.8,
        dataPoints: activityStats.totalEntries
      })
    }

    // Weather correlation insights (if weather data available)
    const weatherInsights = this.getWeatherInsights(entries)
    if (weatherInsights) {
      insights.push(weatherInsights)
    }

    return insights
  }

  private static calculateTrend(values: number[]): number {
    if (values.length < 2) return 0

    const n = values.length
    const sumX = (n * (n - 1)) / 2 // Sum of indices
    const sumY = values.reduce((sum, val) => sum + val, 0)
    const sumXY = values.reduce((sum, val, i) => sum + (i * val), 0)
    const sumX2 = values.reduce((sum, _, i) => sum + (i * i), 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    return slope
  }

  private static getTimeBasedInsights(mostActiveTime: string): Insight | null {
    const timeInsights = {
      'morning': {
        title: 'Morning Journaler',
        description: 'You love starting your day with reflection!',
        recommendation: 'Morning journaling is great for setting daily intentions.'
      },
      'afternoon': {
        title: 'Midday Reflection',
        description: 'You prefer checking in with yourself during the day.',
        recommendation: 'Afternoon journaling helps maintain mindfulness throughout the day.'
      },
      'evening': {
        title: 'Evening Processor',
        description: 'You like to wind down by processing your day.',
        recommendation: 'Evening journaling is perfect for gratitude and daily reflection.'
      },
      'night': {
        title: 'Night Owl Writer',
        description: 'Your creativity flows in the quiet night hours.',
        recommendation: 'Late-night journaling can be deeply contemplative - just ensure good sleep!'
      }
    }

    const insight = timeInsights[mostActiveTime as keyof typeof timeInsights]
    if (!insight) return null

    return {
      type: 'pattern',
      title: insight.title,
      description: insight.description,
      recommendation: insight.recommendation,
      confidence: 0.7,
      dataPoints: 1
    }
  }

  private static getWeatherInsights(entries: JournalEntry[]): Insight | null {
    const weatherEntries = entries.filter(entry => entry.weather)
    if (weatherEntries.length < 5) return null

    const sunnyMoods = weatherEntries
      .filter(entry => entry.weather?.condition === 'Clear')
      .map(entry => entry.mood.intensity)
    
    const rainyMoods = weatherEntries
      .filter(entry => entry.weather?.condition === 'Rain')
      .map(entry => entry.mood.intensity)

    if (sunnyMoods.length >= 3 && rainyMoods.length >= 3) {
      const avgSunnyMood = sunnyMoods.reduce((sum, mood) => sum + mood, 0) / sunnyMoods.length
      const avgRainyMood = rainyMoods.reduce((sum, mood) => sum + mood, 0) / rainyMoods.length

      if (avgSunnyMood - avgRainyMood > 1) {
        return {
          type: 'weather',
          title: 'Sunshine Boost',
          description: 'Your mood tends to be higher on sunny days! ☀️',
          recommendation: 'On cloudy days, try light therapy or vitamin D supplements.',
          confidence: 0.6,
          dataPoints: sunnyMoods.length + rainyMoods.length
        }
      } else if (avgRainyMood - avgSunnyMood > 1) {
        return {
          type: 'weather',
          title: 'Rainy Day Lover',
          description: 'You actually feel better on rainy days! 🌧️',
          recommendation: 'You might be someone who enjoys cozy, contemplative weather.',
          confidence: 0.6,
          dataPoints: sunnyMoods.length + rainyMoods.length
        }
      }
    }

    return null
  }

  static async saveAnalytics(analytics: Analytics): Promise<void> {
    await storage.saveAnalytics(analytics)
  }

  static async getStoredAnalytics(userId: string, period: 'week' | 'month' | 'year'): Promise<Analytics | null> {
    return await storage.getAnalytics(userId, period)
  }

  static async getOrGenerateAnalytics(userId: string, period: 'week' | 'month' | 'year'): Promise<Analytics> {
    // Try to get recent analytics first
    const stored = await this.getStoredAnalytics(userId, period)
    
    // If analytics are less than 1 hour old, return them
    if (stored && (Date.now() - new Date(stored.generatedAt).getTime()) < 3600000) {
      return stored
    }

    // Generate new analytics
    const analytics = await this.generateAnalytics(userId, period)
    await this.saveAnalytics(analytics)
    
    return analytics
  }
}