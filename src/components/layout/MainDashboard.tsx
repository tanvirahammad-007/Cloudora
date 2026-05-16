import { useWeather } from '../../context/WeatherContext';
import WeatherHero from '../weather/WeatherHero';
import HourlyForecast from '../weather/HourlyForecast';
import WeeklyForecast from '../weather/WeeklyForecast';
import AirQuality from '../weather/AirQuality';
import ErrorStateCard from '../errors/ErrorStateCard';
import { motion } from 'motion/react';
import { useSettings } from '../../context/SettingsContext';

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
  const { error, appError, retryFetchWeather, weather } = useWeather();
  const { settings } = useSettings();
  const isBangla = settings.language === 'bn';

  if (error && !weather) {
    return (
      <ErrorStateCard
        error={appError}
        title={isBangla ? 'আবহাওয়া বন্ধ আছে' : appError?.title}
        message={error}
        actionLabel={isBangla ? 'আবার চেষ্টা করুন' : appError?.actionLabel}
        onRetry={appError?.retryable !== false ? retryFetchWeather : undefined}
      />
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
