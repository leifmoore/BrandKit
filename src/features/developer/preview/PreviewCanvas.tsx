import * as React from "react";

import { ThemeScope } from "@comp-lib/react/runtime/theme";

import { usePreviewPortalBridge } from "./portalBridge";
import { createPreviewTheme, getPreviewWidth } from "./theme";
import type { PreviewSettings } from "./types";

export interface PreviewCanvasProps {
  children: React.ReactNode;
  settings: PreviewSettings;
  sessionKey: string;
  ready?: boolean;
  label?: string;
  className?: string;
}

export function PreviewCanvas({
  children,
  settings,
  sessionKey,
  ready = false,
  label = "Interactive component preview",
  className = "",
}: PreviewCanvasProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const theme = React.useMemo(
    () => createPreviewTheme(settings.mode, settings.brand, settings.direction),
    [settings.brand, settings.direction, settings.mode],
  );
  const width = getPreviewWidth(settings.width);

  usePreviewPortalBridge({ rootRef, sessionKey, theme });
  usePreviewScenarioState({ rootRef, sessionKey, state: settings.state, ready });

  return (
    <div
      className={`overflow-x-auto rounded-xl border border-border bg-muted/50 p-3 sm:p-5 ${className}`}
    >
      <div
        className="mx-auto transition-[width] duration-200"
        style={{ width: width === null ? "100%" : `${width}px` }}
      >
        <div
          ref={rootRef}
          dir={settings.direction}
          role="region"
          data-ui-preview="true"
          data-ui-theme={settings.mode}
          data-ui-brand={settings.brand}
          data-ui-width={settings.width}
          data-ui-state={settings.state}
          className={`${theme.className} min-h-56 w-full overflow-hidden rounded-lg border border-border p-6 text-foreground shadow-sm sm:p-8`}
          style={theme.style}
          aria-label={label}
        >
          <ThemeScope
            mode={settings.mode}
            brand={settings.brand}
            className="flex min-h-40 w-full items-center justify-center"
          >
            <div className="w-full max-w-full">{children}</div>
          </ThemeScope>
        </div>
      </div>
    </div>
  );
}

const interactiveSelector = [
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]:not([tabindex='-1'])",
  "[role='checkbox']",
  "[role='radio']",
  "[role='slider']",
  "[role='switch']",
  "[aria-pressed]",
].join(",");

function usePreviewScenarioState({
  rootRef,
  sessionKey,
  state,
  ready,
}: {
  rootRef: React.RefObject<HTMLElement>;
  sessionKey: string;
  state: string;
  ready: boolean;
}) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready || state === "default") return;

    const frame = window.requestAnimationFrame(() => {
      const interactive = [...root.querySelectorAll<HTMLElement>(interactiveSelector)];

      if (state === "disabled") {
        for (const element of interactive) {
          if ("disabled" in element) {
            (element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = true;
          }
          element.setAttribute("aria-disabled", "true");
        }
        return;
      }

      if (state === "invalid") {
        const formControls = root.querySelectorAll<HTMLElement>(
          "input, select, textarea, [role='checkbox'], [role='radio'], [role='switch']",
        );
        for (const element of formControls) element.setAttribute("aria-invalid", "true");
        return;
      }

      if (state === "focus-visible") {
        const target = interactive.find((element) => !element.hasAttribute("disabled"));
        target?.focus();
        target?.setAttribute("data-preview-focus-visible", "true");
        return;
      }

      if (state === "checked") {
        const target = root.querySelector<HTMLElement>(
          "[role='checkbox'], [role='switch'], [role='radio'], [aria-pressed]",
        );
        const selected = target?.getAttribute("aria-checked") === "true"
          || target?.getAttribute("aria-pressed") === "true"
          || target?.getAttribute("data-state") === "checked";
        if (target && !selected) target.click();
        return;
      }

      if (state === "open") {
        const trigger = root.querySelector<HTMLElement>(
          "[data-slot$='-trigger'], [aria-haspopup], button",
        );
        if (!trigger) return;
        trigger.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
        trigger.focus();
        if (trigger.getAttribute("aria-expanded") !== "true") trigger.click();
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [ready, rootRef, sessionKey, state]);
}
