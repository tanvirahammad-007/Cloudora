import { Cloud, MapPin, Wind, Sun, Clock, Settings, LayoutGrid, Droplets, ArrowLeftRight, User, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

export default function Sidebar({ className, isMobile }: SidebarProps) {
  const { t } = useTranslation();

  const menuItems = [
    { icon: LayoutGrid, label: t('overview'), path: '/', color: 'from-black to-gray-800' },
    { icon: Wind, label: t('insights'), path: '/analytics', color: 'from-gray-700 to-gray-900' },
    { icon: Globe, label: t('radar'), path: '/maps', color: 'from-gray-600 to-gray-800' },
    { icon: Clock, label: t('favorites'), path: '/saved', color: 'from-gray-500 to-gray-700' },
    { icon: ArrowLeftRight, label: t('expeditions'), path: '/travel', color: 'from-gray-400 to-gray-600' },
    { icon: User, label: t('identity'), path: '/profile', color: 'from-gray-400 to-gray-600' },
    { icon: Settings, label: t('configuration'), path: '/settings', color: 'from-gray-300 to-gray-500' },
  ];

  if (isMobile) {
    return (
      <>
        {menuItems.map((item, idx) => (
          <NavLink 
            key={idx} 
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => cn(
              "p-3 rounded-2xl transition-all duration-300", 
              isActive ? "bg-[var(--text-main)] text-[var(--bg-color)] shadow-lg" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            )}
          >
            <item.icon size={20} />
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <aside className={cn("hidden md:flex flex-col items-center justify-center h-full", className)}>
      <nav className="flex flex-col items-center gap-[var(--spacing-gap-sm)] p-2 lg:p-3 bg-[var(--panel-bg)] backdrop-blur-3xl rounded-[2rem] lg:rounded-[2.5rem] border border-[var(--border-color)] shadow-2xl">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => cn(
              "w-12 h-12 rounded-[1.25rem] transition-all duration-500 group relative flex items-center justify-center",
              isActive 
                ? "text-[var(--text-main)]" 
                : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  strokeWidth={isActive ? 2.5 : 1.5}
                  size={isActive ? 22 : 20} 
                  className={cn("transition-all duration-500 relative z-10", isActive ? "scale-100" : "group-hover:scale-110")} 
                />
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[var(--text-main)]/[0.08] rounded-[1.25rem] border border-[var(--text-main)]/10"
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
                  />
                )}
                
                {/* Tooltip Label — hover only, appears BELOW the icon with upward arrow */}
                <div className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 px-3.5 py-2 rounded-xl bg-[var(--text-main)] text-[var(--bg-color)] text-[9px] font-black uppercase tracking-[0.15em] opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[100] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                  {/* Arrow pointing up */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[var(--text-main)]" />
                  {item.label}
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
