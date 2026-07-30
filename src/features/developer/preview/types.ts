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

export interface PreviewSettings {
  mode: PreviewMode;
  brand: PreviewBrand;
  direction: PreviewDirection;
  width: PreviewWidth;
  state: string;
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
