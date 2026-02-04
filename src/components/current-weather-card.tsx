"use client";

// carte meteo actuelle - design ludique et visuel

import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Eye,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather-icon";
import { usePreferences } from "@/components/providers/preferences-provider";
import {
  formatTemperature,
  formatWindSpeed,
  formatWindDirection,
  formatPressure,
  formatHumidity,
  formatPrecipitation,
  formatUvIndex,
  formatSunTime,
  getWeatherLabel,
} from "@/lib/utils";
import type { CurrentWeather, DailyForecast } from "@/types";

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  locationName: string;
  country: string;
  today?: DailyForecast;
  timezone?: string;
}

export function CurrentWeatherCard({
  current,
  locationName,
  country,
  today,
  timezone,
}: CurrentWeatherCardProps) {
  const { preferences } = usePreferences();
  const uvInfo = formatUvIndex(current.uvIndex);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl border-slate-700/30 shadow-2xl">
        <CardContent className="p-6 md:p-8">
          {/* header avec location */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">{locationName}</h2>
              <p className="text-slate-400 mt-1">{country}</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                En direct
              </span>
            </div>
          </div>

          {/* zone principale - temperature et icone */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                <WeatherIcon
                  code={current.weatherCode}
                  isDay={current.isDay}
                  size="xl"
                  className="relative text-white w-24 h-24 md:w-32 md:h-32"
                />
              </motion.div>
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-7xl md:text-8xl font-extralight text-white tracking-tighter"
                >
                  {formatTemperature(current.temperature, preferences.temperatureUnit)}
                </motion.div>
                <p className="text-xl text-slate-300 mt-1">
                  {getWeatherLabel(current.weatherCode)}
                </p>
              </div>
            </div>

            {/* min/max du jour */}
            {today && (
              <div className="flex gap-4 md:flex-col md:gap-2">
                <div className="flex items-center gap-2 text-red-400">
                  <ArrowUp className="h-4 w-4" />
                  <span className="text-lg font-medium">
                    {formatTemperature(today.tempMax, preferences.temperatureUnit)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <ArrowDown className="h-4 w-4" />
                  <span className="text-lg font-medium">
                    {formatTemperature(today.tempMin, preferences.temperatureUnit)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ressenti */}
          <div className="flex items-center gap-2 text-slate-400 mb-6 text-lg">
            <Thermometer className="h-5 w-5" />
            <span>
              Ressenti {formatTemperature(current.feelsLike, preferences.temperatureUnit)}
            </span>
          </div>

          {/* grille de stats - style glassmorphism */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<Droplets className="h-5 w-5 text-blue-400" />}
              label="Humidite"
              value={formatHumidity(current.humidity)}
              color="blue"
            />
            <StatCard
              icon={<Wind className="h-5 w-5 text-cyan-400" />}
              label="Vent"
              value={`${formatWindSpeed(current.windSpeed, preferences.windSpeedUnit)}`}
              subValue={formatWindDirection(current.windDirection)}
              color="cyan"
            />
            <StatCard
              icon={<Gauge className="h-5 w-5 text-purple-400" />}
              label="Pression"
              value={formatPressure(current.pressure)}
              color="purple"
            />
            <StatCard
              icon={<Eye className="h-5 w-5 text-slate-400" />}
              label="Nuages"
              value={`${current.cloudCover}%`}
              color="slate"
            />
          </div>

          {/* seconde ligne de stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<Wind className="h-5 w-5 text-orange-400" />}
              label="Rafales"
              value={formatWindSpeed(current.windGusts, preferences.windSpeedUnit)}
              color="orange"
            />
            <StatCard
              icon={<CloudRain className="h-5 w-5 text-indigo-400" />}
              label="Precipitations"
              value={formatPrecipitation(current.precipitation)}
              color="indigo"
            />
            <StatCard
              icon={<Sun className="h-5 w-5 text-yellow-400" />}
              label="Index UV"
              value={uvInfo.value.toString()}
              subValue={uvInfo.level}
              color="yellow"
            />
            {today && (
              <StatCard
                icon={<Thermometer className="h-5 w-5 text-pink-400" />}
                label="Amplitude"
                value={`${Math.round(today.tempMax - today.tempMin)}°`}
                color="pink"
              />
            )}
          </div>

          {/* lever/coucher du soleil - design ameliore */}
          {today && (
            <div className="flex items-center justify-around p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <Sunrise className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Lever</div>
                  <div className="text-lg font-semibold text-amber-300">
                    {formatSunTime(today.sunrise, preferences.timeFormat, timezone)}
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-slate-700" />

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-500/20">
                  <Sunset className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Coucher</div>
                  <div className="text-lg font-semibold text-orange-300">
                    {formatSunTime(today.sunset, preferences.timeFormat, timezone)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
    cyan: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
    purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
    slate: "from-slate-500/10 to-slate-500/5 border-slate-500/20",
    orange: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
    yellow: "from-yellow-500/10 to-yellow-500/5 border-yellow-500/20",
    pink: "from-pink-500/10 to-pink-500/5 border-pink-500/20",
  };

  return (
    <div
      className={`flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-semibold text-white text-lg">{value}</div>
      {subValue && <div className="text-xs text-slate-400">{subValue}</div>}
    </div>
  );
}
