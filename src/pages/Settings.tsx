import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Laptop,
  Check,
  RefreshCw,
  Sparkles,
  Award,
  Globe2,
  Sliders,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Settings() {
  const { preferences, updatePreference, resetPreferences, getAccentClass } = useApp();

  const handleReset = () => {
    resetPreferences();
    toast.success('System preferences restored to factory defaults', {
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#f8fafc',
      },
    });
  };

  const accentColors = [
    { id: 'indigo', name: 'Royal Indigo', colorClass: 'bg-indigo-500' },
    { id: 'emerald', name: 'Emerald Forest', colorClass: 'bg-emerald-500' },
    { id: 'rose', name: 'Rose Petal', colorClass: 'bg-rose-500' },
    { id: 'amber', name: 'Solar Amber', colorClass: 'bg-amber-500' },
    { id: 'blue', name: 'Oceanic Blue', colorClass: 'bg-blue-500' },
    { id: 'purple', name: 'Regal Purple', colorClass: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <SettingsIcon className={`h-7 w-7 ${getAccentClass('text')}`} />
            Preferences Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Reconfigure WorldAtlas visual themes, accent indicators, localization, and animation speeds.
          </p>
        </div>

        {/* Reset Action */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold border border-slate-200/50 dark:border-slate-800/80 cursor-pointer transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Double-Column Preferences panel */}
        <div className="md:col-span-2 space-y-6">
          
          {/* 1. Theme Configuration */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sun className="h-4.5 w-4.5 text-amber-500" />
              Chroma Appearance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toggle lighting schemes between crisp off-white clarity or immersive deep-space charcoal grays.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark Mode', icon: Moon },
                { id: 'system', label: 'System Sync', icon: Laptop },
              ].map((theme) => {
                const Icon = theme.icon;
                const isSelected = preferences.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => updatePreference('theme', theme.id as any)}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? `${getAccentClass('badge')} border-current font-extrabold scale-[1.02] shadow-sm`
                        : 'bg-white/50 dark:bg-slate-950/20 border-slate-200/40 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 text-slate-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Accent Color Configuration */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className={`h-4.5 w-4.5 ${getAccentClass('text')}`} />
              Theme Accent Palette
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select an exquisite signature accent color to anchor interactive indicators, icons, charts, and highlighted buttons.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs font-bold text-slate-600 dark:text-slate-300">
              {accentColors.map((color) => {
                const isSelected = preferences.accentColor === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => updatePreference('accentColor', color.id as any)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-100/80 dark:bg-slate-950/40 border-slate-400/50 scale-[1.02] shadow-sm'
                        : 'bg-white/50 dark:bg-slate-950/20 border-slate-200/40 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/40 text-slate-500'
                    }`}
                  >
                    <span className={`h-4.5 w-4.5 rounded-xl ${color.colorClass} shrink-0 flex items-center justify-center text-white shadow-sm shadow-black/10`}>
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3.5]" />}
                    </span>
                    <span className={isSelected ? 'text-slate-900 dark:text-slate-100 font-extrabold' : 'font-medium'}>
                      {color.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Hardware / Localization switches */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-slate-500" />
              Platform Controls
            </h3>

            <div className="space-y-4">
              {/* Animation Switch */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/10">
                <div className="space-y-1 pr-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Framer Motion Transitions
                  </span>
                  <span className="text-[11px] text-slate-400 block leading-relaxed">
                    Disable motion transitions to save resources on portable or low-end browser containers.
                  </span>
                </div>
                <button
                  onClick={() => updatePreference('animationsEnabled', !preferences.animationsEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    preferences.animationsEnabled ? getAccentClass('bg') : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      preferences.animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Units switcher */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/10">
                <div className="space-y-1 pr-4">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Measurement Metrics
                  </span>
                  <span className="text-[11px] text-slate-400 block leading-relaxed">
                    Toggle geographic surface measurements between Metric (square kilometers) or Imperial (square miles).
                  </span>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800">
                  <button
                    onClick={() => updatePreference('units', 'metric')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      preferences.units === 'metric'
                        ? `${getAccentClass('badge')} font-extrabold shadow-sm`
                        : 'text-slate-400'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => updatePreference('units', 'imperial')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      preferences.units === 'imperial'
                        ? `${getAccentClass('badge')} font-extrabold shadow-sm`
                        : 'text-slate-400'
                    }`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side Column - Diagnostic Indicators info panel */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/60 backdrop-blur-xl shadow-xl space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5" />
              Diagnostic Certificate
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your WorldAtlas system parameters are locked in place and fully encrypted in your local sandbox browser database (`localStorage`).
            </p>

            <div className="border-t border-slate-200/10 pt-4 space-y-2 text-[11px] font-semibold text-slate-400">
              <div className="flex justify-between">
                <span>Certifying Authority:</span>
                <span className="text-slate-200">WorldAtlas Inc</span>
              </div>
              <div className="flex justify-between">
                <span>Local Sync State:</span>
                <span className="text-emerald-400">Perfect (Green)</span>
              </div>
              <div className="flex justify-between">
                <span>Active Core Sandbox:</span>
                <span className="text-slate-200 font-mono">browser-db-1</span>
              </div>
              <div className="flex justify-between">
                <span>Interface Build:</span>
                <span className="text-slate-200 font-mono">v1.1.0-prod</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
