import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { PreviewSettings } from "./types";
import {
  PREVIEW_BRANDS,
  PREVIEW_DIRECTIONS,
  PREVIEW_MODES,
  PREVIEW_WIDTHS,
} from "./theme";

export interface PreviewControlsProps {
  settings: PreviewSettings;
  onChange: (settings: PreviewSettings) => void;
  states?: readonly string[];
  className?: string;
}

const selectClassName =
  "h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function PreviewControls({
  settings,
  onChange,
  states = [],
  className = "",
}: PreviewControlsProps) {
  const patch = <Key extends keyof PreviewSettings>(
    key: Key,
    value: PreviewSettings[Key],
  ) => onChange({ ...settings, [key]: value });

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 ${className}`}
      role="group"
      aria-label="Preview controls"
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs font-medium text-muted-foreground">
          Viewport
          <select
            className={selectClassName}
            value={settings.width}
            onChange={(event) =>
              patch(
                "width",
                event.currentTarget.value as PreviewSettings["width"],
              )
            }
          >
            {PREVIEW_WIDTHS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
                {option.pixels ? ` · ${option.pixels}px` : ""}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="grid gap-1">
          <legend className="text-xs font-medium text-muted-foreground">
            Theme
          </legend>
          <div className="inline-flex h-9 rounded-md border border-border bg-background p-0.5 shadow-xs">
            {PREVIEW_MODES.map((option) => {
              const selected = settings.mode === option.id;
              const Icon = option.id === "light" ? Sun : Moon;
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-sm px-3 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-pressed={selected}
                  onClick={() => patch("mode", option.id)}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
            <Monitor className="size-3.5" aria-hidden="true" />
            More
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={8} collisionPadding={12} className="grid w-[min(18rem,calc(100vw-1.5rem))] gap-3 p-3">
          {states.length > 0 ? (
            <label className="grid gap-1 text-xs font-medium text-muted-foreground">
              State
              <select
                className={selectClassName}
                value={settings.state}
                onChange={(event) => patch("state", event.currentTarget.value)}
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (character: string) => character.toUpperCase())}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-1 text-xs font-medium text-muted-foreground">
            Accent theme
            <select
              className={selectClassName}
              value={settings.brand}
              onChange={(event) =>
                patch(
                  "brand",
                  event.currentTarget.value as PreviewSettings["brand"],
                )
              }
            >
              {PREVIEW_BRANDS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="grid gap-1">
            <legend className="text-xs font-medium text-muted-foreground">
              Direction
            </legend>
            <div className="inline-flex h-9 rounded-md border border-border bg-background p-0.5 shadow-xs">
              {PREVIEW_DIRECTIONS.map((option) => {
                const selected = settings.direction === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={`flex-1 rounded-sm px-3 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    aria-pressed={selected}
                    onClick={() => patch("direction", option.id)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </PopoverContent>
      </Popover>
    </div>
  );
}
