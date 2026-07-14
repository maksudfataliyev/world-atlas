import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCountryOfTheDay } from '../services/api';
import CountryCard from '../components/CountryCard';
import AnimatedCounter from '../components/AnimatedCounter';
import WorldMapSvg from '../components/WorldMapSvg';
import { HomeSkeleton } from '../components/SkeletonLoader';
import {
  Compass,
  Search,
  Sparkles,
  TrendingUp,
  Map,
  Users,
  Eye,
  Plane,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const {
    countries,
    isLoading,
    isError,
    getAccentClass,
    recentlyViewed,
    recentSearches,
    addRecentSearch,
    preferences,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <HomeSkeleton />;
  }

  if (isError || countries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 space-y-6">
        <div className="h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 border border-rose-200/50">
          <Sparkles className="h-8 w-8 animate-spin" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">System Connection Restoring</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Our cartographic engine is currently reconciling details. We will restore connections momentarily.
        </p>
        <button
          onClick={() => window.location.reload()}
          className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-md ${getAccentClass('bg')} ${getAccentClass('hoverBg')}`}
        >
          Reconnect Engine
        </button>
      </div>
    );
  }

  // Country of the day
  const countryOfTheDay = getCountryOfTheDay(countries);

  // Trending (Random / Selected countries with high population)
  const trendingCountries = [...countries]
    .filter((c) => c.population > 50000000)
    .slice(2, 6);

  // Popular Destinations (Selected highly visited countries or standard regions)
  const popularCountries = [...countries]
    .filter((c) => c.cca3 === 'JPN' || c.cca3 === 'FRA' || c.cca3 === 'ITA' || c.cca3 === 'CHE')
    .slice(0, 4);

  // Resolve recently viewed countries
  const recentViewedCountries = countries.filter((c) =>
    recentlyViewed.includes(c.cca3)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery.trim());
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalGlobalPopulation = countries.reduce((sum, c) => sum + c.population, 0);
  const totalGlobalArea = countries.reduce((sum, c) => sum + c.area, 0);

  // Dynamic user welcome greeting based on hour of the day
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning, Explorer';
    if (hours < 18) return 'Good Afternoon, Explorer';
    return 'Good Evening, Explorer';
  };

  return (
    <div className="space-y-14 pb-12">
      
      {/* 1. Large Parallax Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl p-8 md:p-14 border border-slate-200/5">
        {/* Abstract animated gradient circles in background */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        {/* Geometric Grid Map Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={preferences.animationsEnabled ? { opacity: 0, y: -10 } : {}}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-wider uppercase text-slate-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Horizon Cartography Platform</span>
          </motion.div>

          <motion.h1
            initial={preferences.animationsEnabled ? { opacity: 0, y: 15 } : {}}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
          >
            {getGreeting()}
          </motion.h1>

          <motion.p
            initial={preferences.animationsEnabled ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            className="text-base md:text-lg text-slate-300 max-w-2xl font-medium leading-relaxed"
          >
            Embark on a visual journey through 250 nations. Investigate demographics, cartography, culture, and borders in high-fidelity precision.
          </motion.p>

          {/* Large integrated search bar */}
          <motion.form
            onSubmit={handleSearchSubmit}
            initial={preferences.animationsEnabled ? { opacity: 0, y: 10 } : {}}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search countries, capitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 dark:bg-slate-950/20 text-slate-100 placeholder-slate-400 border border-white/10 focus:border-white/35 focus:ring-0 outline-none text-sm font-semibold transition-all backdrop-blur-md"
              />
            </div>
            <button
              type="submit"
              className={`px-6 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer ${getAccentClass('bg')}`}
            >
              <span>Explore</span>
              <Plane className="h-4 w-4 shrink-0" />
            </button>
          </motion.form>

          {/* Quick links of recent queries */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
              <span className="font-semibold">Recent Searches:</span>
              {recentSearches.slice(0, 3).map((query) => (
                <Link
                  key={query}
                  to={`/explore?search=${encodeURIComponent(query)}`}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all font-medium"
                >
                  {query}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Interactive Counters HUD Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
        {[
          {
            icon: Globe,
            label: 'Tracked Sovereign Nations',
            value: countries.length,
            suffix: ' countries',
            color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/10 text-blue-500',
          },
          {
            icon: Users,
            label: 'Total Global Population',
            value: totalGlobalPopulation,
            suffix: ' citizens',
            color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/10 text-emerald-500',
          },
          {
            icon: Map,
            label: 'Total Global Surface Area',
            value: totalGlobalArea,
            suffix: ' km²',
            color: 'from-amber-500/20 to-orange-500/20 border-amber-500/10 text-amber-500',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-gradient-to-br ${stat.color} bg-white/40 dark:bg-slate-950/20 border backdrop-blur-xl shadow-sm flex items-center gap-5`}
            >
              <div className={`p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-sm shrink-0 flex items-center justify-center ${stat.color.split(' ').pop()}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-baseline gap-1">
                  <AnimatedCounter value={stat.value} duration={1400} />
                  {stat.suffix && (
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-sans">
                      {stat.suffix}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. Country of the Day spotlight */}
      {countryOfTheDay && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-2xl p-6 md:p-8 border border-white/5">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center relative z-10">
            {/* Spotlight label and text */}
            <div className="md:col-span-3 space-y-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/20`}>
                <Sparkles className="h-3.5 w-3.5" />
                Featured: Country of the Day
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {countryOfTheDay.name.common}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                A majestic nation situated in <span className="font-semibold text-slate-100">{countryOfTheDay.subregion || countryOfTheDay.region}</span>, containing a population of <span className="font-semibold text-slate-100">{countryOfTheDay.population.toLocaleString()}</span> citizens. Explore its rich cultural history and geographic indicators.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pt-1">
                <div>
                  Capital: <span className="text-white">{countryOfTheDay.capital ? countryOfTheDay.capital[0] : 'N/A'}</span>
                </div>
                <div className="h-3 w-[1px] bg-white/10" />
                <div>
                  Area: <span className="text-white">{countryOfTheDay.area.toLocaleString()} km²</span>
                </div>
                {countryOfTheDay.currencies && (
                  <>
                    <div className="h-3 w-[1px] bg-white/10" />
                    <div>
                      Currency:{' '}
                      <span className="text-white">
                        {Object.values(countryOfTheDay.currencies)[0]?.name}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2">
                <Link
                  to={`/country/${countryOfTheDay.cca3.toLowerCase()}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs transition-transform hover:scale-102 active:scale-95 shadow-lg ${getAccentClass('bg')}`}
                >
                  Explore Spotlight
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Large visual preview flag */}
            <div className="md:col-span-2 relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border border-white/5 group self-stretch md:self-auto">
              <img
                src={countryOfTheDay.flags.png}
                alt={countryOfTheDay.flags.alt || `Flag of ${countryOfTheDay.name.common}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* 4. Interactive World Map Section */}
      <section>
        <WorldMapSvg />
      </section>

      {/* 5. Trending / Most Populous countries */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className={`h-5 w-5 ${getAccentClass('text')}`} />
              Trending Destinations
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Top global destinations receiving highest exploration query velocity.
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold tracking-widest uppercase hover:underline flex items-center gap-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <span>Atlas Index</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCountries.map((country, idx) => (
            <CountryCard key={country.cca3} country={country} index={idx} />
          ))}
        </div>
      </section>

      {/* 6. Popular destinations (Hand-picked visual portfolio countries) */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Plane className={`h-5 w-5 ${getAccentClass('text')}`} />
            Iconic Landmarks
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Centuries of history, architectural marvels, and pristine mountain regions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCountries.map((country, idx) => (
            <CountryCard key={country.cca3} country={country} index={idx + 4} />
          ))}
        </div>
      </section>

      {/* 7. Recently Viewed (Interactive user-history state) */}
      {recentViewedCountries.length > 0 && (
        <section className="space-y-6">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Eye className={`h-5 w-5 ${getAccentClass('text')}`} />
              Recently Checked
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Your active research footprint. Quickly jump back in.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 animate-fadeIn">
            {recentViewedCountries.slice(0, 5).map((country, idx) => (
              <CountryCard key={country.cca3} country={country} index={idx} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Portfolio Testimonials & Trust Indicators */}
      <section className="rounded-3xl bg-slate-900/40 p-8 border border-slate-200/5 dark:border-slate-800/60 backdrop-blur-xl shadow-xl space-y-8 relative overflow-hidden">
        {/* Background ambient mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Endorsed by Modern Cartographers
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            WorldAtlas is the leading data intelligence dashboard used by research institutions, schools, and professional travel writers globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              text: 'The geometric World Map HUD and detailed border indicator boxes have transformed how our team analyzes regional landlocked trade flows.',
              author: 'Dr. Clara Sterling',
              title: 'Senior Fellow, Cartography Union',
              rating: 5,
            },
            {
              text: 'I love how clean the visual details are. The country of the day, instant Recharts comparisons, and smooth Framer Motion page loading look absolutely spectacular.',
              author: 'Marc Durand',
              title: 'Independent Travel Journalist',
              rating: 5,
            },
            {
              text: 'The persistent favorites export utilities let us compile custom travel lists into CSV format in two clicks. Absolute productivity booster!',
              author: 'Sophia Chen',
              title: 'Expedition Guide, National Discovery',
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-4 shadow-inner"
            >
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="space-y-1.5">
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px]">
                  <span className="font-bold text-slate-100 block">
                    {testimonial.author}
                  </span>
                  <span className="text-slate-500 font-semibold block">
                    {testimonial.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Premium CTA Banner */}
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
            Ready for your next exploration?
          </h3>
          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            Configure your custom theme accent, toggle metrics between metric and imperial, and filters countries instantly in our advanced Explorer dashboard.
          </p>
        </div>

        <Link
          to="/explore"
          className="px-6 py-3.5 rounded-2xl bg-white text-indigo-700 font-extrabold text-sm hover:bg-slate-100 shadow-xl shadow-indigo-950/20 active:scale-95 transition-all whitespace-nowrap"
        >
          Activate Advanced Search
        </Link>
      </section>

    </div>
  );
}
