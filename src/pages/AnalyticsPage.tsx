import { motion, AnimatePresence } from 'motion/react';
import { useWeather } from '../context/WeatherContext';
import { Activity, Filter, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { unsplashService } from '../services/unsplashService';
import ThermalVelocityChart from '../components/analytics/ThermalVelocityChart';
import DailySummaryCard from '../components/analytics/DailySummaryCard';
import AnalyticalStatsGrid from '../components/analytics/AnalyticalStatsGrid';

const AnalyticsSkeleton = () => (
  <div className="flex-1 p-8 h-full overflow-y-auto hide-scrollbar animate-pulse">
    <div className="max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="space-y-4">
          <div className="h-12 w-96 bg-white/5 rounded-2xl"></div>
          <div className="h-4 w-64 bg-white/5 rounded-lg opacity-40"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 bg-white/5 rounded-2xl"></div>
          <div className="h-14 w-32 bg-white/5 rounded-[1.5rem]"></div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 h-[500px] bg-white/5 rounded-[3.5rem] border border-[var(--border-color)]"></div>
        <div className="h-[500px] bg-white/5 rounded-[3.5rem] border border-[var(--border-color)]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="h-40 bg-white/5 rounded-[2.5rem] border border-[var(--border-color)]"></div>
        ))}
      </div>
    </div>
  </div>
);

export default function AnalyticsPage() {
  const { weather, loading } = useWeather();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (weather) {
      unsplashService.getWeatherImage(`${weather.location.name} sky weather`).then(setBgImage);
    }
  }, [weather]);

  if (loading && !weather) return <AnalyticsSkeleton />;

  if (!weather) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="p-6 rounded-full bg-indigo-500/10 text-indigo-500 mb-6">
          <Activity size={48} />
        </div>
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">No Atmospheric Data</h2>
        <p className="text-[var(--text-muted)] max-w-md">Initiate a search to unlock advanced climatic insights and historical patterns.</p>
      </div>
    );
  }

  const chartData = weather.hourly.map((h) => ({
    time: new Date(h.time).toLocaleTimeString([], { hour: '2-digit' }),
    temp: h.temp,
    humidity: h.humidity,
    wind: h.windSpeed,
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-8 h-full overflow-y-auto hide-scrollbar relative"
    >
      {/* Background Image Overlay */}
      <AnimatePresence>
        {bgImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 pointer-events-none"
          >
            <img 
              src={bgImage} 
              alt="Analytics Background" 
              className="w-full h-full object-cover opacity-50 saturate-[1.2]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
          <div>
            <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tighter">Atmospheric Perspectives</h1>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] text-[10px] mt-3 opacity-40">Climatic Narrative for {weather.location.name}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-[var(--border-color)] hover:border-indigo-500/30 transition-all text-[var(--text-muted)] hover:text-indigo-500 shadow-sm">
              <Filter size={18} />
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <ThermalVelocityChart data={chartData} />
          <div className="space-y-8">
            <DailySummaryCard weather={weather} chartData={chartData} />
          </div>
        </div>

        <AnalyticalStatsGrid windSpeed={weather.current.windSpeed} />
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black text-white">
        {payload[0].value.toFixed(1)} km/h
      </div>
    );
  }
  return null;
};
