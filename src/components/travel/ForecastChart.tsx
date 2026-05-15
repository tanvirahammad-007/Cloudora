import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useSettings } from '../../context/SettingsContext';
import { convertTemp } from '../../lib/unitUtils';

interface ForecastChartProps {
  data: { date: string; maxTemp: number }[];
}

export default function ForecastChart({ data }: ForecastChartProps) {
  const { settings } = useSettings();

  const chartData = data.map(d => ({
    name: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    temp: Math.round(convertTemp(d.maxTemp, settings.tempUnit))
  }));

  return (
    <div className="h-[120px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--text-main)" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="var(--text-main)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            hide 
          />
          <YAxis 
            hide 
            domain={['dataMin - 5', 'dataMax + 5']} 
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
                    <p className="text-[10px] font-black">{payload[0].value}°{settings.tempUnit}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="temp" 
            stroke="var(--text-main)" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#tempGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
