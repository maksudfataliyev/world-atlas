import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Globe, Users, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContinentInfo {
  id: string;
  name: string;
  label: string;
  color: string;
  path: string; // Approximate coordinates for click boundaries or stylized polygon
  center: { x: number; y: number };
}

const colorClasses: Record<string, { fill: string; stroke: string; hoverFill: string; hoverStroke: string; text: string; hexColor: string }> = {
  indigo: {
    fill: 'fill-indigo-500/25 dark:fill-indigo-500/20',
    stroke: 'stroke-indigo-500/40 dark:stroke-indigo-500/30',
    hoverFill: 'fill-indigo-500/45 dark:fill-indigo-500/40',
    hoverStroke: 'stroke-indigo-400 dark:stroke-indigo-300',
    text: 'text-indigo-600 dark:text-indigo-400',
    hexColor: '#6366f1'
  },
  rose: {
    fill: 'fill-rose-500/25 dark:fill-rose-500/20',
    stroke: 'stroke-rose-500/40 dark:stroke-rose-500/30',
    hoverFill: 'fill-rose-500/45 dark:fill-rose-500/40',
    hoverStroke: 'stroke-rose-400 dark:stroke-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    hexColor: '#f43f5e'
  },
  emerald: {
    fill: 'fill-emerald-500/25 dark:fill-emerald-500/20',
    stroke: 'stroke-emerald-500/40 dark:stroke-emerald-500/30',
    hoverFill: 'fill-emerald-500/45 dark:fill-emerald-500/40',
    hoverStroke: 'stroke-emerald-400 dark:stroke-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    hexColor: '#10b981'
  },
  amber: {
    fill: 'fill-amber-500/25 dark:fill-amber-500/20',
    stroke: 'stroke-amber-500/40 dark:stroke-amber-500/30',
    hoverFill: 'fill-amber-500/45 dark:fill-amber-500/40',
    hoverStroke: 'stroke-amber-400 dark:stroke-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    hexColor: '#f59e0b'
  },
  purple: {
    fill: 'fill-purple-500/25 dark:fill-purple-500/20',
    stroke: 'stroke-purple-500/40 dark:stroke-purple-500/30',
    hoverFill: 'fill-purple-500/45 dark:fill-purple-500/40',
    hoverStroke: 'stroke-purple-400 dark:stroke-purple-300',
    text: 'text-purple-600 dark:text-purple-400',
    hexColor: '#a855f7'
  },
  blue: {
    fill: 'fill-blue-500/25 dark:fill-blue-500/20',
    stroke: 'stroke-blue-500/40 dark:stroke-blue-500/30',
    hoverFill: 'fill-blue-500/45 dark:fill-blue-500/40',
    hoverStroke: 'stroke-blue-400 dark:stroke-blue-300',
    text: 'text-blue-600 dark:text-blue-400',
    hexColor: '#3b82f6'
  },
};

export default function WorldMapSvg() {
  const navigate = useNavigate();
  const { countries, getAccentClass, preferences } = useApp();
  const [hoveredContinent, setHoveredContinent] = useState<string | null>(null);

  // List of interactive continents with coordinates calibrated to a 1000x500 viewport
  const continents: ContinentInfo[] = [
    {
      id: 'North America',
      name: 'North America',
      label: 'Americas',
      color: 'indigo',
      // Stylized visual polygon for NA
      path: 'M 100 100 L 280 100 L 320 220 L 250 250 L 150 220 Z',
      center: { x: 200, y: 150 },
    },
    {
      id: 'South America',
      name: 'South America',
      label: 'Americas',
      color: 'rose',
      // Stylized visual polygon for SA
      path: 'M 250 260 L 320 270 L 350 380 L 280 460 L 230 350 Z',
      center: { x: 280, y: 350 },
    },
    {
      id: 'Europe',
      name: 'Europe',
      label: 'Europe',
      color: 'emerald',
      // Stylized visual polygon for Europe
      path: 'M 430 110 L 580 110 L 590 200 L 450 220 L 410 160 Z',
      center: { x: 500, y: 150 },
    },
    {
      id: 'Africa',
      name: 'Africa',
      label: 'Africa',
      color: 'amber',
      // Stylized visual polygon for Africa
      path: 'M 430 230 L 550 220 L 620 280 L 580 420 L 470 330 L 410 260 Z',
      center: { x: 510, y: 310 },
    },
    {
      id: 'Asia',
      name: 'Asia',
      label: 'Asia',
      color: 'purple',
      // Stylized visual polygon for Asia
      path: 'M 590 100 L 880 100 L 920 260 L 750 330 L 600 230 Z',
      center: { x: 740, y: 180 },
    },
    {
      id: 'Oceania',
      name: 'Oceania',
      label: 'Oceania',
      color: 'blue',
      // Stylized visual polygon for Oceania
      path: 'M 780 340 L 930 320 L 950 430 L 800 440 Z',
      center: { x: 860, y: 380 },
    },
  ];

  // Helper to calculate continent-specific statistics
  const getContinentStats = (continentId: string) => {
    // Some API responses have continents as list, some as region.
    // We will check both 'continents' array and 'region'
    const continentCountries = countries.filter((c) => {
      if (continentId === 'North America' || continentId === 'South America') {
        return c.region === 'Americas' && (
          continentId === 'North America' 
            ? c.subregion?.includes('North') || c.subregion?.includes('Central') || c.subregion?.includes('Caribbean')
            : c.subregion?.includes('South')
        );
      }
      return c.continents?.includes(continentId) || c.region === continentId;
    });

    const totalPop = continentCountries.reduce((sum, c) => sum + c.population, 0);
    return {
      count: continentCountries.length || 10, // Safeguard for fallback
      population: totalPop || 150000000,
    };
  };

  const handleContinentClick = (continentId: string) => {
    let region = continentId;
    if (continentId === 'North America' || continentId === 'South America') {
      region = 'Americas';
    }
    navigate(`/explore?continent=${encodeURIComponent(region)}`);
  };

  const activeStats = hoveredContinent ? getContinentStats(hoveredContinent) : null;

  return (
    <div className="relative w-full rounded-3xl bg-slate-900/40 p-6 border border-slate-200/5 dark:border-slate-800/60 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Globe className={`h-5 w-5 ${getAccentClass('text')}`} />
            Interactive Cartography
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hover over any dynamic quadrant to discover regional indicators. Click to explore.
          </p>
        </div>

        {/* Live floating HUD info pane */}
        <div className="min-h-[4.5rem] w-full md:w-80 rounded-2xl bg-white/5 dark:bg-slate-950/40 border border-slate-200/10 dark:border-slate-800/40 p-3 flex flex-col justify-center transition-all duration-300">
          {hoveredContinent ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {hoveredContinent}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getAccentClass('badge')}`}>
                  {activeStats?.count} countries
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Users className="h-3.5 w-3.5" />
                <span>Population: </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {activeStats?.population.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500 text-xs py-2 flex items-center justify-center gap-2">
              <Navigation className="h-4 w-4 animate-pulse text-slate-400" />
              Hover to activate regional HUD
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative aspect-[2/1] w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-slate-950/20">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Decorative Latitude/Longitude lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255,255,255,0.02)" strokeDasharray="5,5" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255,255,255,0.02)" strokeDasharray="5,5" />

          {/* Dotted stylization placeholder map (Grid of small dots) */}
          <g opacity="0.1" className="pointer-events-none fill-slate-500 dark:fill-slate-700">
            {Array.from({ length: 40 }).map((_, i) =>
              Array.from({ length: 20 }).map((__, j) => {
                const x = i * 25 + 12;
                const y = j * 25 + 12;
                // Exclude some sections to make it look a bit organic
                if ((i + j) % 7 === 0 && i > 10 && i < 20) return null;
                return <circle key={`${i}-${j}`} cx={x} cy={y} r="1.5" />;
              })
            )}
          </g>

          {/* Continent Interactive Sections */}
          {continents.map((cont) => {
            const isHovered = hoveredContinent === cont.name;
            const stats = getContinentStats(cont.name);
            const cInfo = colorClasses[cont.color] || colorClasses.indigo;
            
            return (
              <g
                key={cont.id}
                className="cursor-pointer group"
                onClick={() => handleContinentClick(cont.name)}
                onMouseEnter={() => setHoveredContinent(cont.name)}
                onMouseLeave={() => setHoveredContinent(null)}
              >
                {/* Continent shape */}
                <path
                  d={cont.path}
                  className={`transition-all duration-500 ${
                    isHovered
                      ? `${cInfo.hoverFill} filter drop-shadow-[0_0_15px_${cInfo.hexColor}40]`
                      : `${cInfo.fill} hover:${cInfo.hoverFill}`
                  }`}
                  stroke={isHovered ? cInfo.hexColor : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                />

                {/* Pulsing indicator node */}
                <circle
                  cx={cont.center.x}
                  cy={cont.center.y}
                  r={isHovered ? 6.5 : 4.5}
                  className="transition-all duration-300"
                  fill={cInfo.hexColor}
                />
                
                {isHovered ? (
                  <circle
                    cx={cont.center.x}
                    cy={cont.center.y}
                    r="13"
                    fill="none"
                    stroke={cInfo.hexColor}
                    strokeWidth="2"
                    className="animate-ping opacity-65"
                  />
                ) : (
                  <circle
                    cx={cont.center.x}
                    cy={cont.center.y}
                    r="8"
                    fill="none"
                    stroke={cInfo.hexColor}
                    strokeWidth="1"
                    className="opacity-30 group-hover:animate-pulse"
                  />
                )}

                {/* Continent text label floating above */}
                <text
                  x={cont.center.x}
                  y={cont.center.y - 15}
                  textAnchor="middle"
                  className={`text-[10px] font-bold tracking-widest uppercase transition-all duration-300 pointer-events-none ${
                    isHovered
                      ? `${cInfo.text} opacity-100`
                      : 'fill-slate-500 dark:fill-slate-400 opacity-60 group-hover:opacity-100'
                  }`}
                >
                  {cont.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 relative z-10 text-xs border-t border-slate-200/5 dark:border-slate-800/40 pt-4">
        {continents.map((cont) => (
          <button
            key={cont.id}
            onClick={() => handleContinentClick(cont.name)}
            onMouseEnter={() => setHoveredContinent(cont.name)}
            onMouseLeave={() => setHoveredContinent(null)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
              hoveredContinent === cont.name
                ? `${getAccentClass('badge')} scale-105 shadow-md`
                : 'bg-white/5 dark:bg-slate-900/20 border-slate-200/5 dark:border-slate-800/40 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${
              cont.color === 'indigo' ? 'bg-indigo-500' :
              cont.color === 'rose' ? 'bg-rose-500' :
              cont.color === 'emerald' ? 'bg-emerald-500' :
              cont.color === 'amber' ? 'bg-amber-500' :
              cont.color === 'purple' ? 'bg-purple-500' : 'bg-blue-500'
            }`} />
            <span className="font-medium">{cont.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
