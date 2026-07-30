import * as React from "react";

import { PreviewCanvas } from "./PreviewCanvas";
import { PreviewControls } from "./PreviewControls";
import { hasPreview, loadPreview } from "./registry";
import {
  DEFAULT_PREVIEW_SETTINGS,
  getPreviewPresentation,
  PREVIEW_BRANDS,
  PREVIEW_DIRECTIONS,
  PREVIEW_MODES,
  PREVIEW_WIDTHS,
} from "./theme";
import type {
  PreviewKind,
  PreviewLoadResult,
  PreviewPresentation,
  PreviewSettings,
} from "./types";

export interface LivePreviewProps {
  entryId: string;
  kind?: PreviewKind;
  title?: string;
  showControls?: boolean;
  settings?: PreviewSettings;
  defaultSettings?: Partial<PreviewSettings>;
  states?: readonly string[];
  onSettingsChange?: (settings: PreviewSettings) => void;
  className?: string;
  presentation?: PreviewPresentation;
  thumbnail?: boolean;
}

const PREVIEW_PREFERENCES_KEY = "scudamores.design-system.preview.v1";

type StoredPreviewPreferences = Pick<
  PreviewSettings,
  "mode" | "brand" | "direction" | "width"
>;

function readPreviewPreferences(): Partial<StoredPreviewPreferences> {
  try {
    const stored = window.localStorage.getItem(PREVIEW_PREFERENCES_KEY);
    if (!stored) return {};
    const value = JSON.parse(stored) as Record<string, unknown>;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};

    const preferences: Partial<StoredPreviewPreferences> = {};
    if (PREVIEW_MODES.some((option) => option.id === value.mode)) {
      preferences.mode = value.mode as PreviewSettings["mode"];
    }
    if (PREVIEW_BRANDS.some((option) => option.id === value.brand)) {
      preferences.brand = value.brand as PreviewSettings["brand"];
    }
    if (PREVIEW_DIRECTIONS.some((option) => option.id === value.direction)) {
      preferences.direction = value.direction as PreviewSettings["direction"];
    }
    if (PREVIEW_WIDTHS.some((option) => option.id === value.width)) {
      preferences.width = value.width as PreviewSettings["width"];
    }
    return preferences;
  } catch {
    return {};
  }
}

function storePreviewPreferences(settings: PreviewSettings) {
  try {
    const preferences: StoredPreviewPreferences = {
      mode: settings.mode,
      brand: settings.brand,
      direction: settings.direction,
      width: settings.width,
    };
    window.localStorage.setItem(
      PREVIEW_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );
  } catch {
    // Storage can be unavailable in private or hardened browsing contexts.
  }
}

interface RenderBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface RenderBoundaryState {
  error: Error | null;
}

class PreviewRenderBoundary extends React.Component<
  RenderBoundaryProps,
  RenderBoundaryState
> {
  state: RenderBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RenderBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <PreviewStatus
          title="Preview could not render"
          detail={this.state.error.message}
          actionLabel="Try again"
          onAction={this.props.onReset}
        />
      );
    }
    return this.props.children;
  }
}

export interface PreviewStatusProps {
  title: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
  busy?: boolean;
}

export function PreviewStatus({
  title,
  detail,
  actionLabel,
  onAction,
  busy = false,
}: PreviewStatusProps) {
  return (
    <div
      className="flex min-h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 p-6 text-center"
      role={busy ? "status" : "alert"}
      aria-live="polite"
      aria-busy={busy || undefined}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {detail ? (
        <p className="max-w-lg text-xs text-muted-foreground">{detail}</p>
      ) : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          className="mt-2 inline-flex h-8 items-center rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground shadow-xs outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function useLoadedPreview(
  kind: PreviewKind,
  entryId: string,
  retryNonce: number,
): PreviewLoadResult {
  const requestKey = `${kind}:${entryId}:${retryNonce}`;
  const initialResult: PreviewLoadResult = hasPreview(kind, entryId)
    ? { status: "loading" }
    : { status: "unsupported" };
  const [request, setRequest] = React.useState<{
    key: string;
    result: PreviewLoadResult;
  }>(() => ({ key: requestKey, result: initialResult }));

  React.useEffect(() => {
    let active = true;
    if (!hasPreview(kind, entryId)) {
      setRequest({ key: requestKey, result: { status: "unsupported" } });
      return () => {
        active = false;
      };
    }

    setRequest({ key: requestKey, result: { status: "loading" } });
    void loadPreview(kind, entryId)
      .then((preview) => {
        if (!active) return;
        setRequest({
          key: requestKey,
          result: preview
            ? { status: "ready", preview }
            : { status: "unsupported" },
        });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setRequest({
          key: requestKey,
          result: {
            status: "error",
            error: cause instanceof Error ? cause : new Error(String(cause)),
          },
        });
      });

    return () => {
      active = false;
    };
  }, [entryId, kind, requestKey, retryNonce]);

  if (request.key !== requestKey) {
    return hasPreview(kind, entryId)
      ? { status: "loading" }
      : { status: "unsupported" };
  }
  return request.result;
}

export function LivePreview({
  entryId,
  kind = "component",
  title,
  showControls = true,
  settings: controlledSettings,
  defaultSettings,
  states = [],
  onSettingsChange,
  className = "",
  presentation,
  thumbnail = false,
}: LivePreviewProps) {
  const [internalSettings, setInternalSettings] = React.useState<PreviewSettings>(
    () => ({
      ...DEFAULT_PREVIEW_SETTINGS,
      ...readPreviewPreferences(),
      ...defaultSettings,
      state: defaultSettings?.state ?? "default",
    }),
  );
  const previousEntryRef = React.useRef(entryId);
  const [retryNonce, setRetryNonce] = React.useState(0);
  const settings = controlledSettings ?? internalSettings;
  const result = useLoadedPreview(kind, entryId, retryNonce);
  const availableStates = React.useMemo(
    () => [...new Set(states.length > 0 ? states : ["default"])],
    [states],
  );
  const sessionKey = `${kind}:${entryId}:${settings.state}:${retryNonce}`;

  const updateSettings = React.useCallback((next: PreviewSettings) => {
    if (!controlledSettings) setInternalSettings(next);
    onSettingsChange?.(next);
  }, [controlledSettings, onSettingsChange]);

  React.useEffect(() => {
    if (previousEntryRef.current === entryId) return;
    previousEntryRef.current = entryId;
    updateSettings({
      ...settings,
      state: availableStates.includes("default")
        ? "default"
        : (availableStates[0] ?? "default"),
    });
  }, [availableStates, entryId, settings, updateSettings]);

  React.useEffect(() => {
    storePreviewPreferences(settings);
  }, [settings.brand, settings.direction, settings.mode, settings.width]);

  React.useEffect(() => {
    if (availableStates.includes(settings.state)) return;
    updateSettings({ ...settings, state: availableStates[0] ?? "default" });
  }, [availableStates, settings, updateSettings]);

  let content: React.ReactNode;
  if (result.status === "loading") {
    content = <PreviewStatus title="Loading preview…" busy />;
  } else if (result.status === "unsupported") {
    content = (
      <PreviewStatus
        title="Live preview unavailable"
        detail={`No supported React ${kind} preview is registered for “${entryId}”.`}
      />
    );
  } else if (result.status === "error") {
    content = (
      <PreviewStatus
        title="Preview could not load"
        detail={result.error.message}
        actionLabel="Try again"
        onAction={() => setRetryNonce((value) => value + 1)}
      />
    );
  } else {
    const Component = result.preview.Component;
    content = (
      <PreviewRenderBoundary
        key={sessionKey}
        onReset={() => setRetryNonce((value) => value + 1)}
      >
        <Component key={sessionKey} />
      </PreviewRenderBoundary>
    );
  }

  return (
    <section
      className={`space-y-3 ${className}`}
      aria-label={thumbnail ? undefined : (title ?? "Live preview")}
      aria-hidden={thumbnail || undefined}
      data-preview-entry={entryId}
      data-preview-kind={kind}
      data-preview-status={result.status}
    >
      {showControls ? (
        <PreviewControls
          settings={settings}
          states={states}
          onChange={updateSettings}
        />
      ) : null}
      <PreviewCanvas
        settings={settings}
        sessionKey={sessionKey}
        ready={result.status === "ready"}
        label={title ? `${title} interactive preview` : undefined}
        presentation={presentation ?? getPreviewPresentation(entryId)}
        compact={thumbnail}
        inert={thumbnail}
      >
        {content}
      </PreviewCanvas>
    </section>
  );
}
