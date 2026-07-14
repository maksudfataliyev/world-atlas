import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DetailsSkeleton } from '../components/SkeletonLoader';
import {
  MapPin,
  Users,
  Compass,
  ArrowLeft,
  Heart,
  Globe2,
  Calendar,
  Car,
  Download,
  ExternalLink,
  ShieldAlert,
  Coins,
  Languages as LangIcon,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function CountryDetails() {
  const { cca3 } = useParams<{ cca3: string }>();
  const navigate = useNavigate();
  const {
    countries,
    isLoading,
    isFavorite,
    toggleFavorite,
    getAccentClass,
    addRecentlyViewed,
  } = useApp();

  // Find country
  const country = useMemo(() => {
    if (!cca3) return null;
    return countries.find((c) => c.cca3.toLowerCase() === cca3.toLowerCase()) || null;
  }, [countries, cca3]);

  // Track recently viewed history
  useEffect(() => {
    if (country) {
      addRecentlyViewed(country.cca3);
    }
  }, [country?.cca3, addRecentlyViewed]);

  // Map country borders (CCA3) to actual country objects to render beautiful names
  const borderCountries = useMemo(() => {
    if (!country || !country.borders) return [];
    return country.borders
      .map((code) => countries.find((c) => c.cca3 === code))
      .filter((c): c is NonNullable<typeof c> => !!c);
  }, [country, countries]);

  // Regional comparisons (Population comparison chart)
  const regionalChartData = useMemo(() => {
    if (!country) return [];
    
    // Find neighbors in the same subregion or region
    const targetRegion = country.subregion || country.region;
    const peerCountries = countries
      .filter((c) => (c.subregion || c.region) === targetRegion)
      .sort((a, b) => b.population - a.population)
      .slice(0, 5); // Take top 5

    // Ensure current country is included in chart
    if (!peerCountries.some((c) => c.cca3 === country.cca3)) {
      peerCountries.push(country);
    }

    return peerCountries.map((c) => ({
      name: c.name.common,
      population: c.population,
      area: c.area,
      code: c.cca3,
    })).sort((a, b) => b.population - a.population);
  }, [country, countries]);

  // Dynamic travel image placeholder category based on region
  const getTravelImage = (region: string) => {
    const urls: { [key: string]: string } = {
      Europe: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Mountain lake
      Asia: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', // Pagoda
      Africa: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80', // Wildlife savanna
      Americas: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Grand Canyon
      Oceania: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80', // Bora bora beach
    };
    return urls[region] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  };

  const handleDownloadFlag = () => {
    if (!country) return;
    const anchor = document.createElement('a');
    anchor.href = country.flags.png;
    anchor.target = '_blank';
    anchor.download = `${country.name.common}_flag.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!country) {
    return (
      <div className="text-center py-24 space-y-6">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-200/40">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold">Territory Code Unresolved</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          The country coordinates requested do not match our certified global registers. Verify your spelling or select from active charts.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs ${getAccentClass('bg')}`}
        >
          Return to Atlas Index
        </button>
      </div>
    );
  }

  const commonName = country.name.common;
  const officialName = country.name.official;
  const isFav = isFavorite(country.cca3);

  // Safely extract currencies
  const currencyList = country.currencies
    ? Object.entries(country.currencies).map(([code, details]: [string, any]) => `${details.name} (${code} - ${details.symbol || ''})`)
    : ['N/A'];

  // Safely extract languages
  const languageList = country.languages ? Object.values(country.languages) : ['N/A'];

  return (
    <div className="space-y-10 pb-12 animate-fadeIn">
      
      {/* Back button and Favorite Trigger Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Go Back</span>
        </button>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => toggleFavorite(country.cca3, commonName)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isFav
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFav ? 'Sovereign Favorite' : 'Save Destination'}</span>
          </button>

          <button
            onClick={handleDownloadFlag}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download Flag</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Flag & Travel image overlay combo */}
      <section className="relative overflow-hidden rounded-3xl aspect-[21/9] md:aspect-[3/1] bg-slate-900 border border-slate-200/5 dark:border-slate-800/60 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 pointer-events-none" />
        <img
          src={getTravelImage(country.region)}
          alt="Scenic landmark placeholder"
          className="absolute inset-0 w-full h-full object-cover opacity-45 select-none z-0 filter blur-[1px]"
        />
        
        {/* Flag Card absolute floating */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="aspect-[16/10] w-32 md:w-44 rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 bg-slate-950">
            <img
              src={country.flags.png}
              alt={country.flags.alt || `Flag of ${commonName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1.5 text-white">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
              {country.cca3}
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm">
              {commonName}
            </h1>
            <p className="text-xs text-slate-300 font-semibold italic">
              {officialName}
            </p>
          </div>
        </div>
      </section>

      {/* Grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Detailed descriptors card index */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* A. Core demographics indicators card */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Compass className={`h-5 w-5 ${getAccentClass('text')}`} />
              Sovereign Indicators
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              
              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  Administrative Capital
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                  {country.capital ? country.capital.join(', ') : 'N/A'}
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Registered Population
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 font-mono block">
                  {country.population.toLocaleString()} citizens
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5" />
                  Sovereign Region / Landmass
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                  {country.region} ({country.subregion || 'N/A'})
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" />
                  Land Area
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 font-mono block">
                  {country.area.toLocaleString()} km²
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5" />
                  Legal Tender Currency
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                  {currencyList.join(', ')}
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <LangIcon className="h-3.5 w-3.5" />
                  Spoken Languages
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block">
                  {languageList.join(', ')}
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Chronological Timezones
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 block truncate" title={country.timezones.join(', ')}>
                  {country.timezones.slice(0, 3).join(', ')} {country.timezones.length > 3 ? '...' : ''}
                </span>
              </div>

              <div className="space-y-1 bg-slate-100/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/10 dark:border-slate-800/10">
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                  <Car className="h-3.5 w-3.5" />
                  Road Direction side
                </span>
                <span className="font-extrabold text-slate-700 dark:text-slate-300 capitalize block">
                  {country.car?.side || 'right'} side driving
                </span>
              </div>

            </div>
          </div>

          {/* B. Sovereign Border Links */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Sovereign Land Borders
            </h3>
            {borderCountries.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {borderCountries.map((border) => (
                  <Link
                    key={border.cca3}
                    to={`/country/${border.cca3.toLowerCase()}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950/40 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-slate-800/60 font-semibold text-xs transition-transform hover:scale-102 active:scale-95"
                  >
                    <img
                      src={border.flags.png}
                      alt={`Flag of ${border.name.common}`}
                      className="h-4 w-6 object-cover rounded-md border border-slate-200/20 shadow-sm"
                    />
                    <span>{border.name.common} ({border.cca3})</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-2 italic">
                This territory shares no contiguous sovereign land borders. (Inland or Archipelagic Island).
              </div>
            )}
          </div>

          {/* C. Interactive Demographic Neighbor Comparison Chart */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className={`h-4.5 w-4.5 ${getAccentClass('text')}`} />
                Regional Demographic Comparison
              </h3>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {country.subregion || country.region} Region
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val.length > 10 ? val.slice(0, 8) + '..' : val)}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(num) => (num >= 1e6 ? `${(num / 1e6).toFixed(0)}M` : num.toLocaleString())}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-900 text-white rounded-xl border border-white/10 text-xs shadow-xl space-y-1">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-slate-400">
                              Population: <span className="text-white font-mono">{data.population.toLocaleString()}</span>
                            </p>
                            <p className="text-slate-400">
                              Area: <span className="text-white font-mono">{data.area.toLocaleString()} km²</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="population" radius={[8, 8, 0, 0]}>
                    {regionalChartData.map((entry, index) => {
                      const isSelf = entry.code === country.cca3;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={isSelf ? 'currentColor' : 'rgba(100, 116, 139, 0.25)'}
                          className={isSelf ? getAccentClass('text') : ''}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Side Column - Coat of Arms & Global Coordinates details */}
        <div className="space-y-8">
          
          {/* A. Coat of Arms display */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm text-center space-y-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
              Heraldic Coat of Arms
            </h3>
            
            {country.coatOfArms && country.coatOfArms.png ? (
              <div className="relative aspect-square w-36 md:w-44 mx-auto bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-200/20 flex items-center justify-center shadow-inner hover:scale-105 transition-transform duration-300">
                <img
                  src={country.coatOfArms.png}
                  alt={`Heraldic Coat of arms of ${commonName}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="aspect-square w-36 mx-auto bg-slate-100 dark:bg-slate-950/20 rounded-2xl flex flex-col items-center justify-center border border-slate-200/20 text-slate-400 p-4">
                <HelpCircle className="h-10 w-10 opacity-45 mb-2" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  No Arms Registered
                </span>
              </div>
            )}
          </div>

          {/* B. Geographic Cartography coordinates card */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-5 text-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Globe2 className={`h-4.5 w-4.5 ${getAccentClass('text')}`} />
              Geographic Coordinates
            </h3>

            <div className="space-y-4 font-mono text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between border-b border-slate-200/10 pb-2">
                <span className="text-slate-400 font-sans font-bold uppercase">Latitude</span>
                <span className="font-bold">{country.latlng[0].toFixed(4)}°</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/10 pb-2">
                <span className="text-slate-400 font-sans font-bold uppercase">Longitude</span>
                <span className="font-bold">{country.latlng[1].toFixed(4)}°</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/10 pb-2">
                <span className="text-slate-400 font-sans font-bold uppercase">UN Membership</span>
                <span className={`font-sans font-bold ${country.unMember ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {country.unMember ? 'Full Member' : 'Observer State'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans font-bold uppercase">Sovereignty</span>
                <span className={`font-sans font-bold ${country.independent ? 'text-emerald-500' : 'text-slate-500'}`}>
                  {country.independent ? 'Independent State' : 'Territory / Dependency'}
                </span>
              </div>
            </div>

            {/* Google / OpenStreetMap Links */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              <a
                href={country.maps.googleMaps}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-transform hover:scale-102 cursor-pointer ${getAccentClass('bg')}`}
              >
                <span>Locate on Google Maps</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={country.maps.openStreetMaps}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200/45 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold text-xs cursor-pointer transition-colors"
              >
                <span>OpenStreetMap Coordinates</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
