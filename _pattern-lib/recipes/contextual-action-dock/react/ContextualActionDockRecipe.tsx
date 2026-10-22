import { useState, type ReactNode } from "react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent } from "@scudamores/ui/components/ui/card";

export interface ContextualDockAction {
  id: string;
  label: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface ContextualActionDockProps {
  summary?: ReactNode;
  amountMinor?: number;
  currency?: string;
  primaryAction: ContextualDockAction;
  secondaryAction?: ContextualDockAction | null;
  position?: "fixed" | "contained";
  onAction?: (id: string) => void;
}

function money(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amountMinor / 100);
}

export function ContextualActionDockRecipe({
  summary,
  amountMinor,
  currency = "GBP",
  primaryAction,
  secondaryAction,
  position = "fixed",
  onAction,
}: ContextualActionDockProps) {
  const placement = position === "fixed"
    ? "fixed inset-x-4 bottom-[max(2rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-xl"
    : "relative mx-auto w-full max-w-xl";

  return (
    <aside aria-label="Current workflow actions" className={placement} data-pattern="contextual-action-dock">
      <Card className="shadow-lg">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          {(summary || amountMinor !== undefined) && (
            <div className="min-w-0 flex-1" aria-live="polite">
              {summary && <div className="truncate text-sm text-muted-foreground">{summary}</div>}
              {amountMinor !== undefined && <div className="font-semibold tabular-nums">{money(amountMinor, currency)}</div>}
            </div>
          )}
          <div className="grid shrink-0 grid-cols-1 gap-2 sm:flex">
            {secondaryAction && (
              <Button
                type="button"
                variant="outline"
                disabled={secondaryAction.disabled || secondaryAction.loading}
                aria-busy={secondaryAction.loading || undefined}
                onClick={() => onAction?.(secondaryAction.id)}
              >
                {secondaryAction.loading ? "Working…" : secondaryAction.label}
              </Button>
            )}
            <Button
              type="button"
              disabled={primaryAction.disabled || primaryAction.loading}
              aria-busy={primaryAction.loading || undefined}
              onClick={() => onAction?.(primaryAction.id)}
            >
              {primaryAction.loading ? "Working…" : primaryAction.label}
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

export function ContextualActionDockPreview(props: ContextualActionDockProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  return <div className="space-y-2">
    <ContextualActionDockRecipe {...props} onAction={setLastAction} />
    <p className="text-center text-xs text-muted-foreground" aria-live="polite">
      {lastAction ? `Action selected: ${lastAction}` : "Choose an action to preview its event."}
    </p>
  </div>;
}
