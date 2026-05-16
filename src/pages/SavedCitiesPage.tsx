import { motion, AnimatePresence, Reorder } from 'motion/react';
import { useWeather } from '../context/WeatherContext';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import { 
  MapPin, 
  Trash2, 
  RefreshCw, 
  Search, 
  Plus, 
  Wind, 
  Droplets, 
  ArrowUpRight,
  GripVertical,
  Activity,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { KeyboardEvent } from 'react';
import { useEffect, useState, useMemo } from 'react';
import { weatherService } from '../services/weatherService';
import { useNavigate } from 'react-router-dom';
import { convertTemp, convertWindSpeed } from '../lib/unitUtils';
import { getCountryName } from '../lib/geoUtils';
import { CitySuggestion } from '../types/weather';

interface CityWeatherSummary {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
}

const CitySkeleton = () => (
  <div className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] h-[240px] animate-pulse">
    <div className="flex justify-between items-start mb-8">
      <div className="space-y-3">
        <div className="h-8 w-40 bg-white/5 rounded-xl"></div>
        <div className="h-4 w-24 bg-white/5 rounded-lg opacity-40"></div>
      </div>
      <div className="h-12 w-12 bg-white/5 rounded-full"></div>
    </div>
    <div className="mt-auto flex justify-between items-end">
      <div className="h-12 w-24 bg-white/5 rounded-2xl"></div>
      <div className="space-y-2">
        <div className="h-4 w-16 bg-white/5 rounded-lg"></div>
        <div className="h-4 w-16 bg-white/5 rounded-lg"></div>
      </div>
    </div>
  </div>
);

function SavedCityCard({ city, onRemove }: { city: CitySuggestion; onRemove: () => void }) {
  const { fetchWeather } = useWeather();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [data, setData] = useState<CityWeatherSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const summary = await weatherService.getCurrentWeatherSummary(city.lat, city.lon);
        if (isMounted) setData(summary);
      } catch (err) {
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [city.lat, city.lon]);

  const handleOpen = () => {
    fetchWeather(city.lat, city.lon, city.name);
    navigate('/');
  };

  const handleOpenFromKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  if (loading) return <CitySkeleton />;

  return (
    <motion.div
      layout
      className="glass-panel group relative overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 hover:border-[var(--text-main)]/30 hover:bg-[var(--panel-bg)] transition-all flex flex-col h-full min-h-[220px]"
    >
      <div
        className="p-6 sm:p-8 flex-1 flex flex-col cursor-pointer"
        onClick={handleOpen}
        onKeyDown={handleOpenFromKeyboard}
        role="button"
        tabIndex={0}
        aria-label={`Open weather for ${city.name}`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tighter leading-tight truncate">
              {city.name}
            </h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1 truncate">
              {getCountryName(city.country)}
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
             <div className="drag-handle p-2 opacity-10 group-hover:opacity-40 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
             </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 flex items-center gap-3 text-[var(--text-muted)] opacity-50">
            <AlertCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Offline</span>
          </div>
        ) : data && (
          <div className="mt-2 flex items-center gap-6">
            <div className="text-5xl font-black text-[var(--text-main)] tracking-tighter">
              {Math.round(convertTemp(data.temp, settings.tempUnit))}°
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} 
              alt={data.condition}
              loading="lazy"
              decoding="async"
              className="w-14 h-14 invert dark:invert-0 grayscale brightness-[1.2]"
            />
          </div>
        )}

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <Wind size={12} className="opacity-40" />
              <span className="text-[10px] font-bold opacity-60">
                {data ? Math.round(convertWindSpeed(data.windSpeed, settings.windUnit)) : '-'}{settings.windUnit}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets size={12} className="opacity-40" />
              <span className="text-[10px] font-bold opacity-60">{data?.humidity}%</span>
            </div>
          </div>
          <ArrowUpRight size={16} className="text-indigo-500" />
        </div>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        type="button"
        aria-label={`Remove ${city.name} from saved cities`}
        className="absolute top-6 right-6 p-3 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

export default function SavedCitiesPage() {
  const { profile, toggleFavorite, reorderFavorites } = useUser();
  const { settings } = useSettings();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const isBangla = settings.language === 'bn';

  const filteredFavorites = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return profile.favorites;

    return profile.favorites.filter(city => 
      city.name.toLowerCase().includes(normalizedSearch) ||
      city.country.toLowerCase().includes(normalizedSearch)
    );
  }, [profile.favorites, search]);

  const isFiltering = search.trim().length > 0;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-page"
    >
      <div className="premium-page-inner max-w-[1400px] space-y-10 lg:space-y-12">
        
        {/* Header Section */}
        <header className="flex flex-col xl:flex-row gap-8 xl:items-end justify-between px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-[var(--text-main)] text-[var(--bg-color)] shadow-2xl">
                <MapPin size={24} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                {isBangla ? 'সেভ করা শহর' : 'Saved cities'}
              </h1>
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] text-[10px] ml-1 opacity-40">
              {isBangla ? 'আপনার পছন্দের শহর এক জায়গায়' : 'Your favorite places in one place'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity" size={18} />
               <input 
                 type="text"
                 placeholder={isBangla ? 'সেভ করা শহর খুঁজুন...' : 'Search saved cities...'}
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 aria-label="Search saved cities"
                 className="pl-14 pr-8 py-5 bg-[var(--text-main)]/[0.05] border border-transparent focus:border-[var(--text-main)]/20 rounded-[1.5rem] text-[var(--text-main)] font-bold focus:outline-none w-full md:w-[320px] transition-all"
               />
             </div>
             
             <button 
              onClick={handleRefresh}
              type="button"
              aria-label="Refresh saved city weather"
              className={cn(
                "p-5 glass rounded-[1.5rem] hover:bg-[var(--text-main)]/5 transition-all text-[var(--text-main)] shadow-xl",
                isRefreshing && "animate-spin"
              )}
             >
               <RefreshCw size={20} />
             </button>

             <button 
              onClick={() => navigate('/')}
              type="button"
              className="flex items-center gap-4 px-10 py-5 bg-[var(--text-main)] text-[var(--bg-color)] rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:scale-105 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transition-all active:scale-95"
             >
               <Plus size={18} />
               <span>{isBangla ? 'শহর যোগ করুন' : 'Add city'}</span>
             </button>
          </div>
        </header>

        {/* Content Area */}
        {profile.favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full"></div>
               <div className="p-12 glass rounded-full border border-indigo-500/20 relative">
                  <Activity size={80} className="text-indigo-500 opacity-20" />
               </div>
            </div>
            <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tight mb-4">{isBangla ? 'কোনো শহর সেভ নেই' : 'No saved cities'}</h2>
            <p className="text-[var(--text-muted)] max-w-sm font-medium leading-relaxed opacity-60">
              {isBangla ? 'ড্যাশবোর্ড থেকে একটি শহর খুঁজে সেভ করুন।' : 'Search a city on the dashboard and save it here.'}
            </p>
            <button 
              onClick={() => navigate('/')}
              type="button"
              className="mt-10 typo-label text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-3 group"
            >
              {isBangla ? 'শহর খুঁজুন' : 'Search a city'} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
            </button>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Search size={44} className="mb-5 text-[var(--text-muted)] opacity-30" />
            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">{isBangla ? 'কিছু পাওয়া যায়নি' : 'No matching cities'}</h2>
            <p className="mt-3 max-w-sm text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-60">
              {isBangla ? 'অন্য নামে খুঁজে দেখুন।' : 'Try a different city name.'}
            </p>
          </div>
        ) : isFiltering ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {filteredFavorites.map((city) => (
              <div key={`${city.lat}-${city.lon}`}>
                <SavedCityCard
                  city={city}
                  onRemove={() => toggleFavorite(city)}
                />
              </div>
            ))}
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={profile.favorites} 
            onReorder={reorderFavorites}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 list-none"
          >
            <AnimatePresence mode="popLayout">
              {filteredFavorites.map((city) => (
                <Reorder.Item 
                  key={`${city.lat}-${city.lon}`} 
                  value={city}
                >
                  <SavedCityCard 
                    city={city} 
                    onRemove={() => toggleFavorite(city)} 
                  />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        {/* Footer Stats */}
        {profile.favorites.length > 0 && (
          <footer className="pt-12 px-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[var(--border-color)] opacity-40">
            <div className="flex items-center gap-8">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1">{isBangla ? 'মোট শহর' : 'Total cities'}</span>
                  <span className="text-lg font-black text-[var(--text-main)]">{profile.favorites.length}</span>
               </div>
               <div className="w-[1px] h-8 bg-[var(--border-color)]"></div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1">{isBangla ? 'স্ট্যাটাস' : 'Status'}</span>
                  <span className="text-lg font-black text-emerald-500 uppercase tracking-tighter">{isBangla ? 'সেভড' : 'Saved'}</span>
               </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-center md:text-right max-w-[200px]">
              {isBangla ? 'ড্র্যাগ করে শহরের অর্ডার বদলান।' : 'Drag handles to reorder your saved cities.'}
            </p>
          </footer>
        )}
      </div>
    </motion.div>
  );
}
