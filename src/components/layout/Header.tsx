import { Search, Bell, MapPin, X, Loader2, Sparkles, LayoutGrid, Cloud } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { weatherService } from '../../services/weatherService';
import { CitySuggestion } from '../../types/weather';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import ThemeToggle from './ThemeToggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCountryName } from '../../lib/geoUtils';
import { useTranslation } from '../../hooks/useTranslation';


export default function Header() {
  const { t } = useTranslation();
  const { weather, fetchWeather, addToHistory, loading: weatherLoading } = useWeather();

  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const results = await weatherService.searchCities(query);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Search failed', err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CitySuggestion) => {
    fetchWeather(city.lat, city.lon, city.name);
    addToHistory(city);
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.blur();
    navigate('/');
  };

  const handleSearchClick = () => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <header className="h-20 lg:h-24 flex items-center justify-between gap-4 w-full px-4 lg:px-8 bg-transparent relative z-20">
      {/* Left side: Branding and Location */}
      <div className="flex items-center gap-4 lg:gap-12 min-w-0 lg:min-w-[300px]">
        <NavLink to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group shrink-0">
          <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white text-black dark:bg-[#FFFFFF] dark:text-black rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg border border-white/20 relative overflow-hidden">
            <Cloud size={20} lg:size={22} fill="currentColor" className="relative z-10" />
            <div className="absolute inset-0 bg-black/5 opacity-50" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg lg:text-xl font-black tracking-widest uppercase text-[var(--text-main)] leading-none">Cloudora</span>
            <span className="text-[9px] lg:text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] mt-1 opacity-60">Laggy Clouds</span>
          </div>

        </NavLink>

        <div className="hidden md:flex items-center gap-3 py-2 text-[var(--text-main)] shrink-0">
          <MapPin size={18} className="text-[var(--text-main)] opacity-70" />
          <div className="flex flex-col">
            <span className="text-sm lg:text-base font-black tracking-tight leading-tight">
              {weather?.location.name || t('setLocation')}
            </span>
            <span className="text-[10px] lg:text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] opacity-50">
              {weather?.location.country ? getCountryName(weather.location.country) : t('global')}
            </span>

          </div>
        </div>
      </div>

      {/* Center side: Search Bar */}
      <div className="flex-1 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-full lg:max-w-[500px] xl:max-w-[600px] z-50">
        <div className="relative group" ref={searchRef}>
          <div className={cn(
            "relative w-full flex items-center transition-all duration-500",
            "bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] rounded-full px-4 h-11 lg:h-14",
            "focus-within:bg-[var(--bg-color)] focus-within:border-[var(--text-main)]/20 shadow-sm",
            showSuggestions && suggestions.length > 0 ? "rounded-b-none rounded-t-[1.5rem] lg:rounded-t-[2rem]" : ""
          )}>
            <div className="pr-2 lg:pr-3 flex items-center justify-center">
              {isSearching ? (
                <Loader2 className="animate-spin text-[var(--text-main)]" size={18} />
              ) : (
                <Search className="text-[var(--text-muted)] group-focus-within:text-[var(--text-main)] transition-colors" size={18} />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder={t('exploreLocations')}
              value={query}

              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                    handleSelect(suggestions[selectedIndex]);
                  } else {
                    handleSearchClick();
                  }
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => query.length > 2 && setShowSuggestions(true)}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[var(--text-main)] font-semibold text-sm lg:text-base placeholder:text-[var(--text-muted)] opacity-80"
            />

            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={clearSearch}
                  className="p-1.5 hover:bg-white/10 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all ml-2"
                >
                  <X size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute top-full left-0 w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden z-[100] shadow-2xl p-2 lg:p-3"
              >
                <div className="px-3 py-2 mb-1 flex items-center justify-between opacity-50">
                  <span className="typo-xs font-black uppercase tracking-widest">{t('globalIndex')}</span>
                </div>

                <div className="max-h-[300px] lg:max-h-[400px] overflow-y-auto hide-scrollbar space-y-1">
                  {suggestions.map((suggestion, idx) => (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      key={`${suggestion.lat}-${suggestion.lon}-${idx}`}
                      onClick={() => handleSelect(suggestion)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        "w-full p-3 lg:p-4 flex items-center justify-between rounded-xl lg:rounded-2xl transition-all text-left group/item scale-100",
                        selectedIndex === idx ? "bg-[var(--text-main)]/10 scale-[1.01] border-[var(--text-main)]/10" : "hover:bg-[var(--text-main)]/5 border-transparent",
                        "border"
                      )}
                    >
                      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
                        <div className={cn(
                          "w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl flex items-center justify-center transition-all duration-500 shrink-0",
                          selectedIndex === idx
                            ? "bg-[var(--text-main)] text-[var(--bg-color)] shadow-lg"
                            : "bg-[var(--text-main)]/[0.05] border border-[var(--border-color)] text-[var(--text-main)]"
                        )}>
                          <MapPin size={16} lg:size={20} className={cn(selectedIndex === idx && "animate-bounce")} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-xs lg:text-sm tracking-tight truncate">{suggestion.name}</p>
                            {suggestion.state && (
                              <span className="hidden sm:inline-block text-[8px] lg:text-[10px] bg-[var(--text-main)]/5 px-1 rounded text-[var(--text-muted)] font-black uppercase tracking-tighter">
                                {suggestion.state}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] lg:text-[11px] text-[var(--text-muted)] font-bold opacity-60 mt-0.5 lg:mt-1 uppercase tracking-wider truncate">
                            {getCountryName(suggestion.country)}
                          </p>
                        </div>
                      </div>
                      <Sparkles
                        size={14} lg:size={16}
                        className={cn(
                          "transition-all duration-500 shrink-0",
                          selectedIndex === idx ? "text-[var(--text-main)] opacity-100 scale-125" : "text-[var(--text-main)] opacity-10"
                        )}
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Tools and Profile */}
      <div className="flex items-center gap-2 lg:gap-5 justify-end min-w-0 lg:min-w-[300px]">
        <button className="hidden sm:flex relative w-10 h-10 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-[var(--text-main)]/[0.05] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all active:scale-95 group">
          <Bell size={18} lg:size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-color)] group-hover:scale-125 transition-transform"></span>
        </button>

        <ThemeToggle />

        <NavLink to="/profile" className="relative group shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg active:scale-95 transition-all cursor-pointer group-hover:border-[var(--text-main)]/50">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(weather?.location.name || 'User')}`}
              alt="User"
              className="w-full h-full object-cover bg-white/5"
            />
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 lg:w-3.5 lg:h-3.5 bg-green-500 rounded-full border-2 border-[var(--bg-color)]"></div>
        </NavLink>
      </div>
    </header>

  );
}
