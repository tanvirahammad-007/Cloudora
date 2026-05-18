const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API || import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const imageCache = new Map<string, string>();

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

const LOCATION_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80&w=1200",
];

const WEATHER_QUERY_FALLBACK: Record<string, string> = {
  clear: FALLBACK_IMAGES.clear,
  clouds: FALLBACK_IMAGES.clouds,
  rain: FALLBACK_IMAGES.rain,
  snow: FALLBACK_IMAGES.snow,
  storm: FALLBACK_IMAGES.storm,
  mist: FALLBACK_IMAGES.mist,
};

const hashText = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const getLocationFallbackImage = (seed: string) => {
  return LOCATION_FALLBACK_IMAGES[hashText(seed) % LOCATION_FALLBACK_IMAGES.length];
};

const getWeatherFallbackImage = (query: string) => {
  const normalized = query.toLowerCase();
  if (normalized.includes('clear') || normalized.includes('sun')) return WEATHER_QUERY_FALLBACK.clear;
  if (normalized.includes('cloud')) return WEATHER_QUERY_FALLBACK.clouds;
  if (normalized.includes('rain') || normalized.includes('drizzle')) return WEATHER_QUERY_FALLBACK.rain;
  if (normalized.includes('snow')) return WEATHER_QUERY_FALLBACK.snow;
  if (normalized.includes('thunder') || normalized.includes('storm')) return WEATHER_QUERY_FALLBACK.storm;
  if (normalized.includes('mist') || normalized.includes('fog') || normalized.includes('haze')) return WEATHER_QUERY_FALLBACK.mist;
  return FALLBACK_IMAGES.default;
};

export const unsplashService = {
  getWeatherImage: async (query: string, page = 1): Promise<string> => {
    const normalizedQuery = query.toLowerCase().trim();
    const formattedQuery = encodeURIComponent(normalizedQuery);
    const cacheKey = `${formattedQuery}-${page}`;

    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage) return cachedImage;
    
    if (!ACCESS_KEY) {
      return getWeatherFallbackImage(query);
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${formattedQuery}&orientation=landscape&per_page=1&page=${page}&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );
      if (!response.ok) return getWeatherFallbackImage(query);

      const data = await response.json();
      const image = data.results?.[0]?.urls?.regular || getWeatherFallbackImage(query);
      imageCache.set(cacheKey, image);
      return image;
    } catch (error) {
      console.error('Unsplash fetch error:', error);
      return getWeatherFallbackImage(query);
    }
  },

  getWeatherImageCandidates: async (query: string, page = 1): Promise<string[]> => {
    const fallback = getWeatherFallbackImage(query);

    if (!ACCESS_KEY) return [fallback];

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query.toLowerCase().trim())}&orientation=landscape&per_page=5&page=${page}&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) return [fallback];

      const data = await response.json();
      const images = (data.results || [])
        .map((result: any) => result?.urls?.regular)
        .filter(Boolean);

      return [...images, fallback];
    } catch (error) {
      console.error('Unsplash fetch error:', error);
      return [fallback];
    }
  },

  getLocationImage: async (city: string, country: string, condition: string, lat: number, lon: number): Promise<string> => {
    const seed = `${city}-${country}-${condition}-${lat.toFixed(2)}-${lon.toFixed(2)}`;
    const cacheKey = `location-${seed}`;
    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage) return cachedImage;

    if (!ACCESS_KEY) {
      const fallback = getLocationFallbackImage(seed);
      imageCache.set(cacheKey, fallback);
      return fallback;
    }

    const page = (hashText(seed) % 10) + 1;
    const query = `${city} ${country} landmark city skyline ${condition} weather`;
    const image = await unsplashService.getWeatherImage(query, page);
    const resolvedImage = image === FALLBACK_IMAGES.default ? getLocationFallbackImage(seed) : image;
    imageCache.set(cacheKey, resolvedImage);
    return resolvedImage;
  },

  getLocationImageCandidates: async (city: string, country: string, condition: string, lat: number, lon: number): Promise<string[]> => {
    const seed = `${city}-${country}-${condition}-${lat.toFixed(2)}-${lon.toFixed(2)}`;
    const page = (hashText(seed) % 5) + 1;
    const query = `${city} ${country} landmark city skyline ${condition} weather`;
    const fallback = getLocationFallbackImage(seed);
    const candidates = await unsplashService.getWeatherImageCandidates(query, page);
    return [...new Set([...candidates, fallback, FALLBACK_IMAGES.default])];
  }
};
