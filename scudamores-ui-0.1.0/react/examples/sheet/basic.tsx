"use client";

import { Button } from "../../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

export function SheetExample() {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open panel</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Refine the records shown in this view.</SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm">Filter controls</div>
      </SheetContent>
    </Sheet>
  );
}
