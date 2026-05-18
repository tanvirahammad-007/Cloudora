import { Thermometer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { memo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useIsMobile } from '../../hooks/useIsMobile';

interface ThermalVelocityChartProps {
  data: any[];
}

function ThermalVelocityChart({ data }: ThermalVelocityChartProps) {
  const { settings } = useSettings();
  const isMobile = useIsMobile();
  const animationDuration = settings.animationsEnabled && !isMobile ? 900 : 0;

  return (
    <section aria-label="Thermal velocity chart" className="xl:col-span-2 glass-panel p-6 sm:p-8 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)] shadow-xl overflow-hidden relative group transition-all hover:border-indigo-500/20">
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            <Thermometer size={22} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-[var(--text-main)] tracking-tight">Thermal Velocity</h3>
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-40">Next 24 Hours</p>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] sm:h-[360px] lg:h-[400px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTempAnalytics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 900, opacity: 0.4 }} 
              dy={15}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 900, opacity: 0.4 }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '1.5rem', 
                background: 'var(--panel-bg)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                padding: '1rem',
                color: 'var(--text-main)'
              }} 
            />
            <Area type="monotone" dataKey="temp" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorTempAnalytics)" isAnimationActive={animationDuration > 0} animationDuration={animationDuration} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default memo(ThermalVelocityChart);
