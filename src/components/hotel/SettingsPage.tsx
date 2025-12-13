"use client";

import { z } from "zod";
import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

// Schema for Tambo component registration
export const SettingsPagePropsSchema = z.object({
  initialTheme: z
    .enum(["light", "dark", "system"])
    .optional()
    .describe("Initial theme to display"),
});

export type SettingsPageProps = z.infer<typeof SettingsPagePropsSchema>;

type Theme = "light" | "dark" | "system";

export function SettingsPage({ initialTheme }: SettingsPageProps) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  // Apply theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (!mounted || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] =
    [
      { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
      { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
      {
        value: "system",
        label: "System",
        icon: <Monitor className="w-4 h-4" />,
      },
    ];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="animate-pulse h-10 bg-secondary rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium text-foreground">Theme</p>
          <p className="text-xs text-muted-foreground">
            Select your preferred color mode
          </p>
        </div>
      </div>

      {/* Theme Toggle Buttons */}
      <div className="flex gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              theme === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/80"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
