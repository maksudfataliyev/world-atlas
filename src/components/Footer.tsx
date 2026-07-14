import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Compass, Github, Globe2, Heart, Award, ArrowUp } from 'lucide-react';

export default function Footer() {
  const { getAccentClass, preferences } = useApp();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full mt-16 border-t border-slate-200/15 dark:border-slate-800/40 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md relative">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Logo & Info column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className={`p-2 rounded-2xl bg-gradient-to-tr ${getAccentClass('gradient')} text-white flex items-center justify-center shrink-0 shadow-lg`}>
                <Compass className="h-4.5 w-4.5 animate-[spin_50s_linear_infinite]" />
              </div>
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                WorldAtlas
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Discover the world's cultures, demographics, borders, and statistics in an Apple-inspired interactive interface powered by the public REST Countries API.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors border border-slate-200/50 dark:border-slate-800"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-600 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" />
                <span>Horizon Edition 2026</span>
              </div>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide mb-4">
              Explore Pages
            </h5>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/', label: 'Dashboard' },
                { to: '/explore', label: 'Atlas Search' },
                { to: '/statistics', label: 'Global Indicators' },
                { to: '/favorites', label: 'Saved Destinations' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Status column */}
          <div>
            <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide mb-4">
              System Indicators
            </h5>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>REST Countries v3.1 API: Active</span>
              </li>
              <li>
                <span>Theme Mode: </span>
                <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                  {preferences.theme}
                </span>
              </li>
              <li>
                <span>Accent Color: </span>
                <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                  {preferences.accentColor}
                </span>
              </li>
              <li>
                <span>Data Source: </span>
                <span className="font-mono text-xs text-slate-400 dark:text-slate-600">
                  restcountries.com
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row copyrights and back-to-top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-6 border-t border-slate-200/10 dark:border-slate-800/40 text-xs text-slate-500">
          <div>
            <span>&copy; {new Date().getFullYear()} WorldAtlas Inc. Made with </span>
            <Heart className="h-3 w-3 inline text-rose-500 fill-rose-500 mx-0.5" />
            <span> for travelers worldwide.</span>
          </div>
          
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer hover:shadow-md transition-all active:scale-95 group"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
