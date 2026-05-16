import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, BellRing, CheckCheck, Trash2, Volume2, VolumeX } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useSettings } from '../../context/SettingsContext';
import { NotificationCategory } from '../../types/notification';
import { cn } from '../../lib/utils';
import NotificationCard from './NotificationCard';

const categories: Array<{ id: NotificationCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'weather', label: 'Weather' },
  { id: 'rain', label: 'Rain' },
  { id: 'severe', label: 'Severe' },
  { id: 'aqi', label: 'AQI' },
  { id: 'saved', label: 'Saved' },
];

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isOpen,
    toggleCenter,
    closeCenter,
    markAllAsRead,
    clearAll,
    clearCategory,
    toggleRead,
    removeNotification,
  } = useNotifications();
  const { settings, updateSettings } = useSettings();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory | 'all'>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeCenter();
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [closeCenter]);

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter((item) => item.category === activeCategory);
  }, [activeCategory, notifications]);

  const categoryCounts = useMemo(() => {
    return notifications.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
  }, [notifications]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleCenter}
        className={cn(
          'relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--text-main)]/[0.05] text-[var(--text-muted)] transition-all active:scale-95 lg:h-11 lg:w-11',
          isOpen ? 'border-sky-400/30 text-sky-400 shadow-[0_0_28px_rgba(56,189,248,0.2)]' : 'hover:text-[var(--text-main)]'
        )}
        aria-label="Open notifications"
      >
        {unreadCount > 0 ? <BellRing size={18} /> : <Bell size={18} />}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-400 px-1 text-[10px] font-black text-black shadow-[0_0_18px_rgba(56,189,248,0.9)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-4 right-4 top-[88px] z-[200] max-h-[calc(100vh-112px)] overflow-hidden rounded-[2rem] border border-sky-400/10 bg-[var(--panel-bg)] shadow-[0_30px_100px_-35px_rgba(14,165,233,0.7)] backdrop-blur-3xl sm:left-auto sm:right-6 sm:w-[440px] lg:absolute lg:right-0 lg:top-[calc(100%+0.75rem)]"
            role="dialog"
            aria-label="Notifications"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400/[0.08] via-transparent to-transparent pointer-events-none" />

            <div className="relative border-b border-[var(--border-color)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black tracking-tight text-[var(--text-main)]">Notifications</p>
                  <p className="mt-1 text-[11px] font-bold text-[var(--text-muted)]">
                    {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}` : 'You are all caught up'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateSettings({ notificationSoundEnabled: !settings.notificationSoundEnabled })}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.04] p-2.5 text-[var(--text-muted)] transition-all hover:text-sky-400"
                    title={settings.notificationSoundEnabled ? 'Turn sound off' : 'Turn sound on'}
                  >
                    {settings.notificationSoundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.04] p-2.5 text-[var(--text-muted)] transition-all hover:text-emerald-400"
                    title="Mark all read"
                  >
                    <CheckCheck size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded-xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.04] p-2.5 text-[var(--text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
                    title="Clear all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto hide-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all',
                      activeCategory === category.id
                        ? 'border-sky-400/30 bg-sky-400/10 text-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.15)]'
                        : 'border-[var(--border-color)] bg-[var(--text-main)]/[0.025] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    )}
                  >
                    {category.label}
                    {category.id !== 'all' && categoryCounts[category.id] ? ` ${categoryCounts[category.id]}` : ''}
                  </button>
                ))}
              </div>

              {notifications.length > 0 && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.025] px-3.5 py-3">
                  <span className="text-[11px] font-bold text-[var(--text-muted)]">
                    {activeCategory === 'all'
                      ? `${notifications.length} notification${notifications.length === 1 ? '' : 's'} showing`
                      : `${filteredNotifications.length} ${activeCategory} alert${filteredNotifications.length === 1 ? '' : 's'} showing`}
                  </span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-400 transition-all hover:bg-red-500/15"
                  >
                    <Trash2 size={12} />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="relative max-h-[58vh] space-y-3 overflow-y-auto p-4 custom-scrollbar sm:max-h-[520px]">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div key={notification.id}>
                      <NotificationCard
                        notification={notification}
                        onToggleRead={toggleRead}
                        onRemove={removeNotification}
                        onClearCategory={activeCategory === 'all' ? undefined : clearCategory}
                      />
                    </div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex min-h-[260px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--text-main)]/[0.04] text-[var(--text-muted)]">
                      <Bell size={28} />
                    </div>
                    <p className="text-base font-black text-[var(--text-main)]">No notifications</p>
                    <p className="mt-2 max-w-xs text-xs font-semibold leading-relaxed text-[var(--text-muted)]">
                      Weather alerts, rain warnings, sunrise reminders, and saved city updates will appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
