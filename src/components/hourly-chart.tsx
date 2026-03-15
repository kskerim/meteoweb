"use client";

// graphique de temperature horaire avec recharts - affichage detaille sur 24h

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

// prepare les donnees horaires pour le graphique et determine l'unite de temperature
export function HourlyChart({ hourly, timezone, hours = 24 }: HourlyChartProps) {
  const { preferences } = usePreferences();

  const data = useMemo(() => {
    return hourly.slice(0, hours).map((h) => ({
      time: formatHour(h.time, preferences.timeFormat, timezone),
      temperature: formatTemperatureValue(h.temperature, preferences.temperatureUnit),
    }));
  }, [hourly, hours, preferences.timeFormat, preferences.temperatureUnit, timezone]);

  const unit = preferences.temperatureUnit === "celsius" ? "C" : "F";

  // calcule les extremes pour afficher min/max dans le header
  const temps = data.map((d) => d.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">temperature sur 24h</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-400 font-medium">
              {minTemp}°{unit} min
            </span>
            <span className="text-orange-400 font-medium">
              {maxTemp}°{unit} max
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-100 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.35} />
                  <stop offset="40%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.55)" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                interval={2}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.55)" }}
                tickLine={false}
                axisLine={false}
                unit={`°${unit}`}
                width={55}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.97)",
                  border: "1px solid rgba(96,165,250,0.2)",
                  borderRadius: "14px",
                  padding: "10px 16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}
                itemStyle={{ color: "#60a5fa", fontWeight: 700, fontSize: 15 }}
                formatter={(value) => [`${value}°${unit}`, "temperature"]}
                cursor={{ stroke: "rgba(96,165,250,0.3)", strokeWidth: 1 }}
              />
              <Area
                type="natural"
                dataKey="temperature"
                stroke="#60a5fa"
                strokeWidth={3}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{
                  r: 6,
                  fill: "#60a5fa",
                  stroke: "#fff",
                  strokeWidth: 2.5,
                  style: { filter: "drop-shadow(0 0 4px rgba(96,165,250,0.5))" },
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
