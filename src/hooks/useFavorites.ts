import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('worldatlas_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse favorites:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('worldatlas_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites:', e);
    }
  }, [favorites]);

  const addFavorite = useCallback((cca3: string, countryName?: string) => {
    setFavorites((prev) => {
      if (!prev.includes(cca3)) {
        toast.success(`${countryName || cca3} added to favorites`, {
          icon: '❤️',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        });
        return [...prev, cca3];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((cca3: string, countryName?: string) => {
    setFavorites((prev) => {
      if (prev.includes(cca3)) {
        toast.success(`${countryName || cca3} removed from favorites`, {
          icon: '💔',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        });
        return prev.filter((code) => code !== cca3);
      }
      return prev;
    });
  }, []);

  const isFavorite = useCallback((cca3: string) => {
    return favorites.includes(cca3);
  }, [favorites]);

  const toggleFavorite = useCallback((cca3: string, countryName?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(cca3);
      if (exists) {
        toast.success(`${countryName || cca3} removed from favorites`, {
          icon: '💔',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        });
        return prev.filter((code) => code !== cca3);
      } else {
        toast.success(`${countryName || cca3} added to favorites`, {
          icon: '❤️',
          style: {
            borderRadius: '12px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        });
        return [...prev, cca3];
      }
    });
  }, []);

  const exportFavoritesJSON = useCallback((countriesData: any[]) => {
    try {
      const favoritedCountries = countriesData.filter((c) => favorites.includes(c.cca3));
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(favoritedCountries, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'worldatlas_favorites.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Favorites exported as JSON!', {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
        },
      });
    } catch (e) {
      toast.error('Failed to export favorites');
    }
  }, [favorites]);

  const exportFavoritesCSV = useCallback((countriesData: any[]) => {
    try {
      const favoritedCountries = countriesData.filter((c) => favorites.includes(c.cca3));
      const headers = ['Name', 'Code', 'Capital', 'Region', 'Subregion', 'Population', 'Area (sq km)'];
      const rows = favoritedCountries.map((c) => [
        `"${c.name.common}"`,
        c.cca3,
        `"${c.capital ? c.capital.join(', ') : 'N/A'}"`,
        c.region,
        `"${c.subregion || 'N/A'}"`,
        c.population,
        c.area,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', encodedUri);
      downloadAnchor.setAttribute('download', 'worldatlas_favorites.csv');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success('Favorites exported as CSV!', {
        style: {
          borderRadius: '12px',
          background: '#1e293b',
          color: '#f8fafc',
        },
      });
    } catch (e) {
      toast.error('Failed to export favorites');
    }
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    exportFavoritesJSON,
    exportFavoritesCSV,
  };
}
