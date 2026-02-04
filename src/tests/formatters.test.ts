// tests pour les formatters

import { describe, it, expect } from "vitest";
import {
  formatTemperature,
  formatTemperatureValue,
  formatWindSpeed,
  formatWindDirection,
  formatPressure,
  formatHumidity,
  formatPrecipitation,
  formatUvIndex,
  formatDayName,
} from "@/lib/formatters";

describe("formatters", () => {
  describe("formatTemperature", () => {
    it("formate en celsius", () => {
      expect(formatTemperature(20, "celsius")).toBe("20°C");
      expect(formatTemperature(20.6, "celsius")).toBe("21°C");
      expect(formatTemperature(-5, "celsius")).toBe("-5°C");
    });

    it("formate en fahrenheit", () => {
      expect(formatTemperature(0, "fahrenheit")).toBe("32°F");
      expect(formatTemperature(100, "fahrenheit")).toBe("212°F");
      expect(formatTemperature(20, "fahrenheit")).toBe("68°F");
    });
  });

  describe("formatTemperatureValue", () => {
    it("retourne la valeur numerique en celsius", () => {
      expect(formatTemperatureValue(20, "celsius")).toBe(20);
      expect(formatTemperatureValue(20.6, "celsius")).toBe(21);
    });

    it("retourne la valeur numerique en fahrenheit", () => {
      expect(formatTemperatureValue(0, "fahrenheit")).toBe(32);
      expect(formatTemperatureValue(100, "fahrenheit")).toBe(212);
    });
  });

  describe("formatWindSpeed", () => {
    it("formate en km/h", () => {
      expect(formatWindSpeed(10, "kmh")).toBe("10 km/h");
      expect(formatWindSpeed(25.7, "kmh")).toBe("26 km/h");
    });

    it("formate en mph", () => {
      expect(formatWindSpeed(10, "mph")).toBe("6 mph");
      expect(formatWindSpeed(100, "mph")).toBe("62 mph");
    });
  });

  describe("formatWindDirection", () => {
    it("retourne la direction cardinale", () => {
      expect(formatWindDirection(0)).toBe("N");
      expect(formatWindDirection(45)).toBe("NE");
      expect(formatWindDirection(90)).toBe("E");
      expect(formatWindDirection(135)).toBe("SE");
      expect(formatWindDirection(180)).toBe("S");
      expect(formatWindDirection(225)).toBe("SO");
      expect(formatWindDirection(270)).toBe("O");
      expect(formatWindDirection(315)).toBe("NO");
      expect(formatWindDirection(360)).toBe("N");
    });
  });

  describe("formatPressure", () => {
    it("formate la pression", () => {
      expect(formatPressure(1013)).toBe("1013 hPa");
      expect(formatPressure(1013.5)).toBe("1014 hPa");
    });
  });

  describe("formatHumidity", () => {
    it("formate l'humidite", () => {
      expect(formatHumidity(65)).toBe("65%");
      expect(formatHumidity(65.7)).toBe("66%");
    });
  });

  describe("formatPrecipitation", () => {
    it("formate les precipitations", () => {
      expect(formatPrecipitation(0)).toBe("0.0 mm");
      expect(formatPrecipitation(2.5)).toBe("2.5 mm");
      expect(formatPrecipitation(10.123)).toBe("10.1 mm");
    });
  });

  describe("formatUvIndex", () => {
    it("retourne le niveau faible", () => {
      const result = formatUvIndex(1);
      expect(result.value).toBe("1");
      expect(result.level).toBe("Faible");
    });

    it("retourne le niveau modere", () => {
      const result = formatUvIndex(4);
      expect(result.value).toBe("4");
      expect(result.level).toBe("Modéré");
    });

    it("retourne le niveau eleve", () => {
      const result = formatUvIndex(6);
      expect(result.value).toBe("6");
      expect(result.level).toBe("Élevé");
    });

    it("retourne le niveau tres eleve", () => {
      const result = formatUvIndex(9);
      expect(result.value).toBe("9");
      expect(result.level).toBe("Très élevé");
    });

    it("retourne le niveau extreme", () => {
      const result = formatUvIndex(12);
      expect(result.value).toBe("12");
      expect(result.level).toBe("Extrême");
    });
  });

  describe("formatDayName", () => {
    it("retourne aujourd'hui pour la date du jour", () => {
      const today = new Date().toISOString();
      expect(formatDayName(today)).toBe("Aujourd'hui");
    });

    it("retourne demain pour la date de demain", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatDayName(tomorrow.toISOString())).toBe("Demain");
    });
  });
});
