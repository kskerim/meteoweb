"use client";

// header avec navigation

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CloudSun, Heart, Info, Home } from "lucide-react";
import { motion } from "framer-motion";
import { UnitToggle } from "@/components/unit-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/favorites", label: "Favoris", icon: Heart },
  { href: "/about", label: "A propos", icon: Info },
];

export function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <CloudSun className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="font-bold text-xl tracking-tight">Meteo Web</span>
          </Link>

          {/* navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2">
            <UnitToggle />
          </div>
        </div>

        {/* navigation mobile */}
        <nav className="flex md:hidden items-center justify-center gap-2 pb-3 -mt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
