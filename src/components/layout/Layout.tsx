import Sidebar from './Sidebar';
import Header from './Header';
import { useSettings } from '../../context/SettingsContext';
import { useWeather } from '../../context/WeatherContext';
import { motion, AnimatePresence } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { settings } = useSettings();
  const { theme } = settings;
  const { loading } = useWeather();
  const location = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-[var(--bg-color)]">
      {/* Dynamic Loading Indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--text-main)] z-[9999] origin-left shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col h-screen overflow-hidden">
        {/* Superior Header Persistence */}
        <Header />
        
        <div className="flex flex-1 overflow-hidden premium-container pt-0 gap-4 lg:gap-[var(--spacing-gap-md)]">
          {/* Integrated Navigation Sidebar */}
          <Sidebar className="w-16 lg:w-20" />
          
          <main className="flex-1 flex flex-col h-full overflow-y-auto hide-scrollbar">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.key}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Tactile Mobile Interface */}
       <motion.div 
         initial={{ y: 200 }}
         animate={{ y: 0 }}
         transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.5 }}
         className="md:hidden fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 glass rounded-3xl p-2 flex items-center border border-[var(--border-color)] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
       >
         <Sidebar isMobile />
       </motion.div>
    </div>
  );
}
