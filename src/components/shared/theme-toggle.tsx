"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const emptySubscribe = () => () => {};

export function ThemeToggle({ className, size = "sm" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`h-8 w-8 p-0 sm:h-9 sm:w-9 rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-100/80 dark:bg-white/5 opacity-70 ${
          className || ""
        }`}
        aria-label="Toggle theme"
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <Button
      variant="outline"
      size={size}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-8 w-8 p-0 sm:h-9 sm:w-9 rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-100/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all shadow-sm ${
        className || ""
      }`}
      aria-label="Toggle theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-600 transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
