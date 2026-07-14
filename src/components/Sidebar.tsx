import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Search,
  BarChart3,
  Heart,
  Settings,
  Info,
  Globe2,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
  const { getAccentClass, favorites } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Globe2 },
    { to: '/explore', label: 'Explore', icon: Search },
    { to: '/statistics', label: 'Statistics', icon: BarChart3 },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/about', label: 'About', icon: Info },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col h-[calc(100vh-2rem)] sticky top-4 left-4 z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full rounded-3xl bg-white/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/60 backdrop-blur-xl shadow-xl overflow-hidden p-4 relative">
        
        {/* Toggle Expand/Collapse */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-1.5 top-14 bg-white dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 h-6 w-6 rounded-full border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center shadow-md cursor-pointer transition-transform duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
        </button>

        {/* Logo Section */}
        <div className={`flex items-center gap-3 px-2 py-4 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`p-2 rounded-2xl bg-gradient-to-tr ${getAccentClass('gradient')} text-white shadow-lg shadow-indigo-500/10 flex items-center justify-center shrink-0`}>
            <Compass className="h-5 w-5 animate-[spin_20s_linear_infinite]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                WorldAtlas
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">
                Horizon v2026
              </span>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all duration-200 group relative ${
                    isActive
                      ? `${getAccentClass('badge')} font-bold shadow-sm`
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? getAccentClass('text') : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`} />
                    
                    {!isCollapsed && (
                      <span className="text-sm tracking-wide transition-opacity duration-300">
                        {item.label}
                      </span>
                    )}

                    {/* Badge support */}
                    {item.badge !== undefined && (
                      <span className={`absolute ${
                        isCollapsed ? 'top-1 right-1' : 'right-3'
                      } flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 dark:bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer/Settings Info */}
        {!isCollapsed && (
          <div className="border-t border-slate-200/20 dark:border-slate-800/60 pt-4 pb-2 px-2 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono">UTC-07:00</span>
            <span className="opacity-60">v1.1.0</span>
          </div>
        )}
      </div>
    </aside>
  );
}
