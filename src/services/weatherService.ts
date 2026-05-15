import axios from 'axios';
import { WeatherData, CitySuggestion, CountryDetails } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_BASE_URL = 'https://api.openweathermap.org/geo/1.0';
const AIR_QUALITY_BASE_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';
const COUNTRIES_BASE_URL = 'https://restcountries.com/v3.1';

export const weatherService = {
  async getWeatherData(lat: number, lon: number, cityName: string): Promise<WeatherData> {
    if (!API_KEY) {
      console.warn('OpenWeatherMap API Key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
    }

    const [currentRes, forecastRes, aqiRes] = await Promise.all([
      axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: { lat, lon, units: 'metric', appid: API_KEY },
      }),
      axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: { lat, lon, units: 'metric', appid: API_KEY },
      }),
      axios.get(AIR_QUALITY_BASE_URL, {
        params: { lat, lon, appid: API_KEY },
      }),
    ]);

    const countryCode = currentRes.data.sys.country;
    let countryDetails: CountryDetails | undefined;

    try {
      const countryRes = await axios.get(`${COUNTRIES_BASE_URL}/alpha/${countryCode}`);
      const c = countryRes.data[0];
      countryDetails = {
        name: c.name.common,
        capital: c.capital?.[0] || 'N/A',
        region: c.region,
        population: c.population,
        languages: Object.values(c.languages || {}),
        currencies: Object.values(c.currencies || {}).map((curr: any) => `${curr.name} (${curr.symbol})`),
        flag: c.flags.svg,
        timezones: c.timezones,
      };
    } catch (err) {
      console.error('Failed to fetch country details', err);
    }

    const dailyData: Record<string, any> = {};
    forecastRes.data.list.forEach((item: any) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          maxTemp: item.main.temp_max,
          minTemp: item.main.temp_min,
          weatherCode: item.weather[0].id,
          condition: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      } else {
        dailyData[date].maxTemp = Math.max(dailyData[date].maxTemp, item.main.temp_max);
        dailyData[date].minTemp = Math.min(dailyData[date].minTemp, item.main.temp_min);
      }
    });

    return {
      current: {
        temp: Math.round(currentRes.data.main.temp),
        feelsLike: Math.round(currentRes.data.main.feels_like),
        humidity: currentRes.data.main.humidity,
        windSpeed: currentRes.data.wind.speed,
        weatherCode: currentRes.data.weather[0].id,
        isDay: currentRes.data.weather[0].icon.includes('d'),
        condition: currentRes.data.weather[0].main,
        precipitation: currentRes.data.rain?.['1h'] || currentRes.data.snow?.['1h'] || 0,
        icon: currentRes.data.weather[0].icon,
        sunrise: currentRes.data.sys.sunrise,
        sunset: currentRes.data.sys.sunset,
      },
      hourly: forecastRes.data.list.slice(0, 24).map((item: any) => ({
        time: item.dt_txt,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        weatherCode: item.weather[0].id,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
      })),
      daily: Object.values(dailyData).slice(0, 7),
      aqi: {
        european: aqiRes.data.list[0].main.aqi,
        us: aqiRes.data.list[0].main.aqi, // OpenWeather simple AQI is 1-5
        pm10: aqiRes.data.list[0].components.pm10,
        pm25: aqiRes.data.list[0].components.pm2_5,
        co: aqiRes.data.list[0].components.co,
        no2: aqiRes.data.list[0].components.no2,
      },
      location: {
        name: cityName,
        country: countryCode,
        lat,
        lon,
        timezone: currentRes.data.timezone.toString(),
      },
      countryDetails,
    };
  },

  async searchCities(query: string): Promise<CitySuggestion[]> {
    if (!query || query.length < 2 || !API_KEY) return [];
    const res = await axios.get(`${GEO_BASE_URL}/direct`, {
      params: { q: query, limit: 10, appid: API_KEY },
    });
    return res.data.map((item: any, i: number) => ({
      id: i,
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    }));
  },

  async getCurrentWeatherSummary(lat: number, lon: number) {
    if (!API_KEY) return null;
    const res = await axios.get(`${WEATHER_BASE_URL}/weather`, {
      params: { lat, lon, units: 'metric', appid: API_KEY },
    });
    return {
      temp: Math.round(res.data.main.temp),
      condition: res.data.weather[0].main,
      icon: res.data.weather[0].icon,
      humidity: res.data.main.humidity,
      windSpeed: res.data.wind.speed,
      lastUpdated: new Date().toISOString(),
    };
  }
};
