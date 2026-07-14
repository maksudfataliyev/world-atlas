import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Country, Preferences } from '../types/country';
import { usePreferences } from '../hooks/usePreferences';
import { useFavorites } from '../hooks/useFavorites';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { getAllCountries } from '../services/api';

interface AppContextType {
  countries: Country[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  preferences: Preferences;
  updatePreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetPreferences: () => void;
  getAccentClass: (type: 'text' | 'bg' | 'border' | 'hoverBg' | 'hoverText' | 'focusRing' | 'gradient' | 'badge') => string;
  favorites: string[];
  addFavorite: (cca3: string, name?: string) => void;
  removeFavorite: (cca3: string, name?: string) => void;
  isFavorite: (cca3: string) => boolean;
  toggleFavorite: (cca3: string, name?: string) => void;
  exportFavoritesJSON: (countries: Country[]) => void;
  exportFavoritesCSV: (countries: Country[]) => void;
  recentSearches: string[];
  recentlyViewed: string[];
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  addRecentlyViewed: (cca3: string) => void;
  clearRecentlyViewed: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // TanStack Query for caching countries data
  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: getAllCountries,
    staleTime: 1000 * 60 * 60, // 1 hour caching
    retry: 2,
  });

  const prefs = usePreferences();
  const favs = useFavorites();
  const recents = useRecentSearches();

  const value: AppContextType = {
    countries,
    isLoading,
    isError,
    error: error as Error | null,
    preferences: prefs.preferences,
    updatePreference: prefs.updatePreference,
    resetPreferences: prefs.resetPreferences,
    getAccentClass: prefs.getAccentClass,
    favorites: favs.favorites,
    addFavorite: favs.addFavorite,
    removeFavorite: favs.removeFavorite,
    isFavorite: favs.isFavorite,
    toggleFavorite: favs.toggleFavorite,
    exportFavoritesJSON: favs.exportFavoritesJSON,
    exportFavoritesCSV: favs.exportFavoritesCSV,
    recentSearches: recents.recentSearches,
    recentlyViewed: recents.recentlyViewed,
    addRecentSearch: recents.addRecentSearch,
    removeRecentSearch: recents.removeRecentSearch,
    clearRecentSearches: recents.clearRecentSearches,
    addRecentlyViewed: recents.addRecentlyViewed,
    clearRecentlyViewed: recents.clearRecentlyViewed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
