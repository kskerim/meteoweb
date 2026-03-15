"use client";

// previsions sur 7 jours avec barres de temperature visuelles et icones meteo

import { useMemo } from "react";
import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather-icon";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatTemperature, formatDayName, getWeatherLabel } from "@/lib/utils";
import type { DailyForecast } from "@/types";

interface DailyForecastCardProps {
  daily: DailyForecast[];
  timezone?: string;
}

// affiche les previsions jour par jour avec une barre de temperature proportionnelle a la semaine
export function DailyForecastCard({ daily, timezone }: DailyForecastCardProps) {
  const { preferences } = usePreferences();

  // calcule la plage min/max de la semaine pour dimensionner les barres
  const { weekMin, weekMax } = useMemo(() => {
    const mins = daily.map((d) => d.tempMin);
    const maxs = daily.map((d) => d.tempMax);
    return { weekMin: Math.min(...mins), weekMax: Math.max(...maxs) };
  }, [daily]);

  const range = weekMax - weekMin;

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader>
        <CardTitle className="text-xl">previsions 7 jours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {daily.map((day, index) => {
          // calcule le positionnement de la barre de temperature
          const leftPct = range > 0 ? ((day.tempMin - weekMin) / range) * 100 : 0;
          const rightPct = range > 0 ? 100 - ((day.tempMax - weekMin) / range) * 100 : 0;

          return (
            <div
              key={day.date}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                index === 0
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : "bg-white/5 hover:bg-white/8"
              }`}
            >
              {/* nom du jour */}
              <div className="w-24 shrink-0">
                <div className="font-semibold text-base text-white capitalize">
                  {formatDayName(day.date, timezone)}
                </div>
              </div>

              {/* icone meteo */}
              <div className="shrink-0">
                <WeatherIcon code={day.weatherCode} isDay={true} size="lg" />
              </div>

              {/* description de la condition meteo */}
              <div className="w-28 shrink-0 hidden sm:block">
                <span className="text-sm text-slate-400 truncate block">
                  {getWeatherLabel(day.weatherCode)}
                </span>
              </div>

              {/* probabilite de precipitation */}
              <div className="w-12 shrink-0">
                {day.precipitationProbability > 0 && (
                  <div className="flex items-center gap-0.5 text-blue-400">
                    <Droplets className="h-4 w-4" />
                    <span className="text-xs font-semibold">{day.precipitationProbability}%</span>
                  </div>
                )}
              </div>

              {/* temperature minimale */}
              <div className="w-12 shrink-0 text-right">
                <span className="text-base text-slate-400 font-medium">
                  {formatTemperature(day.tempMin, preferences.temperatureUnit)}
                </span>
              </div>

              {/* barre visuelle de temperature proportionnelle */}
              <div className="flex-1 min-w-16">
                <div className="relative h-2.5 rounded-full bg-white/10">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500"
                    style={{
                      left: `${leftPct}%`,
                      right: `${rightPct}%`,
                    }}
                  />
                </div>
              </div>

              {/* temperature maximale */}
              <div className="w-12 shrink-0">
                <span className="text-base font-bold text-white">
                  {formatTemperature(day.tempMax, preferences.temperatureUnit)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
