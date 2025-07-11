"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, Activity, Moon, Droplets, Target, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface WellnessEntry {
  id: string
  date: string
  mood: number
  energy: number
  sleep: number
  water: number
  exercise: boolean
  meditation: boolean
  gratitude: string[]
  notes: string
}

interface WellnessGoal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  icon: string
}

export default function WellnessPage() {
  const [todayEntry, setTodayEntry] = useState<WellnessEntry>({
    id: `wellness_${new Date().toISOString().split("T")[0]}`,
    date: new Date().toISOString().split("T")[0],
    mood: 5,
    energy: 5,
    sleep: 8,
    water: 0,
    exercise: false,
    meditation: false,
    gratitude: [],
    notes: "",
  })

  const [goals, setGoals] = useState<WellnessGoal[]>([
    { id: "water", title: "Daily Water", target: 8, current: 0, unit: "glasses", icon: "💧" },
    { id: "sleep", title: "Sleep Hours", target: 8, current: 8, unit: "hours", icon: "😴" },
    { id: "exercise", title: "Weekly Workouts", target: 5, current: 0, unit: "sessions", icon: "💪" },
    { id: "meditation", title: "Mindful Minutes", target: 20, current: 0, unit: "minutes", icon: "🧘" },
  ])

  const [newGratitude, setNewGratitude] = useState("")
  const [wellnessHistory, setWellnessHistory] = useState<WellnessEntry[]>([])

  useEffect(() => {
    loadWellnessData()
  }, [])

  const loadWellnessData = () => {
    const stored = localStorage.getItem("soulsync_wellness_entries")
    if (stored) {
      const entries = JSON.parse(stored)
      setWellnessHistory(entries)

      // Load today's entry if it exists
      const today = new Date().toISOString().split("T")[0]
      const todayData = entries.find((entry: WellnessEntry) => entry.date === today)
      if (todayData) {
        setTodayEntry(todayData)
      }
    }
  }

  const saveWellnessEntry = () => {
    const entries = wellnessHistory.filter((entry) => entry.date !== todayEntry.date)
    entries.push(todayEntry)

    localStorage.setItem("soulsync_wellness_entries", JSON.stringify(entries))
    setWellnessHistory(entries)
  }

  const updateEntry = (field: keyof WellnessEntry, value: any) => {
    setTodayEntry((prev) => ({ ...prev, [field]: value }))
  }

  const addGratitude = () => {
    if (newGratitude.trim() && todayEntry.gratitude.length < 3) {
      updateEntry("gratitude", [...todayEntry.gratitude, newGratitude.trim()])
      setNewGratitude("")
    }
  }

  const removeGratitude = (index: number) => {
    updateEntry(
      "gratitude",
      todayEntry.gratitude.filter((_, i) => i !== index),
    )
  }

  const getWeeklyAverage = (field: keyof WellnessEntry) => {
    const lastWeek = wellnessHistory.slice(-7)
    if (lastWeek.length === 0) return 0

    const sum = lastWeek.reduce((acc, entry) => {
      const value = entry[field]
      return acc + (typeof value === "number" ? value : 0)
    }, 0)

    return (sum / lastWeek.length).toFixed(1)
  }

  useEffect(() => {
    saveWellnessEntry()
  }, [todayEntry])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
              <h1 className="font-semibold text-gray-800">Wellness Tracker</h1>
              <p className="text-sm text-gray-600">Nurture your mind, body, and soul</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Today's Check-in */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Today's Wellness Check-in
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Mood */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">😊 Mood (1-10)</label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={todayEntry.mood}
                  onChange={(e) => updateEntry("mood", Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{todayEntry.mood}/10</div>
              </div>

              {/* Energy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">⚡ Energy (1-10)</label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={todayEntry.energy}
                  onChange={(e) => updateEntry("energy", Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{todayEntry.energy}/10</div>
              </div>

              {/* Sleep */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Sleep Hours
                </label>
                <Input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={todayEntry.sleep}
                  onChange={(e) => updateEntry("sleep", Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Water */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Water Glasses
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateEntry("water", Math.max(0, todayEntry.water - 1))}
                  >
                    -
                  </Button>
                  <span className="flex-1 text-center font-medium">{todayEntry.water}</span>
                  <Button variant="outline" size="sm" onClick={() => updateEntry("water", todayEntry.water + 1)}>
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Daily Activities</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayEntry.exercise}
                      onChange={(e) => updateEntry("exercise", e.target.checked)}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm text-gray-700">💪 Exercise/Movement</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={todayEntry.meditation}
                      onChange={(e) => updateEntry("meditation", e.target.checked)}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-sm text-gray-700">🧘 Meditation/Mindfulness</span>
                  </label>
                </div>
              </div>

              {/* Gratitude */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800">Gratitude (up to 3)</h3>
                <div className="space-y-2">
                  {todayEntry.gratitude.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 flex-1">✨ {item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGratitude(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  {todayEntry.gratitude.length < 3 && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="What are you grateful for?"
                        value={newGratitude}
                        onChange={(e) => setNewGratitude(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addGratitude()}
                        className="flex-1"
                      />
                      <Button onClick={addGratitude} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800">Daily Reflection</h3>
              <Textarea
                placeholder="How are you feeling today? Any insights or reflections..."
                value={todayEntry.notes}
                onChange={(e) => updateEntry("notes", e.target.value)}
                className="min-h-20"
              />
            </div>
          </Card>
        </motion.div>

        {/* Wellness Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              Wellness Goals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{goal.icon}</span>
                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Weekly Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              Weekly Averages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{getWeeklyAverage("mood")}</div>
                <div className="text-sm text-gray-600">Average Mood</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{getWeeklyAverage("energy")}</div>
                <div className="text-sm text-gray-600">Average Energy</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{getWeeklyAverage("sleep")}h</div>
                <div className="text-sm text-gray-600">Average Sleep</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{getWeeklyAverage("water")}</div>
                <div className="text-sm text-gray-600">Daily Water</div>
              </div>
            </div>

            {/* Wellness Tips */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">💡 Personalized Wellness Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                {todayEntry.water < 6 && <p>• Try setting hourly reminders to drink more water throughout the day</p>}
                {todayEntry.sleep < 7 && <p>• Consider establishing a bedtime routine for better sleep quality</p>}
                {!todayEntry.exercise && <p>• Even a 10-minute walk can boost your mood and energy levels</p>}
                {!todayEntry.meditation && <p>• Try 5 minutes of deep breathing or meditation to reduce stress</p>}
                <p>• Remember: small consistent steps lead to big wellness wins! 🌟</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
