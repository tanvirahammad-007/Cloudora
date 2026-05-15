const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Fallback high-quality images if API key is missing
const FALLBACK_IMAGES: Record<string, string> = {
  clear: "https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&q=80&w=1200",
  clouds: "https://images.unsplash.com/photo-1534088568595-a066f7104211?auto=format&fit=crop&q=80&w=1200",
  rain: "https://images.unsplash.com/photo-1534274988757-a28bf1f5a4b7?auto=format&fit=crop&q=80&w=1200",
  snow: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?auto=format&fit=crop&q=80&w=1200",
  storm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&q=80&w=1200",
  mist: "https://images.unsplash.com/photo-1543968332-f99478b1ebdc?auto=format&fit=crop&q=80&w=1200",
  default: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=1200",
};

export const unsplashService = {
  getWeatherImage: async (query: string): Promise<string> => {
    const formattedQuery = encodeURIComponent(query.toLowerCase());
    
    if (!ACCESS_KEY) {
      if (formattedQuery.includes('clear')) return FALLBACK_IMAGES.clear;
      if (formattedQuery.includes('cloud')) return FALLBACK_IMAGES.clouds;
      if (formattedQuery.includes('rain') || formattedQuery.includes('drizzle')) return FALLBACK_IMAGES.rain;
      if (formattedQuery.includes('snow')) return FALLBACK_IMAGES.snow;
      if (formattedQuery.includes('thunder') || formattedQuery.includes('storm')) return FALLBACK_IMAGES.storm;
      if (formattedQuery.includes('mist') || formattedQuery.includes('fog')) return FALLBACK_IMAGES.mist;
      return FALLBACK_IMAGES.default;
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${formattedQuery}&orientation=landscape&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );
      const data = await response.json();
      return data.results[0]?.urls?.regular || FALLBACK_IMAGES.default;
    } catch (error) {
      console.error('Unsplash fetch error:', error);
      return FALLBACK_IMAGES.default;
    }
  }
};
