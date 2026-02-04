"use client";

// previsions sur 7 jours

import { motion } from "framer-motion";
import { Sunrise, Sunset, Sun, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherIcon } from "@/components/weather-icon";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatTemperature, formatDayName, formatSunTime, formatUvIndex } from "@/lib/utils";
import type { DailyForecast } from "@/types";

interface DailyForecastCardProps {
  daily: DailyForecast[];
  timezone?: string;
}

export function DailyForecastCard({ daily, timezone }: DailyForecastCardProps) {
  const { preferences } = usePreferences();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30">
        <CardHeader>
          <CardTitle className="text-lg">Previsions 7 jours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y divide-border/30">
          {daily.map((day, index) => {
            const uvInfo = formatUvIndex(day.uvIndexMax);
            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="py-4 first:pt-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* jour et icone */}
                  <div className="flex items-center gap-3 min-w-[140px]">
                    <WeatherIcon code={day.weatherCode} isDay={true} size="md" />
                    <div>
                      <div className="font-medium capitalize">
                        {formatDayName(day.date, timezone)}
                      </div>
                    </div>
                  </div>

                  {/* precipitation */}
                  <div className="flex items-center gap-1 text-muted-foreground min-w-[60px]">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">{day.precipitationProbability}%</span>
                  </div>

                  {/* uv */}
                  <div className="hidden sm:flex items-center gap-1 text-muted-foreground min-w-[80px]">
                    <Sun className="h-4 w-4" />
                    <span className="text-sm">UV {uvInfo.value}</span>
                  </div>

                  {/* lever/coucher */}
                  <div className="hidden md:flex items-center gap-3 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Sunrise className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">
                        {formatSunTime(day.sunrise, preferences.timeFormat, timezone)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sunset className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">
                        {formatSunTime(day.sunset, preferences.timeFormat, timezone)}
                      </span>
                    </div>
                  </div>

                  {/* temperatures */}
                  <div className="flex items-center gap-2 min-w-[100px] justify-end">
                    <span className="text-muted-foreground">
                      {formatTemperature(day.tempMin, preferences.temperatureUnit)}
                    </span>
                    <span className="font-medium">
                      {formatTemperature(day.tempMax, preferences.temperatureUnit)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
