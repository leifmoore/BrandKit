import type * as React from "react";

export type PreviewKind = "component" | "recipe";
export type PreviewMode = "light" | "dark";
export type PreviewBrand =
  | "default"
  | "blue"
  | "emerald"
  | "red"
  | "orange"
  | "slate"
  | "violet";
export type PreviewDirection = "ltr" | "rtl";
export type PreviewWidth = "mobile" | "tablet" | "desktop" | "fluid";
export type PreviewLayout = "intrinsic" | "fluid";
export type PreviewAlignment = "start" | "center";

export interface PreviewPresentation {
  layout: PreviewLayout;
  alignment?: PreviewAlignment;
  /** Optional destination-only bound for intrinsically sized previews. */
  maxWidth?: string;
}

export interface PreviewSettings {
  mode: PreviewMode;
  brand: PreviewBrand;
  direction: PreviewDirection;
  width: PreviewWidth;
  scenario: string;
  state: string;
}

export interface PreviewScenario {
  id: string;
  title: string;
  description?: string;
  states?: readonly string[];
  defaultViewport?: "360" | "768" | "1280" | "fluid";
}

export interface PreviewTheme {
  mode: PreviewMode;
  brand: PreviewBrand;
  direction: PreviewDirection;
  className: string;
  style: React.CSSProperties & Record<`--${string}`, string | number>;
}

export interface LoadedPreview {
  Component: React.ComponentType;
  sourcePath: string;
}

export type PreviewLoadResult =
  | { status: "loading" }
  | { status: "unsupported" }
  | { status: "error"; error: Error }
  | { status: "ready"; preview: LoadedPreview };
