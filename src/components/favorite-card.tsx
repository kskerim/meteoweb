"use client";

// carte resumee pour les favoris

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherIcon } from "@/components/weather-icon";
import { FavoriteCardSkeleton } from "@/components/skeletons";
import { usePreferences } from "@/components/providers/preferences-provider";
import { formatTemperature, getWeatherLabel, removeFavorite } from "@/lib/utils";
import type { FavoriteCity, WeatherData } from "@/types";

interface FavoriteCardProps {
  favorite: FavoriteCity;
  onRemove: (id: string) => void;
  index: number;
}

export function FavoriteCard({ favorite, onRemove, index }: FavoriteCardProps) {
  const { preferences } = usePreferences();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const params = new URLSearchParams({
          lat: favorite.latitude.toString(),
          lon: favorite.longitude.toString(),
          name: favorite.name,
          country: favorite.country,
        });

        const response = await fetch(`/api/weather?${params}`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        setWeather(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [favorite]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(favorite.id);
    onRemove(favorite.id);
  };

  if (loading) {
    return <FavoriteCardSkeleton />;
  }

  const cityUrl = `/city?lat=${favorite.latitude}&lon=${favorite.longitude}&name=${encodeURIComponent(favorite.name)}&country=${encodeURIComponent(favorite.country)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={cityUrl}>
        <Card className="group bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-md border-border/30 hover:border-primary/30 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {weather && !error ? (
                  <WeatherIcon
                    code={weather.current.weatherCode}
                    isDay={weather.current.isDay}
                    size="lg"
                    className="text-primary"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">N/A</span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg">{favorite.name}</div>
                  <div className="text-sm text-muted-foreground">{favorite.country}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {weather && !error ? (
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatTemperature(weather.current.temperature, preferences.temperatureUnit)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getWeatherLabel(weather.current.weatherCode)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Erreur de chargement</div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  aria-label="Retirer des favoris"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
