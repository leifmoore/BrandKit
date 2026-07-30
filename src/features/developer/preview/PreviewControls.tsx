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
      className={`flex flex-wrap items-end gap-3 rounded-lg border border-border bg-card p-3 ${className}`}
      role="group"
      aria-label="Preview controls"
    >
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
        Mode
        <select
          className={selectClassName}
          value={settings.mode}
          onChange={(event) =>
            patch("mode", event.currentTarget.value as PreviewSettings["mode"])
          }
        >
          {PREVIEW_MODES.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Brand
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

      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        Width
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
          Direction
        </legend>
        <div className="inline-flex h-9 rounded-md border border-border bg-background p-0.5 shadow-xs">
          {PREVIEW_DIRECTIONS.map((option) => {
            const selected = settings.direction === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`rounded-sm px-3 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={selected}
                onClick={() => patch("direction", option.id)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
