"use client";

import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        openOnHover
        delay={150}
        closeDelay={150}
        render={
          <Button
            id="tour-theme"
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            suppressHydrationWarning
          />
        }
      >
        <Sun className="hidden size-4 dark:block" aria-hidden="true" />
        <Moon className="size-4 dark:hidden" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEME_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="justify-between"
          >
            <span className="flex items-center gap-2">
              <option.icon className="size-4" aria-hidden="true" />
              {option.label}
            </span>
            {theme === option.value && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
