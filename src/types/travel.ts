import { CitySuggestion } from './weather';

export interface TravelPlan {
  id: string;
  city: CitySuggestion;
  startDate: string;
  endDate: string;
  climateType?: 'Tropical' | 'Alpine' | 'Oceanic' | 'Temperate' | 'Arid';
  createdAt: string;
  score: number;
  weatherSummary: {
    avgTemp: number;
    maxTemp: number;
    minTemp: number;
    avgRainChance: number;
    avgHumidity: number;
    condition: string;
    icon: string;
    aqi: number;
    sunrise: number;
    sunset: number;
    forecast: { date: string; maxTemp: number }[];
  };
  recommendations: {
    packing: string[];
    activities: string[];
    bestDay: string;
  };
}
