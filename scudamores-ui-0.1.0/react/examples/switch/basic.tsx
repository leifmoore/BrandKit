"use client";

import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

export function SwitchExample() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="availability" defaultChecked />
      <Label htmlFor="availability">Available for bookings</Label>
    </div>
  );
}
