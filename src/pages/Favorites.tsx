import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CountryCard from '../components/CountryCard';
import {
  Heart,
  Search,
  LayoutGrid,
  List,
  Download,
  FileJson,
  Plus,
  Compass,
} from 'lucide-react';

export default function Favorites() {
  const navigate = useNavigate();
  const {
    countries,
    favorites,
    getAccentClass,
    exportFavoritesJSON,
    exportFavoritesCSV,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isListView, setIsListView] = useState(false);

  // Filter countries to only favorited ones
  const favoritedCountries = useMemo(() => {
    const list = countries.filter((c) => favorites.includes(c.cca3));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (c) =>
          c.name.common.toLowerCase().includes(q) ||
          c.name.official.toLowerCase().includes(q) ||
          (c.capital && c.capital.some((cap) => cap.toLowerCase().includes(q))) ||
          c.cca3.toLowerCase().includes(q)
      );
    }

    return list;
  }, [countries, favorites, searchQuery]);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <Heart className="h-7 w-7 text-rose-500 fill-rose-500 animate-pulse" />
            Saved Destinations
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            You have archived {favorites.length} travel destinations in your local footprint.
          </p>
        </div>

        {/* Action controls */}
        {favorites.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Export JSON */}
            <button
              onClick={() => exportFavoritesJSON(countries)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/60 font-semibold text-xs cursor-pointer transition-colors"
            >
              <FileJson className="h-4 w-4 text-amber-500" />
              <span>Export JSON</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={() => exportFavoritesCSV(countries)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/60 font-semibold text-xs cursor-pointer transition-colors"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              <span>Export CSV</span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block mx-1" />

            {/* Grid vs List toggler */}
            <div className="flex bg-slate-100/50 dark:bg-slate-900/30 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
              <button
                onClick={() => setIsListView(false)}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  !isListView
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsListView(true)}
                className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                  isListView
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main favorites display */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/5 dark:bg-slate-950/20 border border-slate-200/5 dark:border-slate-800/30 space-y-4 max-w-2xl mx-auto">
          <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-rose-500 mx-auto shadow-inner">
            <Heart className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">Favorite List Empty</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            You haven't favorited any countries yet. Browse our comprehensive interactive atlas directory to assemble your list.
          </p>
          <button
            onClick={() => navigate('/explore')}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-102 cursor-pointer ${getAccentClass('bg')}`}
          >
            <Compass className="h-4 w-4 shrink-0 animate-spin" style={{ animationDuration: '30s' }} />
            <span>Discover Destinations</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sub search input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search specifically within favorited destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200/50 dark:border-slate-800 outline-none focus:border-indigo-500/50 transition-colors text-sm font-semibold"
            />
          </div>

          {favoritedCountries.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              No favorited countries match "{searchQuery}" query.
            </div>
          ) : isListView ? (
            <div className="space-y-3.5">
              {favoritedCountries.map((c, idx) => (
                <div
                  key={c.cca3}
                  onClick={() => navigate(`/country/${c.cca3.toLowerCase()}`)}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 hover:border-slate-300/40 dark:hover:border-slate-700/80 cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={c.flags.png}
                      alt={c.name.common}
                      className="h-10 w-16 object-cover rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{c.name.common}</h4>
                      <span className="text-xs text-slate-400">{c.capital ? c.capital.join(', ') : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{c.region}</span>
                    <span className="font-mono text-slate-400">({c.cca3})</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoritedCountries.map((country, idx) => (
                <CountryCard key={country.cca3} country={country} index={idx} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
