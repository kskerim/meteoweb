"use client";

// icone meteo dynamique basee sur le code wmo

import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
} from "lucide-react";
import { getWeatherIcon } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-20 w-20",
};

const iconComponents: Record<string, React.ElementType> = {
  sun: Sun,
  moon: Moon,
  cloud: Cloud,
  "cloud-sun": CloudSun,
  "cloud-moon": CloudMoon,
  "cloud-fog": CloudFog,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "cloud-snow": CloudSnow,
  snowflake: Snowflake,
  "cloud-lightning": CloudLightning,
};

export function WeatherIcon({ code, isDay, className, size = "md" }: WeatherIconProps) {
  const iconName = getWeatherIcon(code, isDay);
  const IconComponent = iconComponents[iconName] || Cloud;

  return (
    <IconComponent
      className={cn(sizeClasses[size], "text-current", className)}
      aria-hidden="true"
    />
  );
}
