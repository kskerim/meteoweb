"use client";

// page des favoris

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Header, StaticBackground, FavoriteCard } from "@/components";
import { getFavorites } from "@/lib/utils";
import type { FavoriteCity } from "@/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() => {
    if (typeof window === "undefined") return [];
    return getFavorites();
  });
  const mounted = typeof window !== "undefined";

  const handleRemove = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <StaticBackground>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Mes favoris</h1>
          <p className="text-muted-foreground">
            Retrouvez rapidement la meteo de vos villes preferees
          </p>
        </motion.div>

        {!mounted ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aucun favori</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ajoutez des villes a vos favoris en cliquant sur l&apos;icone coeur sur la page meteo
              d&apos;une ville
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite, index) => (
              <FavoriteCard
                key={favorite.id}
                favorite={favorite}
                onRemove={handleRemove}
                index={index}
              />
            ))}
          </div>
        )}
      </main>
    </StaticBackground>
  );
}
