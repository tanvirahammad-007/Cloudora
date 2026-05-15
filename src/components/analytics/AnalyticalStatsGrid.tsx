import { Zap, Wind, Info, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface AnalyticalStatsGridProps {
  windSpeed: number;
}

export default function AnalyticalStatsGrid({ windSpeed }: AnalyticalStatsGridProps) {
  const stats = [
    { icon: Zap, label: 'UV Flux', value: '7.4', unit: 'Index', color: 'text-amber-500' },
    { icon: Wind, label: 'Gust Max', value: windSpeed, unit: 'km/h', color: 'text-indigo-500' },
    { icon: Info, label: 'Dew Point', value: '18', unit: '°C', color: 'text-emerald-500' },
    { icon: Activity, label: 'Inertia', value: '1.2', unit: 'mb/s', color: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx }}
          className="glass-panel p-8 rounded-[2.5rem] border border-[var(--border-color)] group hover:border-indigo-500/20 transition-all flex flex-col gap-4 shadow-lg"
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
