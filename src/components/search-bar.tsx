"use client";

// barre de recherche avec autocomplete et historique

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { cn, addToSearchHistory, getSearchHistory } from "@/lib/utils";
import type { GeoLocation } from "@/types";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  className,
  placeholder = "Rechercher une ville...",
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof getSearchHistory>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // charger l'historique au montage
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // rechercher les villes
  useEffect(() => {
    const searchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/geocoding?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (location: { name: string; country: string; latitude: number; longitude: number }) => {
      addToSearchHistory({
        name: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setQuery("");
      setIsOpen(false);
      setHistory(getSearchHistory());

      const params = new URLSearchParams({
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
        name: location.name,
        country: location.country,
      });

      router.push(`/city?${params.toString()}`);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query.length >= 2 ? results : history;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleSelect(items[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const showHistory = query.length < 2 && history.length > 0;
  const showResults = query.length >= 2;
  const showDropdown = isOpen && (showHistory || showResults);

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-10 pr-10 bg-background/80 backdrop-blur-sm border-border/50"
          aria-label="Rechercher une ville"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg overflow-hidden"
            role="listbox"
          >
            {isLoading && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Recherche...</div>
            )}

            {showHistory && !isLoading && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                  Recherches recentes
                </div>
                {history.map((item, index) => (
                  <button
                    key={`${item.latitude}-${item.longitude}`}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors",
                      selectedIndex === index && "bg-muted/50"
                    )}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {showResults && !isLoading && results.length === 0 && (
              <div className="px-4 py-3 text-sm text-muted-foreground">Aucun resultat</div>
            )}

            {showResults && !isLoading && results.length > 0 && (
              <div>
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors",
                      selectedIndex === index && "bg-muted/50"
                    )}
                    role="option"
                    aria-selected={selectedIndex === index}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.admin1 ? `${result.admin1}, ` : ""}
                        {result.country}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
