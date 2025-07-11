interface WeatherData {
  temperature: number
  description: string
  icon: string
  location: string
}

export async function getWeatherData(): Promise<WeatherData> {
  try {
    // Get user's location
    const position = await getCurrentPosition()
    const { latitude, longitude } = position.coords

    // In a real app, you'd use your OpenWeatherMap API key
    // For demo purposes, we'll simulate the API call
    const mockWeatherData = {
      temperature: Math.floor(Math.random() * 30) + 60, // 60-90°F
      description: ["Sunny", "Partly Cloudy", "Clear", "Overcast"][Math.floor(Math.random() * 4)],
      icon: "☀️",
      location: "Your Location",
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return mockWeatherData
  } catch (error) {
    // Fallback weather data
    return {
      temperature: 72,
      description: "Sunny",
      icon: "☀️",
      location: "Your Location",
    }
  }
}

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      enableHighAccuracy: true,
    })
  })
}
