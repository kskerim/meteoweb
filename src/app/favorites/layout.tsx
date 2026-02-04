import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoris",
  description: "Consultez la meteo de vos villes favorites",
};

export default function FavoritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
