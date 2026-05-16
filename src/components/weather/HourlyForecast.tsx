import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { convertTemp } from '../../lib/unitUtils';
import ErrorStateCard from '../errors/ErrorStateCard';
import SafeImage from '../common/SafeImage';

const HourlyForecastSkeleton = () => (
  <div className="glass-panel p-10 flex flex-col rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] h-full min-h-[360px] animate-pulse">
    <div className="flex items-center justify-between mb-10">
      <div className="space-y-3">
        <div className="h-4 w-32 bg-white/5 rounded"></div>
        <div className="h-8 w-48 bg-white/5 rounded-lg"></div>
      </div>
      <div className="h-10 w-24 bg-white/5 rounded-full"></div>
    </div>
    <div className="flex gap-6 overflow-hidden">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="flex flex-col items-center justify-between min-w-[100px] p-6 rounded-[2.5rem] bg-white/[0.03] border border-[var(--border-color)] space-y-4">
          <div className="h-4 w-12 bg-white/5 rounded opacity-40"></div>
          <div className="h-16 w-16 bg-white/5 rounded-full"></div>
          <div className="h-8 w-12 bg-white/5 rounded-lg"></div>
        </div>
      ))}
    </div>
    <div className="flex-1 mt-6 h-32 bg-white/5 rounded-2xl opacity-20"></div>
  </div>
);

export default function HourlyForecast() {
  const { weather, loading, retryFetchWeather } = useWeather();
  const { settings } = useSettings();

  if (loading && !weather) return <HourlyForecastSkeleton />;
  if (!weather) return null;

  if (weather.hourly.length === 0) {
    return (
      <ErrorStateCard
        kind="forecast-unavailable"
        title={settings.language === 'bn' ? 'ঘন্টার পূর্বাভাস পাওয়া যায়নি' : 'Hourly forecast is unavailable'}
        message={settings.language === 'bn' ? 'ঘন্টার আবহাওয়া এখন পাওয়া যাচ্ছে না। বর্তমান আবহাওয়া ঠিক আছে।' : 'Hourly details did not arrive. Current weather is still available.'}
        actionLabel={settings.language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry forecast'}
        onRetry={retryFetchWeather}
        compact
        className="h-full min-h-[360px]"
      />
    );
  }

  const chartData = weather.hourly.map(h => ({
    time: new Date(h.time).getHours() + ':00',
    temp: Math.round(convertTemp(h.temp, settings.tempUnit)),
  }));

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
  };

  return (
    <section aria-label="Hourly forecast" className="glass-panel p-[var(--spacing-gap-md)] flex flex-col rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 h-full min-h-[360px] group transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--text-main)]/5 relative overflow-hidden">
      <div className="flex items-center justify-between mb-[var(--spacing-gap-md)]">
        <div>
          <h3 className="typo-label mb-1">Forecast Cycles</h3>
          <p className="typo-h3">Today's Temperature</p>
        </div>
        <div className="typo-label px-4 py-1.5 rounded-full border border-sky-500/20 text-sky-400">
          24h Window
        </div>
      </div>
      
      <div className="flex gap-[var(--spacing-gap-md)] overflow-x-auto pb-8 custom-scrollbar -mx-4 px-4 z-10 relative" role="list" aria-label="Hourly weather cards">
        {weather.hourly.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className="flex flex-col items-center justify-between min-w-[104px] sm:min-w-[110px] p-6 sm:p-8 rounded-[2.5rem] sm:rounded-[3rem] bg-[var(--text-main)]/[0.02] border border-[var(--border-color)] hover:bg-[var(--text-main)]/[0.04] hover:border-[var(--text-main)]/20 transition-all duration-500 cursor-default group/item"
            role="listitem"
          >
            <span className="typo-label tracking-tighter opacity-30 group-hover/item:opacity-100 transition-all">
              {formatTime(h.time)}
            </span>
            <div className="relative group-hover:scale-110 transition-transform duration-700 my-4">
              <SafeImage 
                src={`https://openweathermap.org/img/wn/${h.icon}@2x.png`} 
                alt={h.condition}
                loading="lazy"
                decoding="async"
                className="w-14 h-14 drop-shadow-xl relative z-10 invert dark:invert-0 brightness-[1.2]"
              />
            </div>
            <span className="typo-h3 leading-none">{Math.round(convertTemp(h.temp, settings.tempUnit))}°</span>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 -mx-8 -mb-8 h-40 opacity-10 group-hover:opacity-25 transition-opacity duration-1000 mt-6 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis hide dataKey="time" />
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--panel-bg)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '16px',
                fontSize: '11px',
                color: 'var(--text-main)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              }}
              itemStyle={{ color: 'var(--text-main)', fontWeight: '900' }}
              labelStyle={{ display: 'none' }}
              cursor={{ stroke: 'var(--text-main)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#38bdf8" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
              className="text-[var(--text-main)]"
              animationDuration={2500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
