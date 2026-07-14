import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  Compass,
  Heart,
  Globe2,
  Search,
  BarChart3,
  Settings,
  Info,
} from 'lucide-react';

export default function Navbar() {
  const { getAccentClass, favorites } = useApp();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    if (paths.length === 0) return [{ label: 'Home', active: true }];

    const breadcrumbs = [{ label: 'Home', to: '/', active: false }];
    paths.forEach((path, idx) => {
      const label = path.charAt(0).toUpperCase() + path.slice(1);
      const to = '/' + paths.slice(0, idx + 1).join('/');
      breadcrumbs.push({
        label,
        to,
        active: idx === paths.length - 1,
      });
    });
    return breadcrumbs;
  };

  const menuItems = [
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

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 w-full px-4 pt-4 pb-2 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/15 dark:border-slate-800/40 shadow-sm relative">
        
        {/* Breadcrumbs for desktop */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
              {crumb.active ? (
                <span className={`font-bold ${getAccentClass('text')}`}>
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to || '/'}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Brand logo for mobile view */}
        <Link to="/" className="flex md:hidden items-center gap-2">
          <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${getAccentClass('gradient')} text-white flex items-center justify-center shadow`}>
            <Compass className="h-4.5 w-4.5 animate-[spin_40s_linear_infinite]" />
          </div>
          <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            WorldAtlas
          </span>
        </Link>

        {/* Global Indicators */}
        <div className="flex items-center gap-4">
          {/* Favorites counter indicator */}
          {favorites.length > 0 && (
            <Link
              to="/favorites"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/40 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all hover:scale-105"
            >
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              <span>{favorites.length} Saved</span>
            </Link>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown panel */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl bg-white/95 dark:bg-slate-950/95 border border-slate-200/20 dark:border-slate-800/80 shadow-2xl backdrop-blur-2xl md:hidden flex flex-col gap-1 z-50">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? `${getAccentClass('badge')} font-bold`
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`h-5 w-5 ${isActive ? getAccentClass('text') : 'text-slate-400'}`} />
                    <span className="text-sm tracking-wide">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
