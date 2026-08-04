"use client";

import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function SelectExample() {
  return (
    <div className="grid w-full max-w-xs gap-2">
      <Label htmlFor="status-select">Status</Label>
      <Select defaultValue="active">
        <SelectTrigger id="status-select"><SelectValue placeholder="Choose a status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
