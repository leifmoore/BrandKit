"use client";

import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";

export function CheckboxExample() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="email-updates" />
      <Label htmlFor="email-updates">Email me booking updates</Label>
    </div>
  );
}
