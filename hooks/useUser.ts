import { useState, useEffect, useCallback } from 'react'
import type { User, UserPreferences } from '@/lib/types'
import { localStorageManager, initStorage } from '@/lib/storage'

const defaultPreferences: UserPreferences = {
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
}

const defaultUser: User = {
  id: 'user_' + Date.now(),
  name: 'Beautiful Soul',
  preferences: defaultPreferences,
  createdAt: new Date(),
  lastActive: new Date()
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        await initStorage()
        
        let existingUser = localStorageManager.getUser()
        
        if (!existingUser) {
          // Create new user
          existingUser = { ...defaultUser }
          localStorageManager.saveUser(existingUser)
        } else {
          // Update last active
          existingUser.lastActive = new Date()
          localStorageManager.saveUser(existingUser)
        }
        
        setUser(existingUser)
      } catch (error) {
        console.error('Failed to initialize user:', error)
        // Fallback to default user
        setUser(defaultUser)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...newPreferences },
      lastActive: new Date()
    }

    setUser(updatedUser)
    localStorageManager.saveUser(updatedUser)
    localStorageManager.savePreferences(updatedUser.preferences)
  }, [user])

  const updateUser = useCallback((updates: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...updates,
      lastActive: new Date()
    }

    setUser(updatedUser)
    localStorageManager.saveUser(updatedUser)
  }, [user])

  const clearUserData = useCallback(() => {
    localStorageManager.clear()
    setUser(null)
  }, [])

  return {
    user,
    loading,
    updatePreferences,
    updateUser,
    clearUserData
  }
}