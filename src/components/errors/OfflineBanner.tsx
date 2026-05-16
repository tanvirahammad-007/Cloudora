import { AnimatePresence, motion } from 'motion/react';
import { WifiOff } from 'lucide-react';
import { useErrors } from '../../context/ErrorContext';

export default function OfflineBanner() {
  const { isOffline } = useErrors();

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="fixed left-1/2 top-4 z-[270] flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-400/20 bg-[var(--panel-bg)]/95 px-5 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-amber-300 shadow-[0_20px_60px_-35px_rgba(251,191,36,0.8)] backdrop-blur-2xl"
          role="status"
          aria-live="polite"
        >
          <WifiOff size={14} />
          Offline mode
        </motion.div>
      )}
    </AnimatePresence>
  );
}
