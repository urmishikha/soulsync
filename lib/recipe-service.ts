interface Recipe {
  title: string
  description: string
  ingredients: string[]
  cookTime: string
  difficulty: "Easy" | "Medium" | "Hard"
  mood: string
  healthScore: number
}

export async function getMoodBasedRecipe(mood: string, weather: string): Promise<Recipe> {
  // Simulate Spoonacular API call
  const moodRecipes = {
    Inspired: [
      {
        title: "Rainbow Acai Bowl",
        description: "Vibrant and energizing superfood bowl",
        ingredients: ["Acai puree", "Fresh berries", "Granola", "Coconut flakes", "Honey"],
        cookTime: "10 mins",
        difficulty: "Easy" as const,
        mood: "creative",
        healthScore: 95,
      },
      {
        title: "Matcha Chia Pudding",
        description: "Zen-inspired green goodness",
        ingredients: ["Chia seeds", "Matcha powder", "Coconut milk", "Maple syrup"],
        cookTime: "5 mins + overnight",
        difficulty: "Easy" as const,
        mood: "focused",
        healthScore: 90,
      },
    ],
    Peaceful: [
      {
        title: "Chamomile Honey Oats",
        description: "Soothing and comforting breakfast",
        ingredients: ["Oats", "Chamomile tea", "Honey", "Almonds", "Cinnamon"],
        cookTime: "15 mins",
        difficulty: "Easy" as const,
        mood: "calm",
        healthScore: 85,
      },
    ],
    Energetic: [
      {
        title: "Power Green Smoothie",
        description: "Energizing blend of superfoods",
        ingredients: ["Spinach", "Banana", "Mango", "Protein powder", "Coconut water"],
        cookTime: "5 mins",
        difficulty: "Easy" as const,
        mood: "energetic",
        healthScore: 92,
      },
    ],
  }

  const recipes = moodRecipes[mood as keyof typeof moodRecipes] || moodRecipes["Inspired"]
  const recipe = recipes[Math.floor(Math.random() * recipes.length)]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return recipe
}
