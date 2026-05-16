import { WeatherData, CitySuggestion, CountryDetails } from '../types/weather';
import { createAppError } from '../lib/errorUtils';
import { countryApiClient, geoApiClient, weatherApiClient } from './apiClient';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export const weatherService = {
  async getWeatherData(lat: number, lon: number, cityName: string): Promise<WeatherData> {
    if (!API_KEY) {
      console.warn('OpenWeatherMap API Key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
      throw createAppError({
        kind: 'api',
        source: 'weather-service',
        message: 'Weather access is not ready. Please add the weather API key and try again.',
      });
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw createAppError({ kind: 'offline', source: 'weather-service' });
    }

    const [currentResult, forecastResult, aqiResult] = await Promise.allSettled([
      weatherApiClient.get('/weather', {
        params: { lat, lon, units: 'metric', appid: API_KEY },
      }),
      weatherApiClient.get('/forecast', {
        params: { lat, lon, units: 'metric', appid: API_KEY },
      }),
      weatherApiClient.get('/air_pollution', {
        params: { lat, lon, appid: API_KEY },
      }),
    ]);

    if (currentResult.status === 'rejected') {
      throw currentResult.reason;
    }

    const currentRes = currentResult.value;
    const forecastList = forecastResult.status === 'fulfilled' ? forecastResult.value.data?.list || [] : [];
    const airQuality = aqiResult.status === 'fulfilled' ? aqiResult.value.data?.list?.[0] : null;

    if (!currentRes.data?.main || !currentRes.data?.weather?.[0] || !currentRes.data?.sys) {
      throw createAppError({ kind: 'missing-data', source: 'weather-service' });
    }

    const countryCode = currentRes.data.sys.country;
    let countryDetails: CountryDetails | undefined;

    try {
      const countryRes = await countryApiClient.get(`/alpha/${countryCode}`);
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
    forecastList.forEach((item: any) => {
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

    const data: WeatherData = {
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
      hourly: forecastList.slice(0, 24).map((item: any) => ({
        time: item.dt_txt,
        temp: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        weatherCode: item.weather[0].id,
        condition: item.weather[0].main,
        icon: item.weather[0].icon,
      })),
      daily: Object.values(dailyData).slice(0, 7),
      location: {
        name: cityName,
        country: countryCode,
        lat,
        lon,
        timezone: currentRes.data.timezone.toString(),
      },
      countryDetails,
    };

    if (airQuality?.main && airQuality?.components) {
      data.aqi = {
        european: airQuality.main.aqi,
        us: airQuality.main.aqi, // OpenWeather simple AQI is 1-5
        pm10: airQuality.components.pm10,
        pm25: airQuality.components.pm2_5,
        co: airQuality.components.co,
        no2: airQuality.components.no2,
      };
    }

    return data;
  },

  async searchCities(query: string): Promise<CitySuggestion[]> {
    if (!query.trim()) throw createAppError({ kind: 'empty-search', source: 'city-search', retryable: false });
    if (!API_KEY) {
      throw createAppError({
        kind: 'api',
        source: 'city-search',
        message: 'City search is not ready. Please add the weather API key and try again.',
      });
    }
    if (query.trim().length < 2) return [];
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw createAppError({ kind: 'offline', source: 'city-search' });
    }

    const res = await geoApiClient.get('/direct', {
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
    const res = await weatherApiClient.get('/weather', {
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
