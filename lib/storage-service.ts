interface JournalEntry {
  id: string
  date: string
  mood: string
  content: string
  elements: any[]
  persona: string
  theme: string
}

interface UserPreferences {
  selectedPersona: string
  selectedTheme: string
  location?: string
  notifications: boolean
}

export class StorageService {
  private static JOURNAL_KEY = "soulsync_journal_entries"
  private static PREFERENCES_KEY = "soulsync_preferences"
  private static MOOD_HISTORY_KEY = "soulsync_mood_history"

  static saveJournalEntry(entry: JournalEntry): void {
    const entries = this.getJournalEntries()
    const existingIndex = entries.findIndex((e) => e.id === entry.id)

    if (existingIndex >= 0) {
      entries[existingIndex] = entry
    } else {
      entries.push(entry)
    }

    localStorage.setItem(this.JOURNAL_KEY, JSON.stringify(entries))

    // Also save to mood history
    this.saveMoodEntry(entry.mood, entry.date)
  }

  static getJournalEntries(): JournalEntry[] {
    const stored = localStorage.getItem(this.JOURNAL_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences))
  }

  static getPreferences(): UserPreferences | null {
    const stored = localStorage.getItem(this.PREFERENCES_KEY)
    return stored ? JSON.parse(stored) : null
  }

  static saveMoodEntry(mood: string, date: string): void {
    const moodHistory = this.getMoodHistory()
    moodHistory.push({ mood, date, timestamp: Date.now() })

    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
    const filtered = moodHistory.filter((entry) => entry.timestamp > thirtyDaysAgo)

    localStorage.setItem(this.MOOD_HISTORY_KEY, JSON.stringify(filtered))
  }

  static getMoodHistory(): Array<{ mood: string; date: string; timestamp: number }> {
    const stored = localStorage.getItem(this.MOOD_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static exportData(): string {
    const data = {
      entries: this.getJournalEntries(),
      preferences: this.getPreferences(),
      moodHistory: this.getMoodHistory(),
      exportDate: new Date().toISOString(),
    }

    return JSON.stringify(data, null, 2)
  }
}
