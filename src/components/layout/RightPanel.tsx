import { History, MapPin, Share2, Globe, Users, Landmark, Coins, Languages, Clock, ChevronRight } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { unsplashService } from '../../services/unsplashService';
import { getCountryName } from '../../lib/geoUtils';

interface RightPanelProps {
  className?: string;
}

export default function RightPanel({ className }: RightPanelProps) {
  const { searchHistory, fetchWeather, weather, loading } = useWeather();
  const [geoBg, setGeoBg] = useState<string | null>(null);

  useEffect(() => {
    if (weather) {
      unsplashService.getWeatherImage(`${weather.location.name} ${weather.location.country} landmarks`).then(setGeoBg);
    }
  }, [weather]);

  return (
    <aside className={cn("flex flex-col gap-[var(--spacing-gap-md)] h-full pb-[var(--spacing-gap-md)]", className)}>
      {/* Recent Searches */}
      <div className="glass-panel p-[var(--spacing-gap-md)] flex flex-col rounded-[3rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 h-[45%] group">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 rounded-2xl bg-[var(--text-main)] text-[var(--bg-color)] shadow-2xl">
            <History size={18} strokeWidth={2.5} />
          </div>
          <h3 className="typo-label opacity-100">Synchronized Logs</h3>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-3 pb-4">
          {searchHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 opacity-10">
              <History size={40} className="mb-4 text-[var(--text-main)]" />
              <p className="typo-label tracking-tighter">No Recent Entries</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {searchHistory.map((city, idx) => (
                <motion.button
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  key={`${city.lat}-${city.lon}-${idx}`}
                  onClick={() => fetchWeather(city.lat, city.lon, city.name)}
                  className="flex items-center gap-5 p-4 rounded-3xl bg-[var(--text-main)]/[0.02] hover:bg-[var(--text-main)]/[0.05] border border-transparent hover:border-[var(--border-color)] transition-all duration-500 group/item active:scale-[0.98]"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[var(--text-main)]/[0.05] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] group-hover/item:bg-[var(--text-main)] group-hover/item:text-[var(--bg-color)] transition-all duration-500 shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="typo-h3 text-base leading-tight truncate w-32 tracking-tighter">
                      {city.name}
                    </p>
                    <p className="typo-label text-[10px] opacity-30 mt-1">
                      {getCountryName(city.country)}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-[var(--text-main)] opacity-10 group-hover:opacity-40 transition-all group-hover:translate-x-1" />
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Country Info */}
      <div className="glass-panel p-[var(--spacing-gap-md)] relative overflow-hidden rounded-[3rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 flex-1 min-h-[360px]">
        {/* Background Image with Overlay */}
        <AnimatePresence>
          {geoBg && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0"
            >
              <img 
                src={geoBg} 
                alt="Country Background" 
                className="w-full h-full object-cover grayscale brightness-125 transition-transform duration-[40s] ease-linear"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/90 to-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="p-3.5 rounded-2xl bg-[var(--text-main)] text-[var(--bg-color)] shadow-2xl">
            <Globe size={18} strokeWidth={2.5} />
          </div>
          <h4 className="typo-label opacity-100">Global Metrics</h4>
        </div>
        
        {loading && !weather ? (
           <div className="space-y-6 animate-pulse">
             <div className="h-16 bg-[var(--text-main)]/5 rounded-[2rem]"></div>
             <div className="grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => <div key={i} className="h-12 bg-[var(--text-main)]/5 rounded-2xl"></div>)}
             </div>
           </div>
        ) : weather?.countryDetails ? (
          <div className="space-y-8 relative z-10">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-6 px-6 py-5 rounded-[2.5rem] bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] shadow-inner group/flag"
            >
              <div className="w-20 h-14 rounded-xl shadow-2xl overflow-hidden border border-black/10 flex-shrink-0 group-hover:scale-105 transition-transform duration-700 grayscale-[0.5] contrast-[1.2]">
                <img src={weather.countryDetails.flag} alt={weather.countryDetails.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="typo-h3 text-xl truncate tracking-tighter block">{weather.countryDetails.name}</span>
                <span className="typo-label block opacity-40">{weather.countryDetails.region}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Landmark, label: 'Capital', value: weather.countryDetails.capital },
                { icon: Users, label: 'People', value: `${(weather.countryDetails.population / 1000000).toFixed(1)}M` },
                { icon: Coins, label: 'Asset', value: weather.countryDetails.currencies[0]?.split('(')[0] || '-' },
                { icon: Clock, label: 'Zone', value: weather.countryDetails.timezones[0] || '-' },
              ].map((stat, i) => (stat.value && (
                <div key={i} className="flex flex-col gap-2 p-5 rounded-3xl bg-[var(--text-main)]/[0.02] border border-transparent hover:border-[var(--border-color)] hover:bg-[var(--text-main)]/[0.04] transition-all duration-500 group/stat">
                   <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                    <stat.icon size={12} strokeWidth={2.5} />
                    <span className="typo-label text-[9px] translate-y-[0.5px]">{stat.label}</span>
                  </div>
                  <span className="typo-h3 text-[13px] truncate tracking-tight">{stat.value}</span>
                </div>
              )))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-10">
            <Globe size={48} className="mb-4 text-[var(--text-main)]" />
            <p className="typo-label tracking-tighter">Initializing Map...</p>
          </div>
        )}
      </div>

      {/* Upgrade Banner */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="mt-auto glass-panel p-10 rounded-[3.5rem] border border-[var(--text-main)]/10 bg-gradient-to-br from-[var(--text-main)]/[0.03] to-transparent relative overflow-hidden group cursor-pointer transition-all duration-700"
      >
         <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-1000 text-[var(--text-main)] scale-150">
           <Share2 size={80} />
         </div>
         <p className="typo-h3 text-xl mb-3 relative z-10 leading-none">Matrix Access</p>
         <p className="text-[12px] opacity-40 relative z-10 font-bold leading-relaxed mb-10">Neural modeling and deep satellite history available via Matrix Neural Auth.</p>
         <button className="w-full py-4 bg-[var(--text-main)] hover:scale-[1.02] text-[var(--bg-color)] typo-label opacity-100 rounded-[1.5rem] transition-all shadow-2xl active:scale-95 relative z-10">
           Initialize Upgrade
         </button>
      </motion.div>
    </aside>
  );
}
