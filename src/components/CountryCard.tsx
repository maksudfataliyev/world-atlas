import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Country } from '../types/country';
import { Heart, Users, MapPin, Compass, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountryCardProps {
  country: Country;
  index?: number;
  key?: any;
}

export default function CountryCard({ country, index = 0 }: CountryCardProps) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, getAccentClass, preferences } = useApp();

  const cca3 = country.cca3;
  const isFav = isFavorite(cca3);
  const commonName = country.name.common;
  const capitalName = country.capital ? country.capital[0] : 'N/A';
  const flagUrl = country.flags.png;
  const flagAlt = country.flags.alt || `Flag of ${commonName}`;
  const region = country.region;
  const population = country.population;

  const handleCardClick = () => {
    navigate(`/country/${cca3.toLowerCase()}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(cca3, commonName);
  };

  // Check if animations are enabled
  const animationVariants = preferences.animationsEnabled
    ? {
        hidden: { opacity: 0, y: 15 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            delay: Math.min(index * 0.05, 0.4),
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }
    : { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      whileHover={preferences.animationsEnabled ? { y: -6, scale: 1.01 } : {}}
      onClick={handleCardClick}
      className="group relative flex flex-col h-full rounded-3xl bg-white/45 dark:bg-slate-900/45 border border-slate-200/10 dark:border-slate-800/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-slate-500/5 dark:hover:shadow-indigo-950/20 hover:border-slate-300/30 dark:hover:border-slate-700/60 transition-all duration-300 overflow-hidden cursor-pointer shadow-sm"
    >
      {/* Flag Image Cover with Gradient Tint Overlay */}
      <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
        
        {/* Subtle decorative shimmer background while flag is lazy-loaded */}
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse pointer-events-none" />

        <img
          src={flagUrl}
          alt={flagAlt}
          loading="lazy"
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 z-0"
          onLoad={(e) => {
            const parent = e.currentTarget.parentElement;
            if (parent) {
              const pulse = parent.querySelector('.animate-pulse');
              if (pulse) pulse.remove();
            }
          }}
        />

        {/* Favorite Button Overlay */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3.5 right-3.5 h-9 w-9 rounded-xl bg-white/80 dark:bg-slate-950/70 border border-white/20 dark:border-slate-800/80 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer z-20 group/heart"
          aria-label={isFav ? `Remove ${commonName} from favorites` : `Add ${commonName} to favorites`}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-all duration-300 ${
              isFav
                ? 'fill-rose-500 text-rose-500 scale-110'
                : 'text-slate-500 dark:text-slate-400 group-hover/heart:text-rose-500 dark:group-hover/heart:text-rose-400 group-hover/heart:scale-110'
            }`}
          />
        </button>

        {/* Region overlay badge */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-slate-900/60 dark:bg-slate-950/60 border border-slate-200/10 text-slate-100 backdrop-blur-md z-20">
          {region}
        </span>
      </div>

      {/* Card Content Description */}
      <div className="flex flex-col flex-1 p-5 relative">
        <div className="flex-1">
          {/* Main Title */}
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors duration-200 line-clamp-1">
            {commonName}
          </h4>

          {/* Capital Name */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="truncate">{capitalName}</span>
          </div>

          {/* Population Statistic */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <Users className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span>Pop: {population.toLocaleString()}</span>
          </div>
        </div>

        {/* Elegant hover disclosure indicator */}
        <div className="flex items-center justify-between border-t border-slate-200/5 dark:border-slate-800/40 pt-3.5 mt-4 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
          <span className="flex items-center gap-1">
            <Sparkles className={`h-3 w-3 ${getAccentClass('text')}`} />
            {country.cca3}
          </span>
          <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
            Details &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}
