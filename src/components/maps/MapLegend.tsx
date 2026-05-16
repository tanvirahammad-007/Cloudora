import { cn } from '../../lib/utils';

interface MapLegendProps {
  items: { label: string; color: string; range: string }[];
}

export default function MapLegend({ items }: MapLegendProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-end sm:bottom-8 sm:left-auto sm:right-8">
      <div className="glass w-full max-w-[240px] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/20 backdrop-blur-[12px] shadow-2xl">
        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-500 mb-4">Legend</h4>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                <span className="text-[10px] font-bold text-[var(--text-main)]">{item.label}</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
