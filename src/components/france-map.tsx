"use client";

// carte interactive de la france avec grandes villes

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Thermometer, Cloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityPoint {
  name: string;
  lat: number;
  lon: number;
  x: number; // position en % sur la carte
  y: number;
}

const FRENCH_CITIES: CityPoint[] = [
  { name: "Paris", lat: 48.8566, lon: 2.3522, x: 50, y: 25 },
  { name: "Marseille", lat: 43.2965, lon: 5.3698, x: 58, y: 85 },
  { name: "Lyon", lat: 45.764, lon: 4.8357, x: 55, y: 60 },
  { name: "Toulouse", lat: 43.6047, lon: 1.4442, x: 35, y: 80 },
  { name: "Nice", lat: 43.7102, lon: 7.262, x: 72, y: 82 },
  { name: "Nantes", lat: 47.2184, lon: -1.5536, x: 22, y: 42 },
  { name: "Strasbourg", lat: 48.5734, lon: 7.7521, x: 78, y: 28 },
  { name: "Bordeaux", lat: 44.8378, lon: -0.5792, x: 22, y: 65 },
  { name: "Lille", lat: 50.6292, lon: 3.0573, x: 52, y: 8 },
  { name: "Rennes", lat: 48.1173, lon: -1.6778, x: 18, y: 35 },
  { name: "Montpellier", lat: 43.6108, lon: 3.8767, x: 50, y: 82 },
  { name: "Brest", lat: 48.3904, lon: -4.4861, x: 5, y: 32 },
  { name: "Clermont-Ferrand", lat: 45.7772, lon: 3.087, x: 45, y: 58 },
  { name: "Grenoble", lat: 45.1885, lon: 5.7245, x: 62, y: 65 },
];

interface CityWeatherData {
  temp: number;
  code: number;
}

export function FranceMap() {
  const router = useRouter();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [cityWeather, setCityWeather] = useState<Record<string, CityWeatherData>>({});
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  const fetchCityWeather = async (city: CityPoint) => {
    if (cityWeather[city.name]) return;
    
    setLoadingCity(city.name);
    try {
      const params = new URLSearchParams({
        lat: city.lat.toString(),
        lon: city.lon.toString(),
        name: city.name,
        country: "France",
      });
      const res = await fetch(`/api/weather?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCityWeather(prev => ({
          ...prev,
          [city.name]: {
            temp: Math.round(data.current.temperature),
            code: data.current.weatherCode,
          },
        }));
      }
    } catch {
      // ignore
    } finally {
      setLoadingCity(null);
    }
  };

  const handleCityClick = (city: CityPoint) => {
    const params = new URLSearchParams({
      lat: city.lat.toString(),
      lon: city.lon.toString(),
      name: city.name,
      country: "France",
    });
    router.push(`/city?${params}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-[4/5]">
      {/* carte svg de la france */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.3))" }}
      >
        {/* forme simplifiee de la france */}
        <defs>
          <linearGradient id="franceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.3)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* contour de la france */}
        <path
          d="M 50 5 
             L 55 8 L 60 10 L 70 12 L 78 18 L 82 25 L 80 32
             L 78 40 L 75 50 L 78 60 L 82 70 L 78 78 L 72 82
             L 65 85 L 55 88 L 45 90 L 35 88 L 28 82
             L 22 75 L 18 65 L 15 55 L 18 45 L 15 38 L 8 32
             L 5 28 L 10 22 L 18 18 L 25 15 L 35 10 L 45 7 Z"
          fill="url(#franceGradient)"
          stroke="rgba(147, 197, 253, 0.5)"
          strokeWidth="0.5"
          className="transition-all duration-300"
        />

        {/* corse */}
        <ellipse
          cx="85"
          cy="88"
          rx="4"
          ry="7"
          fill="url(#franceGradient)"
          stroke="rgba(147, 197, 253, 0.5)"
          strokeWidth="0.3"
        />
      </svg>

      {/* points des villes */}
      {FRENCH_CITIES.map((city) => (
        <motion.button
          key={city.name}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: Math.random() * 0.5, type: "spring" }}
          className={cn(
            "absolute transform -translate-x-1/2 -translate-y-1/2 z-10",
            "group cursor-pointer"
          )}
          style={{ left: `${city.x}%`, top: `${city.y}%` }}
          onMouseEnter={() => {
            setHoveredCity(city.name);
            fetchCityWeather(city);
          }}
          onMouseLeave={() => setHoveredCity(null)}
          onClick={() => handleCityClick(city)}
        >
          {/* point lumineux */}
          <div className="relative">
            <div className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              "bg-blue-400 shadow-lg shadow-blue-400/50",
              hoveredCity === city.name && "scale-150 bg-blue-300"
            )}>
              <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30" />
            </div>
            
            {/* tooltip */}
            {hoveredCity === city.name && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 bottom-full mb-2",
                  "bg-slate-800/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl",
                  "border border-slate-700/50 whitespace-nowrap z-20",
                  "min-w-[120px]"
                )}
              >
                <p className="font-semibold text-white text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-blue-400" />
                  {city.name}
                </p>
                
                {loadingCity === city.name ? (
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Chargement...
                  </div>
                ) : cityWeather[city.name] ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold text-blue-300">
                      {cityWeather[city.name].temp}°
                    </span>
                    <Thermometer className="h-3 w-3 text-slate-400" />
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                    <Cloud className="h-3 w-3" />
                    Cliquer pour voir
                  </p>
                )}
                
                {/* fleche du tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95" />
              </motion.div>
            )}
          </div>
        </motion.button>
      ))}

      {/* legende */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className="text-slate-400 text-sm">
          Cliquez sur une ville pour voir la meteo detaillee
        </p>
      </div>
    </div>
  );
}
