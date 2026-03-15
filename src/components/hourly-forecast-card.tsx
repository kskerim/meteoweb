"use client";

// previsions horaires en cartes scrollables avec icones et temperatures

import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WeatherIcon } from "@/components/weather-icon";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatTemperature, formatHour } from "@/lib/utils";
import type { HourlyForecast } from "@/types";

interface HourlyForecastCardProps {
  hourly: HourlyForecast[];
  timezone?: string;
  hours?: number;
}

// affiche les previsions heure par heure dans un scroll horizontal
export function HourlyForecastCard({ hourly, timezone, hours = 24 }: HourlyForecastCardProps) {
  const { preferences } = usePreferences();
  const displayHours = hourly.slice(0, hours);

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader>
        <CardTitle className="text-xl">heure par heure</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-4">
            {displayHours.map((hour, index) => (
              <div
                key={hour.time}
                className={`flex flex-col items-center gap-3 px-5 py-4 rounded-2xl min-w-24 transition-colors ${
                  index === 0
                    ? "bg-blue-500/15 border border-blue-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {/* heure ou "maintenant" pour l'heure actuelle */}
                <span
                  className={`text-sm font-medium ${index === 0 ? "text-blue-300" : "text-slate-400"}`}
                >
                  {index === 0
                    ? "maintenant"
                    : formatHour(hour.time, preferences.timeFormat, timezone)}
                </span>

                {/* icone meteo */}
                <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size="lg" />

                {/* temperature */}
                <span className="font-bold text-lg text-white">
                  {formatTemperature(hour.temperature, preferences.temperatureUnit)}
                </span>

                {/* probabilite de precipitation si > 0 */}
                {hour.precipitationProbability > 0 && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Droplets className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold">{hour.precipitationProbability}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
