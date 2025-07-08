import type { User, UserPreferences, JournalEntry, Analytics } from './types'

// IndexedDB setup for large data
const DB_NAME = 'SoulSyncDB'
const DB_VERSION = 1

class StorageManager {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Journal entries store
        if (!db.objectStoreNames.contains('journalEntries')) {
          const entriesStore = db.createObjectStore('journalEntries', { keyPath: 'id' })
          entriesStore.createIndex('userId', 'userId', { unique: false })
          entriesStore.createIndex('date', 'date', { unique: false })
        }
        
        // Analytics store
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id' })
          analyticsStore.createIndex('userId', 'userId', { unique: false })
          analyticsStore.createIndex('period', 'period', { unique: false })
        }
        
        // Media store for images/audio
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' })
        }
      }
    })
  }

  // Journal Entries
  async saveJournalEntry(entry: JournalEntry): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readwrite')
      const store = transaction.objectStore('journalEntries')
      const request = store.put(entry)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getJournalEntries(userId: string, limit = 50): Promise<JournalEntry[]> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readonly')
      const store = transaction.objectStore('journalEntries')
      const index = store.index('userId')
      const request = index.getAll(userId)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const entries = request.result
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)
        resolve(entries)
      }
    })
  }

  async getJournalEntry(id: string): Promise<JournalEntry | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readonly')
      const store = transaction.objectStore('journalEntries')
      const request = store.get(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async deleteJournalEntry(id: string): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journalEntries'], 'readwrite')
      const store = transaction.objectStore('journalEntries')
      const request = store.delete(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  // Analytics
  async saveAnalytics(analytics: Analytics): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['analytics'], 'readwrite')
      const store = transaction.objectStore('analytics')
      const request = store.put({ ...analytics, id: `${analytics.userId}-${analytics.period}-${Date.now()}` })
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAnalytics(userId: string, period: string): Promise<Analytics | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['analytics'], 'readonly')
      const store = transaction.objectStore('analytics')
      const index = store.index('userId')
      const request = index.getAll(userId)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        const analytics = request.result
          .filter(a => a.period === period)
          .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0]
        resolve(analytics || null)
      }
    })
  }

  // Media storage
  async saveMedia(id: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['media'], 'readwrite')
      const store = transaction.objectStore('media')
      const request = store.put({ id, blob, timestamp: new Date() })
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getMedia(id: string): Promise<Blob | null> {
    if (!this.db) await this.init()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['media'], 'readonly')
      const store = transaction.objectStore('media')
      const request = store.get(id)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result?.blob || null)
    })
  }
}

// Local Storage for user preferences and quick access data
class LocalStorageManager {
  private static readonly KEYS = {
    USER: 'soulsync_user',
    PREFERENCES: 'soulsync_preferences',
    RECENT_ENTRIES: 'soulsync_recent_entries',
    LAST_SYNC: 'soulsync_last_sync',
    CACHE: 'soulsync_cache'
  }

  static saveUser(user: User): void {
    globalThis.localStorage.setItem(this.KEYS.USER, JSON.stringify(user))
  }

  static getUser(): User | null {
    const data = globalThis.localStorage.getItem(this.KEYS.USER)
    return data ? JSON.parse(data) : null
  }

  static savePreferences(preferences: UserPreferences): void {
    globalThis.localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(preferences))
  }

  static getPreferences(): UserPreferences | null {
    const data = globalThis.localStorage.getItem(this.KEYS.PREFERENCES)
    return data ? JSON.parse(data) : null
  }

  static saveRecentEntries(entries: JournalEntry[]): void {
    const recent = entries.slice(0, 10) // Keep only last 10 for quick access
    globalThis.localStorage.setItem(this.KEYS.RECENT_ENTRIES, JSON.stringify(recent))
  }

  static getRecentEntries(): JournalEntry[] {
    const data = globalThis.localStorage.getItem(this.KEYS.RECENT_ENTRIES)
    return data ? JSON.parse(data) : []
  }

  static saveCache(key: string, data: any, ttl: number = 3600000): void { // 1 hour default TTL
    const cache = {
      data,
      timestamp: Date.now(),
      ttl
    }
    globalThis.localStorage.setItem(`${this.KEYS.CACHE}_${key}`, JSON.stringify(cache))
  }

  static getCache(key: string): any | null {
    const cached = globalThis.localStorage.getItem(`${this.KEYS.CACHE}_${key}`)
    if (!cached) return null
    
    const { data, timestamp, ttl } = JSON.parse(cached)
    if (Date.now() - timestamp > ttl) {
      globalThis.localStorage.removeItem(`${this.KEYS.CACHE}_${key}`)
      return null
    }
    
    return data
  }

  static clearCache(): void {
    Object.keys(globalThis.localStorage).forEach(key => {
      if (key.startsWith(this.KEYS.CACHE)) {
        globalThis.localStorage.removeItem(key)
      }
    })
  }

  static clear(): void {
    Object.values(this.KEYS).forEach(key => {
      globalThis.localStorage.removeItem(key)
    })
    this.clearCache()
  }
}

// Singleton instances
export const storage = new StorageManager()
export const localStorageManager = LocalStorageManager

// Export utility functions
export const initStorage = async (): Promise<void> => {
  await storage.init()
}

export const exportUserData = async (userId: string): Promise<Blob> => {
  const entries = await storage.getJournalEntries(userId, 1000)
  const analytics = await Promise.all([
    storage.getAnalytics(userId, 'week'),
    storage.getAnalytics(userId, 'month'),
    storage.getAnalytics(userId, 'year')
  ])
  
  const userData = {
    user: LocalStorageManager.getUser(),
    preferences: LocalStorageManager.getPreferences(),
    entries,
    analytics: analytics.filter(Boolean),
    exportedAt: new Date()
  }
  
  return new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
}