"use client";

// page d'accueil avec carte de france et recherche

import { useState } from "react";
import { MapPin, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Header,
  SearchBar,
  StaticBackground,
  CurrentWeatherCard,
  HourlyForecastCard,
  DailyForecastCard,
  FavoriteButton,
  CurrentWeatherSkeleton,
  HourlyForecastSkeleton,
  DailyForecastSkeleton,
  DynamicBackground,
} from "@/components";
import { FranceMap } from "@/components/france-map";
import { getWeatherCondition } from "@/lib/utils";
import type { WeatherData } from "@/types";

export default function HomePage() {
  const [geoLoading, setGeoLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError("La geolocalisation n'est pas supportee par votre navigateur");
      return;
    }

    setGeoLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const params = new URLSearchParams({
            lat: latitude.toString(),
            lon: longitude.toString(),
            name: "Ma position",
            country: "",
          });

          setWeatherLoading(true);
          const response = await fetch(`/api/weather?${params}`);
          if (!response.ok) throw new Error();

          const data = await response.json();
          setWeather(data);
        } catch {
          setError("Impossible de charger les donnees meteo");
        } finally {
          setWeatherLoading(false);
        }

        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Vous avez refuse l'acces a votre position");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Position indisponible");
            break;
          case err.TIMEOUT:
            setError("Delai d'attente depasse");
            break;
          default:
            setError("Erreur de geolocalisation");
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  };

  const content = (
    <>
      <Header />

      <main className="container mx-auto px-4 py-6">
        {/* section recherche sticky */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-16 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-border/20"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full sm:flex-1">
              <SearchBar className="w-full" placeholder="Rechercher une ville..." />
            </div>

            <Button
              variant="outline"
              onClick={handleGeolocation}
              disabled={geoLoading}
              className="w-full sm:w-auto gap-2 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
            >
              {geoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              Ma position
            </Button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* affichage meteo si disponible */}
        {(weatherLoading || weather) ? (
          <div className="space-y-6 max-w-4xl mx-auto mt-8">
            {weatherLoading ? (
              <>
                <CurrentWeatherSkeleton />
                <HourlyForecastSkeleton />
                <DailyForecastSkeleton />
              </>
            ) : weather ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-400" />
                    Votre position
                  </h2>
                  <FavoriteButton
                    name={weather.location.name}
                    country={weather.location.country}
                    latitude={weather.location.latitude}
                    longitude={weather.location.longitude}
                  />
                </motion.div>

                <CurrentWeatherCard
                  current={weather.current}
                  locationName={weather.location.name}
                  country={weather.location.country}
                  today={weather.daily[0]}
                  timezone={weather.timezone}
                />

                <HourlyForecastCard hourly={weather.hourly} timezone={weather.timezone} />

                <DailyForecastCard daily={weather.daily} timezone={weather.timezone} />
              </>
            ) : null}
          </div>
        ) : (
          /* carte de france par defaut */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            {/* titre accrocheur */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              >
                Explorez la meteo en France
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Survolez une ville pour voir la temperature en direct
              </motion.p>
            </div>

            {/* carte interactive */}
            <FranceMap />
          </motion.div>
        )}
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
