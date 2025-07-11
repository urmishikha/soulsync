"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Type, Palette, Sticker, Save, Download, Trash2, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PersonaSelector, personas, type AIPersona } from "@/components/persona-selector"
import { ThemeSelector, themes, type AestheticTheme } from "@/components/theme-selector"
import { TemplateGallery, type JournalTemplate } from "@/components/template-gallery"
import { StorageService } from "@/lib/storage-service"

interface JournalElement {
  id: string
  type: "text" | "image" | "sticker" | "mood"
  content: string
  position: { x: number; y: number }
  size?: { width: number; height: number }
  style?: any
}

const backgrounds = [
  { name: "Paper", class: "bg-amber-50", pattern: "paper" },
  { name: "Grid", class: "bg-blue-50", pattern: "grid" },
  { name: "Dots", class: "bg-purple-50", pattern: "dots" },
  { name: "Floral", class: "bg-pink-50", pattern: "floral" },
]

export default function JournalPage() {
  const [selectedPersona, setSelectedPersona] = useState<AIPersona>(personas[0])
  const [selectedTheme, setSelectedTheme] = useState<AestheticTheme>(themes[0])
  const [elements, setElements] = useState<JournalElement[]>([
    {
      id: "1",
      type: "mood",
      content: `${selectedPersona.emoji} Feeling inspired today!`,
      position: { x: 50, y: 50 },
    },
  ])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [currentBackground, setCurrentBackground] = useState(backgrounds[0])
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [showPersonaSelector, setShowPersonaSelector] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [currentEntryId] = useState(() => `entry_${Date.now()}`)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Load saved preferences
  useEffect(() => {
    const preferences = StorageService.getPreferences()
    if (preferences) {
      const savedPersona = personas.find((p) => p.id === preferences.selectedPersona)
      const savedTheme = themes.find((t) => t.id === preferences.selectedTheme)

      if (savedPersona) setSelectedPersona(savedPersona)
      if (savedTheme) setSelectedTheme(savedTheme)
    }
  }, [])

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      saveJournalEntry()
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveTimer)
  }, [elements, selectedPersona, selectedTheme])

  const addElement = (type: JournalElement["type"], content = "") => {
    const newElement: JournalElement = {
      id: Date.now().toString(),
      type,
      content: content || (type === "text" ? "Click to edit..." : ""),
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const updateElement = (id: string, updates: Partial<JournalElement>) => {
    setElements(elements.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id))
    setSelectedElement(null)
  }

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedElement(elementId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!draggedElement || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    updateElement(draggedElement, {
      position: { x: Math.max(0, x - 50), y: Math.max(0, y - 25) },
    })
    setDraggedElement(null)
  }

  const applyTemplate = (template: JournalTemplate) => {
    setElements(
      template.elements.map((el) => ({
        ...el,
        id: Date.now().toString() + Math.random().toString(),
      })),
    )
  }

  const saveJournalEntry = () => {
    const textContent = elements
      .filter((el) => el.type === "text")
      .map((el) => el.content)
      .join(" ")

    const moodElements = elements.filter((el) => el.type === "mood").map((el) => el.content)

    const entry = {
      id: currentEntryId,
      date: new Date().toISOString(),
      mood: moodElements[0] || "✨ Inspired",
      content: textContent,
      elements: elements,
      persona: selectedPersona.id,
      theme: selectedTheme.id,
    }

    StorageService.saveJournalEntry(entry)
    setLastSaved(new Date())
  }

  const exportJournalEntry = () => {
    const data = StorageService.exportData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `soulsync-journal-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${selectedTheme.colors.background}`}>
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
              <h1 className={`font-semibold ${selectedTheme.colors.text} ${selectedTheme.fonts.heading}`}>
                Today's Page
              </h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {lastSaved && <p className="text-xs text-gray-500">Last saved: {lastSaved.toLocaleTimeString()}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonaSelector(true)}
              className="bg-white/70 backdrop-blur-sm border-0"
            >
              {selectedPersona.emoji} {selectedPersona.name}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowThemeSelector(true)}
              className="bg-white/70 backdrop-blur-sm border-0"
            >
              <Palette className="w-4 h-4 mr-2" />
              {selectedTheme.name}
            </Button>
            <Button variant="outline" size="sm" onClick={saveJournalEntry}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportJournalEntry}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Tools Sidebar */}
        <AnimatePresence>
          {toolsOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-16 bottom-0 w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 z-40 overflow-y-auto"
            >
              <div className="p-4 space-y-6">
                {/* Templates */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Templates
                  </h3>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setShowTemplateGallery(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>

                {/* Text Tools */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Text & Writing
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addElement("text")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Text Box
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => addElement("text", "Dear diary...")}
                    >
                      📝 Journal Entry
                    </Button>
                  </div>
                </div>

                {/* Persona Stickers */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Sticker className="w-4 h-4" />
                    {selectedPersona.name} Stickers
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedPersona.stickers.map((sticker, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="h-10 w-10 p-0 text-lg hover:scale-110 transition-transform"
                        onClick={() => addElement("sticker", sticker)}
                      >
                        {sticker}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Theme Stickers */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    {selectedTheme.name} Stickers
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {selectedTheme.stickers.map((sticker, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="h-10 w-10 p-0 text-lg hover:scale-110 transition-transform"
                        onClick={() => addElement("sticker", sticker)}
                      >
                        {sticker}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Backgrounds */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Backgrounds
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {backgrounds.map((bg, index) => (
                      <Button
                        key={index}
                        variant={currentBackground.name === bg.name ? "default" : "outline"}
                        className="h-12 justify-start"
                        onClick={() => setCurrentBackground(bg)}
                      >
                        <div className={`w-4 h-4 rounded mr-2 ${bg.class}`} />
                        {bg.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quick Mood */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Quick Mood</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { emoji: "😊", label: "Happy" },
                      { emoji: "😌", label: "Calm" },
                      { emoji: "✨", label: "Inspired" },
                      { emoji: "💭", label: "Thoughtful" },
                    ].map((mood, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12 flex-col gap-1 text-xs bg-transparent"
                        onClick={() => addElement("mood", `${mood.emoji} ${mood.label}`)}
                      >
                        <span className="text-lg">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Canvas */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {/* Canvas Controls */}
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant={toolsOpen ? "default" : "outline"}
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Tools
              </Button>

              {selectedElement && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Badge variant="secondary">Element selected</Badge>
                  <Button variant="outline" size="sm" onClick={() => deleteElement(selectedElement)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Journal Canvas */}
            <Card className="relative min-h-[600px] bg-white/70 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <div
                ref={canvasRef}
                className="relative w-full h-full p-8"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ minHeight: "600px" }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  {currentBackground.pattern === "grid" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  )}
                  {currentBackground.pattern === "dots" && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  )}
                </div>

                {/* Journal Elements */}
                <AnimatePresence>
                  {elements.map((element) => (
                    <motion.div
                      key={element.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute cursor-move select-none ${
                        selectedElement === element.id ? "ring-2 ring-purple-400 ring-opacity-50" : ""
                      }`}
                      style={{
                        left: element.position.x,
                        top: element.position.y,
                        transform: draggedElement === element.id ? "rotate(5deg)" : "none",
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, element.id)}
                      onClick={() => setSelectedElement(element.id)}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ scale: 1.05, rotate: 5 }}
                    >
                      {element.type === "text" && (
                        <div className="bg-white/80 rounded-lg p-3 shadow-sm min-w-32">
                          {selectedElement === element.id ? (
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateElement(element.id, { content: e.target.value })}
                              className={`border-0 bg-transparent resize-none p-0 focus:ring-0 ${selectedTheme.fonts.body}`}
                              autoFocus
                              onBlur={() => setSelectedElement(null)}
                            />
                          ) : (
                            <p
                              className={`${selectedTheme.colors.text} whitespace-pre-wrap ${selectedTheme.fonts.body}`}
                            >
                              {element.content}
                            </p>
                          )}
                        </div>
                      )}

                      {element.type === "sticker" && (
                        <div className="text-3xl hover:scale-110 transition-transform">{element.content}</div>
                      )}

                      {element.type === "mood" && (
                        <div
                          className={`bg-gradient-to-r ${selectedTheme.colors.secondary} rounded-full px-4 py-2 shadow-sm`}
                        >
                          <span className={`text-sm font-medium ${selectedTheme.colors.text}`}>{element.content}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Empty State */}
                {elements.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="text-center text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Your creative canvas awaits</p>
                      <p className="text-sm">Click "Tools" to start decorating your journal page</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PersonaSelector
        selectedPersona={selectedPersona}
        onPersonaChange={setSelectedPersona}
        isOpen={showPersonaSelector}
        onClose={() => setShowPersonaSelector(false)}
      />

      <ThemeSelector
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
      />

      <TemplateGallery
        onTemplateSelect={applyTemplate}
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
      />
    </div>
  )
}
