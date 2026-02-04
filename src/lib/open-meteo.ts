// client pour l'api open-meteo

import type {
  GeoLocation,
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
} from "@/types";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_API = "https://api.open-meteo.com/v1/forecast";

// geocoding

export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    timezone: string;
  }>;
}

export async function searchCities(query: string, count = 8): Promise<GeoLocation[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language: "fr",
    format: "json",
  });

  try {
    const response = await fetch(`${GEOCODING_API}?${params}`);
    if (!response.ok) throw new Error("geocoding api error");

    const data: GeocodingResponse = await response.json();

    if (!data.results) return [];

    return data.results.map((r) => ({
      id: r.id,
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      countryCode: r.country_code,
      admin1: r.admin1,
      timezone: r.timezone,
    }));
  } catch (error) {
    console.error("error searching cities:", error);
    return [];
  }
}

// forecast

interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

export async function fetchWeather(
  latitude: number,
  longitude: number,
  locationName: string,
  country: string
): Promise<WeatherData> {
  const currentParams = [
    "temperature_2m",
    "apparent_temperature",
    "relative_humidity_2m",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
    "surface_pressure",
    "cloud_cover",
    "precipitation",
    "weather_code",
    "is_day",
  ].join(",");

  const hourlyParams = [
    "temperature_2m",
    "precipitation_probability",
    "weather_code",
    "is_day",
  ].join(",");

  const dailyParams = [
    "temperature_2m_min",
    "temperature_2m_max",
    "precipitation_probability_max",
    "weather_code",
    "sunrise",
    "sunset",
    "uv_index_max",
  ].join(",");

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: currentParams,
    hourly: hourlyParams,
    daily: dailyParams,
    timezone: "auto",
    forecast_days: "7",
    forecast_hours: "48",
  });

  const response = await fetch(`${FORECAST_API}?${params}`);
  if (!response.ok) throw new Error("forecast api error");

  const data: OpenMeteoForecastResponse = await response.json();

  // normaliser les donnees

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    pressure: data.current.surface_pressure,
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    uvIndex: data.daily.uv_index_max[0] || 0,
  };

  const hourly: HourlyForecast[] = data.hourly.time.map((time, i) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitationProbability: data.hourly.precipitation_probability[i],
    weatherCode: data.hourly.weather_code[i],
    isDay: data.hourly.is_day[i] === 1,
  }));

  const daily: DailyForecast[] = data.daily.time.map((date, i) => ({
    date,
    tempMin: data.daily.temperature_2m_min[i],
    tempMax: data.daily.temperature_2m_max[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
    weatherCode: data.daily.weather_code[i],
    sunrise: data.daily.sunrise[i],
    sunset: data.daily.sunset[i],
    uvIndexMax: data.daily.uv_index_max[i],
  }));

  return {
    location: {
      id: 0,
      name: locationName,
      latitude,
      longitude,
      country,
      countryCode: "",
      timezone: data.timezone,
    },
    current,
    hourly,
    daily,
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
  };
}
