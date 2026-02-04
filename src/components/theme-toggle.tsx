"use client";

// toggle pour le theme (clair/sombre/systeme)

import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/components/providers/preferences-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { preferences, updatePreferences } = usePreferences();
  const mounted = typeof window !== "undefined";

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const icons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {icons[preferences.theme]}
          <span className="sr-only">Changer le theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => updatePreferences({ theme: "light" })}
          className={cn(preferences.theme === "light" && "bg-muted")}
        >
          <Sun className="h-4 w-4 mr-2" />
          Clair
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updatePreferences({ theme: "dark" })}
          className={cn(preferences.theme === "dark" && "bg-muted")}
        >
          <Moon className="h-4 w-4 mr-2" />
          Sombre
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => updatePreferences({ theme: "system" })}
          className={cn(preferences.theme === "system" && "bg-muted")}
        >
          <Monitor className="h-4 w-4 mr-2" />
          Systeme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
