// api route pour le geocoding (recherche de villes)

import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/lib/open-meteo";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const count = searchParams.get("count");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchCities(query, count ? parseInt(count) : 8);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "erreur lors de la recherche" }, { status: 500 });
  }
}
