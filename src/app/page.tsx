"use client";

// page d'accueil avec recherche et geolocalisation

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
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

      <main className="container mx-auto px-4 py-8">
        {/* hero section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Meteo en temps reel
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Recherchez une ville ou utilisez votre position pour obtenir les previsions meteo
            detaillees
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <SearchBar className="w-full sm:flex-1" autoFocus />

            <Button
              variant="outline"
              onClick={handleGeolocation}
              disabled={geoLoading}
              className="w-full sm:w-auto gap-2"
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
              className="mt-4 text-destructive text-sm"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* weather display */}
        {(weatherLoading || weather) && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {weatherLoading ? (
              <>
                <CurrentWeatherSkeleton />
                <HourlyForecastSkeleton />
                <DailyForecastSkeleton />
              </>
            ) : weather ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Votre position</h2>
                  <FavoriteButton
                    name={weather.location.name}
                    country={weather.location.country}
                    latitude={weather.location.latitude}
                    longitude={weather.location.longitude}
                  />
                </div>

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
