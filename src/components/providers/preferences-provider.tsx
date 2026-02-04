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
  theme: "dark",
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<UserPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    // Charger les préférences depuis le stockage côté client
    const saved = getPreferences();

    // Utiliser un timeout pour éviter les rendus en cascade
    if (saved) {
      setTimeout(() => {
        setPreferencesState((prev) => ({ ...prev, ...saved }));
      }, 0);
    }

    // Toujours forcer le mode sombre
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, []);

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
