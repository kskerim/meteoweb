"use client";

// page ville avec affichage meteo complet

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Header,
  DynamicBackground,
  StaticBackground,
  CurrentWeatherCard,
  HourlyForecastCard,
  HourlyChart,
  PrecipitationChart,
  DailyForecastCard,
  FavoriteButton,
  CurrentWeatherSkeleton,
  HourlyForecastSkeleton,
  ChartSkeleton,
  DailyForecastSkeleton,
} from "@/components";
import { getWeatherCondition } from "@/lib/utils";
import type { WeatherData } from "@/types";

export default function CityPage() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const name = searchParams.get("name") || "Lieu inconnu";
  const country = searchParams.get("country") || "";

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lon) {
        setError("Coordonnees manquantes");
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          lat,
          lon,
          name,
          country,
        });

        const response = await fetch(`/api/weather?${params}`);
        if (!response.ok) throw new Error();

        const data = await response.json();
        setWeather(data);
      } catch {
        setError("Impossible de charger les donnees meteo");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, name, country]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Meteo ${name}`,
          text: `Consultez la meteo de ${name}`,
          url,
        });
      } catch {
        // ignore si l'utilisateur annule
      }
    } else {
      await navigator.clipboard.writeText(url);
      // todo: afficher un toast
    }
  };

  const content = (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            <CurrentWeatherSkeleton />
            <HourlyForecastSkeleton />
            <div className="grid md:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <DailyForecastSkeleton />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <Card className="bg-destructive/10 border-destructive/30">
              <CardContent className="p-6 flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-destructive flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-lg">Erreur</h2>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : weather ? (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* header avec actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between flex-wrap gap-4"
            >
              <h1 className="text-2xl font-bold">{name}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <FavoriteButton
                  name={name}
                  country={country}
                  latitude={parseFloat(lat!)}
                  longitude={parseFloat(lon!)}
                  size="sm"
                />
              </div>
            </motion.div>

            {/* meteo actuelle */}
            <CurrentWeatherCard
              current={weather.current}
              locationName={name}
              country={country}
              today={weather.daily[0]}
              timezone={weather.timezone}
            />

            {/* previsions horaires */}
            <HourlyForecastCard hourly={weather.hourly} timezone={weather.timezone} hours={48} />

            {/* graphiques */}
            <div className="grid md:grid-cols-2 gap-6">
              <HourlyChart hourly={weather.hourly} timezone={weather.timezone} hours={24} />
              <PrecipitationChart hourly={weather.hourly} timezone={weather.timezone} hours={24} />
            </div>

            {/* previsions 7 jours */}
            <DailyForecastCard daily={weather.daily} timezone={weather.timezone} />
          </div>
        ) : null}
      </main>
    </>
  );

  if (weather) {
    return (
      <DynamicBackground
        condition={getWeatherCondition(weather.current.weatherCode)}
        isDay={weather.current.isDay}
      >
        {content}
      </DynamicBackground>
    );
  }

  return <StaticBackground>{content}</StaticBackground>;
}
