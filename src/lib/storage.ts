// helpers pour localStorage (favoris, preferences, historique recherches)

import type { FavoriteCity, UserPreferences } from "@/types";

const STORAGE_KEYS = {
  favorites: "meteo-aura-favorites",
  preferences: "meteo-aura-preferences",
  searchHistory: "meteo-aura-search-history",
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  timeFormat: "24h",
  theme: "system",
};

// verifier si on est cote client
function isClient(): boolean {
  return typeof window !== "undefined";
}

// favorites

export function getFavorites(): FavoriteCity[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.favorites);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(city: Omit<FavoriteCity, "id" | "addedAt">): FavoriteCity {
  const favorites = getFavorites();
  const newFavorite: FavoriteCity = {
    ...city,
    id: `${city.latitude}-${city.longitude}`,
    addedAt: Date.now(),
  };

  // eviter les doublons
  const exists = favorites.some((f) => f.id === newFavorite.id);
  if (!exists) {
    favorites.push(newFavorite);
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
    }
  }

  return newFavorite;
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter((f) => f.id !== id);
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }
}

export function isFavorite(latitude: number, longitude: number): boolean {
  const id = `${latitude}-${longitude}`;
  return getFavorites().some((f) => f.id === id);
}

// preferences

export function getPreferences(): UserPreferences {
  if (!isClient()) return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.preferences);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function setPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(updated));
  }
  return updated;
}

// historique de recherche

export interface SearchHistoryItem {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: number;
}

const MAX_SEARCH_HISTORY = 10;

export function getSearchHistory(): SearchHistoryItem[] {
  if (!isClient()) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.searchHistory);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToSearchHistory(item: Omit<SearchHistoryItem, "timestamp">): void {
  const history = getSearchHistory();
  const newItem: SearchHistoryItem = {
    ...item,
    timestamp: Date.now(),
  };

  // supprimer si deja present (pour le remonter)
  const filtered = history.filter(
    (h) => !(h.latitude === item.latitude && h.longitude === item.longitude)
  );

  // ajouter en debut
  filtered.unshift(newItem);

  // limiter la taille
  const limited = filtered.slice(0, MAX_SEARCH_HISTORY);

  if (isClient()) {
    localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(limited));
  }
}

export function clearSearchHistory(): void {
  if (isClient()) {
    localStorage.removeItem(STORAGE_KEYS.searchHistory);
  }
}
