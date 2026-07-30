"use client";

import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";

export function ToggleGroupExample() {
  return (
    <ToggleGroup type="single" defaultValue="week" variant="outline" aria-label="Date range">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
    </ToggleGroup>
  );
}
