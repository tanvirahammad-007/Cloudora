import { Zap, Wind, Info, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { memo, useMemo } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';

interface AnalyticalStatsGridProps {
  windSpeed: number;
}

function AnalyticalStatsGrid({ windSpeed }: AnalyticalStatsGridProps) {
  const isMobile = useIsMobile();
  const stats = useMemo(() => [
    { icon: Zap, label: 'UV Flux', value: '7.4', unit: 'Index', color: 'text-amber-500' },
    { icon: Wind, label: 'Gust Max', value: windSpeed, unit: 'km/h', color: 'text-indigo-500' },
    { icon: Info, label: 'Dew Point', value: '18', unit: '°C', color: 'text-emerald-500' },
    { icon: Activity, label: 'Inertia', value: '1.2', unit: 'mb/s', color: 'text-purple-500' }
  ], [windSpeed]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6" role="list" aria-label="Analytical weather statistics">
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx}
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx }}
          className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] group hover:border-indigo-500/20 transition-all flex flex-col gap-4 shadow-lg"
          role="listitem"
        >
          <div className={cn("p-3 w-fit rounded-2xl bg-white/5 border border-[var(--border-color)]", stat.color)}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-3xl font-black text-[var(--text-main)] tracking-tighter">
              {stat.value} <span className="text-xs uppercase opacity-40 font-bold ml-1">{stat.unit}</span>
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-40 mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default memo(AnalyticalStatsGrid);
