import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CountryCard from '../components/CountryCard';
import { ExploreSkeleton } from '../components/SkeletonLoader';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RefreshCw,
  Users,
  Map,
  DollarSign,
  Globe2,
  CheckCircle,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

export default function Explore() {
  const navigate = useNavigate();
  const { countries, isLoading, getAccentClass, recentSearches, addRecentSearch, preferences } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, Pagination & UI layout states
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedContinent, setSelectedContinent] = useState(() => searchParams.get('continent') || 'All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedCurrency, setSelectedCurrency] = useState('All');
  const [selectedPopRange, setSelectedPopRange] = useState('All');
  const [selectedAreaRange, setSelectedAreaRange] = useState('All');
  const [independentStatus, setIndependentStatus] = useState('All');
  const [unMemberStatus, setUnMemberStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isListView, setIsListView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(16); // Pagination batch

  // Synchronize search query from search parameter (e.g. from hero search)
  useEffect(() => {
    const searchVal = searchParams.get('search');
    const continentVal = searchParams.get('continent');
    if (searchVal !== null) {
      setSearchQuery(searchVal);
    }
    if (continentVal !== null) {
      setSelectedContinent(continentVal);
    }
  }, [searchParams]);

  // Dynamically compile unique metadata from countries dataset for filters
  const uniqueLanguages = useMemo(() => {
    const list = new Set<string>();
    countries.forEach((c) => {
      if (c.languages) {
        (Object.values(c.languages) as string[]).forEach((lang) => list.add(lang));
      }
    });
    return Array.from(list).sort();
  }, [countries]);

  const uniqueCurrencies = useMemo(() => {
    const list = new Set<string>();
    countries.forEach((c) => {
      if (c.currencies) {
        (Object.values(c.currencies) as any[]).forEach((curr) => {
          if (curr.name) list.add(`${curr.name} (${Object.keys(c.currencies || {})[0]})`);
        });
      }
    });
    return Array.from(list).sort();
  }, [countries]);

  // Population scale matching definitions
  const popRanges = [
    { label: 'Micro (< 1M)', value: 'micro' },
    { label: 'Medium (1M - 10M)', value: 'medium' },
    { label: 'Large (10M - 50M)', value: 'large' },
    { label: 'Super (> 50M)', value: 'super' },
  ];

  // Area scale matching definitions
  const areaRanges = [
    { label: 'Small (< 10K km²)', value: 'small' },
    { label: 'Medium (10K - 100K km²)', value: 'medium' },
    { label: 'Large (100K - 1M km²)', value: 'large' },
    { label: 'Continental (> 1M km²)', value: 'continental' },
  ];

  // Filter countries
  const filteredCountries = useMemo(() => {
    let result = [...countries];

    // Search query query (common name, official name, capitals, tld, codes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.common.toLowerCase().includes(q) ||
          c.name.official.toLowerCase().includes(q) ||
          (c.capital && c.capital.some((cap) => cap.toLowerCase().includes(q))) ||
          c.cca3.toLowerCase().includes(q) ||
          c.cca2.toLowerCase().includes(q)
      );
    }

    // Continent / Region filter
    if (selectedContinent !== 'All') {
      result = result.filter((c) => c.region === selectedContinent || c.continents?.includes(selectedContinent));
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      result = result.filter(
        (c) => c.languages && Object.values(c.languages).includes(selectedLanguage)
      );
    }

    // Currency filter
    if (selectedCurrency !== 'All') {
      // Extract code inside parentheses (e.g., 'Euro (EUR)' -> 'EUR')
      const codeMatch = selectedCurrency.match(/\(([^)]+)\)/);
      if (codeMatch) {
        const code = codeMatch[1];
        result = result.filter((c) => c.currencies && Object.keys(c.currencies).includes(code));
      }
    }

    // Population ranges filter
    if (selectedPopRange !== 'All') {
      result = result.filter((c) => {
        const p = c.population;
        if (selectedPopRange === 'micro') return p < 1000000;
        if (selectedPopRange === 'medium') return p >= 1000000 && p < 10000000;
        if (selectedPopRange === 'large') return p >= 10000000 && p < 50000000;
        if (selectedPopRange === 'super') return p >= 50000000;
        return true;
      });
    }

    // Area range filter
    if (selectedAreaRange !== 'All') {
      result = result.filter((c) => {
        const a = c.area;
        if (selectedAreaRange === 'small') return a < 10000;
        if (selectedAreaRange === 'medium') return a >= 10000 && a < 100000;
        if (selectedAreaRange === 'large') return a >= 100000 && a < 1000000;
        if (selectedAreaRange === 'continental') return a >= 1000000;
        return true;
      });
    }

    // Independence status filter
    if (independentStatus !== 'All') {
      const target = independentStatus === 'Yes';
      result = result.filter((c) => c.independent === target);
    }

    // UN member filter
    if (unMemberStatus !== 'All') {
      const target = unMemberStatus === 'Yes';
      result = result.filter((c) => c.unMember === target);
    }

    // Sorting algorithm
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.common.localeCompare(b.name.common);
      if (sortBy === 'name-desc') return b.name.common.localeCompare(a.name.common);
      if (sortBy === 'pop-desc') return b.population - a.population;
      if (sortBy === 'pop-asc') return a.population - b.population;
      if (sortBy === 'area-desc') return b.area - a.area;
      if (sortBy === 'area-asc') return a.area - b.area;
      return 0;
    });

    return result;
  }, [
    countries,
    searchQuery,
    selectedContinent,
    selectedLanguage,
    selectedCurrency,
    selectedPopRange,
    selectedAreaRange,
    independentStatus,
    unMemberStatus,
    sortBy,
  ]);

  // Reset all filters in single click
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedContinent('All');
    setSelectedLanguage('All');
    setSelectedCurrency('All');
    setSelectedPopRange('All');
    setSelectedAreaRange('All');
    setIndependentStatus('All');
    setUnMemberStatus('All');
    setSortBy('name-asc');
    setSearchParams({});
  };

  // Trigger loading next batch
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // Add search query to recent on form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
    }
  };

  if (isLoading) {
    return <ExploreSkeleton />;
  }

  const pagedCountries = filteredCountries.slice(0, visibleCount);

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <Globe2 className={`h-7 w-7 ${getAccentClass('text')}`} />
            Atlas Directory
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Browse through {filteredCountries.length} matching sovereign jurisdictions and territories.
          </p>
        </div>

        {/* Layout Toggle Actions */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
              showFilters
                ? `${getAccentClass('badge')} border-current`
                : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

          {/* Grid vs List buttons */}
          <div className="flex bg-slate-100/50 dark:bg-slate-900/30 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
            <button
              onClick={() => setIsListView(false)}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                !isListView
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsListView(true)}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                isListView
                  ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer Section */}
      {showFilters && (
        <div className="p-6 rounded-3xl bg-slate-900/20 dark:bg-slate-950/40 border border-slate-200/10 dark:border-slate-800/40 backdrop-blur-xl animate-slideDown grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Region Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5" />
              Continent / Region
            </label>
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
              <option value="Antarctica">Antarctica</option>
            </select>
          </div>

          {/* 3. Currency Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              Legal Tender Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All Currencies</option>
              {uniqueCurrencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Population Scale */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              Population Scale
            </label>
            <select
              value={selectedPopRange}
              onChange={(e) => setSelectedPopRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All Populations</option>
              {popRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Surface Area Scale */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5" />
              Sovereign Landmass
            </label>
            <select
              value={selectedAreaRange}
              onChange={(e) => setSelectedAreaRange(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All Landmasses</option>
              {areaRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Independent */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              Independent State
            </label>
            <select
              value={independentStatus}
              onChange={(e) => setIndependentStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All Jurisdictions</option>
              <option value="Yes">Independent Only</option>
              <option value="No">Territories / Dependencies</option>
            </select>
          </div>

          {/* 7. UN Member */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              UN Member status
            </label>
            <select
              value={unMemberStatus}
              onChange={(e) => setUnMemberStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold border border-slate-200/50 dark:border-slate-800 outline-none"
            >
              <option value="All">All States</option>
              <option value="Yes">United Nations Members</option>
              <option value="No">Non-Member States</option>
            </select>
          </div>

          {/* 8. Reset Action button */}
          <div className="flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold border border-slate-200/30 dark:border-slate-800/80 cursor-pointer transition-all duration-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset Configuration</span>
            </button>
          </div>

        </div>
      )}

      {/* Main Filter / Sorting toolbar */}
      <div className="flex flex-col lg:flex-row items-center gap-4">
        
        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter atlas database by name, official title, capital, or 3-letter code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200/50 dark:border-slate-800 outline-none focus:border-indigo-500/50 transition-colors text-sm font-semibold"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* Sort drop down */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase hidden lg:block">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full lg:w-56 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm font-semibold border border-slate-200/50 dark:border-slate-800 outline-none focus:border-indigo-500/50"
          >
            <option value="name-asc">Alphabetical (A - Z)</option>
            <option value="name-desc">Alphabetical (Z - A)</option>
            <option value="pop-desc">Population (Highest)</option>
            <option value="pop-asc">Population (Lowest)</option>
            <option value="area-desc">Sovereign Area (Largest)</option>
            <option value="area-asc">Sovereign Area (Smallest)</option>
          </select>
        </div>

      </div>

      {/* Grid vs List Content Rendering */}
      {filteredCountries.length === 0 ? (
        <div className="text-center py-16 space-y-4 rounded-3xl bg-slate-900/5 border border-slate-200/5 dark:border-slate-800/30">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-600 mx-auto">
            <X className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Jurisdictions Identified</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            We couldn't identify any sovereign territories matching your filter parameters. Try expanding your parameters or resetting filters.
          </p>
          <button
            onClick={handleResetFilters}
            className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-102 active:scale-95 ${getAccentClass('bg')}`}
          >
            Clear Search Filter
          </button>
        </div>
      ) : isListView ? (
        /* List View rendering */
        <div className="space-y-3.5">
          {pagedCountries.map((c, idx) => (
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
              <div className="flex items-center gap-8 text-right text-xs text-slate-500">
                <div className="hidden sm:block">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Region</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{c.region}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Population</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{c.population.toLocaleString()}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Landmass</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{c.area.toLocaleString()} km²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View rendering */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pagedCountries.map((country, idx) => (
            <CountryCard key={country.cca3} country={country} index={idx} />
          ))}
        </div>
      )}

      {/* Load More Pagination Trigger */}
      {visibleCount < filteredCountries.length && (
        <div className="flex flex-wrap justify-center items-center gap-4 pt-8">
          <button
            onClick={handleLoadMore}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow shadow-sm active:scale-95 cursor-pointer transition-transform"
          >
            <RefreshCw className="h-4 w-4 shrink-0 animate-[spin_5s_linear_infinite]" />
            <span>Load Additional Territories</span>
          </button>

          <button
            onClick={() => setVisibleCount(filteredCountries.length)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-sm hover:shadow shadow-md active:scale-95 cursor-pointer transition-transform ${getAccentClass('bg')}`}
          >
            <Sparkles className="h-4 w-4 shrink-0 animate-pulse" />
            <span>Show All {filteredCountries.length} Territories</span>
          </button>
        </div>
      )}

    </div>
  );
}
