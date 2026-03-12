"use client";

// previsions sur 7 jours

import { Sunrise, Sunset, Droplets, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather-icon";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatTemperature, formatDayName, formatSunTime, getWeatherLabel } from "@/lib/utils";
import type { DailyForecast } from "@/types";

interface DailyForecastCardProps {
  daily: DailyForecast[];
  timezone?: string;
}

export function DailyForecastCard({ daily, timezone }: DailyForecastCardProps) {
  const { preferences } = usePreferences();

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader>
        <CardTitle className="text-lg">Previsions 7 jours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {daily.map((day, index) => (
          <div
            key={day.date}
            className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
              index === 0
                ? "bg-blue-500/10 border border-blue-500/20"
                : "bg-white/5 hover:bg-white/8"
            }`}
          >
            {/* jour */}
            <div className="min-w-[110px]">
              <div className="font-semibold text-white capitalize">
                {formatDayName(day.date, timezone)}
              </div>
            </div>

            {/* icone et condition */}
            <div className="flex items-center gap-2 min-w-[130px]">
              <WeatherIcon code={day.weatherCode} isDay={true} size="md" />
              <span className="text-sm text-slate-300 hidden sm:block">
                {getWeatherLabel(day.weatherCode)}
              </span>
            </div>

            {/* precipitation */}
            {day.precipitationProbability > 0 && (
              <div className="flex items-center gap-1 text-blue-400 min-w-[50px]">
                <Droplets className="h-4 w-4" />
                <span className="text-sm font-medium">{day.precipitationProbability}%</span>
              </div>
            )}
            {day.precipitationProbability === 0 && <div className="min-w-[50px]" />}

            {/* lever/coucher */}
            <div className="hidden md:flex items-center gap-3 text-slate-400 ml-auto">
              <div className="flex items-center gap-1.5">
                <Sunrise className="h-4 w-4 text-amber-400" />
                <span className="text-sm">
                  {formatSunTime(day.sunrise, preferences.timeFormat, timezone)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sunset className="h-4 w-4 text-orange-400" />
                <span className="text-sm">
                  {formatSunTime(day.sunset, preferences.timeFormat, timezone)}
                </span>
              </div>
            </div>

            {/* temperatures min/max */}
            <div className="flex items-center gap-3 ml-auto md:ml-0">
              <div className="flex items-center gap-1 text-blue-400">
                <ArrowDown className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">
                  {formatTemperature(day.tempMin, preferences.temperatureUnit)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <ArrowUp className="h-3.5 w-3.5" />
                <span className="text-sm font-semibold">
                  {formatTemperature(day.tempMax, preferences.temperatureUnit)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
