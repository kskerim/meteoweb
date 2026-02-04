"use client";

// fond dynamique selon la meteo et le jour/nuit

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { WeatherCondition } from "@/types";
import { cn } from "@/lib/utils";

interface DynamicBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
  children: React.ReactNode;
}

const gradients: Record<WeatherCondition, { day: string; night: string }> = {
  clear: {
    day: "from-sky-400 via-blue-500 to-blue-600",
    night: "from-slate-900 via-indigo-950 to-slate-900",
  },
  "partly-cloudy": {
    day: "from-sky-300 via-blue-400 to-slate-400",
    night: "from-slate-800 via-slate-900 to-indigo-950",
  },
  cloudy: {
    day: "from-slate-400 via-slate-500 to-gray-500",
    night: "from-slate-800 via-gray-900 to-slate-900",
  },
  fog: {
    day: "from-gray-300 via-slate-400 to-gray-400",
    night: "from-gray-800 via-slate-900 to-gray-900",
  },
  drizzle: {
    day: "from-slate-500 via-blue-600 to-slate-600",
    night: "from-slate-900 via-blue-950 to-slate-900",
  },
  rain: {
    day: "from-slate-600 via-blue-700 to-slate-700",
    night: "from-slate-950 via-blue-950 to-slate-950",
  },
  snow: {
    day: "from-slate-200 via-blue-200 to-white",
    night: "from-slate-700 via-blue-900 to-slate-800",
  },
  thunderstorm: {
    day: "from-slate-700 via-purple-800 to-slate-800",
    night: "from-slate-950 via-purple-950 to-slate-950",
  },
};

export function DynamicBackground({ condition, isDay, children }: DynamicBackgroundProps) {
  const gradient = useMemo(() => {
    const colors = gradients[condition] || gradients.cloudy;
    return isDay ? colors.day : colors.night;
  }, [condition, isDay]);

  return (
    <div className="relative min-h-screen">
      <motion.div
        key={`${condition}-${isDay}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={cn(
          "fixed inset-0 bg-gradient-to-br transition-colors duration-1000",
          gradient
        )}
      />

      {/* overlay pour adoucir */}
      <div className="fixed inset-0 bg-background/30 backdrop-blur-[1px]" />

      {/* contenu */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// version simplifiee pour les pages sans donnees meteo
export function StaticBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="fixed inset-0 bg-background/50" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
