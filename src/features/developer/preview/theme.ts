import type * as React from "react";

import brandsSource from "@comp-lib/foundations/data/brands.json";
import tokensSource from "@comp-lib/foundations/data/tokens.json";

import type {
  PreviewBrand,
  PreviewDirection,
  PreviewMode,
  PreviewSettings,
  PreviewTheme,
  PreviewWidth,
} from "./types";

interface SemanticToken {
  light: string;
  dark: string;
}

interface TokenData {
  tokens: Record<string, SemanticToken>;
  tailwindAliases: {
    font: { sans: string };
  };
}

interface BrandPresetData {
  label: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface BrandData {
  presets: Record<PreviewBrand, BrandPresetData>;
}

const tokenData = tokensSource as TokenData;
const brandData = brandsSource as BrandData;

/**
 * Destination-only corrections for known handoff token-pair failures.
 *
 * In 0.1.0, dark `muted-foreground` resolves to #99a1af, which is 3.96:1
 * against the dark popover surface (#364153). The rendered documentation
 * raises it to #b0b8c4 (5.15:1) without altering the immutable copy source.
 */
const DARK_DESTINATION_OVERRIDES = {
  "muted-foreground": "#b0b8c4",
} as const;

export const PREVIEW_MODES: ReadonlyArray<{
  id: PreviewMode;
  label: string;
}> = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

export const PREVIEW_BRANDS: ReadonlyArray<{
  id: PreviewBrand;
  label: string;
}> = (Object.entries(brandData.presets) as Array<
  [PreviewBrand, BrandPresetData]
>).map(([id, preset]) => ({ id, label: preset.label }));

export const PREVIEW_DIRECTIONS: ReadonlyArray<{
  id: PreviewDirection;
  label: string;
}> = [
  { id: "ltr", label: "LTR" },
  { id: "rtl", label: "RTL" },
];

export const PREVIEW_WIDTHS: ReadonlyArray<{
  id: PreviewWidth;
  label: string;
  pixels: number | null;
}> = [
  { id: "mobile", label: "Mobile", pixels: 360 },
  { id: "tablet", label: "Tablet", pixels: 768 },
  { id: "desktop", label: "Desktop", pixels: 1280 },
  { id: "fluid", label: "Fluid", pixels: null },
];

export const DEFAULT_PREVIEW_SETTINGS: PreviewSettings = {
  mode: "light",
  brand: "default",
  direction: "ltr",
  width: "fluid",
  state: "default",
};

export function getPreviewWidth(width: PreviewWidth): number | null {
  return PREVIEW_WIDTHS.find((option) => option.id === width)?.pixels ?? null;
}

export function createPreviewTheme(
  mode: PreviewMode,
  brand: PreviewBrand,
  direction: PreviewDirection,
): PreviewTheme {
  const style = {} as React.CSSProperties &
    Record<`--${string}`, string | number>;

  for (const [name, token] of Object.entries(tokenData.tokens)) {
    style[`--${name}`] = token[mode];
  }

  for (const [name, value] of Object.entries(
    brandData.presets[brand][mode],
  )) {
    style[`--${name}`] = value;
  }

  if (mode === "dark") {
    for (const [name, value] of Object.entries(DARK_DESTINATION_OVERRIDES)) {
      style[`--${name}`] = value;
    }
  }

  // Components consume the font through the semantic Tailwind alias, which is
  // inherited by all descendants and copied to preview-owned portals.
  style["--font-sans"] = tokenData.tailwindAliases.font.sans;
  style.fontFamily = "var(--font-sans)";
  style.fontSize = "var(--font-size)";
  style.color = "var(--foreground)";
  style.backgroundColor = "var(--background)";
  style.colorScheme = mode;

  return {
    mode,
    brand,
    direction,
    className: [
      "ds-preview-theme",
      mode === "dark" ? "preview-dark dark" : "preview-light",
      `brand-${brand}`,
    ].join(" "),
    style,
  };
}
