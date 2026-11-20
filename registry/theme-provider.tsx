import * as React from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const darkQuery = "(prefers-color-scheme: dark)";

function readStoredTheme(storageKey: string): Theme | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : null;
  } catch {
    return null;
  }
}

function systemTheme(): ResolvedTheme {
  return window.matchMedia(darkQuery).matches ? "dark" : "light";
}

/**
 * App-level light/dark/system mode. Applies `.dark` to <html>, which the
 * Scudamore's tokens read, and follows the OS setting while in "system".
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "scudamores-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => readStoredTheme(storageKey) ?? defaultTheme,
  );
  const [system, setSystem] = React.useState<ResolvedTheme>(systemTheme);

  React.useEffect(() => {
    const media = window.matchMedia(darkQuery);
    const onChange = () => setSystem(media.matches ? "dark" : "light");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme = theme === "system" ? system : theme;

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = React.useCallback(
    (next: Theme) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage can be unavailable (private mode); the choice still applies.
      }
      setThemeState(next);
    },
    [storageKey],
  );

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider.");
  return context;
}
