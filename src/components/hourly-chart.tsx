"use client";

// graphique temperature horaire avec recharts

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatHour, formatTemperatureValue } from "@/lib/utils";
import type { HourlyForecast } from "@/types";

interface HourlyChartProps {
  hourly: HourlyForecast[];
  timezone?: string;
  hours?: number;
}

export function HourlyChart({ hourly, timezone, hours = 24 }: HourlyChartProps) {
  const { preferences } = usePreferences();

  const data = useMemo(() => {
    return hourly.slice(0, hours).map((h) => ({
      time: formatHour(h.time, preferences.timeFormat, timezone),
      temperature: formatTemperatureValue(h.temperature, preferences.temperatureUnit),
      raw: h,
    }));
  }, [hourly, hours, preferences.timeFormat, preferences.temperatureUnit, timezone]);

  const unit = preferences.temperatureUnit === "celsius" ? "C" : "F";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30">
        <CardHeader>
          <CardTitle className="text-lg">Temperature horaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  className="fill-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  unit={`°${unit}`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value) => [`${value}°${unit}`, "Temperature"]}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
