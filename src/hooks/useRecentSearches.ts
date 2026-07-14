import { useState, useEffect, useCallback } from 'react';

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('worldatlas_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('worldatlas_recently_viewed');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('worldatlas_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {}
  }, [recentSearches]);

  useEffect(() => {
    try {
      localStorage.setItem('worldatlas_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {}
  }, [recentlyViewed]);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 8); // Keep last 8 searches
    });
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches((prev) => prev.filter((q) => q !== query));
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const addRecentlyViewed = useCallback((cca3: string) => {
    if (!cca3) return;
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((code) => code !== cca3);
      return [cca3, ...filtered].slice(0, 10); // Keep last 10 viewed
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentSearches,
    recentlyViewed,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    addRecentlyViewed,
    clearRecentlyViewed,
  };
}
