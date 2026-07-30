"use client";

import * as React from "react";

import { cn } from "../components/ui/utils";

export type ThemeMode = "light" | "dark";
export type BrandName =
  | "default"
  | "blue"
  | "emerald"
  | "red"
  | "orange"
  | "slate"
  | "violet";

export interface HandoffTheme {
  mode: ThemeMode;
  brand: BrandName;
}

export interface ThemeScopeProps
  extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  children: React.ReactNode;
  mode?: ThemeMode;
  brand?: BrandName;
}

const ThemeContext = React.createContext<HandoffTheme | null>(null);

/**
 * Applies handoff theme classes to a local subtree. The host owns persistence,
 * system-theme resolution, and any root-element class changes.
 */
export function ThemeScope({
  children,
  mode = "light",
  brand = "default",
  className,
  ...props
}: ThemeScopeProps) {
  const value = React.useMemo(() => ({ mode, brand }), [mode, brand]);

  return (
    <ThemeContext.Provider value={value}>
      <div
        data-ui-theme={mode}
        data-ui-brand={brand}
        className={cn(mode === "dark" && "dark", `brand-${brand}`, className)}
        {...props}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useHandoffTheme() {
  return React.useContext(ThemeContext);
}
