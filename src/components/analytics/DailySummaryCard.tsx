import { TrendingUp, Droplets, Wind } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { memo, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useIsMobile } from '../../hooks/useIsMobile';

interface DailySummaryCardProps {
  weather: any;
  chartData: any[];
}

function DailySummaryCard({ weather, chartData }: DailySummaryCardProps) {
  const windBars = useMemo(() => chartData.slice(0, 12), [chartData]);
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const animationsEnabled = settings.animationsEnabled && !isMobile;

  return (
    <section aria-label="Daily weather summary" className="glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl h-full flex flex-col justify-between group transition-all hover:border-indigo-500/20">
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <TrendingUp size={22} />
          </div>
          <h3 className="text-xl font-black text-[var(--text-main)] tracking-tight">Daily Summary</h3>
        </div>
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40">Saturation</span>
              <Droplets size={18} className="text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{weather.current.humidity}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={animationsEnabled ? { width: 0 } : { width: `${weather.current.humidity}%` }}
                animate={{ width: `${weather.current.humidity}%` }}
                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              />
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-white/5 border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest opacity-40">Wind Shear</span>
              <Wind size={18} className="text-indigo-400" />
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={windBars}>
                  <Bar dataKey="wind" radius={[4, 4, 0, 0]}>
                    {windBars.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(DailySummaryCard);
