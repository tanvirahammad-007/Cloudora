import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { Activity, Zap, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { unsplashService } from '../../services/unsplashService';
import ErrorStateCard from '../errors/ErrorStateCard';
import SafeImage from '../common/SafeImage';

const getAQILevel = (aqi: number, isBangla: boolean) => {
  // OpenWeatherMap AQI is 1-5
  switch (aqi) {
    case 1:
      return {
        label: isBangla ? 'খুব ভালো' : 'Very good',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500',
        description: isBangla ? 'বাতাস খুব ভালো।' : 'The air is very good.',
        icon: ShieldCheck,
        shadow: 'shadow-emerald-500/10'
      };
    case 2:
      return {
        label: isBangla ? 'ভালো' : 'Good',
        color: 'text-green-400',
        bg: 'bg-green-500',
        description: isBangla ? 'বাতাস ভালো আছে।' : 'The air is good.',
        icon: ShieldCheck,
        shadow: 'shadow-green-500/10'
      };
    case 3:
      return {
        label: isBangla ? 'মাঝারি' : 'Okay',
        color: 'text-amber-400',
        bg: 'bg-amber-500',
        description: isBangla ? 'হালকা দূষণ আছে।' : 'A little pollution is in the air.',
        icon: Info,
        shadow: 'shadow-amber-500/10'
      };
    case 4:
      return {
        label: isBangla ? 'খারাপ' : 'Bad',
        color: 'text-orange-400',
        bg: 'bg-orange-500',
        description: isBangla ? 'সংবেদনশীল মানুষ সাবধান থাকুন।' : 'Sensitive people should be careful.',
        icon: AlertTriangle,
        shadow: 'shadow-orange-500/10'
      };
    case 5:
      return {
        label: isBangla ? 'খুব খারাপ' : 'Very bad',
        color: 'text-red-400',
        bg: 'bg-red-500',
        description: isBangla ? 'বাতাস খুব খারাপ। বাইরে কম থাকুন।' : 'The air is very bad. Stay outside less.',
        icon: Zap,
        shadow: 'shadow-red-500/10'
      };
    default:
      return {
        label: isBangla ? 'জানা নেই' : 'Unknown',
        color: 'text-white/40',
        bg: 'bg-white/40',
        description: isBangla ? 'তথ্য পাওয়া যায়নি।' : 'No data available.',
        icon: Info,
        shadow: ''
      };
  }
};

const AirQualitySkeleton = () => (
  <div className="glass-panel p-10 flex flex-col rounded-[4rem] border border-[var(--border-color)] bg-[var(--panel-bg)] h-full min-h-[400px] animate-pulse">
    <div className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-white/5 rounded-[1.25rem]"></div>
        <div className="h-10 w-40 bg-white/5 rounded-xl"></div>
      </div>
      <div className="h-10 w-32 bg-white/5 rounded-full"></div>
    </div>

    <div className="flex-1 flex flex-col justify-center mb-12">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="h-40 w-40 bg-white/5 rounded-3xl"></div>
        <div className="flex-1 space-y-4 w-full">
          <div className="h-12 w-3/4 bg-white/5 rounded-2xl"></div>
          <div className="h-8 w-1/2 bg-white/5 rounded-xl"></div>
        </div>
      </div>
      <div className="w-full h-8 bg-white/5 rounded-[1.5rem] mt-12"></div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-auto">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-32 bg-white/5 rounded-[2.5rem]"></div>
      ))}
    </div>
  </div>
);

export default function AirQuality() {
  const { weather, loading, retryFetchWeather } = useWeather();
  const { settings } = useSettings();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (!weather) return;

    let isActive = true;
    unsplashService.getWeatherImage(`clear clean sky atmosphere ${weather.location.name}`).then((image) => {
      if (isActive) setBgImage(image);
    });

    return () => {
      isActive = false;
    };
  }, [weather?.location.lat, weather?.location.lon, weather?.location.name]);

  if (loading && !weather) return <AirQualitySkeleton />;

  if (!weather) return null;

  if (!weather.aqi) {
    return (
      <ErrorStateCard
        kind="air-quality-unavailable"
        title={settings.language === 'bn' ? 'বাতাসের মান পাওয়া যায়নি' : 'Air quality is unavailable'}
        message={settings.language === 'bn' ? 'এই জায়গার AQI এখন পাওয়া যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।' : 'AQI readings are missing for this location right now.'}
        actionLabel={settings.language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}
        onRetry={retryFetchWeather}
        compact
        className="h-full min-h-[400px]"
      />
    );
  }

  const isBangla = settings.language === 'bn';
  const aqiInfo = getAQILevel(weather.aqi.us, isBangla);
  const StatusIcon = aqiInfo.icon;
  const copy = {
    title: isBangla ? 'বাতাসের মান' : 'Air Quality',
    index: isBangla ? 'স্কোর' : 'Score',
    safety: isBangla ? 'বাতাস কতটা নিরাপদ' : 'Air safety',
    safe: isBangla ? 'ভালো' : 'Good',
    hazard: isBangla ? 'খারাপ' : 'Bad',
  };

  const metrics = [
    { label: 'PM2.5', value: weather.aqi.pm25, desc: isBangla ? 'ভালো' : 'Good' },
    { label: 'PM10', value: weather.aqi.pm10, desc: isBangla ? 'ঠিক আছে' : 'Okay' },
    { label: 'CO', value: Math.round(weather.aqi.co), desc: isBangla ? 'সাধারণ' : 'Normal' },
    { label: 'NO2', value: Math.round(weather.aqi.no2), desc: isBangla ? 'খেয়াল রাখুন' : 'Watch' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      role="region"
      aria-label="Air quality"
      className="glass-panel p-5 lg:p-7 flex flex-col rounded-[2.5rem] lg:rounded-[3rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 h-full min-h-[400px] group transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--text-main)]/5 active:scale-[0.99] overflow-hidden relative"
    >
      {/* Background Image with Enhanced Overlay */}
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <SafeImage
              src={bgImage}
              alt=""
              decoding="async"
              aria-hidden="true"
              className="w-full h-full object-cover brightness-110 saturate-[1.2] contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/80 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8 lg:mb-10">
          <div className="flex items-center gap-3 lg:gap-4 min-w-0">
            <div className="p-3.5 lg:p-4 rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl shadow-emerald-500/20 shrink-0">
              <Activity size={24} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <h4 className="typo-h3 leading-none">{copy.title}</h4>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(
              "px-5 py-2 rounded-full border border-current backdrop-blur-xl transition-all duration-500 shrink-0",
              aqiInfo.bg, "bg-opacity-5", aqiInfo.color
            )}
          >
            <span className="typo-label opacity-100">{aqiInfo.label}</span>
          </motion.div>
        </div>

        <div className="flex-1 flex flex-col justify-center mb-8 lg:mb-10">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5 lg:gap-7 text-center md:text-left">
            <div className="group/aqi shrink-0 flex items-center justify-center gap-4 rounded-[2rem] bg-[var(--text-main)]/[0.035] border border-[var(--border-color)] px-5 py-4">
              <span className="text-6xl lg:text-7xl font-black leading-none tracking-tight opacity-100">{weather.aqi.us}</span>
              <div className="flex flex-col items-start gap-1">
                <span className={cn("text-[10px] font-black uppercase tracking-[0.28em]", aqiInfo.color)}>AQI</span>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--text-muted)] opacity-50">{copy.index}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-lg lg:text-2xl font-black tracking-tight mb-4 leading-tight max-w-xl">{aqiInfo.description}</h3>
              <div className="flex items-center justify-center md:justify-start gap-3 transition-all duration-500 hover:translate-x-2">
                <div className={cn("p-2 rounded-xl border border-current shrink-0", aqiInfo.color)}>
                  <StatusIcon size={20} strokeWidth={2} />
                </div>
                <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.24em] text-[var(--text-muted)] opacity-70">{copy.safety}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-4 bg-[var(--text-main)]/5 rounded-full overflow-hidden mt-8 lg:mt-10 relative border border-[var(--border-color)] p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((weather.aqi.us / 5) * 100, 100)}%` }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className={cn("h-full rounded-full bg-current relative z-10", aqiInfo.color)}
            ></motion.div>
          </div>
          <div className="flex justify-between mt-4 px-2">
            <span className="typo-label opacity-20">{copy.safe}</span>
            <span className="typo-label opacity-20">{copy.hazard}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 min-[1500px]:grid-cols-4 gap-3 lg:gap-4 mt-auto" role="list" aria-label="Air pollutant readings">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex flex-col gap-3 p-4 lg:p-5 rounded-2xl lg:rounded-[1.75rem] bg-[var(--text-main)]/[0.04] border border-transparent hover:border-[var(--border-color)] transition-all duration-500 group/metric cursor-default min-w-0"
              role="listitem"
            >
              <div className="flex items-center justify-between">
                <span className="typo-label tracking-tighter">{m.label}</span>
                <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]" : i === 1 ? "bg-emerald-400/40" : i === 2 ? "bg-amber-400/40" : "bg-rose-400/40")}></div>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-2xl lg:text-3xl font-black leading-none tracking-tight">{m.value}</span>
                <span className="text-[11px] font-bold opacity-45">ug/m3</span>
              </div>
              <p className="typo-label text-[10px] opacity-20 group-hover:opacity-60 transition-opacity">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
