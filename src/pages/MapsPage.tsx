import { motion } from 'motion/react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { Globe, Layers, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';
import WeatherMap from '../components/maps/WeatherMap';
import MapLegend from '../components/maps/MapLegend';
import RadarStatus from '../components/maps/RadarStatus';

const MapsSkeleton = () => (
  <div className="flex-1 p-6 flex flex-col gap-8 h-full animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
      <div className="space-y-3">
        <div className="h-10 w-64 bg-white/5 rounded-xl"></div>
        <div className="h-4 w-48 bg-white/5 rounded-lg opacity-40"></div>
      </div>
      <div className="h-14 w-80 bg-white/5 rounded-2xl"></div>
    </div>
    <div className="flex-1 bg-white/5 rounded-[3rem] border border-[var(--border-color)] shadow-2xl relative">
      <div className="absolute top-8 left-8 h-10 w-48 bg-white/5 rounded-3xl"></div>
      <div className="absolute bottom-8 right-8 h-32 w-48 bg-white/5 rounded-[2rem]"></div>
    </div>
  </div>
);

export default function MapsPage() {
  const { weather, loading } = useWeather();
  const { settings } = useSettings();
  const isBangla = settings.language === 'bn';
  
  if (loading && !weather) return <MapsSkeleton />;
  
  const position: [number, number] = weather 
    ? [weather.location.lat, weather.location.lon] 
    : [51.505, -0.09];

  const legendItems = [
    { label: isBangla ? 'বৃষ্টি' : 'Rain', color: 'bg-blue-500', range: isBangla ? 'মাঝারি' : 'Medium' },
    { label: isBangla ? 'মেঘ' : 'Cloud', color: 'bg-gray-400', range: isBangla ? 'বেশি' : 'High' },
    { label: isBangla ? 'তাপ' : 'Temp', color: 'bg-orange-500', range: isBangla ? 'বেশি' : 'High' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-page flex flex-col gap-6 sm:gap-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-main)] tracking-tighter">{isBangla ? 'আবহাওয়ার মানচিত্র' : 'Weather map'}</h1>
          <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.25em] text-[10px] mt-2 opacity-60">{isBangla ? 'এখনকার আবহাওয়া দেখুন' : 'See current weather'}</p>
        </div>
        
        <div className="flex items-center gap-3 glass p-2 rounded-2xl border border-[var(--border-color)]">
          {[
            { icon: Globe, label: isBangla ? 'সাধারণ' : 'Normal', active: true },
            { icon: Layers, label: isBangla ? 'বৃষ্টি' : 'Rain', active: false },
            { icon: Navigation, label: isBangla ? 'দিক' : 'Direction', active: false }
          ].map((mode, i) => (
            <button key={i} type="button" aria-pressed={mode.active} className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              mode.active ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-[var(--text-muted)] hover:text-indigo-400"
            )}>
              <mode.icon size={14} />
              <span className="hidden sm:inline">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 glass rounded-[2rem] sm:rounded-[3rem] border border-[var(--border-color)] overflow-hidden relative shadow-2xl min-h-[420px] sm:min-h-[500px]">
        <WeatherMap position={position} weather={weather} />
        <MapLegend items={legendItems} />
        <RadarStatus />
      </div>
    </motion.div>
  );
}
