// mapping des codes meteo wmo vers labels et icones
// reference: https://open-meteo.com/en/docs (wmo weather interpretation codes)

import type { WeatherCondition } from "@/types";

export interface WeatherCodeInfo {
  label: string;
  icon: string;
  iconNight: string;
  condition: WeatherCondition;
}

const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: {
    label: "Ciel dégagé",
    icon: "sun",
    iconNight: "moon",
    condition: "clear",
  },
  1: {
    label: "Principalement dégagé",
    icon: "sun",
    iconNight: "moon",
    condition: "clear",
  },
  2: {
    label: "Partiellement nuageux",
    icon: "cloud-sun",
    iconNight: "cloud-moon",
    condition: "partly-cloudy",
  },
  3: {
    label: "Couvert",
    icon: "cloud",
    iconNight: "cloud",
    condition: "cloudy",
  },
  45: {
    label: "Brouillard",
    icon: "cloud-fog",
    iconNight: "cloud-fog",
    condition: "fog",
  },
  48: {
    label: "Brouillard givrant",
    icon: "cloud-fog",
    iconNight: "cloud-fog",
    condition: "fog",
  },
  51: {
    label: "Bruine légère",
    icon: "cloud-drizzle",
    iconNight: "cloud-drizzle",
    condition: "drizzle",
  },
  53: {
    label: "Bruine modérée",
    icon: "cloud-drizzle",
    iconNight: "cloud-drizzle",
    condition: "drizzle",
  },
  55: {
    label: "Bruine dense",
    icon: "cloud-drizzle",
    iconNight: "cloud-drizzle",
    condition: "drizzle",
  },
  56: {
    label: "Bruine verglaçante légère",
    icon: "cloud-drizzle",
    iconNight: "cloud-drizzle",
    condition: "drizzle",
  },
  57: {
    label: "Bruine verglaçante dense",
    icon: "cloud-drizzle",
    iconNight: "cloud-drizzle",
    condition: "drizzle",
  },
  61: {
    label: "Pluie légère",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  63: {
    label: "Pluie modérée",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  65: {
    label: "Pluie forte",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  66: {
    label: "Pluie verglaçante légère",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  67: {
    label: "Pluie verglaçante forte",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  71: {
    label: "Neige légère",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  73: {
    label: "Neige modérée",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  75: {
    label: "Neige forte",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  77: {
    label: "Grains de neige",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  80: {
    label: "Averses de pluie légères",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  81: {
    label: "Averses de pluie modérées",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  82: {
    label: "Averses de pluie violentes",
    icon: "cloud-rain",
    iconNight: "cloud-rain",
    condition: "rain",
  },
  85: {
    label: "Averses de neige légères",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  86: {
    label: "Averses de neige fortes",
    icon: "snowflake",
    iconNight: "snowflake",
    condition: "snow",
  },
  95: {
    label: "Orage",
    icon: "cloud-lightning",
    iconNight: "cloud-lightning",
    condition: "thunderstorm",
  },
  96: {
    label: "Orage avec grêle légère",
    icon: "cloud-lightning",
    iconNight: "cloud-lightning",
    condition: "thunderstorm",
  },
  99: {
    label: "Orage avec grêle forte",
    icon: "cloud-lightning",
    iconNight: "cloud-lightning",
    condition: "thunderstorm",
  },
};

const defaultWeatherInfo: WeatherCodeInfo = {
  label: "Inconnu",
  icon: "cloud",
  iconNight: "cloud",
  condition: "cloudy",
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return weatherCodeMap[code] || defaultWeatherInfo;
}

export function getWeatherLabel(code: number): string {
  return getWeatherInfo(code).label;
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  const info = getWeatherInfo(code);
  return isDay ? info.icon : info.iconNight;
}

export function getWeatherCondition(code: number): WeatherCondition {
  return getWeatherInfo(code).condition;
}
