import { useSettings } from '../../context/SettingsContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { settings, toggleTheme } = useSettings();
  const { theme } = settings;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      className="relative h-10 w-20 bg-[var(--text-main)]/[0.05] border border-[var(--border-color)] rounded-full flex items-center px-1 cursor-pointer group transition-all hover:bg-[var(--text-main)]/10"
    >
      <div className="flex w-full justify-between px-1 relative z-10 pointer-events-none">
        <Sun 
          size={14} 
          className={theme === 'light' ? 'text-[var(--bg-color)] group-hover:scale-110 transition-transform' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-all'}
          strokeWidth={theme === 'light' ? 3 : 2}
        />
        <Moon 
          size={14} 
          className={theme === 'dark' ? 'text-[var(--bg-color)] group-hover:scale-110 transition-transform' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-all'}
          strokeWidth={theme === 'dark' ? 3 : 2}
        />
      </div>
      
      <motion.div
        animate={{ x: theme === 'light' ? 0 : 40 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute left-1 w-8 h-8 rounded-full bg-[var(--text-main)] shadow-[0_0_15px_rgba(255,255,255,0.1)] flex items-center justify-center border border-[var(--border-color)]"
      >
        {theme === 'light' ? (
          <Sun size={14} className="text-[var(--bg-color)]" strokeWidth={3} />
        ) : (
          <Moon size={14} className="text-[var(--bg-color)]" strokeWidth={3} fill="currentColor" />
        )}
      </motion.div>
    </button>
  );
}
