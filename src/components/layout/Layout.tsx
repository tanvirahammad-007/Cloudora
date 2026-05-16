import Sidebar from './Sidebar';
import Header from './Header';
import { useWeather } from '../../context/WeatherContext';
import { motion, AnimatePresence } from 'motion/react';
import { Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const { loading } = useWeather();
  const location = useLocation();

  return (
    <div className="relative z-10 min-h-screen overflow-hidden font-sans">
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

      <div className="flex h-[100dvh] flex-col overflow-hidden">
        {/* Superior Header Persistence */}
        <Header />
        
        <div className="premium-container flex flex-1 gap-4 overflow-hidden pt-0 lg:gap-[var(--spacing-gap-md)]">
          {/* Integrated Navigation Sidebar */}
          <Sidebar className="w-16 lg:w-20" />
          
          <main className="flex h-full min-w-0 flex-1 scroll-smooth overflow-y-auto custom-scrollbar pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-0">
              <div
                key={location.pathname}
                className="h-full flex-1 animate-fadeIn"
              >
                <Outlet />
              </div>
          </main>
        </div>
      </div>

      {/* Tactile Mobile Interface */}
       <motion.div 
         initial={{ y: 200 }}
         animate={{ y: 0 }}
         transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.5 }}
         className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-1/2 z-50 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center overflow-x-auto rounded-3xl border border-[var(--border-color)] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] glass hide-scrollbar md:hidden sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
       >
         <Sidebar isMobile />
       </motion.div>
    </div>
  );
}
