"use client";

// graphique temperature horaire avec recharts

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

export function HourlyChart({ hourly, timezone, hours = 24 }: HourlyChartProps) {
  const { preferences } = usePreferences();

  const data = useMemo(() => {
    return hourly.slice(0, hours).map((h) => ({
      time: formatHour(h.time, preferences.timeFormat, timezone),
      temperature: formatTemperatureValue(h.temperature, preferences.temperatureUnit),
    }));
  }, [hourly, hours, preferences.timeFormat, preferences.temperatureUnit, timezone]);

  const unit = preferences.temperatureUnit === "celsius" ? "C" : "F";

  return (
    <Card className="bg-gradient-to-br from-background/80 to-background/60 border-border/30">
      <CardHeader>
        <CardTitle className="text-lg">Temperature sur 24h</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "rgba(255,255,255,0.6)" }}
                tickLine={false}
                axisLine={false}
                unit={`°${unit}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
                itemStyle={{ color: "#3b82f6", fontWeight: 600 }}
                formatter={(value) => [`${value}°${unit}`, "Temperature"]}
              />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#tempGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
