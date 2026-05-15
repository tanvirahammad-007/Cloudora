import { useWeather } from '../../context/WeatherContext';
import WeatherHero from '../weather/WeatherHero';
import HourlyForecast from '../weather/HourlyForecast';
import WeeklyForecast from '../weather/WeeklyForecast';
import AirQuality from '../weather/AirQuality';
import { motion } from 'motion/react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function MainDashboard() {
  const { loading, error, weather } = useWeather();

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text-main)] flex-col gap-6 glass rounded-[2.5rem] p-12 text-center border border-[var(--border-color)]">
        <div className="w-20 h-20 rounded-3xl bg-[var(--text-main)]/5 flex items-center justify-center text-[var(--text-main)] mb-2">
          <p className="text-4xl font-black">!</p>
        </div>
        <div className="space-y-2">
          <p className="font-black text-3xl tracking-tight">Atmospheric Feed Interrupted</p>
          <p className="text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[var(--text-main)] hover:bg-[var(--text-main)]/90 text-[var(--bg-color)] font-bold rounded-2xl transition-all shadow-xl active:scale-95"
        >
          Re-sync
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 flex flex-col gap-[var(--spacing-gap-lg)] w-full pb-20"
    >
      <motion.div variants={item}>
        <WeatherHero />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-5 gap-[var(--spacing-gap-md)] lg:gap-[var(--spacing-gap-lg)]">
        <motion.div variants={item} className="md:col-span-2 lg:col-span-1 xl:col-span-3">
          <HourlyForecast />
        </motion.div>
        <motion.div variants={item} className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <AirQuality />
        </motion.div>
      </div>

      <motion.div variants={item} className="flex-1">
        <WeeklyForecast />
      </motion.div>
    </motion.div>
  );
}
