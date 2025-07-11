import type { AIPersona } from "@/components/persona-selector"

interface AIResponse {
  message: string
  suggestions: string[]
  mood: string
}

export async function getPersonalizedResponse(
  persona: AIPersona,
  mood: string,
  weather: any,
  context?: string,
): Promise<AIResponse> {
  // Simulate OpenAI GPT-4 API call with persona-specific prompts
  const personaPrompts = {
    "soft-girl": {
      style: "sweet, nurturing, uses lots of emojis and soft language",
      suggestions: ["self-care routine", "cozy activities", "aesthetic photos", "gentle movement"],
    },
    "chaotic-neutral": {
      style: "witty, unpredictable, uses dark humor and unexpected insights",
      suggestions: ["weird experiments", "random adventures", "unconventional art", "midnight snacks"],
    },
    "wellness-bestie": {
      style: "mindful, grounding, focuses on balance and holistic health",
      suggestions: ["meditation", "herbal tea", "nature walks", "breathwork"],
    },
    "indie-overthinker": {
      style: "introspective, artistic, references music and literature",
      suggestions: ["journaling", "indie music", "poetry", "philosophical thoughts"],
    },
    "minimalist-ai": {
      style: "clean, efficient, precise and focused",
      suggestions: ["decluttering", "focused work", "simple pleasures", "mindful consumption"],
    },
  }

  const personaConfig = personaPrompts[persona.id as keyof typeof personaPrompts]

  // Generate response based on persona, mood, and weather
  const responses = generatePersonaResponse(persona, mood, weather, personaConfig)

  await new Promise((resolve) => setTimeout(resolve, 1200)) // Simulate API delay

  return responses[Math.floor(Math.random() * responses.length)]
}

function generatePersonaResponse(persona: AIPersona, mood: string, weather: any, config: any): AIResponse[] {
  const baseResponses = {
    "soft-girl": [
      {
        message: `Aww babe, you're absolutely glowing today! ✨ The ${weather.description.toLowerCase()} weather is giving me major cozy vibes. Maybe try some strawberry matcha and that cute floral dress? 🌸💕`,
        suggestions: [
          "Take aesthetic photos",
          "Make a cozy playlist",
          "Try a new skincare routine",
          "Write in your journal",
        ],
        mood: "nurturing",
      },
    ],
    "chaotic-neutral": [
      {
        message: `Mood: cryptid energy 💀 Today's vibe is 'feral but make it fashion.' The ${weather.description} is either a sign from the universe or just weather - you decide. Try that weird recipe you bookmarked at 3am.`,
        suggestions: [
          "Experiment with chaos",
          "Try something completely random",
          "Make art with unconventional materials",
          "Text that person",
        ],
        mood: "unpredictable",
      },
    ],
    "wellness-bestie": [
      {
        message: `Take a deep breath, love 🌿 Your energy feels scattered today, but that's okay. The ${weather.description.toLowerCase()} weather is perfect for some grounding activities. How about some herbal tea and gentle stretching?`,
        suggestions: ["Practice mindfulness", "Go for a nature walk", "Try breathwork", "Prepare nourishing food"],
        mood: "grounding",
      },
    ],
    "indie-overthinker": [
      {
        message: `That Phoebe Bridgers song hits different today, doesn't it? 🎵 The ${weather.description.toLowerCase()} weather matches your contemplative mood perfectly. Maybe journal about that feeling while it's still raw.`,
        suggestions: ["Listen to indie music", "Write poetry", "Read philosophy", "Take moody photos"],
        mood: "introspective",
      },
    ],
    "minimalist-ai": [
      {
        message: `Status: Optimal. Weather: ${weather.description}. Suggestion: Green tea + focused work session. Current efficiency: 87%. Recommendation: Embrace simplicity today.`,
        suggestions: ["Declutter space", "Focus on one task", "Practice minimalism", "Optimize routine"],
        mood: "focused",
      },
    ],
  }

  return baseResponses[persona.id as keyof typeof baseResponses] || baseResponses["soft-girl"]
}
