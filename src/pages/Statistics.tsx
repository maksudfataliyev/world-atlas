import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatsSkeleton } from '../components/SkeletonLoader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Map,
  Users,
  Compass,
  CheckCircle,
  Activity,
  Award,
  Globe,
  Droplets,
} from 'lucide-react';

export default function Statistics() {
  const { countries, isLoading, getAccentClass } = useApp();
  const [activeTab, setActiveTab] = useState<'pop' | 'area' | 'continents'>('pop');
  const [chartLimit, setChartLimit] = useState<number>(12);

  // 1. Top countries by Population
  const topPopulated = useMemo(() => {
    return [...countries]
      .sort((a, b) => b.population - a.population)
      .slice(0, chartLimit)
      .map((c) => ({
        name: c.name.common,
        population: c.population,
        formattedPop: (c.population / 1e6).toFixed(1) + 'M',
      }));
  }, [countries, chartLimit]);

  // 2. Top countries by Area
  const topArea = useMemo(() => {
    return [...countries]
      .sort((a, b) => b.area - a.area)
      .slice(0, chartLimit)
      .map((c) => ({
        name: c.name.common,
        area: c.area,
        formattedArea: (c.area / 1e6).toFixed(1) + 'M km²',
      }));
  }, [countries, chartLimit]);

  // 3. Continent Distribution (Counts, Total Pop, Avg Area)
  const continentStats = useMemo(() => {
    const stats: { [key: string]: { count: number; population: number; area: number } } = {};

    countries.forEach((c) => {
      const continent = c.region || 'Oceania';
      if (!stats[continent]) {
        stats[continent] = { count: 0, population: 0, area: 0 };
      }
      stats[continent].count += 1;
      stats[continent].population += c.population;
      stats[continent].area += c.area;
    });

    return Object.entries(stats).map(([name, data]) => ({
      name,
      count: data.count,
      population: data.population,
      formattedPop: (data.population / 1e6).toFixed(0) + 'M',
      area: Math.round(data.area),
    }));
  }, [countries]);

  // 4. Sovereignty distribution (Independent vs dependents)
  const sovereigntyStats = useMemo(() => {
    let independent = 0;
    let dependent = 0;

    countries.forEach((c) => {
      if (c.independent) {
        independent++;
      } else {
        dependent++;
      }
    });

    return [
      { name: 'Sovereign Independent', value: independent },
      { name: 'External Territories', value: dependent },
    ];
  }, [countries]);

  if (isLoading) {
    return <StatsSkeleton />;
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#3b82f6', '#ec4899'];
  const PIE_COLORS = ['#6366f1', '#64748b'];

  return (
    <div className="space-y-10 pb-12 animate-fadeIn">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
          <BarChart3 className={`h-7 w-7 ${getAccentClass('text')}`} />
          Global Cartographic Statistics
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Comparative demographic analyses, sovereign surface area visualizers, and regional indicators.
        </p>
      </div>

      {/* Summary HUD Cards Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Most Populous Nation',
            value: countries.reduce((max, c) => (c.population > max.population ? c : max), countries[0])?.name.common,
            sub: countries.reduce((max, c) => (c.population > max.population ? c : max), countries[0])?.population.toLocaleString() + ' citizens',
            icon: Users,
            color: 'text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20',
          },
          {
            label: 'Largest Surface Area',
            value: countries.reduce((max, c) => (c.area > max.area ? c : max), countries[0])?.name.common,
            sub: countries.reduce((max, c) => (c.area > max.area ? c : max), countries[0])?.area.toLocaleString() + ' km²',
            icon: Map,
            color: 'text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
          },
          {
            label: 'Most Common Region',
            value: continentStats.reduce((max, c) => (c.count > max.count ? c : max), continentStats[0])?.name,
            sub: continentStats.reduce((max, c) => (c.count > max.count ? c : max), continentStats[0])?.count + ' sovereign entities',
            icon: Compass,
            color: 'text-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
          },
          {
            label: 'Sovereignty Index',
            value: `${((sovereigntyStats[0].value / countries.length) * 100).toFixed(0)}% Independent`,
            sub: sovereigntyStats[0].value + ' independent nations total',
            icon: CheckCircle,
            color: 'text-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm flex items-center gap-4"
            >
              <div className={`p-3 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 block">
                  {item.label}
                </span>
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 block truncate">
                  {item.value}
                </span>
                <span className="text-[11px] text-slate-500 block truncate font-medium">
                  {item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Main interactive comparison graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double-Column Graph block */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-6">
          
          {/* Tab selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/5 dark:border-slate-800/40 pb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
              Comparative Sovereign Metrics
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100/60 dark:bg-slate-950/30 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/50 text-xs font-bold self-stretch sm:self-auto">
                {[
                  { id: 'pop', label: 'Population Leaders' },
                  { id: 'area', label: 'Landmass Leaders' },
                  { id: 'continents', label: 'Continent Spread' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab !== 'continents' && (
                <select
                  value={chartLimit}
                  onChange={(e) => setChartLimit(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-200/50 dark:border-slate-800/80 outline-none focus:border-indigo-500/50 cursor-pointer shadow-sm"
                >
                  <option value={5}>Top 5</option>
                  <option value={12}>Top 12</option>
                  <option value={25}>Top 25</option>
                  <option value={50}>Top 50</option>
                  <option value={250}>All (250)</option>
                </select>
              )}
            </div>
          </div>

          {/* Dynamic Chart viewport */}
          <div className="h-[22rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'pop' ? (
                /* Population Chart */
                <BarChart data={topPopulated} layout="vertical" margin={{ top: 10, right: 20, left: 15, bottom: 5 }}>
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val >= 1e6 ? `${(val / 1e6).toFixed(0)}M` : val.toLocaleString())}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={85}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-950 text-white rounded-xl border border-white/10 text-xs shadow-xl space-y-0.5 font-sans">
                            <p className="font-extrabold">{data.name}</p>
                            <p className="text-slate-400">
                              Population: <span className="text-white font-mono">{data.population.toLocaleString()} citizens</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="population" fill="#6366f1" radius={[0, 6, 6, 0]} maxBarSize={16}>
                    {topPopulated.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : activeTab === 'area' ? (
                /* Area Chart */
                <BarChart data={topArea} layout="vertical" margin={{ top: 10, right: 20, left: 15, bottom: 5 }}>
                  <XAxis
                    type="number"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val >= 1e6 ? `${(val / 1e6).toFixed(0)}M km²` : val.toLocaleString())}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={85}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-950 text-white rounded-xl border border-white/10 text-xs shadow-xl space-y-0.5 font-sans">
                            <p className="font-extrabold">{data.name}</p>
                            <p className="text-slate-400">
                              Surface Area: <span className="text-white font-mono">{data.area.toLocaleString()} km²</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="area" fill="#10b981" radius={[0, 6, 6, 0]} maxBarSize={16}>
                    {topArea.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                /* Continent chart (Area chart visual) */
                <AreaChart data={continentStats} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(num) => (num >= 1e6 ? `${(num / 1e6).toFixed(0)}M` : num.toLocaleString())}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-950 text-white rounded-xl border border-white/10 text-xs shadow-xl space-y-1">
                            <p className="font-bold">{data.name}</p>
                            <p className="text-slate-400">
                              Country Count: <span className="text-white font-mono">{data.count}</span>
                            </p>
                            <p className="text-slate-400">
                              Total Population: <span className="text-white font-mono">{data.population.toLocaleString()}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <defs>
                    <linearGradient id="popGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="population"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#popGradient)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Single-Column containing Sovereignty Ratio and Global Surface Composition */}
        <div className="space-y-8 flex flex-col">
          {/* Sovereignty Profile */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                Sovereignty Profile
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Percentage of fully independent nations versus territories under external administration.
              </p>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={soverignityData(sovereigntyStats)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {soverignityData(sovereigntyStats).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 bg-slate-950 text-white border border-white/10 rounded-lg text-xs font-bold shadow">
                            {data.name}: {data.value} nations
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Inner absolute statistics indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800 dark:text-slate-100 font-mono">
                  {countries.length}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Entities
                </span>
              </div>
            </div>

            {/* Color Index Legend */}
            <div className="space-y-2 border-t border-slate-200/10 pt-4 text-xs font-semibold">
              {soverignityData(sovereigntyStats).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {item.value} ({((item.value / countries.length) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Global Surface Composition */}
          <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/5 dark:border-slate-800/40 backdrop-blur-xl shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Globe className={`h-4.5 w-4.5 ${getAccentClass('text')}`} />
                Global Surface Composition
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Comparative breakdown of terrestrial landmass versus planetary marine water coverage.
              </p>
            </div>

            {/* Visual multi-segment progress bar */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/50 flex overflow-hidden">
                {/* Land Segment (29.4%) */}
                <div 
                  className={`h-full transition-all duration-500 ${getAccentClass('bg')}`}
                  style={{ width: '29.4%' }}
                  title="Global Land Area: 29.4%"
                />
                {/* Water Segment (70.6%) */}
                <div 
                  className="h-full bg-blue-500/80 dark:bg-blue-600/70 transition-all duration-500"
                  style={{ width: '70.6%' }}
                  title="Global Ocean Cover: 70.6%"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">
                <span>LAND (29.4%)</span>
                <span>OCEANS (70.6%)</span>
              </div>
            </div>

            {/* Metric Breakdown list */}
            <div className="space-y-3 pt-2 border-t border-slate-200/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Total Earth Surface</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">510.1M km²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${getAccentClass('bg')}`} />
                  Terrestrial Landmass
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">150.1M km²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Oceans & Seas
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">360.0M km²</span>
              </div>
            </div>

            {/* Explanatory Caption */}
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40">
              The cumulative landmass of all 250 countries and territories catalogs approximately <strong>150.1 Million km²</strong> (29.4%). The remaining <strong>360.0 Million km²</strong> (70.6%) is composed of oceans, marine waters, and international seas, yielding the total planetary surface area of <strong>510.1 Million km²</strong>.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

// Simple internal helper to safely process sovereigntyStats
function soverignityData(stats: any[]) {
  return stats || [];
}
