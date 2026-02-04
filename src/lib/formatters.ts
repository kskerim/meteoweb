// formatters pour temperatures, vent, dates

import type { UserPreferences } from "@/types";

export function formatTemperature(
  celsius: number,
  unit: UserPreferences["temperatureUnit"]
): string {
  if (unit === "fahrenheit") {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTemperatureValue(
  celsius: number,
  unit: UserPreferences["temperatureUnit"]
): number {
  if (unit === "fahrenheit") {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWindSpeed(kmh: number, unit: UserPreferences["windSpeedUnit"]): string {
  if (unit === "mph") {
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}

export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

export function formatPrecipitation(mm: number): string {
  return `${mm.toFixed(1)} mm`;
}

export function formatUvIndex(index: number): { value: string; level: string } {
  const value = Math.round(index).toString();
  let level: string;

  if (index <= 2) {
    level = "Faible";
  } else if (index <= 5) {
    level = "Modéré";
  } else if (index <= 7) {
    level = "Élevé";
  } else if (index <= 10) {
    level = "Très élevé";
  } else {
    level = "Extrême";
  }

  return { value, level };
}

export function formatTime(
  isoString: string,
  format: UserPreferences["timeFormat"],
  timezone?: string
): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: format === "12h",
    timeZone: timezone,
  };
  return date.toLocaleTimeString("fr-FR", options);
}

export function formatHour(
  isoString: string,
  format: UserPreferences["timeFormat"],
  timezone?: string
): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    hour12: format === "12h",
    timeZone: timezone,
  };
  return date.toLocaleTimeString("fr-FR", options);
}

export function formatDate(isoString: string, timezone?: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: timezone,
  };
  return date.toLocaleDateString("fr-FR", options);
}

export function formatDayName(isoString: string, timezone?: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateStr = date.toDateString();
  if (dateStr === today.toDateString()) {
    return "Aujourd'hui";
  }
  if (dateStr === tomorrow.toDateString()) {
    return "Demain";
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    timeZone: timezone,
  };
  return date.toLocaleDateString("fr-FR", options);
}

export function formatSunTime(
  isoString: string,
  format: UserPreferences["timeFormat"],
  timezone?: string
): string {
  return formatTime(isoString, format, timezone);
}
