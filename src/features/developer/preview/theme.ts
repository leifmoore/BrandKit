import type * as React from "react";

import brandsSource from "@comp-lib/foundations/data/brands.json";
import tokensSource from "@comp-lib/foundations/data/tokens.json";

import type {
  PreviewBrand,
  PreviewPresentation,
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
 * In 0.1.0, `muted-foreground` misses AA on selected muted/popover surfaces.
 * The rendered documentation raises light mode to #626b7b (4.88:1 on
 * #f3f4f6) and dark mode to #b0b8c4 (5.15:1 on #364153) without altering
 * the immutable copy source.
 */
const DESTINATION_OVERRIDES = {
  light: { "muted-foreground": "#626b7b" },
  dark: { "muted-foreground": "#b0b8c4" },
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
  scenario: "default",
  state: "default",
};

const DEFAULT_PREVIEW_PRESENTATION: PreviewPresentation = Object.freeze({
  layout: "fluid",
  alignment: "center",
});

const PREVIEW_PRESENTATIONS: Readonly<Record<string, PreviewPresentation>> =
  Object.freeze({
    calendar: Object.freeze({
      layout: "intrinsic",
      alignment: "center",
      maxWidth: "22rem",
    }),
  });

export function getPreviewPresentation(entryId: string): PreviewPresentation {
  return PREVIEW_PRESENTATIONS[entryId] ?? DEFAULT_PREVIEW_PRESENTATION;
}

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

  for (const [name, value] of Object.entries(DESTINATION_OVERRIDES[mode])) {
    style[`--${name}`] = value;
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
