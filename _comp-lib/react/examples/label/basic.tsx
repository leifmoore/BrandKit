import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function LabelExample() {
  return (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="customer-name">Customer name</Label>
      <Input id="customer-name" />
    </div>
  );
}
