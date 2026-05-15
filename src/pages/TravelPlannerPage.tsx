import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import NewExpeditionForm from '../components/travel/NewExpeditionForm';
import SmartInsightCard from '../components/travel/SmartInsightCard';
import TravelPlanCard from '../components/travel/TravelPlanCard';
import { TravelPlan } from '../types/travel';
import { getPlans, deletePlan } from '../lib/travelUtils';
import { Luggage, Compass, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TravelPlannerPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'explored'>('upcoming');
  const [plans, setPlans] = useState<TravelPlan[]>([]);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    setPlans(getPlans());
  };

  const handleDelete = (id: string) => {
    deletePlan(id);
    loadPlans();
  };

  const filteredPlans = plans.filter(p => {
    const isPast = new Date(p.endDate) < new Date();
    return activeTab === 'upcoming' ? !isPast : isPast;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-6 md:p-8 lg:p-12 h-full overflow-y-auto custom-scrollbar"
    >
      <div className="max-w-[1600px] mx-auto space-y-12 pb-20">
        
        {/* Page Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-3xl bg-[var(--text-main)] text-[var(--bg-color)] shadow-2xl">
                <Compass size={28} strokeWidth={2.5} />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                Expedition Intel
              </h1>
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] text-[10px] ml-1 opacity-40">
              Strategic Climate-Aware Journey Planning
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-1.5 glass rounded-[2rem] border border-[var(--border-color)] shadow-xl shrink-0">
            <button 
              onClick={() => setActiveTab('upcoming')} 
              className={cn(
                "px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all", 
                activeTab === 'upcoming' ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "text-[var(--text-muted)] hover:bg-[var(--text-main)]/5"
              )}
            >
              Planned Future
            </button>
            <button 
              onClick={() => setActiveTab('explored')} 
              className={cn(
                "px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all", 
                activeTab === 'explored' ? "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20" : "text-[var(--text-muted)] hover:bg-[var(--text-main)]/5"
              )}
            >
              Journey Archive
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Left Column: Form & Insights */}
          <div className="xl:col-span-4 space-y-8">
            <NewExpeditionForm onPlanCreated={loadPlans} />
            
            <div className="glass-panel p-10 rounded-[3.5rem] bg-indigo-500/5 border border-indigo-500/10 overflow-hidden relative group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={120} />
               </div>
               <h4 className="text-2xl font-black text-[var(--text-main)] tracking-tight relative z-10">Sync Assurance</h4>
               <p className="text-sm text-[var(--text-muted)] mt-4 font-medium leading-relaxed opacity-70 relative z-10">Our algorithms analyze 5-day predictive patterns to ensure your exploration window remains within optimal safety thresholds.</p>
               
               <div className="mt-8 flex gap-6 relative z-10">
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Reliability</span>
                     <span className="text-xl font-black">99.2%</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Confidence</span>
                     <span className="text-xl font-black">High</span>
                  </div>
               </div>
            </div>

            <SmartInsightCard />
          </div>

          {/* Right Column: Plans Grid */}
          <div className="xl:col-span-8">
            {filteredPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 lg:py-40 text-center animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="relative mb-10">
                   <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                   <div className="p-16 glass rounded-full border border-indigo-500/10 relative">
                      <Luggage size={80} className="text-[var(--text-main)] opacity-10" />
                   </div>
                </div>
                <h2 className="text-4xl font-black text-[var(--text-main)] tracking-tight mb-4">Empty Itinerary</h2>
                <p className="text-[var(--text-muted)] max-w-sm font-medium leading-relaxed opacity-50 mx-auto">
                  {activeTab === 'upcoming' 
                    ? "Initialize your next global expedition by configuring a destination and timeframe in the commander panel." 
                    : "No historical expeditions found in the archive logs. Start exploring to populate your journal."}
                </p>
                {activeTab === 'upcoming' && (
                  <div className="mt-12 flex items-center gap-3 text-indigo-500 animate-pulse">
                     <ArrowRight size={20} className="rotate-180" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Configuration Required</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <TravelPlanCard 
                        plan={plan} 
                        onDelete={handleDelete} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {filteredPlans.length > 0 && (
               <div className="mt-12 p-8 rounded-[3rem] glass-panel border border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
                  <div className="flex items-center gap-6">
                     <Activity size={20} />
                     <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                        Global weather vectors are processed in real-time.<br/>
                        Expect variations as your departure timeframe approaches.
                     </p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                     <span className="text-[9px] font-black uppercase tracking-widest">Live Predictive Link Active</span>
                  </div>
               </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
