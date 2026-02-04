// tests pour les helpers localstorage

import { describe, it, expect, beforeEach } from "vitest";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getPreferences,
  setPreferences,
  getSearchHistory,
  addToSearchHistory,
  clearSearchHistory,
} from "@/lib/storage";

// mock localstorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

Object.defineProperty(global, "window", {
  value: {
    localStorage: localStorageMock,
  },
});

describe("storage helpers", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe("favorites", () => {
    it("retourne un tableau vide si pas de favoris", () => {
      expect(getFavorites()).toEqual([]);
    });

    it("ajoute un favori", () => {
      const city = {
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      };

      const result = addFavorite(city);

      expect(result.name).toBe("Paris");
      expect(result.id).toBe("48.8566-2.3522");
      expect(result.addedAt).toBeDefined();

      const favorites = getFavorites();
      expect(favorites).toHaveLength(1);
      expect(favorites[0].name).toBe("Paris");
    });

    it("n'ajoute pas de doublon", () => {
      const city = {
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      };

      addFavorite(city);
      addFavorite(city);

      const favorites = getFavorites();
      expect(favorites).toHaveLength(1);
    });

    it("supprime un favori", () => {
      const city = {
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      };

      addFavorite(city);
      expect(getFavorites()).toHaveLength(1);

      removeFavorite("48.8566-2.3522");
      expect(getFavorites()).toHaveLength(0);
    });

    it("verifie si une ville est en favori", () => {
      const city = {
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      };

      expect(isFavorite(48.8566, 2.3522)).toBe(false);

      addFavorite(city);

      expect(isFavorite(48.8566, 2.3522)).toBe(true);
      expect(isFavorite(0, 0)).toBe(false);
    });
  });

  describe("preferences", () => {
    it("retourne les preferences par defaut", () => {
      const prefs = getPreferences();

      expect(prefs.temperatureUnit).toBe("celsius");
      expect(prefs.windSpeedUnit).toBe("kmh");
      expect(prefs.timeFormat).toBe("24h");
      expect(prefs.theme).toBe("system");
    });

    it("met a jour les preferences", () => {
      setPreferences({ temperatureUnit: "fahrenheit" });

      const prefs = getPreferences();
      expect(prefs.temperatureUnit).toBe("fahrenheit");
      expect(prefs.windSpeedUnit).toBe("kmh"); // inchange
    });

    it("met a jour plusieurs preferences", () => {
      setPreferences({
        temperatureUnit: "fahrenheit",
        windSpeedUnit: "mph",
        theme: "dark",
      });

      const prefs = getPreferences();
      expect(prefs.temperatureUnit).toBe("fahrenheit");
      expect(prefs.windSpeedUnit).toBe("mph");
      expect(prefs.theme).toBe("dark");
    });
  });

  describe("search history", () => {
    it("retourne un historique vide", () => {
      expect(getSearchHistory()).toEqual([]);
    });

    it("ajoute une recherche a l'historique", () => {
      addToSearchHistory({
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      });

      const history = getSearchHistory();
      expect(history).toHaveLength(1);
      expect(history[0].name).toBe("Paris");
      expect(history[0].timestamp).toBeDefined();
    });

    it("remonte une recherche existante en haut", () => {
      addToSearchHistory({
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      });

      addToSearchHistory({
        name: "Lyon",
        country: "France",
        latitude: 45.764,
        longitude: 4.8357,
      });

      addToSearchHistory({
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      });

      const history = getSearchHistory();
      expect(history).toHaveLength(2);
      expect(history[0].name).toBe("Paris"); // paris remonte en premier
      expect(history[1].name).toBe("Lyon");
    });

    it("limite l'historique a 10 elements", () => {
      for (let i = 0; i < 15; i++) {
        addToSearchHistory({
          name: `City ${i}`,
          country: "Country",
          latitude: i,
          longitude: i,
        });
      }

      const history = getSearchHistory();
      expect(history).toHaveLength(10);
      expect(history[0].name).toBe("City 14"); // le plus recent
    });

    it("efface l'historique", () => {
      addToSearchHistory({
        name: "Paris",
        country: "France",
        latitude: 48.8566,
        longitude: 2.3522,
      });

      clearSearchHistory();

      expect(getSearchHistory()).toEqual([]);
    });
  });
});
