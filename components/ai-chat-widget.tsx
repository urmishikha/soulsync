"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPersonalizedResponse } from "@/lib/ai-service"
import type { AIPersona } from "@/components/persona-selector"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  persona?: AIPersona
}

interface AIChatWidgetProps {
  selectedPersona: AIPersona
  context?: string
  suggestions?: string[]
}

export function AIChatWidget({ selectedPersona, context, suggestions = [] }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize with a welcome message when persona changes
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: `welcome_${Date.now()}`,
        content: `Hey there! ${selectedPersona.emoji} I'm your ${selectedPersona.name}! ${selectedPersona.sampleResponse}`,
        sender: "ai",
        timestamp: new Date(),
        persona: selectedPersona,
      }
      setMessages([welcomeMessage])
    }
  }, [selectedPersona, isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const aiResponse = await getPersonalizedResponse(
        selectedPersona,
        "inspired",
        null,
        `${context || ""} User message: ${inputValue}`,
      )

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        content: aiResponse.message,
        sender: "ai",
        timestamp: new Date(),
        persona: selectedPersona,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        content: "Oops! I'm having trouble connecting right now. Try again in a moment! 💫",
        sender: "ai",
        timestamp: new Date(),
        persona: selectedPersona,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div className="fixed bottom-6 right-6 z-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg bg-gradient-to-r ${selectedPersona.colors.primary} hover:shadow-xl transition-all duration-300`}
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 h-96 z-50"
          >
            <Card className="h-full flex flex-col bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              {/* Header */}
              <div className={`p-4 bg-gradient-to-r ${selectedPersona.colors.primary} rounded-t-lg`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{selectedPersona.emoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{selectedPersona.name}</h3>
                    <p className="text-xs text-white/80">{selectedPersona.description}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : `bg-gradient-to-r ${selectedPersona.colors.secondary} text-gray-800`
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${selectedPersona.colors.secondary}`}>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 text-xs"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Chat with ${selectedPersona.name}...`}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className={`bg-gradient-to-r ${selectedPersona.colors.primary}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
