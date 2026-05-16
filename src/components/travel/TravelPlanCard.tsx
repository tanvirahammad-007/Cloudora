import { motion } from 'motion/react';
import { TravelPlan } from '../../types/travel';
import { 
  Calendar, 
  MapPin, 
  Wind, 
  Droplets, 
  Thermometer, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  Info,
  CalendarDays,
  Sunrise,
  Sunset,
  Wind as AirIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { convertTemp } from '../../lib/unitUtils';
import { useSettings } from '../../context/SettingsContext';
import ForecastChart from './ForecastChart';

interface TravelPlanCardProps {
  plan: TravelPlan;
  onDelete: (id: string) => void;
}

export default function TravelPlanCard({ plan, onDelete }: TravelPlanCardProps) {
  const { settings } = useSettings();
  const isBangla = settings.language === 'bn';

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAQILabel = (aqi: number) => {
    switch (aqi) {
      case 1: return { label: 'Excellent', color: 'text-emerald-500' };
      case 2: return { label: 'Good', color: 'text-emerald-400' };
      case 3: return { label: 'Fair', color: 'text-orange-400' };
      case 4: return { label: 'Poor', color: 'text-red-400' };
      case 5: return { label: 'Hazardous', color: 'text-red-600' };
      default: return { label: 'Unknown', color: 'text-gray-400' };
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const dayCount = Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)) || 1;

  return (
    <article className="glass-panel overflow-hidden rounded-[2.5rem] lg:rounded-[3rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/60 hover:bg-[var(--panel-bg)] transition-all group shadow-xl h-full">
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] to-transparent z-10" />
        <img 
          src={`https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800`} 
          alt={plan.city.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
            <span className={cn("text-lg font-black", getScoreColor(plan.score))}>{plan.score}</span>
            <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Comfort Index</span>
          </div>
        </div>
        <div className="absolute bottom-6 left-8 z-20">
          <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter">{plan.city.name}</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">{plan.city.country}</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">
                {new Date(plan.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(plan.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
                {isBangla ? `${dayCount} দিনের ভ্রমণ` : `${dayCount} day trip`}
              </p>
            </div>
          </div>
          <p className="text-[9px] font-black bg-[var(--text-main)]/[0.05] border border-[var(--border-color)] px-3 py-1.5 rounded-full uppercase tracking-widest">{plan.climateType}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-[2rem] bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] group/item hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer size={16} className="text-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Thermal Average</span>
            </div>
            <p className="text-3xl font-black tracking-tight">{Math.round(convertTemp(plan.weatherSummary.avgTemp, settings.tempUnit))}°{settings.tempUnit}</p>
            <div className="mt-2 flex items-center justify-between opacity-30 text-[9px] font-bold">
               <span>L: {Math.round(convertTemp(plan.weatherSummary.minTemp, settings.tempUnit))}°</span>
               <span>H: {Math.round(convertTemp(plan.weatherSummary.maxTemp, settings.tempUnit))}°</span>
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] group/item hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Droplets size={16} className="text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Saturation</span>
            </div>
            <p className="text-3xl font-black tracking-tight">{plan.weatherSummary.avgRainChance}%</p>
            <div className="mt-2 flex items-center gap-2 opacity-30 text-[9px] font-bold">
               <TrendingUp size={10} />
               <span>Low Humidity Risk</span>
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] group/item hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <AirIcon size={16} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Air Quality</span>
            </div>
            <p className="text-xl font-black tracking-tight">{getAQILabel(plan.weatherSummary.aqi).label}</p>
            <div className="mt-2 flex items-center gap-2 opacity-30 text-[9px] font-bold">
               <span className={cn("px-2 py-0.5 rounded-full border border-current", getAQILabel(plan.weatherSummary.aqi).color)}>Index {plan.weatherSummary.aqi}</span>
            </div>
          </div>

          <div className="p-5 rounded-[2rem] bg-[var(--text-main)]/[0.03] border border-[var(--border-color)] group/item hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Sunrise size={16} className="text-yellow-500" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Solar Metrics</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold opacity-60">First Light</span>
                <span className="text-[10px] font-black">{formatTime(plan.weatherSummary.sunrise)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold opacity-60">Last Light</span>
                <span className="text-[10px] font-black">{formatTime(plan.weatherSummary.sunset)}</span>
              </div>
            </div>
          </div>
        </div>

        {plan.weatherSummary.forecast && (
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50">Thermal Velocity</h4>
                <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest">7-Day Projection</span>
             </div>
             <ForecastChart data={plan.weatherSummary.forecast} />
          </div>
        )}

        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Intelligent Briefing</h4>
           </div>
           <div className="grid grid-cols-1 gap-3">
              <div className="glass p-5 rounded-2xl border border-indigo-500/10 flex items-start gap-4">
                 <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0">
                    <Info size={14} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Peak Opportunity</p>
                    <p className="text-xs font-medium leading-relaxed">The best climatic window for activities is <span className="text-indigo-500 font-bold">{plan.recommendations.bestDay}</span>.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-indigo-500/5 p-6 rounded-[2rem] border border-indigo-500/10">
           <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-50">Packing Protocol</h4>
           <div className="flex flex-wrap gap-2">
              {plan.recommendations.packing.map((item, i) => (
                <span key={i} className="text-[9px] font-bold px-4 py-2 bg-white/5 border border-white/10 rounded-full">{item}</span>
              ))}
           </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
          <button 
            onClick={() => onDelete(plan.id)}
            type="button"
            aria-label={`Delete trip plan for ${plan.city.name}`}
            className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 px-5 py-3 rounded-2xl transition-all text-[9px] font-black uppercase tracking-widest"
          >
            <Trash2 size={14} />
            Discard Plan
          </button>
          
          <div className="flex items-center gap-3 opacity-30">
             <Calendar size={12} />
             <span className="text-[9px] font-bold">Generated {new Date(plan.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
