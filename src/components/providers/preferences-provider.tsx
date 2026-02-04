"use client";

// contexte pour les preferences utilisateur (unites, theme, format heure)

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UserPreferences } from "@/types";
import { getPreferences, setPreferences as savePreferences } from "@/lib/storage";

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  timeFormat: "24h",
  theme: "system",
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    return getPreferences();
  });
  const mounted = typeof window !== "undefined";

  useEffect(() => {
    if (!mounted) return;

    // appliquer le theme
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (preferences.theme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(systemDark ? "dark" : "light");
    } else {
      root.classList.add(preferences.theme);
    }
  }, [preferences.theme, mounted]);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = savePreferences(prefs);
    setPreferencesState(updated);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
