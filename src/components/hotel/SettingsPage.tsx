"use client";

import { z } from "zod";
import { Moon, Sun, Monitor, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Schema for Tambo component registration
export const SettingsPagePropsSchema = z.object({
  initialTheme: z
    .enum(["light", "dark", "system"])
    .optional()
    .describe("Initial theme to display (ignored, uses next-themes)"),
});

export type SettingsPageProps = z.infer<typeof SettingsPagePropsSchema>;

type Theme = "light" | "dark" | "system";

export function SettingsPage({}: SettingsPageProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

      {/* Divider */}
      <div className="border-t border-border my-4"></div>

      {/* About this Demo section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">About this Demo</h3>
        <p className="text-sm text-muted-foreground">
          This hotel front desk demo showcases Tambo AI&apos;s generative UI
          capabilities.
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://github.com/tambo-ai/tambo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Tambo Framework
          </a>
          <a
            href="https://github.com/tambo-ai/hotel-front-desk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
}
