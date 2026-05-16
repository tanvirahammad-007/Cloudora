import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Languages, 
  Thermometer, 
  Wind, 
  Zap, 
  Trash2, 
  AlertTriangle, 
  Activity, 
  History, 
  ChevronRight, 
  Cloud,
  Eye,
  Layout,
  Map,
  Volume2,
  VolumeX,
  Navigation
} from 'lucide-react';
import { useSettings, TemperatureUnit, WindSpeedUnit, BlurIntensity, Language } from '../context/SettingsContext';
import { useWeather } from '../context/WeatherContext';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../lib/utils';


export default function SettingsPage() {
  const { t } = useTranslation();
  const { settings, updateSettings, toggleTheme } = useSettings();
  const { searchHistory, removeFromHistory, clearHistory } = useWeather();


  const tempUnits: { label: string, value: TemperatureUnit }[] = [
    { label: 'Celsius (°C)', value: 'C' },
    { label: 'Fahrenheit (°F)', value: 'F' }
  ];

  const windUnits: { label: string, value: WindSpeedUnit }[] = [
    { label: 'km/h', value: 'km/h' },
    { label: 'mph', value: 'mph' },
    { label: 'm/s', value: 'm/s' },
    { label: 'knots', value: 'knots' }
  ];

  const blurLevels: { label: string, value: BlurIntensity }[] = [
    { label: 'None', value: 'none' },
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  const languages: { label: string, value: Language }[] = [
    { label: 'English', value: 'en' },
    { label: 'বাংলা', value: 'bn' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: 'Deutsch', value: 'de' },
    { label: 'Italiano', value: 'it' }
  ];


  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="premium-page"
    >
      <div className="premium-page-inner max-w-4xl space-y-10">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="p-4 rounded-[2rem] bg-[var(--text-main)]/[0.05] text-[var(--text-main)] border border-[var(--border-color)]">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tracking-tight">{t('settings')}</h1>
            <p className="typo-label mt-1">Personal Experience Parameters</p>
          </div>

        </div>

        {/* Units & Localization */}
        <section className="space-y-6">
          <SectionHeader title={t('units')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectorSetting 
              icon={Thermometer}
              label={t('tempUnit')}
              options={tempUnits}
              activeValue={settings.tempUnit}
              onChange={(val) => updateSettings({ tempUnit: val as TemperatureUnit })}
            />
            <SelectorSetting 
              icon={Wind}
              label={t('windUnit')}
              options={windUnits}
              activeValue={settings.windUnit}
              onChange={(val) => updateSettings({ windUnit: val as WindSpeedUnit })}
            />
            <SelectorSetting 
              icon={Languages}
              label={t('language')}
              options={languages}
              activeValue={settings.language}
              onChange={(val) => updateSettings({ language: val as Language })}
            />
            <ToggleSetting 
              icon={Navigation}
              label="Auto-Location"
              description="Detect your city automatically on startup"
              checked={settings.autoLocation}
              onChange={(checked) => updateSettings({ autoLocation: checked })}
            />
          </div>
        </section>


        {/* Global Appearance */}
        <section className="space-y-6">
          <SectionHeader title={t('appearance')} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSetting 
              icon={settings.theme === 'dark' ? Moon : Sun}
              label={t('theme')}
              description="Calibrate for low-light environments"
              checked={settings.theme === 'dark'}
              onChange={toggleTheme}
            />
            <ToggleSetting 
              icon={Zap}
              label={t('animations')}
              description="Enable fluid interface interactions"
              checked={settings.animationsEnabled}
              onChange={(checked) => updateSettings({ animationsEnabled: checked })}
            />
            <ToggleSetting 
              icon={Layout}
              label={t('compactMode')}
              description="Optimized layout for detailed analysis"
              checked={settings.compactMode}
              onChange={(checked) => updateSettings({ compactMode: checked })}
            />
            <ToggleSetting 
              icon={Map}
              label={t('dynamicBg')}
              description="Context-aware background patterns"
              checked={settings.dynamicBackground}
              onChange={(checked) => updateSettings({ dynamicBackground: checked })}
            />
          </div>
          <div className="p-1">
             <SelectorSetting 
              icon={Eye}
              label={t('blur')}
              description="Refine your glassmorphism intensity"
              options={blurLevels}
              activeValue={settings.blurIntensity}
              onChange={(val) => updateSettings({ blurIntensity: val as BlurIntensity })}
              fullWidth
            />
          </div>
        </section>


        {/* Notifications & Alerts */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader title={t('notifications')} />

            <ToggleSwitch 
              checked={settings.notificationsEnabled}
              onChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>
          
          <AnimatePresence>
            {settings.notificationsEnabled && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 overflow-hidden"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NotificationToggle 
                    icon={Cloud}
                    label="Rain alerts"
                    description="Rain and snow alerts"
                    checked={settings.rainAlerts}
                    onChange={(val) => updateSettings({ rainAlerts: val })}
                  />
                  <NotificationToggle 
                    icon={Zap}
                    label="Storm alerts"
                    description="Severe storm warnings"
                    checked={settings.stormAlerts}
                    onChange={(val) => updateSettings({ stormAlerts: val })}
                  />
                  <NotificationToggle
                    icon={Activity}
                    label="AQI alerts"
                    description="Air quality warnings"
                    checked={settings.aqiAlerts}
                    onChange={(val) => updateSettings({ aqiAlerts: val })}
                  />
                  <NotificationToggle
                    icon={Thermometer}
                    label="Temperature alerts"
                    description="Big temperature changes"
                    checked={settings.temperatureAlerts}
                    onChange={(val) => updateSettings({ temperatureAlerts: val })}
                  />
                  <NotificationToggle
                    icon={Sun}
                    label="Sun reminders"
                    description="Sunrise and sunset reminders"
                    checked={settings.sunReminderAlerts}
                    onChange={(val) => updateSettings({ sunReminderAlerts: val })}
                  />
                  <NotificationToggle
                    icon={Bell}
                    label="Daily summary"
                    description="One weather summary each day"
                    checked={settings.dailySummaryAlerts}
                    onChange={(val) => updateSettings({ dailySummaryAlerts: val })}
                  />
                  <NotificationToggle
                    icon={Map}
                    label="Saved cities"
                    description="Alerts for saved places"
                    checked={settings.savedCityAlerts}
                    onChange={(val) => updateSettings({ savedCityAlerts: val })}
                  />
                  <NotificationToggle
                    icon={settings.notificationSoundEnabled ? Volume2 : VolumeX}
                    label="Sound"
                    description="Soft alert sound"
                    checked={settings.notificationSoundEnabled}
                    onChange={(val) => updateSettings({ notificationSoundEnabled: val })}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <ThresholdControl 
                    icon={Activity}
                    label="AQI Alert Trigger"
                    value={settings.aqiThreshold}
                    min={50}
                    max={300}
                    unit="AQI"
                    onChange={(val) => updateSettings({ aqiThreshold: val })}
                    color="text-emerald-500"
                  />
                  <ThresholdControl 
                    icon={Wind}
                    label="Wind Severity"
                    value={settings.windThreshold}
                    min={10}
                    max={150}
                    unit={settings.windUnit}
                    onChange={(val) => updateSettings({ windThreshold: val })}
                    color="text-amber-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Data & History */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader title="Storage Context" />
            <button 
              onClick={clearHistory}
              type="button"
              disabled={searchHistory.length === 0}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-full border border-red-500/20 transition-all"
            >
              <Trash2 size={12} />
              Purge Historical Logs
            </button>
          </div>

          <div className="glass-panel rounded-[2.5rem] border border-[var(--border-color)] overflow-hidden">
            <div className="p-6 bg-[var(--text-main)]/[0.02] border-b border-[var(--border-color)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <History size={18} className="text-[var(--text-muted)]" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-main)]">Cached Locations</span>
              </div>
              <span className="text-[10px] font-bold text-[var(--text-muted)] opacity-60 uppercase tracking-widest">{searchHistory.length} Recorded</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar divide-y divide-[var(--border-color)]">
              <AnimatePresence initial={false}>
                {searchHistory.length > 0 ? (
                  searchHistory.map((city) => (
                    <motion.div 
                      key={`${city.lat}-${city.lon}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center justify-between p-5 hover:bg-[var(--text-main)]/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                           <Layout size={14} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-main)]">{city.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] opacity-60">{city.country}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromHistory(city.lat, city.lon)}
                        type="button"
                        aria-label={`Remove ${city.name} from search history`}
                        className="p-3 rounded-xl hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-xs font-bold text-[var(--text-muted)] opacity-40 uppercase tracking-widest">No history is currently stored</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-500/80 ml-6 mb-4">{title}</h3>
  );
}

function ToggleSetting({ icon: Icon, label, description, checked, onChange }: any) {
  return (
    <div 
      className="glass-panel p-6 rounded-[2.5rem] border border-[var(--border-color)] flex items-center justify-between group hover:border-[var(--text-main)]/20 transition-all cursor-pointer"
      onClick={() => onChange(!checked)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onChange(!checked);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={checked}
    >
      <div className="flex items-center gap-5">
        <div className="p-3.5 rounded-2xl bg-[var(--text-main)]/[0.05] text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors border border-[var(--border-color)]">
          <Icon size={22} />
        </div>
        <div>
          <p className="font-black text-[var(--text-main)] tracking-tight">{label}</p>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60 mt-0.5">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function SelectorSetting({ icon: Icon, label, description, options, activeValue, onChange, fullWidth }: any) {
  return (
    <div className={cn(
      "glass-panel p-6 rounded-[2.5rem] border border-[var(--border-color)] space-y-4",
      fullWidth ? "w-full" : ""
    )}>
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-[var(--text-main)]/[0.05] text-[var(--text-muted)] border border-[var(--border-color)]">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-[var(--text-main)] tracking-tight">{label}</p>
          {description && <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-60">{description}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: any) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={activeValue === opt.value}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeValue === opt.value
                ? "bg-[var(--text-main)] text-[var(--bg-color)] shadow-lg scale-105"
                : "bg-[var(--text-main)]/[0.05] text-[var(--text-muted)] hover:bg-[var(--text-main)]/[0.1] border border-transparent"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onChange(!checked); }}
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer",
        checked ? "bg-indigo-500" : "bg-[var(--text-main)]/10"
      )}
    >
      <motion.div 
        animate={{ x: checked ? 24 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

function NotificationToggle({ icon: Icon, label, description, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 rounded-3xl bg-[var(--text-main)]/[0.02] border border-[var(--border-color)]">
      <div className="flex min-w-0 items-center gap-4">
        <div className="p-2.5 rounded-xl bg-[var(--text-main)]/[0.05] text-indigo-500">
          <Icon size={16} />
        </div>
        <div>
          <p className="text-xs font-bold text-[var(--text-main)]">{label}</p>
          <p className="text-[9px] text-[var(--text-muted)] opacity-60 uppercase font-black tracking-widest">{description}</p>
        </div>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}

function ThresholdControl({ icon: Icon, label, value, min, max, unit, onChange, color }: any) {
  return (
    <div className="glass-panel p-6 rounded-[2.5rem] border border-[var(--border-color)] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl bg-[var(--text-main)]/[0.05]", color)}>
            <Icon size={16} />
          </div>
          <span className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-[0.15em]">{label}</span>
        </div>
        <span className={cn("text-lg font-black tabular-nums tracking-tighter", color)}>{value}<span className="text-[10px] ml-1 opacity-40">{unit}</span></span>
      </div>
      
      <div className="relative pt-1 px-1">
        <input 
          type="range" 
          min={min} 
          max={max} 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          aria-label={label}
          className="w-full h-1.5 bg-[var(--text-main)]/5 rounded-full appearance-none cursor-pointer accent-indigo-500 focus:outline-none"
        />
        <div className="flex justify-between mt-2">
           <span className="text-[8px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-widest">{min} {unit}</span>
           <span className="text-[8px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-widest">{max} {unit}</span>
        </div>
      </div>
    </div>
  );
}
