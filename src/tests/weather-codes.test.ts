// tests pour le mapping des codes meteo

import { describe, it, expect } from "vitest";
import {
  getWeatherInfo,
  getWeatherLabel,
  getWeatherIcon,
  getWeatherCondition,
} from "@/lib/weather-codes";

describe("weather-codes", () => {
  describe("getWeatherInfo", () => {
    it("retourne les infos pour un code valide", () => {
      const info = getWeatherInfo(0);
      expect(info.label).toBe("Ciel dégagé");
      expect(info.icon).toBe("sun");
      expect(info.iconNight).toBe("moon");
      expect(info.condition).toBe("clear");
    });

    it("retourne les infos par defaut pour un code invalide", () => {
      const info = getWeatherInfo(999);
      expect(info.label).toBe("Inconnu");
      expect(info.condition).toBe("cloudy");
    });

    it("retourne les bonnes infos pour la pluie", () => {
      const info = getWeatherInfo(63);
      expect(info.label).toBe("Pluie modérée");
      expect(info.icon).toBe("cloud-rain");
      expect(info.condition).toBe("rain");
    });

    it("retourne les bonnes infos pour la neige", () => {
      const info = getWeatherInfo(73);
      expect(info.label).toBe("Neige modérée");
      expect(info.icon).toBe("snowflake");
      expect(info.condition).toBe("snow");
    });

    it("retourne les bonnes infos pour l'orage", () => {
      const info = getWeatherInfo(95);
      expect(info.label).toBe("Orage");
      expect(info.icon).toBe("cloud-lightning");
      expect(info.condition).toBe("thunderstorm");
    });
  });

  describe("getWeatherLabel", () => {
    it("retourne le label pour un code valide", () => {
      expect(getWeatherLabel(0)).toBe("Ciel dégagé");
      expect(getWeatherLabel(3)).toBe("Couvert");
      expect(getWeatherLabel(61)).toBe("Pluie légère");
    });

    it("retourne inconnu pour un code invalide", () => {
      expect(getWeatherLabel(999)).toBe("Inconnu");
    });
  });

  describe("getWeatherIcon", () => {
    it("retourne l'icone jour pour isDay=true", () => {
      expect(getWeatherIcon(0, true)).toBe("sun");
      expect(getWeatherIcon(2, true)).toBe("cloud-sun");
    });

    it("retourne l'icone nuit pour isDay=false", () => {
      expect(getWeatherIcon(0, false)).toBe("moon");
      expect(getWeatherIcon(2, false)).toBe("cloud-moon");
    });

    it("retourne la meme icone jour/nuit pour certains codes", () => {
      expect(getWeatherIcon(63, true)).toBe("cloud-rain");
      expect(getWeatherIcon(63, false)).toBe("cloud-rain");
    });
  });

  describe("getWeatherCondition", () => {
    it("retourne la condition correcte", () => {
      expect(getWeatherCondition(0)).toBe("clear");
      expect(getWeatherCondition(2)).toBe("partly-cloudy");
      expect(getWeatherCondition(3)).toBe("cloudy");
      expect(getWeatherCondition(45)).toBe("fog");
      expect(getWeatherCondition(51)).toBe("drizzle");
      expect(getWeatherCondition(63)).toBe("rain");
      expect(getWeatherCondition(73)).toBe("snow");
      expect(getWeatherCondition(95)).toBe("thunderstorm");
    });
  });
});
