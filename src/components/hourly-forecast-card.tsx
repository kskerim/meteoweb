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
        <CardTitle className="text-lg">Previsions horaires</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {displayHours.map((hour, index) => (
              <div
                key={hour.time}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/30 min-w-[80px]"
              >
                <span className="text-sm text-muted-foreground">
                  {index === 0
                    ? "Maintenant"
                    : formatHour(hour.time, preferences.timeFormat, timezone)}
                </span>
                <WeatherIcon code={hour.weatherCode} isDay={hour.isDay} size="md" />
                <span className="font-medium">
                  {formatTemperature(hour.temperature, preferences.temperatureUnit)}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Droplets className="h-3 w-3" />
                  <span className="text-xs">{hour.precipitationProbability}%</span>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
