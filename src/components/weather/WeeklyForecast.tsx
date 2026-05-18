import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { convertTemp } from '../../lib/unitUtils';
import ErrorStateCard from '../errors/ErrorStateCard';
import SafeImage from '../common/SafeImage';
import { memo, useMemo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

const ForecastSkeleton = () => (
  <div className="glass-panel p-10 flex flex-col rounded-[4rem] border border-[var(--border-color)] bg-[var(--panel-bg)] h-full overflow-hidden animate-pulse">
    <div className="flex items-center gap-5 mb-12">
      <div className="h-14 w-14 bg-white/5 rounded-[1.5rem]"></div>
      <div className="h-10 w-40 bg-white/5 rounded-xl"></div>
    </div>
    <div className="space-y-6 flex-1 pr-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between p-7 rounded-[3rem] bg-white/5 border border-[var(--border-color)]">
          <div className="flex items-center gap-8">
            <div className="h-16 w-16 bg-white/5 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-4 w-20 bg-white/5 rounded opacity-40"></div>
              <div className="h-6 w-32 bg-white/5 rounded-lg"></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="h-10 w-12 bg-white/5 rounded-xl"></div>
            <div className="w-[1px] h-10 bg-[var(--border-color)] opacity-40"></div>
            <div className="h-10 w-12 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-8 h-16 w-full bg-white/5 rounded-[1.5rem]"></div>
  </div>
);

function WeeklyForecast() {
  const { weather, loading, retryFetchWeather } = useWeather();
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const itemAnimationsEnabled = settings.animationsEnabled && !isMobile;
  const forecastDays = useMemo(() => weather?.daily.map((day, idx) => ({
    ...day,
    dateLabel: idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString(settings.language === 'en' ? 'en-US' : settings.language, { weekday: 'long' }),
    displayMaxTemp: Math.round(convertTemp(day.maxTemp, settings.tempUnit)),
    displayMinTemp: Math.round(convertTemp(day.minTemp, settings.tempUnit)),
  })) || [], [settings.language, settings.tempUnit, weather?.daily]);

  if (loading && !weather) return <ForecastSkeleton />;
  if (!weather) return null;

  if (weather.daily.length === 0) {
    return (
      <ErrorStateCard
        kind="forecast-unavailable"
        title={settings.language === 'bn' ? 'আগাম আবহাওয়া পাওয়া যায়নি' : 'Forecast is unavailable'}
        message={settings.language === 'bn' ? 'এই জায়গার আগামী দিনের তথ্য এখন আসেনি। বর্তমান আবহাওয়া দেখা যাচ্ছে।' : 'The forecast did not arrive for this location. Current weather is still available.'}
        actionLabel={settings.language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry forecast'}
        onRetry={retryFetchWeather}
        compact
        className="h-full min-h-[320px]"
      />
    );
  }

  return (
    <section aria-label="Weekly forecast" className="glass-panel p-[var(--spacing-gap-md)] flex flex-col rounded-[4.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 h-full overflow-hidden group transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--text-main)]/5">
      <div className="flex items-center justify-between mb-[var(--spacing-gap-lg)]">
        <div className="flex items-center gap-5">
          <div className="p-4 rounded-[1.25rem] bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-2xl shadow-violet-500/20">
            <Calendar size={24} strokeWidth={1.5} />
          </div>
          <h3 className="typo-h3">Forecast Horizon</h3>
        </div>
        <button type="button" className="typo-label px-6 py-3 glass rounded-full hover:bg-[var(--text-main)]/5 transition-colors" aria-label="Open full weekly forecast">
          Full View
        </button>
      </div>

      <div className="flex flex-col gap-[var(--spacing-gap-sm)] flex-1 overflow-y-auto custom-scrollbar pr-1" role="list">
        {forecastDays.map((day, idx) => (
          <motion.div 
            initial={itemAnimationsEnabled ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            key={day.date} 
            className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] bg-[var(--text-main)]/[0.02] border border-transparent hover:border-[var(--border-color)] hover:bg-[var(--text-main)]/[0.05] transition-all duration-500 group/item cursor-default gap-6 sm:gap-0"
            role="listitem"
          >
            <div className="flex items-center gap-6 lg:gap-10 relative z-10 w-full sm:w-auto">
              <div className="relative group-hover/item:scale-110 transition-transform duration-700 shrink-0">
                <SafeImage 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                  alt={day.condition} 
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 lg:w-14 lg:h-14 drop-shadow-2xl relative z-10 invert dark:invert-0 brightness-[1.2]"
                />
              </div>
              <div className="min-w-0">
                <p className="typo-label mb-1 lg:mb-2 opacity-30 group-hover:opacity-60 transition-opacity truncate">
                  {day.dateLabel}
                </p>
                <h4 className="text-lg lg:typo-h3 truncate max-w-[200px]">
                  {day.condition}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-8 lg:gap-10 relative z-10 ml-auto sm:ml-0">
              <div className="flex flex-col items-end">
                <span className="text-2xl lg:typo-h2 leading-none">
                  {day.displayMaxTemp}°
                </span>
                <span className="text-[9px] lg:typo-label mt-1 lg:mt-2 text-amber-400 opacity-100">Peak</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xl lg:typo-h3 leading-none opacity-20">
                  {day.displayMinTemp}°
                </span>
                <span className="text-[9px] lg:typo-label mt-1 lg:mt-2 text-sky-400">Dip</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default memo(WeeklyForecast);
