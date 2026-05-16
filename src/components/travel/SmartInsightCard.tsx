import { Sun, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useWeather } from '../../context/WeatherContext';
import { useSettings } from '../../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

export default function SmartInsightCard() {
  const { profile } = useUser();
  const { fetchWeather } = useWeather();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const isBangla = settings.language === 'bn';

  const favorite = profile.favorites[0];

  if (!favorite) return null;

  return (
    <div className="glass-panel p-10 rounded-[3.5rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-red-500/5 backdrop-blur-[12px] relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform text-orange-600 duration-700">
        <Sun size={80} />
      </div>
      <h4 className="text-xl font-black text-[var(--text-main)] tracking-tight relative z-10">{isBangla ? 'ভালো সময়' : 'Good time to visit'}</h4>
      <p className="text-sm text-[var(--text-muted)] mt-3 font-medium leading-relaxed opacity-80 relative z-10">
        {isBangla ? 'আগামী সপ্তাহে ' : 'Next week looks good for '}
        <span className="text-orange-600 font-bold">{favorite.name}</span>
        {isBangla ? ' ভ্রমণের জন্য। আকাশ পরিষ্কার থাকতে পারে।' : '. The sky may be clear.'}
      </p>
      <button 
        type="button"
        onClick={() => {
          fetchWeather(favorite.lat, favorite.lon, favorite.name);
          navigate('/');
        }}
        className="flex items-center gap-3 mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 hover:gap-5 transition-all"
      >
        {isBangla ? 'বিস্তারিত দেখুন' : 'View details'} <ArrowRight size={16} />
      </button>
    </div>
  );
}
