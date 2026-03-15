"use client";

// carte interactive de la france avec les 13 regions metropolitaines tracees

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Thermometer, Loader2 } from "lucide-react";

interface CityPoint {
  name: string;
  lat: number;
  lon: number;
}

// villes principales positionnees par coordonnees reelles
const FRENCH_CITIES: CityPoint[] = [
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Marseille", lat: 43.2965, lon: 5.3698 },
  { name: "Lyon", lat: 45.764, lon: 4.8357 },
  { name: "Toulouse", lat: 43.6047, lon: 1.4442 },
  { name: "Nice", lat: 43.7102, lon: 7.262 },
  { name: "Nantes", lat: 47.2184, lon: -1.5536 },
  { name: "Strasbourg", lat: 48.5734, lon: 7.7521 },
  { name: "Bordeaux", lat: 44.8378, lon: -0.5792 },
  { name: "Lille", lat: 50.6292, lon: 3.0573 },
  { name: "Rennes", lat: 48.1173, lon: -1.6778 },
  { name: "Montpellier", lat: 43.6108, lon: 3.8767 },
  { name: "Brest", lat: 48.3904, lon: -4.4861 },
  { name: "Clermont-Ferrand", lat: 45.7772, lon: 3.087 },
  { name: "Grenoble", lat: 45.1885, lon: 5.7245 },
];

// limites geographiques pour la projection
const BOUNDS = {
  minLon: -5.5,
  maxLon: 8.5,
  minLat: 42.0,
  maxLat: 51.5,
};

// convertit des coordonnees lon/lat en position x/y dans le svg (pourcentage du viewbox)
function project(lon: number, lat: number) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

// ajuste la position y du svg vers le container html
// le svg a un viewbox carre (100x100) dans un container 4:5
// sans cet ajustement les boutons html ne s'alignent pas avec les points svg
function toContainerY(svgY: number) {
  return (svgY + 12.5) * 0.8;
}

// convertit un tableau de coordonnees geographiques [lon, lat] en chemin svg
function geoToPath(coords: [number, number][]) {
  const points = coords.map(([lon, lat]) => project(lon, lat));
  return (
    `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} ` +
    points
      .slice(1)
      .map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ")
  );
}

// contour de la france metropolitaine
// ajuste pour bien inclure lille (nord) et nice (sud-est)
const FRANCE_PATH = [
  "M 57.5 4.3",
  "L 59.5 6.5",
  "L 62.0 8.0",
  "L 65.0 11.5",
  "L 68.1 15.2",
  "L 73.7 16.3",
  "L 80.9 21.1",
  "L 84.7 21.4",
  "L 92.3 26.5",
  "L 98.1 26.6",
  "L 93.5 41.2",
  "L 89.3 42.1",
  "L 88.2 48.1",
  "L 83.2 55.9",
  "L 87.9 59.7",
  "L 89.6 66.0",
  "L 86.6 77.6",
  "L 92.5 82.5",
  "L 91.5 83.5",
  "L 84.1 88.2",
  "L 77.4 86.3",
  "L 72.4 85.2",
  "L 64.0 89.8",
  "L 59.9 95.4",
  "L 51.7 94.0",
  "L 44.5 91.6",
  "L 35.7 89.8",
  "L 26.6 85.6",
  "L 30.4 81.5",
  "L 30.6 72.2",
  "L 31.1 62.0",
  "L 31.4 56.2",
  "L 26.2 52.6",
  "L 23.5 44.3",
  "L 19.6 40.7",
  "L 14.7 39.1",
  "L 5.5 33.3",
  "L 11.6 29.2",
  "L 17.0 28.1",
  "L 26.1 30.1",
  "L 27.7 19.6",
  "L 31.1 19.2",
  "L 40.1 21.3",
  "L 47.0 16.5",
  "L 50.5 7.6",
  "Z",
].join(" ");

// frontieres internes entre les 13 regions metropolitaines
// tracees a partir de coordonnees geographiques reelles [lon, lat]
// clipees au contour de la france pour ne pas depasser
const REGION_BORDERS = (
  [
    // bretagne / normandie (frontiere est de la bretagne, partie nord)
    // prolonge jusqu'a la cote nord
    [
      [-1.5, 50.5],
      [-1.35, 48.35],
      [-1.2, 48.15],
    ],
    // bretagne / pays de la loire (frontiere est, partie sud vers la cote)
    // prolonge jusqu'a la cote atlantique
    [
      [-1.2, 48.15],
      [-1.7, 47.7],
      [-2.2, 47.1],
      [-3.0, 45.5],
    ],
    // normandie / pays de la loire (sud-ouest de la normandie)
    [
      [-1.2, 48.15],
      [-0.5, 48.05],
      [0.0, 48.05],
    ],
    // normandie / centre-val de loire (sud de la normandie)
    [
      [0.0, 48.05],
      [0.7, 48.3],
      [1.3, 48.5],
    ],
    // normandie / ile-de-france (frontiere est de la normandie)
    [
      [1.3, 48.5],
      [1.5, 48.8],
      [1.7, 49.1],
    ],
    // normandie / hauts-de-france (vers la cote nord de la manche)
    // prolonge bien au-dela du contour pour que le clip coupe proprement
    [
      [1.7, 49.1],
      [1.5, 49.7],
      [1.3, 51.0],
    ],
    // hauts-de-france / ile-de-france (frontiere sud des hauts-de-france)
    [
      [1.7, 49.1],
      [2.5, 49.15],
      [3.4, 49.1],
    ],
    // hauts-de-france / grand est (vers la frontiere belge)
    // prolonge jusqu'a la frontiere nord-est
    [
      [3.4, 49.1],
      [3.8, 49.5],
      [4.2, 50.0],
      [5.5, 51.5],
    ],
    // ile-de-france / grand est (frontiere est de l'idf)
    [
      [3.4, 49.1],
      [3.35, 48.7],
      [3.2, 48.35],
    ],
    // ile-de-france / bourgogne-franche-comte (sud-est de l'idf)
    [
      [3.2, 48.35],
      [3.0, 48.2],
      [2.8, 48.1],
    ],
    // ile-de-france / centre-val de loire (frontiere sud de l'idf)
    [
      [2.8, 48.1],
      [2.0, 48.2],
      [1.3, 48.5],
    ],
    // grand est / bourgogne-franche-comte (vers la frontiere suisse)
    // prolonge bien au-dela de la frontiere est
    [
      [3.2, 48.35],
      [4.0, 47.8],
      [5.0, 47.4],
      [6.0, 47.3],
      [6.8, 47.5],
      [9.0, 47.5],
    ],
    // pays de la loire / centre-val de loire
    [
      [0.0, 48.05],
      [0.2, 47.5],
      [0.3, 47.0],
      [0.3, 46.8],
    ],
    // pays de la loire / nouvelle-aquitaine (vers la cote atlantique)
    // prolonge jusqu'a la cote ouest
    [
      [0.3, 46.8],
      [-0.3, 46.5],
      [-0.8, 46.3],
      [-1.2, 46.15],
      [-2.5, 45.0],
    ],
    // centre-val de loire / bourgogne-franche-comte
    [
      [2.8, 48.1],
      [2.9, 47.5],
      [3.0, 47.0],
      [3.0, 46.7],
    ],
    // centre-val de loire / auvergne-rhone-alpes
    [
      [3.0, 46.7],
      [2.7, 46.5],
      [2.4, 46.3],
    ],
    // centre-val de loire / nouvelle-aquitaine
    [
      [2.4, 46.3],
      [1.5, 46.3],
      [0.8, 46.5],
      [0.3, 46.8],
    ],
    // bourgogne-franche-comte / auvergne-rhone-alpes (vers la frontiere suisse)
    // prolonge au-dela de la frontiere est
    [
      [3.0, 46.7],
      [3.5, 46.3],
      [4.0, 46.0],
      [4.8, 46.0],
      [5.5, 46.2],
      [6.0, 46.3],
      [8.0, 46.5],
    ],
    // nouvelle-aquitaine / occitanie (des pyrenees vers le nord)
    // prolonge jusque dans les pyrenees (hors contour)
    [
      [-1.5, 41.5],
      [-0.5, 42.5],
      [0.0, 43.0],
      [0.5, 43.5],
      [1.0, 44.0],
      [1.5, 44.3],
      [2.0, 44.7],
      [2.2, 44.8],
    ],
    // nouvelle-aquitaine / auvergne-rhone-alpes
    [
      [2.2, 44.8],
      [2.3, 45.3],
      [2.4, 45.8],
      [2.4, 46.3],
    ],
    // auvergne-rhone-alpes / occitanie (frontiere horizontale)
    [
      [2.2, 44.8],
      [3.0, 44.5],
      [3.5, 44.3],
      [4.0, 44.2],
      [4.5, 44.2],
    ],
    // auvergne-rhone-alpes / paca (vers la frontiere italienne)
    // prolonge au-dela de la frontiere est
    [
      [4.5, 44.2],
      [5.0, 44.5],
      [5.5, 44.8],
      [6.0, 45.0],
      [6.5, 45.3],
      [8.5, 46.5],
    ],
    // occitanie / paca (vers la cote mediterranee)
    // prolonge jusqu'a la mer
    [
      [4.5, 44.2],
      [4.5, 43.8],
      [4.5, 43.5],
      [4.7, 42.0],
    ],
  ] as [number, number][][]
).map(geoToPath);

interface CityWeatherData {
  temp: number;
  code: number;
}

export function FranceMap() {
  const router = useRouter();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [cityWeather, setCityWeather] = useState<Record<string, CityWeatherData>>({});
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  // recupere la meteo d'une ville au survol, avec cache pour eviter les appels en double
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
        setCityWeather((prev) => ({
          ...prev,
          [city.name]: {
            temp: Math.round(data.current.temperature),
            code: data.current.weatherCode,
          },
        }));
      }
    } catch {
      // ignore les erreurs reseau
    } finally {
      setLoadingCity(null);
    }
  };

  // redirige vers la page meteo detaillee de la ville selectionnee
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
    <div className="relative w-full max-w-2xl mx-auto aspect-4/5 overflow-visible">
      {/* carte svg avec contour et frontieres des regions */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 2px 12px rgba(59,130,246,0.12))" }}
      >
        <defs>
          <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.12)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.08)" />
            <stop offset="100%" stopColor="rgba(147,51,234,0.12)" />
          </linearGradient>
          <linearGradient id="mapStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.5)" />
            <stop offset="100%" stopColor="rgba(167,139,250,0.5)" />
          </linearGradient>
          {/* filtre de lueur pour les points survoles */}
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* clip pour que les frontieres internes ne depassent pas du contour */}
          <clipPath id="franceClip">
            <path d={FRANCE_PATH} />
          </clipPath>
        </defs>

        {/* france metropolitaine - fond */}
        <path
          d={FRANCE_PATH}
          fill="url(#mapFill)"
          stroke="url(#mapStroke)"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />

        {/* frontieres internes des 13 regions (clipees au contour) */}
        <g clipPath="url(#franceClip)">
          {REGION_BORDERS.map((path, i) => (
            <path
              key={i}
              d={path}
              fill="none"
              stroke="rgba(147,197,253,0.3)"
              strokeWidth="0.3"
              strokeLinejoin="round"
            />
          ))}
        </g>

        {/* points des villes sur la carte */}
        {FRENCH_CITIES.map((city) => {
          const { x, y } = project(city.lon, city.lat);
          const isHovered = hoveredCity === city.name;
          const isParis = city.name === "Paris";

          return (
            <g key={city.name}>
              {/* effet d'onde au survol (double cercle anime) */}
              {isHovered && (
                <>
                  <circle cx={x} cy={y} r="1.5" fill="none" stroke="#3b82f6" strokeWidth="0.3">
                    <animate
                      attributeName="r"
                      from="1.5"
                      to="4.5"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.6"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx={x} cy={y} r="1" fill="none" stroke="#60a5fa" strokeWidth="0.2">
                    <animate
                      attributeName="r"
                      from="1"
                      to="3.5"
                      dur="1.5s"
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.4"
                      to="0"
                      dur="1.5s"
                      begin="0.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}

              {/* halo lumineux autour du point */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 2.8 : isParis ? 1.8 : 1.2}
                fill={isHovered ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.15)"}
                className="transition-all duration-300"
              />

              {/* point central de la ville */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 1.3 : isParis ? 0.8 : 0.55}
                fill={isHovered ? "#93c5fd" : "#3b82f6"}
                filter={isHovered ? "url(#cityGlow)" : undefined}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>

      {/* zones cliquables superposees en html, positions corrigees pour le ratio 4:5 */}
      {FRENCH_CITIES.map((city) => {
        const { x, y } = project(city.lon, city.lat);
        const isHovered = hoveredCity === city.name;

        return (
          <button
            key={city.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer w-12 h-12 rounded-full"
            style={{ left: `${x}%`, top: `${toContainerY(y)}%` }}
            onMouseEnter={() => {
              setHoveredCity(city.name);
              fetchCityWeather(city);
            }}
            onMouseLeave={() => setHoveredCity(null)}
            onClick={() => handleCityClick(city)}
            aria-label={`voir la meteo de ${city.name}`}
          >
            {/* tooltip anime au survol */}
            {isHovered && (
              <div
                className="absolute left-1/2 bottom-full mb-2 rounded-xl px-3.5 py-2.5 shadow-2xl whitespace-nowrap z-20 min-w-32"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.97), rgba(30,41,59,0.97))",
                  border: "1px solid rgba(148,163,184,0.15)",
                  backdropFilter: "blur(12px)",
                  animation: "tooltipIn 0.2s ease-out forwards",
                }}
              >
                <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-400" />
                  {city.name}
                </p>

                {loadingCity === city.name ? (
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    chargement...
                  </div>
                ) : cityWeather[city.name] ? (
                  <div className="flex items-center gap-2 mt-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-lg font-bold text-blue-300">
                      {cityWeather[city.name].temp}°C
                    </span>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs mt-1.5">chargement...</p>
                )}

                {/* fleche du tooltip vers le point */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid rgba(15,23,42,0.97)",
                  }}
                />
              </div>
            )}
          </button>
        );
      })}

      {/* legende en bas de la carte */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className="text-slate-500 text-sm">cliquez sur une ville pour voir la meteo detaillee</p>
      </div>
    </div>
  );
}
