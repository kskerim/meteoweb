// api route pour les previsions meteo avec cache

import { NextRequest, NextResponse } from "next/server";
import { fetchWeather } from "@/lib/open-meteo";

export const revalidate = 600; // cache 10 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const name = searchParams.get("name") || "Lieu inconnu";
  const country = searchParams.get("country") || "";

  if (!lat || !lon) {
    return NextResponse.json({ error: "latitude et longitude requises" }, { status: 400 });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json({ error: "coordonnees invalides" }, { status: 400 });
  }

  try {
    const weatherData = await fetchWeather(latitude, longitude, name, country);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("weather api error:", error);
    return NextResponse.json(
      { error: "erreur lors de la recuperation des donnees meteo" },
      { status: 500 }
    );
  }
}
