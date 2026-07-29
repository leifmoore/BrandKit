"use client";

import { Info } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export function TooltipExample() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild><Button size="icon" variant="outline" aria-label="More information"><Info /></Button></TooltipTrigger>
        <TooltipContent>More information</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
