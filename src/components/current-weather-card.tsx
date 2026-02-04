"use client";

// carte meteo actuelle

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="overflow-hidden bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{locationName}</h2>
              <p className="text-sm text-muted-foreground font-normal">{country}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Maintenant</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* temperature principale */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <WeatherIcon
                code={current.weatherCode}
                isDay={current.isDay}
                size="xl"
                className="text-primary"
              />
              <div>
                <div className="text-6xl font-light tracking-tight">
                  {formatTemperature(current.temperature, preferences.temperatureUnit)}
                </div>
                <div className="text-lg text-muted-foreground">
                  {getWeatherLabel(current.weatherCode)}
                </div>
              </div>
            </div>
          </div>

          {/* ressenti */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className="h-4 w-4" />
            <span>
              Ressenti {formatTemperature(current.feelsLike, preferences.temperatureUnit)}
            </span>
          </div>

          {/* grille de stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatItem
              icon={<Droplets className="h-4 w-4" />}
              label="Humidite"
              value={formatHumidity(current.humidity)}
            />
            <StatItem
              icon={<Wind className="h-4 w-4" />}
              label="Vent"
              value={`${formatWindSpeed(current.windSpeed, preferences.windSpeedUnit)} ${formatWindDirection(current.windDirection)}`}
            />
            <StatItem
              icon={<Gauge className="h-4 w-4" />}
              label="Pression"
              value={formatPressure(current.pressure)}
            />
            <StatItem
              icon={<Eye className="h-4 w-4" />}
              label="Nuages"
              value={`${current.cloudCover}%`}
            />
          </div>

          {/* rafales et precipitations */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatItem
              icon={<Wind className="h-4 w-4" />}
              label="Rafales"
              value={formatWindSpeed(current.windGusts, preferences.windSpeedUnit)}
            />
            <StatItem
              icon={<CloudRain className="h-4 w-4" />}
              label="Precip."
              value={formatPrecipitation(current.precipitation)}
            />
            <StatItem
              icon={<Sun className="h-4 w-4" />}
              label="UV"
              value={`${uvInfo.value} (${uvInfo.level})`}
            />
            {today && (
              <StatItem
                icon={<Thermometer className="h-4 w-4" />}
                label="Min/Max"
                value={`${formatTemperature(today.tempMin, preferences.temperatureUnit)} / ${formatTemperature(today.tempMax, preferences.temperatureUnit)}`}
              />
            )}
          </div>

          {/* lever/coucher du soleil */}
          {today && (
            <div className="flex items-center justify-center gap-8 pt-2 border-t border-border/30">
              <div className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Lever</div>
                  <div className="font-medium">
                    {formatSunTime(today.sunrise, preferences.timeFormat, timezone)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="h-5 w-5 text-orange-500" />
                <div>
                  <div className="text-xs text-muted-foreground">Coucher</div>
                  <div className="font-medium">
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

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className="font-medium text-sm">{value}</div>
    </div>
  );
}
