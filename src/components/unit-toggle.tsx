"use client";

// toggle pour les unites (temperature, vent)

import { Thermometer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

export function UnitToggle() {
  const { preferences, updatePreferences } = usePreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Thermometer className="h-4 w-4" />
          <span className="hidden sm:inline">Unites</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Temperature</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => updatePreferences({ temperatureUnit: "celsius" })}
          className={cn(preferences.temperatureUnit === "celsius" && "bg-muted")}
        >
          Celsius (C)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updatePreferences({ temperatureUnit: "fahrenheit" })}
          className={cn(preferences.temperatureUnit === "fahrenheit" && "bg-muted")}
        >
          Fahrenheit (F)
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Vitesse du vent</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => updatePreferences({ windSpeedUnit: "kmh" })}
          className={cn(preferences.windSpeedUnit === "kmh" && "bg-muted")}
        >
          km/h
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updatePreferences({ windSpeedUnit: "mph" })}
          className={cn(preferences.windSpeedUnit === "mph" && "bg-muted")}
        >
          mph
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Format heure</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => updatePreferences({ timeFormat: "24h" })}
          className={cn(preferences.timeFormat === "24h" && "bg-muted")}
        >
          24h
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updatePreferences({ timeFormat: "12h" })}
          className={cn(preferences.timeFormat === "12h" && "bg-muted")}
        >
          12h (AM/PM)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
