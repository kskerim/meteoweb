"use client";

// graphique precipitations horaires

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatHour } from "@/lib/utils";
import type { HourlyForecast } from "@/types";

interface PrecipitationChartProps {
  hourly: HourlyForecast[];
  timezone?: string;
  hours?: number;
}

export function PrecipitationChart({ hourly, timezone, hours = 24 }: PrecipitationChartProps) {
  const { preferences } = usePreferences();

  const data = useMemo(() => {
    return hourly.slice(0, hours).map((h) => ({
      time: formatHour(h.time, preferences.timeFormat, timezone),
      probability: h.precipitationProbability,
    }));
  }, [hourly, hours, preferences.timeFormat, timezone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30">
        <CardHeader>
          <CardTitle className="text-lg">Probabilite de precipitation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                  unit="%"
                  domain={[0, 100]}
                  width={45}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value) => [`${value}%`, "Probabilite"]}
                />
                <Bar
                  dataKey="probability"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
