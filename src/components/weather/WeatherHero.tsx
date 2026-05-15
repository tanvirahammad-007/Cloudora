import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { useUser } from '../../context/UserContext';
import { Wind, Droplets, Thermometer, Sunrise, Sunset, AlertCircle, MapPin, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { unsplashService } from '../../services/unsplashService';
import { cn } from '../../lib/utils';
import { getCountryName } from '../../lib/geoUtils';
import { convertTemp, convertWindSpeed } from '../../lib/unitUtils';

const WeatherHeroSkeleton = () => (
  <div className="glass-panel relative flex flex-col xl:flex-row items-center justify-between p-12 lg:p-16 overflow-hidden min-h-[520px] rounded-[4.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] animate-pulse">
    <div className="relative z-10 flex-1 w-full flex flex-col justify-between h-full">
      <div className="space-y-8">
        <div className="h-10 w-48 bg-white/5 rounded-full"></div>
        <div className="space-y-4">
          <div className="h-32 w-3/4 bg-white/5 rounded-3xl"></div>
          <div className="h-12 w-1/2 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 mt-20">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-4">
            <div className="h-12 w-12 bg-white/5 rounded-2xl"></div>
            <div className="h-8 w-24 bg-white/5 rounded-xl"></div>
            <div className="h-4 w-16 bg-white/5 rounded-lg opacity-40"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-center xl:items-end gap-12 mt-20 xl:mt-0 xl:pl-16">
      <div className="h-64 w-64 bg-white/5 rounded-[4rem]"></div>
      <div className="h-16 w-48 bg-white/5 rounded-3xl"></div>
    </div>
  </div>
);

export default function WeatherHero() {
  const { weather, lastUpdated, loading, error } = useWeather();
  const { settings } = useSettings();
  const { toggleFavorite, isFavorite } = useUser();
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [localTime, setLocalTime] = useState<string>('');

  useEffect(() => {
    if (!weather?.location.timezone) return;

    const updateTime = () => {
      try {
        const time = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: weather.location.timezone
        }).format(new Date());
        setLocalTime(time);
      } catch (e) {
        setLocalTime('');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, [weather?.location.timezone]);

  useEffect(() => {
    if (weather) {
      const query = `${weather.location.name} ${weather.location.country} ${weather.current.condition} weather landscape`;
      unsplashService.getWeatherImage(query).then(setBgImage);
    }
  }, [weather]);

  const getDayGradient = (code: number) => {
    if (code === 800) return 'from-white/10 via-transparent to-transparent'; // Clear
    if (code > 800) return 'from-white/5 via-transparent to-transparent'; // Clouds
    if (code >= 500 && code < 600) return 'from-white/10 via-black/20 to-black/40'; // Rain
    if (code >= 200 && code < 300) return 'from-gray-500/10 via-black/30 to-black/60'; // Storm
    if (code >= 600 && code < 700) return 'from-white/20 via-white/10 to-transparent'; // Snow
    return 'from-gray-500/10 via-transparent to-transparent'; // Atmosphere
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper adjustment to match existing formatTime if needed, but the one above is just placeholder for finding
  
  if (loading && !weather) return <WeatherHeroSkeleton />;

  if (error && !weather) {
    return (
      <div className="glass-panel p-12 flex flex-col items-center justify-center text-center rounded-[4rem] border border-[var(--text-main)]/20 bg-[var(--panel-bg)]/5 shadow-2xl">
        <AlertCircle size={64} className="text-[var(--text-main)] opacity-30 mb-6 animate-bounce" />
        <h3 className="text-3xl font-black text-[var(--text-main)] mb-4 tracking-tight">System Interrupted</h3>
        <p className="text-[var(--text-muted)] max-w-sm font-medium leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-10 px-10 py-5 bg-[var(--text-main)] hover:scale-105 rounded-[1.5rem] text-[var(--bg-color)] text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          Initialize Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const currentTemp = Math.round(convertTemp(weather.current.temp, settings.tempUnit));
  const currentFeelsLike = Math.round(convertTemp(weather.current.feelsLike, settings.tempUnit));
  const currentWindSpeed = Math.round(convertWindSpeed(weather.current.windSpeed, settings.windUnit));

  const isFav = isFavorite(weather.location.lat, weather.location.lon);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel relative flex flex-col xl:flex-row items-center justify-between p-8 md:p-[var(--spacing-gap-lg)] lg:p-[var(--spacing-gap-xl)] overflow-hidden group min-h-[500px] lg:min-h-[600px] rounded-[3rem] lg:rounded-[4.5rem] bg-[var(--panel-bg)]/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border-[0.5px] border-[var(--border-color)]"
    >
      {/* Background Image with Enhanced Overlay */}
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div 
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={bgImage} 
              alt="Weather Background" 
              className="w-full h-full object-cover grayscale brightness-[0.8] contrast-[1.1] transition-transform duration-[40s] ease-linear"
            />
            <div className="absolute inset-0 bg-gradient-to-br lg:bg-gradient-to-r from-[var(--bg-color)] via-[var(--bg-color)]/60 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex-1 w-full flex flex-col justify-between h-full order-2 xl:order-1">
        <div className="mt-8 xl:mt-0">
          <div className="flex items-center justify-between mb-8 lg:mb-[var(--spacing-gap-lg)]">
             <div className="flex items-center gap-3 lg:gap-4">
               <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3 lg:gap-5 px-4 lg:px-6 py-2 lg:py-3 glass rounded-full"
               >
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[var(--text-main)] rounded-full animate-pulse shadow-[0_0_10px_var(--text-main)]"></div>
                   <span className="text-[9px] lg:typo-label opacity-100 uppercase tracking-widest">Live Broadcast</span>
                 </div>
                 {localTime && (
                   <div className="flex items-center gap-3 lg:gap-4">
                     <div className="w-[1px] h-3 bg-[var(--text-main)]/20"></div>
                     <span className="text-[9px] lg:typo-label opacity-60 uppercase tracking-widest font-black">{localTime}</span>
                   </div>
                 )}
               </motion.div>
  
               <motion.button 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => toggleFavorite({
                  name: weather.location.name,
                  country: weather.location.country,
                  lat: weather.location.lat,
                  lon: weather.location.lon
                })}
                className={cn(
                  "p-3 rounded-xl lg:p-4 lg:rounded-[1.25rem] glass transition-all duration-300 active:scale-95",
                  isFav ? "text-red-500 bg-red-500/10 border-red-500/20" : "text-[var(--text-muted)] hover:text-red-500"
                )}
               >
                 <Heart size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={1.5} />
               </motion.button>
             </div>
          </div>
  
          <div className="mb-10 lg:mb-[var(--spacing-gap-xl)] text-center xl:text-left">
            {/* ... title and location */}
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="typo-display mb-6 lg:mb-10"
            >
              {weather.location.name}
            </motion.h1>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center xl:justify-start gap-3 lg:gap-[var(--spacing-gap-sm)] group/geo"
            >
              <div className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-[var(--text-main)] text-[var(--bg-color)] shadow-xl group-hover:scale-105 transition-transform duration-500">
                <MapPin size={24} strokeWidth={1.5} />
              </div>
              <p className="text-xl lg:typo-h2 opacity-80">
                {getCountryName(weather.location.country)}
              </p>
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-[var(--spacing-gap-md)] xl:gap-[var(--spacing-gap-lg)]">
          {[
            { icon: Droplets, label: 'Humidity', value: `${weather.current.humidity}%`, color: 'text-[var(--text-main)]', bg: 'bg-[var(--text-main)]/5' },
            { icon: Wind, label: 'Wind Flow', value: `${currentWindSpeed}${settings.windUnit}`, color: 'text-[var(--text-main)]', bg: 'bg-[var(--text-main)]/5' },
            { icon: Sunrise, label: 'First Light', value: formatTime(weather.current.sunrise), color: 'text-[var(--text-main)]', bg: 'bg-[var(--text-main)]/5' },
            { icon: Sunset, label: 'Last Light', value: formatTime(weather.current.sunset), color: 'text-[var(--text-main)]', bg: 'bg-[var(--text-main)]/5' },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              className="flex flex-col gap-3 lg:gap-6 group/stat p-4 lg:p-6 rounded-2xl lg:rounded-3xl hover:bg-[var(--text-main)]/5 transition-all duration-500 border border-transparent hover:border-[var(--border-color)]"
            >
              <item.icon size={24} strokeWidth={1.5} className="group-hover:translate-y-[-4px] transition-transform duration-500 opacity-60" />
              <div>
                <p className="text-xl lg:typo-h3 mb-1 lg:mb-2">{item.value}</p>
                <p className="text-[9px] lg:typo-label opacity-40 uppercase tracking-widest">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative z-10 flex flex-col items-center xl:items-end gap-6 lg:gap-[var(--spacing-gap-lg)] mt-6 lg:mt-[var(--spacing-gap-lg)] xl:mt-0 xl:pl-[var(--spacing-gap-xl)] order-1 xl:order-2"
      >
        <div className="flex flex-col items-center xl:items-end relative">
          <div className="relative group/temp">
            <span className="typo-display leading-tight opacity-100 text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">
              {currentTemp}
            </span>
            <span className="absolute top-4 lg:top-10 -right-8 lg:-right-[var(--spacing-gap-lg)] text-3xl lg:text-6xl font-black text-[var(--text-main)] opacity-10 select-none tracking-tighter">°{settings.tempUnit}</span>
          </div>
          <div className="flex flex-col items-center xl:items-end gap-4 lg:gap-8 mt-[-10px]">
            <p className="text-2xl lg:typo-h2 font-black tracking-tighter">{weather.current.condition}</p>
            <div className="flex items-center gap-3 lg:gap-5 px-6 lg:px-10 py-3 lg:py-5 glass rounded-full shadow-2xl transition-all cursor-default group hover:scale-[1.02]">
              <Thermometer size={24} strokeWidth={2} className="opacity-60" />
              <span className="text-sm lg:text-xl font-bold tracking-tight text-[var(--text-main)] opacity-80">Perceived {currentFeelsLike}°{settings.tempUnit}</span>
            </div>
          </div>
        </div>

        <motion.div 
          animate={settings.animationsEnabled ? { y: [0, -20, 0] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[var(--text-main)]/5 blur-[40px] lg:blur-[80px] rounded-full scale-150 opacity-40"></div>
          <img 
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@4x.png`} 
            alt={weather.current.condition}
            className="w-48 h-48 lg:w-72 lg:h-72 drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] select-none pointer-events-none relative z-10 active:scale-110 transition-transform invert dark:invert-0 brightness-[1.1]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
