import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Heart, 
  Activity, 
  Search, 
  Clock, 
  Cloud, 
  Zap, 
  Settings, 
  Edit3, 
  Camera, 
  Globe,
  Star,
  History,
  TrendingUp,
  Layout,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useUser, UserProfile } from '../context/UserContext';
import { useWeather } from '../context/WeatherContext';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { profile, updateProfile, toggleFavorite } = useUser();
  const { weather, searchHistory, fetchWeather } = useWeather();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
  };

  const lastCity = searchHistory[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 p-4 sm:p-6 lg:p-8 h-full overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Profile Identity Card */}
        <div className="glass-panel relative overflow-hidden rounded-[4rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80 group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-10 group-hover:rotate-12 transition-all duration-[2s] text-[var(--text-main)] scale-150 pointer-events-none">
            <User size={200} />
          </div>
          
          <div className="p-8 lg:p-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
              <div className="relative group/avatar">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] overflow-hidden border-4 border-white/10 shadow-2xl transition-all duration-700 group-hover/avatar:scale-105 group-hover/avatar:border-[var(--text-main)]/30">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-2 right-2 p-3 bg-[var(--text-main)] text-[var(--bg-color)] rounded-2xl shadow-xl active:scale-95 transition-all opacity-0 group-hover/avatar:opacity-100"
                >
                  <Camera size={18} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                    {profile.name}
                  </h1>
                  <p className="typo-label text-indigo-500/80 font-black tracking-[0.2em] uppercase">Advanced Climate Navigator</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-60">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="text-xs font-bold">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span className="text-xs font-bold">Joined {new Date(profile.joinedDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <p className="text-sm md:text-base text-[var(--text-muted)] max-w-xl leading-relaxed italic opacity-80">
                  "{profile.bio}"
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 glass rounded-[1.5rem] typo-label opacity-100 flex items-center gap-3 hover:bg-[var(--text-main)]/5 active:scale-95 transition-all"
                >
                  <Edit3 size={16} />
                  Modify Profile
                </button>
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-4 glass rounded-[1.5rem] hover:bg-[var(--text-main)]/5 active:scale-95 transition-all"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Insights */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Usage Stats */}
            <div className="glass-panel p-8 rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--text-main)]/[0.05] text-indigo-500">
                  <Activity size={18} />
                </div>
                <h3 className="typo-label opacity-100">Activity Pulse</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Analyses" value="1.2k" icon={Search} color="text-indigo-500" />
                <StatCard label="Uptime" value="99.9%" icon={Zap} color="text-amber-500" />
                <StatCard label="Reports" value="48" icon={Layout} color="text-emerald-500" />
                <StatCard label="Accuracy" value="+94%" icon={TrendingUp} color="text-fuchsia-500" />
              </div>
            </div>

            {/* Weather Pulse */}
            {weather && (
              <div className="glass-panel p-8 rounded-[3.5rem] border border-[var(--border-color)] bg-gradient-to-br from-indigo-500/10 to-transparent">
                 <div className="flex items-center justify-between mb-6">
                    <span className="typo-label text-indigo-500 opacity-100">Primary Pulse</span>
                    <Globe size={16} className="text-indigo-500 opacity-40" />
                 </div>
                 <div className="flex items-center gap-6">
                    <span className="text-5xl font-black text-[var(--text-main)] tracking-tighter">{weather.current.temp}°</span>
                    <div>
                      <p className="text-lg font-bold text-[var(--text-main)]">{weather.location.name}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest opacity-40">{weather.current.condition}</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => navigate('/')}
                  className="w-full mt-8 py-3 glass rounded-full typo-label text-[10px] hover:bg-[var(--text-main)]/5 transition-all"
                 >
                   Return to Control Center
                 </button>
              </div>
            )}
          </div>

          {/* Right Column: Favorites & History */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Favorites Section */}
            <div className="glass-panel p-8 rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-[var(--text-main)]/[0.05] text-red-500">
                    <Heart size={18} fill="currentColor" />
                  </div>
                  <h3 className="typo-label opacity-100">Priority Latitudes</h3>
                </div>
                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{profile.favorites.length} Saved Sectors</span>
              </div>

              {profile.favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.favorites.map((city, idx) => (
                    <motion.div 
                      key={`${city.lat}-${city.lon}`}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group p-5 rounded-[2rem] bg-[var(--text-main)]/[0.02] border border-[var(--border-color)] hover:border-red-500/30 transition-all flex items-center justify-between cursor-pointer"
                    >
                      <div 
                        className="flex items-center gap-4 flex-1"
                        onClick={() => {
                          fetchWeather(city.lat, city.lon, city.name);
                          navigate('/');
                        }}
                      >
                         <div className="w-12 h-12 rounded-xl bg-[var(--text-main)]/[0.05] flex items-center justify-center text-[var(--text-muted)] group-hover:text-red-500 transition-colors">
                           <Star size={18} />
                         </div>
                         <div>
                           <p className="text-sm font-black text-[var(--text-main)]">{city.name}</p>
                           <p className="text-[10px] text-[var(--text-muted)] opacity-40 uppercase tracking-widest">{city.country}</p>
                         </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(city);
                        }}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 opacity-10 text-center">
                  <Heart size={48} className="mb-4" />
                  <p className="typo-label tracking-tighter">No destinations favorited</p>
                </div>
              )}
            </div>

            {/* Recent Analysis Logs */}
            <div className="glass-panel p-8 rounded-[3.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/80">
               <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--text-main)]/[0.05] text-emerald-500">
                  <History size={18} />
                </div>
                <h3 className="typo-label opacity-100">Exploration History</h3>
              </div>

              <div className="space-y-3">
                {searchHistory.slice(0, 5).map((city, idx) => (
                  <div 
                    key={`${city.lat}-${city.lon}-${idx}`}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-[var(--text-main)]/[0.02] transition-colors border border-transparent hover:border-[var(--border-color)] group/log cursor-pointer"
                    onClick={() => {
                        fetchWeather(city.lat, city.lon, city.name);
                        navigate('/');
                      }}
                  >
                    <div className="flex items-center gap-4">
                      <Clock size={14} className="opacity-20 group-hover/log:text-emerald-500 group-hover/log:opacity-100 transition-all" />
                      <div>
                        <span className="text-sm font-bold text-[var(--text-main)]">{city.name}</span>
                        <span className="mx-2 opacity-10">|</span>
                        <span className="text-[10px] opacity-30 uppercase font-black tracking-widest">{city.country}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover/log:opacity-20 group-hover/log:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsEditing(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative w-full max-w-lg glass-panel p-10 rounded-[3rem] border border-[var(--border-color)] bg-[var(--bg-color)] shadow-3xl"
             >
               <h2 className="text-2xl font-black text-[var(--text-main)] mb-8 tracking-tight">Identity Adjustment</h2>
               
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Display Alias</label>
                   <input 
                     type="text" 
                     value={editForm.name}
                     onChange={e => setEditForm({...editForm, name: e.target.value})}
                     className="w-full p-4 rounded-2xl bg-[var(--text-main)]/[0.05] border border-transparent focus:border-indigo-500/30 outline-none text-[var(--text-main)] font-bold transition-all"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Sector Locale</label>
                   <input 
                     type="text" 
                     value={editForm.location}
                     onChange={e => setEditForm({...editForm, location: e.target.value})}
                     className="w-full p-4 rounded-2xl bg-[var(--text-main)]/[0.05] border border-transparent focus:border-indigo-500/30 outline-none text-[var(--text-main)] font-bold transition-all"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Identity Seed (Avatar)</label>
                   <input 
                     type="text" 
                     value={editForm.avatarSeed}
                     onChange={e => setEditForm({...editForm, avatarSeed: e.target.value})}
                     className="w-full p-4 rounded-2xl bg-[var(--text-main)]/[0.05] border border-transparent focus:border-indigo-500/30 outline-none text-[var(--text-main)] font-bold transition-all"
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Thought Stream (Bio)</label>
                   <textarea 
                     value={editForm.bio}
                     onChange={e => setEditForm({...editForm, bio: e.target.value})}
                     className="w-full p-4 rounded-2xl bg-[var(--text-main)]/[0.05] border border-transparent focus:border-indigo-500/30 outline-none text-[var(--text-main)] font-bold transition-all min-h-[100px] resize-none"
                   />
                 </div>
               </div>

               <div className="flex gap-4 mt-10">
                 <button 
                   onClick={() => setIsEditing(false)}
                   className="flex-1 py-4 glass rounded-2xl typo-label opacity-60 hover:opacity-100 transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSave}
                   className="flex-1 py-4 bg-[var(--text-main)] text-[var(--bg-color)] rounded-2xl typo-label opacity-100 shadow-xl active:scale-95 transition-all"
                 >
                   Save Matrix Profile
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="p-5 rounded-2xl bg-[var(--text-main)]/[0.02] border border-[var(--border-color)] hover:border-[var(--text-main)]/20 transition-all group">
      <div className={cn("p-2 rounded-lg bg-[var(--text-main)]/[0.05] mb-4 w-fit transition-transform group-hover:scale-110", color)}>
        <Icon size={14} />
      </div>
      <p className="text-xl font-black text-[var(--text-main)] tracking-tighter leading-none">{value}</p>
      <p className="text-[9px] font-black tracking-widest opacity-30 mt-2 uppercase">{label}</p>
    </div>
  );
}

function Trash2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
