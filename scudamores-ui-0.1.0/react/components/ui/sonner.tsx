"use client";

import * as React from "react";
import {
  Toaster as Sonner,
  type ToasterProps as SonnerToasterProps,
} from "sonner";

import { useHandoffTheme } from "../../runtime/theme";

export interface ToasterProps extends SonnerToasterProps {}
export type ToastProps = ToasterProps;

/**
 * Host-neutral Sonner adapter. An explicit `theme` prop wins; otherwise the
 * nearest ThemeScope mode is used. Without a scope Sonner's SSR-safe `system`
 * mode is used. This component never reads app context, storage, or browser globals.
 */
const Toaster = ({ theme, style, ...props }: ToasterProps) => {
  const handoffTheme = useHandoffTheme();

  return (
    <Sonner
      theme={theme ?? handoffTheme?.mode ?? "system"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
