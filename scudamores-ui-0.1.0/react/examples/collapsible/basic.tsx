"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";

export function CollapsibleExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-80 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Advanced options</span>
        <CollapsibleTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Toggle advanced options"><ChevronsUpDown /></Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="rounded-lg border p-3 text-sm text-muted-foreground">
        Additional configuration appears here.
      </CollapsibleContent>
    </Collapsible>
  );
}
