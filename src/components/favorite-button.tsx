"use client";

// bouton pour ajouter/retirer des favoris

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn, isFavorite, addFavorite, removeFavorite } from "@/lib/utils";

interface FavoriteButtonProps {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function FavoriteButton({
  name,
  country,
  latitude,
  longitude,
  className,
  size = "default",
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(() => {
    if (typeof window === "undefined") return false;
    return isFavorite(latitude, longitude);
  });
  const mounted = typeof window !== "undefined";

  useEffect(() => {
    setIsFav(isFavorite(latitude, longitude));
  }, [latitude, longitude]);

  const handleToggle = () => {
    const id = `${latitude}-${longitude}`;

    if (isFav) {
      removeFavorite(id);
      setIsFav(false);
    } else {
      addFavorite({ name, country, latitude, longitude });
      setIsFav(true);
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        <Heart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleToggle}
      className={cn(
        "transition-all",
        isFav && "text-red-500 border-red-500/50 hover:text-red-600 hover:border-red-500",
        className
      )}
      aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFav ? "filled" : "empty"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
