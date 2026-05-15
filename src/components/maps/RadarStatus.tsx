export default function RadarStatus() {
  return (
    <div className="absolute top-8 left-8 z-10">
      <div className="glass px-6 py-4 rounded-3xl border border-white/20 backdrop-blur-[12px] shadow-2xl flex items-center gap-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Active Geo-Sync</span>
      </div>
    </div>
  );
}
