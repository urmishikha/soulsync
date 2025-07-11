interface CreativePrompt {
  activity: string
  description: string
  materials: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  timeEstimate: string
  mood: string
  category: "Art" | "Writing" | "Craft" | "Digital" | "Music"
}

export async function getCreativePrompt(mood: string, theme: string): Promise<CreativePrompt> {
  const prompts = {
    Inspired: [
      {
        activity: "Watercolor Sunset Painting",
        description: "Paint a dreamy sunset with flowing watercolor techniques",
        materials: ["Watercolor paints", "Watercolor paper", "Brushes", "Water container"],
        difficulty: "Beginner" as const,
        timeEstimate: "45-60 mins",
        mood: "creative",
        category: "Art" as const,
      },
      {
        activity: "Vision Board Collage",
        description: "Create a visual representation of your dreams and goals",
        materials: ["Magazines", "Scissors", "Glue", "Poster board", "Markers"],
        difficulty: "Beginner" as const,
        timeEstimate: "30-45 mins",
        mood: "aspirational",
        category: "Craft" as const,
      },
    ],
    Peaceful: [
      {
        activity: "Zen Garden Sketch",
        description: "Draw a peaceful garden scene with mindful attention to detail",
        materials: ["Pencils", "Paper", "Eraser", "Blending stump"],
        difficulty: "Intermediate" as const,
        timeEstimate: "60-90 mins",
        mood: "meditative",
        category: "Art" as const,
      },
    ],
    Energetic: [
      {
        activity: "Abstract Expression Painting",
        description: "Let your energy flow through bold colors and dynamic brushstrokes",
        materials: ["Acrylic paints", "Canvas", "Large brushes", "Palette knife"],
        difficulty: "Intermediate" as const,
        timeEstimate: "45-75 mins",
        mood: "dynamic",
        category: "Art" as const,
      },
    ],
  }

  const moodPrompts = prompts[mood as keyof typeof prompts] || prompts["Inspired"]
  const prompt = moodPrompts[Math.floor(Math.random() * moodPrompts.length)]

  await new Promise((resolve) => setTimeout(resolve, 500))

  return prompt
}
