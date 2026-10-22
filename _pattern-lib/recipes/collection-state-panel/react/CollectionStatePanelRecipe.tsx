"use client";

import * as React from "react";
import { AlertCircle, Inbox, LockKeyhole, RotateCcw } from "lucide-react";

import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent } from "@scudamores/ui/components/ui/card";
import { Skeleton } from "@scudamores/ui/components/ui/skeleton";

export type CollectionState = "loading" | "empty" | "error" | "restricted";

export interface CollectionStatePanelRecipeProps {
  state: CollectionState;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const defaults: Record<Exclude<CollectionState, "loading">, { title: string; description: string }> = {
  empty: { title: "Nothing here yet", description: "Records will appear here when they are available." },
  error: { title: "We could not load this collection", description: "Try again or contact support if the problem continues." },
  restricted: { title: "Access restricted", description: "Your account does not have access to this information." },
};

/** Shared loading, empty, error, and restricted treatment for collection surfaces. */
export function CollectionStatePanelRecipe({ state, title, description, actionLabel, onAction }: CollectionStatePanelRecipeProps) {
  if (state === "loading") {
    return (
      <Card aria-busy="true" aria-label={title ?? "Loading collection"}>
        <CardContent className="space-y-3 p-6" role="status">
          <span className="sr-only">{description ?? "Loading…"}</span>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="grid gap-3 pt-3 sm:grid-cols-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const copy = defaults[state];
  const Icon = state === "empty" ? Inbox : state === "restricted" ? LockKeyhole : AlertCircle;

  return (
    <Card>
      <CardContent
        className="flex flex-col items-center px-6 py-10 text-center"
        role={state === "error" ? "alert" : "status"}
      >
        <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h3 className="font-semibold">{title ?? copy.title}</h3>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">{description ?? copy.description}</p>
        {actionLabel && onAction ? (
          <Button variant={state === "error" ? "default" : "outline"} className="mt-5" onClick={onAction}>
            {state === "error" ? <RotateCcw aria-hidden="true" /> : null}
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

/** Fixture adapter with a local action acknowledgement. */
export function CollectionStatePanelPreview(fixture: Omit<CollectionStatePanelRecipeProps, "onAction">) {
  const [acted, setActed] = React.useState(false);
  return (
    <div className="space-y-3">
      <CollectionStatePanelRecipe {...fixture} onAction={fixture.actionLabel ? () => setActed(true) : undefined} />
      {acted ? <p className="text-center text-xs text-muted-foreground" aria-live="polite">Action callback received.</p> : null}
    </div>
  );
}
