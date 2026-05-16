export default function RadarStatus() {
  return (
    <div className="absolute left-4 top-4 z-10 sm:left-8 sm:top-8">
      <div className="glass px-4 py-3 sm:px-6 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-[12px] shadow-2xl flex items-center gap-3 sm:gap-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Active Geo-Sync</span>
      </div>
    </div>
  );
}
