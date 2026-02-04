"use client";

// previsions horaires en cartes scrollables

import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30">
        <CardHeader>
          <CardTitle className="text-lg">Previsions horaires</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {displayHours.map((hour, index) => (
                <motion.div
                  key={hour.time}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
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
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
