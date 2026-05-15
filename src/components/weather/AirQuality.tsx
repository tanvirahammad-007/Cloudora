import { useWeather } from '../../context/WeatherContext';
import { Wind, Activity, Zap, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { unsplashService } from '../../services/unsplashService';

const getAQILevel = (aqi: number) => {
  // OpenWeatherMap AQI is 1-5
  switch (aqi) {
    case 1:
      return { 
        label: 'Pristine', 
        color: 'text-[var(--text-main)]', 
        bg: 'bg-[var(--text-main)]', 
        description: 'Atmosphere is perfectly balanced.', 
        icon: ShieldCheck,
        shadow: 'shadow-[var(--text-main)]/10'
      };
    case 2:
      return { 
        label: 'Optimal', 
        color: 'text-[var(--text-main)]/80', 
        bg: 'bg-[var(--text-main)]/80', 
        description: 'Quality is within safe parameters.', 
        icon: ShieldCheck,
        shadow: 'shadow-[var(--text-main)]/10'
      };
    case 3:
      return { 
        label: 'Moderate', 
        color: 'text-[var(--text-main)]/60', 
        bg: 'bg-[var(--text-main)]/60', 
        description: 'Nominal pollution detected.', 
        icon: Info,
        shadow: 'shadow-[var(--text-main)]/10'
      };
    case 4:
      return { 
        label: 'Degraded', 
        color: 'text-[var(--text-main)]/40', 
        bg: 'bg-[var(--text-main)]/40', 
        description: 'System alert: Sensitive risk.', 
        icon: AlertTriangle,
        shadow: 'shadow-[var(--text-main)]/10'
      };
    case 5:
      return { 
        label: 'Critical', 
        color: 'text-[var(--text-main)]/20', 
        bg: 'bg-[var(--text-main)]/20', 
        description: 'Emergency: High toxicity.', 
        icon: Zap,
        shadow: 'shadow-[var(--text-main)]/10'
      };
    default:
      return { 
        label: 'Unknown', 
        color: 'text-white/40', 
        bg: 'bg-white/40', 
        description: 'Data unavailable.', 
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
  const { weather, loading } = useWeather();
  const [bgImage, setBgImage] = useState<string | null>(null);

  useEffect(() => {
    if (weather) {
      unsplashService.getWeatherImage(`clear clean sky atmosphere ${weather.location.name}`).then(setBgImage);
    }
  }, [weather]);

  if (loading && !weather) return <AirQualitySkeleton />;

  if (!weather) return null;

  const aqiInfo = getAQILevel(weather.aqi.us);
  const StatusIcon = aqiInfo.icon;

  const metrics = [
    { label: 'PM2.5', value: weather.aqi.pm25, unit: 'μg/m³', desc: 'Optimal', color: 'from-[var(--text-main)]/20 to-[var(--text-main)]/10' },
    { label: 'PM10', value: weather.aqi.pm10, unit: 'μg/m³', desc: 'Acceptable', color: 'from-[var(--text-main)]/15 to-[var(--text-main)]/5' },
    { label: 'CO', value: Math.round(weather.aqi.co), unit: 'μg/m³', desc: 'Standard', color: 'from-[var(--text-main)]/10 to-[var(--text-main)]/5' },
    { label: 'NO2', value: Math.round(weather.aqi.no2), unit: 'μg/m³', desc: 'Critical', color: 'from-[var(--text-main)]/5 to-transparent' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-[var(--spacing-gap-md)] lg:p-[var(--spacing-gap-lg)] flex flex-col rounded-[4rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 h-full min-h-[400px] group transition-all duration-700 hover:shadow-2xl hover:shadow-[var(--text-main)]/5 active:scale-[0.99] overflow-hidden relative"
    >
      {/* Background Image with Enhanced Overlay */}
      <AnimatePresence mode="wait">
        {bgImage && (
          <motion.div 
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={bgImage} 
              alt="Air Quality Background" 
              className="w-full h-full object-cover grayscale brightness-110 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/80 to-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-center mb-[var(--spacing-gap-lg)]">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[1.25rem] bg-[var(--text-main)] text-[var(--bg-color)] shadow-2xl">
              <Activity size={24} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <h4 className="typo-h3">Air Integrity</h4>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={cn(
              "px-6 py-2.5 rounded-full border border-current backdrop-blur-xl transition-all duration-500",
              aqiInfo.bg, "bg-opacity-5", aqiInfo.color
            )}
          >
            <span className="typo-label opacity-100">{aqiInfo.label}</span>
          </motion.div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center mb-[var(--spacing-gap-lg)]">
          <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            <div className="relative group/aqi">
              <span className="typo-display leading-none opacity-100">{weather.aqi.us}</span>
              <div className="absolute -top-6 -right-6 px-3 py-1 glass rounded-lg typo-xs opacity-50 uppercase tracking-widest">AQI</div>
            </div>
            <div className="flex-1">
              <h3 className="typo-h2 mb-4 leading-tight">{aqiInfo.description}</h3>
              <div className="flex items-center justify-center md:justify-start gap-4 transition-all duration-500 hover:translate-x-2">
                <div className={cn("p-2 rounded-xl border border-current", aqiInfo.color)}>
                  <StatusIcon size={20} strokeWidth={2} />
                </div>
                <span className="typo-label opacity-40">System Safety Rating</span>
              </div>
            </div>
          </div>

          <div className="w-full h-4 bg-[var(--text-main)]/5 rounded-full overflow-hidden mt-12 relative border border-[var(--border-color)] p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((weather.aqi.us / 500) * 100, 100)}%` }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className={cn("h-full rounded-full bg-current relative z-10", aqiInfo.color)}
            ></motion.div>
          </div>
          <div className="flex justify-between mt-6 px-2">
            <span className="typo-label opacity-20">Safe</span>
            <span className="typo-label opacity-20">Lethal</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gap-sm)] mt-auto">
          {metrics.map((m, i) => (
            <motion.div 
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex flex-col gap-4 p-8 rounded-[3rem] bg-[var(--text-main)]/[0.02] border border-transparent hover:border-[var(--border-color)] transition-all duration-500 group/metric cursor-default"
            >
              <div className="flex items-center justify-between">
                <span className="typo-label tracking-tighter">{m.label}</span>
                <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-[var(--text-main)] shadow-[0_0_8px_var(--text-main)]" : "bg-[var(--text-main)]/10")}></div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="typo-h3 text-2xl">{m.value}</span>
                <span className="typo-xs opacity-30">{m.unit}</span>
              </div>
              <p className="typo-label text-[10px] opacity-20 group-hover:opacity-60 transition-opacity">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
