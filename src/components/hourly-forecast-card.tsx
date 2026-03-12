"use client";

// previsions horaires en cartes scrollables

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

export function HourlyForecastCard({ hourly, timezone, hours = 24 }: HourlyForecastCardProps) {
  const { preferences } = usePreferences();
  const displayHours = hourly.slice(0, hours);

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader>
        <CardTitle className="text-lg">Heure par heure</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-4">
            {displayHours.map((hour, index) => (
              <div
                key={hour.time}
                className={`flex flex-col items-center gap-2.5 px-4 py-3 rounded-xl min-w-[85px] transition-colors ${
                  index === 0
                    ? "bg-blue-500/15 border border-blue-500/30"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className={`text-sm font-medium ${index === 0 ? "text-blue-300" : "text-slate-400"}`}>
                  {index === 0
                    ? "Maintenant"
                    : formatHour(hour.time, preferences.timeFormat, timezone)}
                </span>
                <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size="md" />
                <span className="font-semibold text-base text-white">
                  {formatTemperature(hour.temperature, preferences.temperatureUnit)}
                </span>
                {hour.precipitationProbability > 0 && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Droplets className="h-3 w-3" />
                    <span className="text-xs font-medium">{hour.precipitationProbability}%</span>
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
