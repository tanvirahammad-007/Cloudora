import { motion, AnimatePresence } from 'motion/react';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { Activity, Filter, Download } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { unsplashService } from '../services/unsplashService';

const ThermalVelocityChart = lazy(() => import('../components/analytics/ThermalVelocityChart'));
const DailySummaryCard = lazy(() => import('../components/analytics/DailySummaryCard'));
const AnalyticalStatsGrid = lazy(() => import('../components/analytics/AnalyticalStatsGrid'));

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

const AnalyticsPanelFallback = ({ className = '' }: { className?: string }) => (
  <div className={`glass-panel min-h-[320px] animate-pulse rounded-[2.5rem] border border-[var(--border-color)] bg-white/5 ${className}`} />
);

export default function AnalyticsPage() {
  const { weather, loading } = useWeather();
  const { settings } = useSettings();
  const [bgImage, setBgImage] = useState<string | null>(null);
  const isBangla = settings.language === 'bn';

  useEffect(() => {
    if (!weather) return;

    let isActive = true;
    unsplashService.getWeatherImage(`${weather.location.name} sky weather`).then((image) => {
      if (isActive) setBgImage(image);
    });

    return () => {
      isActive = false;
    };
  }, [weather?.location.name]);

  const chartData = useMemo(() => weather?.hourly.map((h) => ({
    time: new Date(h.time).toLocaleTimeString([], { hour: '2-digit' }),
    temp: h.temp,
    humidity: h.humidity,
    wind: h.windSpeed,
  })) || [], [weather?.hourly]);

  const handleExport = useCallback(() => {
    if (!weather) return;

    const exportPayload = {
      location: weather.location,
      current: weather.current,
      aqi: weather.aqi,
      hourly: chartData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cloudora-${weather.location.name.toLowerCase().replace(/\s+/g, '-')}-analytics.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }, [chartData, weather]);

  if (loading && !weather) return <AnalyticsSkeleton />;

  if (!weather) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="p-6 rounded-full bg-indigo-500/10 text-indigo-500 mb-6">
          <Activity size={48} />
        </div>
        <h2 className="text-2xl font-black text-[var(--text-main)] mb-2">{isBangla ? 'আবহাওয়ার তথ্য নেই' : 'No weather data'}</h2>
        <p className="text-[var(--text-muted)] max-w-md">{isBangla ? 'তথ্য দেখতে একটি শহর খুঁজুন।' : 'Search a city to see details.'}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-page relative"
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
              alt=""
              aria-hidden="true"
              decoding="async"
              className="w-full h-full object-cover opacity-50 saturate-[1.2]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="premium-page-inner max-w-7xl space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1 sm:px-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-[var(--text-main)] tracking-tighter">{isBangla ? 'আবহাওয়ার বিস্তারিত' : 'Weather details'}</h1>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] text-[10px] mt-3 opacity-40">{isBangla ? `${weather.location.name} এর তথ্য` : `Details for ${weather.location.name}`}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Filter analytics" className="p-4 rounded-2xl bg-white/40 dark:bg-black/40 border border-[var(--border-color)] hover:border-indigo-500/30 transition-all text-[var(--text-muted)] hover:text-indigo-500 shadow-sm">
              <Filter size={18} />
            </button>
            <button type="button" onClick={handleExport} className="flex items-center gap-3 px-6 sm:px-8 py-4 bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Suspense fallback={<AnalyticsPanelFallback className="xl:col-span-2" />}>
            <ThermalVelocityChart data={chartData} />
          </Suspense>
          <div className="space-y-8">
            <Suspense fallback={<AnalyticsPanelFallback />}>
              <DailySummaryCard weather={weather} chartData={chartData} />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<AnalyticsPanelFallback />}>
          <AnalyticalStatsGrid windSpeed={weather.current.windSpeed} />
        </Suspense>
      </div>
    </motion.div>
  );
}
