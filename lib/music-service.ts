interface Song {
  title: string
  artist: string
  preview_url?: string
  mood: string
  energy: number
}

export async function getTodaysVibeMusic(mood: string): Promise<Song> {
  // Simulate Spotify API call based on mood
  const moodPlaylists = {
    Inspired: [
      { title: "Golden Hour", artist: "Jvke", mood: "uplifting", energy: 0.8 },
      { title: "Sunflower", artist: "Post Malone", mood: "creative", energy: 0.7 },
      { title: "Good 4 U", artist: "Olivia Rodrigo", mood: "energetic", energy: 0.9 },
    ],
    Peaceful: [
      { title: "Weightless", artist: "Marconi Union", mood: "calm", energy: 0.2 },
      { title: "River", artist: "Leon Bridges", mood: "serene", energy: 0.3 },
      { title: "Holocene", artist: "Bon Iver", mood: "reflective", energy: 0.4 },
    ],
    Energetic: [
      { title: "Levitating", artist: "Dua Lipa", mood: "upbeat", energy: 0.95 },
      { title: "Heat Waves", artist: "Glass Animals", mood: "vibrant", energy: 0.85 },
      { title: "Stay", artist: "The Kid LAROI", mood: "dynamic", energy: 0.9 },
    ],
    Reflective: [
      { title: "The Night We Met", artist: "Lord Huron", mood: "contemplative", energy: 0.3 },
      { title: "Skinny Love", artist: "Bon Iver", mood: "introspective", energy: 0.25 },
      { title: "Mad World", artist: "Gary Jules", mood: "melancholic", energy: 0.2 },
    ],
  }

  const songs = moodPlaylists[mood as keyof typeof moodPlaylists] || moodPlaylists["Inspired"]
  const randomSong = songs[Math.floor(Math.random() * songs.length)]

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return randomSong
}

export function playPreview(song: Song) {
  // In a real app, this would use Spotify Web Playback SDK
  console.log(`Playing preview of ${song.title} by ${song.artist}`)

  // For demo, we'll just show a notification
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`🎵 Now Playing: ${song.title}`, {
      body: `by ${song.artist}`,
      icon: "/music-icon.png",
    })
  }
}
