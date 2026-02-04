// types pour les reponses api normalisees

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  precipitationProbability: number;
  weatherCode: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
  timezoneAbbreviation: string;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  addedAt: number;
}

export interface UserPreferences {
  temperatureUnit: "celsius" | "fahrenheit";
  windSpeedUnit: "kmh" | "mph";
  timeFormat: "24h" | "12h";
  theme: "system" | "light" | "dark";
}

export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "thunderstorm";
