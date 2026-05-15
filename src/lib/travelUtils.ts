import { WeatherData } from '../types/weather';
import { TravelPlan } from '../types/travel';

export function calculateTravelScore(weather: WeatherData): number {
  let score = 100;
  
  // Temperature penalty (ideal 20-25°C)
  const avgTemp = weather.daily.slice(0, 5).reduce((acc, curr) => acc + curr.maxTemp, 0) / 5;
  if (avgTemp > 30) score -= (avgTemp - 30) * 3;
  if (avgTemp < 15) score -= (15 - avgTemp) * 2;
  
  // Humidity penalty (ideal 40-60%)
  if (weather.current.humidity > 70) score -= 10;
  if (weather.current.humidity < 30) score -= 5;
  
  // Wind penalty
  if (weather.current.windSpeed > 10) score -= 15;
  
  // Rain/Condition penalty
  const rainDays = weather.daily.filter(d => d.condition.toLowerCase().includes('rain') || d.condition.toLowerCase().includes('storm')).length;
  score -= rainDays * 15;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function generateTravelRecommendations(weather: WeatherData) {
  const avgTemp = weather.daily.reduce((acc, curr) => acc + curr.maxTemp, 0) / weather.daily.length;
  const isRainy = weather.daily.some(d => d.condition.toLowerCase().includes('rain'));
  const isCold = avgTemp < 15;
  const isHot = avgTemp > 28;

  const packing = ['Lightweight breathable fabrics', 'Universal power adapter', 'Reusable water bottle'];
  if (isRainy) packing.push('Compact umbrella', 'Waterproof jacket');
  if (isCold) packing.push('Insulated layers', 'Warm scarf', 'Thermal socks');
  if (isHot) packing.push('Sunscreen (SPF 50+)', 'Polarized sunglasses', 'Wide-brimmed hat');
  if (avgTemp > 18 && avgTemp < 28) packing.push('Walking shoes', 'Light cardigan for evenings');

  const activities = ['City walking tour', 'Local food exploration', 'Photography session'];
  if (isRainy) activities.push('Museum visits', 'Indoor gallery tours', 'Cooking class');
  else activities.push('Hiking', 'Outdoor architecture walk', 'Sunset viewing');
  if (isHot) activities.push('Beach trip', 'Water activities');

  // Find best day (lowest rain, moderate temp)
  const bestDayData = [...weather.daily].sort((a, b) => {
    const rainA = a.condition.toLowerCase().includes('rain') ? 1 : 0;
    const rainB = b.condition.toLowerCase().includes('rain') ? 1 : 0;
    if (rainA !== rainB) return rainA - rainB;
    return Math.abs(a.maxTemp - 23) - Math.abs(b.maxTemp - 23);
  })[0];

  return {
    packing,
    activities,
    bestDay: bestDayData ? new Date(bestDayData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'N/A'
  };
}

export function savePlan(plan: TravelPlan) {
  const plans = getPlans();
  const updated = [plan, ...plans];
  localStorage.setItem('cloudora_travel_plans', JSON.stringify(updated));
}

export function getPlans(): TravelPlan[] {
  const stored = localStorage.getItem('cloudora_travel_plans');
  return stored ? JSON.parse(stored) : [];
}

export function deletePlan(id: string) {
  const plans = getPlans();
  const updated = plans.filter(p => p.id !== id);
  localStorage.setItem('cloudora_travel_plans', JSON.stringify(updated));
}
