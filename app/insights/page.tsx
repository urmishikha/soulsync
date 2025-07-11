"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, TrendingUp, Calendar, Heart, Brain, Target, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { StorageService } from "@/lib/storage-service"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const moodColors = {
  "✨ Inspired": "#8B5CF6",
  "🌸 Peaceful": "#10B981",
  "☀️ Energetic": "#F59E0B",
  "🌙 Reflective": "#6366F1",
  "💖 Happy": "#EC4899",
  "😌 Calm": "#06B6D4",
  "💭 Thoughtful": "#8B5A2B",
}

export default function InsightsPage() {
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: string; date: string; timestamp: number }>>([])
  const [journalEntries, setJournalEntries] = useState<any[]>([])
  const [insights, setInsights] = useState({
    totalEntries: 0,
    streakDays: 0,
    dominantMood: "",
    moodDistribution: [] as Array<{ name: string; value: number; color: string }>,
    weeklyTrend: [] as Array<{ date: string; mood: string; score: number }>,
  })

  useEffect(() => {
    loadInsights()
  }, [])

  const loadInsights = () => {
    const history = StorageService.getMoodHistory()
    const entries = StorageService.getJournalEntries()

    setMoodHistory(history)
    setJournalEntries(entries)

    // Calculate insights
    const moodCounts = history.reduce(
      (acc, entry) => {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "✨ Inspired"

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood,
      value: count,
      color: moodColors[mood as keyof typeof moodColors] || "#8B5CF6",
    }))

    // Calculate streak
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let streak = 0
    let currentDate = new Date()

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    // Weekly trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const weeklyTrend = last7Days.map((date) => {
      const dayEntries = history.filter((entry) => entry.date.startsWith(date))
      const avgMoodScore =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / dayEntries.length
          : 0

      return {
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        mood: dayEntries[0]?.mood || "",
        score: avgMoodScore,
      }
    })

    setInsights({
      totalEntries: entries.length,
      streakDays: streak,
      dominantMood,
      moodDistribution,
      weeklyTrend,
    })
  }

  const getMoodScore = (mood: string): number => {
    const scores: Record<string, number> = {
      "💖 Happy": 5,
      "✨ Inspired": 4.5,
      "☀️ Energetic": 4,
      "🌸 Peaceful": 3.5,
      "😌 Calm": 3,
      "💭 Thoughtful": 2.5,
      "🌙 Reflective": 2,
    }
    return scores[mood] || 3
  }

  const exportInsights = () => {
    const data = {
      insights,
      moodHistory,
      journalEntries: journalEntries.map((entry) => ({
        date: entry.date,
        mood: entry.mood,
        wordCount: entry.content?.length || 0,
      })),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `soulsync-insights-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
              <h1 className="font-semibold text-gray-800">Mood Analytics</h1>
              <p className="text-sm text-gray-600">Discover patterns in your emotional journey</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={exportInsights}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{insights.totalEntries}</p>
                <p className="text-sm text-gray-600">Total Entries</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{insights.streakDays}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">{insights.dominantMood}</p>
                <p className="text-sm text-gray-600">Dominant Mood</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{moodHistory.length}</p>
                <p className="text-sm text-gray-600">Mood Entries</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Mood Trend */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Mood Trend
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insights.weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis domain={[0, 5]} stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Mood Distribution */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Mood Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insights.moodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {insights.moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Patterns */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Recent Patterns & Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Most Active Day */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Most Active Day</h4>
                <p className="text-sm text-gray-600">
                  {moodHistory.length > 0
                    ? new Date(moodHistory[0].date).toLocaleDateString("en-US", { weekday: "long" })
                    : "No data yet"}
                </p>
              </div>

              {/* Average Mood Score */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Average Mood</h4>
                <p className="text-sm text-gray-600">
                  {moodHistory.length > 0
                    ? `${(moodHistory.reduce((sum, entry) => sum + getMoodScore(entry.mood), 0) / moodHistory.length).toFixed(1)}/5.0`
                    : "No data yet"}
                </p>
              </div>

              {/* Journaling Frequency */}
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Journal Frequency</h4>
                <p className="text-sm text-gray-600">
                  {journalEntries.length > 0
                    ? `${(journalEntries.length / 7).toFixed(1)} entries/week`
                    : "Start journaling!"}
                </p>
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">✨ Personalized Recommendations</h4>
              <div className="space-y-2">
                {insights.dominantMood.includes("Reflective") && (
                  <Badge variant="outline" className="mr-2">
                    Try morning journaling for clarity
                  </Badge>
                )}
                {insights.streakDays < 3 && (
                  <Badge variant="outline" className="mr-2">
                    Set daily reminders to build consistency
                  </Badge>
                )}
                {insights.totalEntries > 10 && (
                  <Badge variant="outline" className="mr-2">
                    Explore mood patterns with themes
                  </Badge>
                )}
                <Badge variant="outline" className="mr-2">
                  Share insights with your wellness journey
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
