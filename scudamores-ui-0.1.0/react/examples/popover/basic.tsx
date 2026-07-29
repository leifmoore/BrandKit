"use client";

import { Button } from "../../components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

export function PopoverExample() {
  return (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-72">
        <p className="font-medium">Collection window</p>
        <p className="mt-1 text-sm text-muted-foreground">Tomorrow, 09:00–12:00</p>
      </PopoverContent>
    </Popover>
  );
}
