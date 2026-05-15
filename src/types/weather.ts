export interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    isDay: boolean;
    condition: string;
    precipitation: number;
    icon: string;
    sunrise: number;
    sunset: number;
  };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  aqi: {
    european: number;
    us: number;
    pm10: number;
    pm25: number;
    co: number;
    no2: number;
  };
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
    timezone: string;
  };
  countryDetails?: CountryDetails;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  icon: string;
}

export interface CitySuggestion {
  id: number;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface CountryDetails {
  name: string;
  capital: string;
  region: string;
  population: number;
  languages: string[];
  currencies: string[];
  flag: string;
  timezones: string[];
}
