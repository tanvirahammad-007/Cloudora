import { Plane, MapPin, Calendar, Search, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import { weatherService } from '../../services/weatherService';
import { CitySuggestion } from '../../types/weather';
import { calculateTravelScore, generateTravelRecommendations, savePlan } from '../../lib/travelUtils';
import { TravelPlan } from '../../types/travel';
import { cn } from '../../lib/utils';

interface NewExpeditionFormProps {
  onPlanCreated: () => void;
}

export default function NewExpeditionForm({ onPlanCreated }: NewExpeditionFormProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [climate, setClimate] = useState('Tropical');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setSearching(true);
      try {
        const results = await weatherService.searchCities(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreatePlan = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setErrorMessage('');

    if (!selectedCity || !startDate || !endDate) {
      setErrorMessage('Choose a place and dates first.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErrorMessage('Return date should be after departure.');
      return;
    }

    setLoading(true);
    try {
      const weather = await weatherService.getWeatherData(selectedCity.lat, selectedCity.lon, selectedCity.name);
      
      const newPlan: TravelPlan = {
        id: crypto.randomUUID(),
        city: selectedCity,
        startDate,
        endDate,
        climateType: climate as any,
        createdAt: new Date().toISOString(),
        score: calculateTravelScore(weather),
        weatherSummary: {
          avgTemp: Math.round(weather.daily.reduce((a, b) => a + b.maxTemp, 0) / weather.daily.length),
          maxTemp: Math.max(...weather.daily.map(d => d.maxTemp)),
          minTemp: Math.min(...weather.daily.map(d => d.minTemp)),
          avgRainChance: 20, // Mocked as service doesn't provide probability directly
          avgHumidity: weather.current.humidity,
          condition: weather.current.condition,
          icon: weather.current.icon,
          aqi: weather.aqi?.us || 0,
          sunrise: weather.current.sunrise,
          sunset: weather.current.sunset,
          forecast: weather.daily.map(d => ({ date: d.date, maxTemp: d.maxTemp }))
        },
        recommendations: generateTravelRecommendations(weather)
      };

      savePlan(newPlan);
      onPlanCreated();
      
      // Reset form
      setQuery('');
      setSelectedCity(null);
      setStartDate('');
      setEndDate('');
    } catch (err) {
      console.error('Failed to create plan', err);
      setErrorMessage('Could not create this trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreatePlan} className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl space-y-8 relative overflow-hidden group">
      <div className="flex items-center gap-4">
        <div className="p-4 rounded-2xl bg-indigo-500 text-white shadow-xl shadow-indigo-500/20">
          <Plane size={24} />
        </div>
        <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Plan Exploration</h3>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 relative" ref={searchRef}>
          <label htmlFor="trip-destination" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-4 opacity-50">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500" size={18} />
            <input 
              id="trip-destination"
              type="text" 
              placeholder="Search locations..." 
              value={selectedCity ? selectedCity.name : query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selectedCity) setSelectedCity(null);
              }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-controls="trip-location-suggestions"
              className="w-full pl-16 pr-8 py-5 bg-white/5 border border-[var(--border-color)] rounded-[1.5rem] text-sm font-bold text-[var(--text-main)] focus:outline-none focus:border-indigo-500/50 shadow-inner transition-all" 
            />
            {searching && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" size={18} />}
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div id="trip-location-suggestions" role="listbox" className="absolute top-full left-0 w-full mt-2 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[2rem] overflow-hidden z-50 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.lat}-${suggestion.lon}`}
                  type="button"
                  role="option"
                  onClick={() => {
                    setSelectedCity(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left p-4 hover:bg-[var(--text-main)]/[0.05] rounded-2xl flex items-center gap-3 transition-colors"
                >
                  <Search size={14} className="opacity-40" />
                  <div>
                    <p className="text-sm font-bold text-[var(--text-main)]">{suggestion.name}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">{suggestion.state ? `${suggestion.state}, ` : ''}{suggestion.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-4 opacity-50">Climate Environment</label>
          <div className="grid grid-cols-3 gap-3">
            {['Tropical', 'Alpine', 'Oceanic'].map((type) => (
              <button 
                key={type} 
                type="button"
                onClick={() => setClimate(type)}
                aria-pressed={climate === type}
                className={cn(
                  "py-4 rounded-2xl border text-[8px] font-black uppercase tracking-widest transition-all",
                  climate === type 
                    ? "bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                    : "bg-white/5 border-[var(--border-color)] text-[var(--text-muted)] hover:border-indigo-500/30 hover:text-indigo-500"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <label htmlFor="trip-start-date" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-4 opacity-50">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" size={18} />
              <input 
                id="trip-start-date"
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-[var(--border-color)] rounded-[1.5rem] text-sm font-bold text-[var(--text-main)] focus:outline-none focus:border-indigo-500/50 [color-scheme:dark] md:[color-scheme:light] dark:[color-scheme:dark]" 
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="trip-end-date" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-4 opacity-50">Return</label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" size={18} />
              <input 
                id="trip-end-date"
                type="date" 
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-[var(--border-color)] rounded-[1.5rem] text-sm font-bold text-[var(--text-main)] focus:outline-none focus:border-indigo-500/50 [color-scheme:dark] md:[color-scheme:light] dark:[color-scheme:dark]" 
              />
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-400">
            {errorMessage}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading || !selectedCity || !startDate || !endDate}
          className="w-full py-6 bg-indigo-500 disabled:bg-indigo-400 disabled:opacity-50 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 mt-6 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Analyzing Forecasts...
            </>
          ) : (
            'Analyze Journey Feasibility'
          )}
        </button>
      </div>
    </form>
  );
}
