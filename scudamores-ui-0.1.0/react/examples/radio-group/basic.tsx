"use client";

import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";

export function RadioGroupExample() {
  return (
    <RadioGroup defaultValue="standard" aria-label="Delivery speed">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="standard" value="standard" />
        <Label htmlFor="standard">Standard</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="express" value="express" />
        <Label htmlFor="express">Express</Label>
      </div>
    </RadioGroup>
  );
}
