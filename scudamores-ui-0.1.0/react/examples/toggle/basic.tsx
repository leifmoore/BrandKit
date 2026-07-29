"use client";

import { Bold } from "lucide-react";

import { Toggle } from "../../components/ui/toggle";

export function ToggleExample() {
  return <Toggle aria-label="Toggle bold"><Bold /> Bold</Toggle>;
}
