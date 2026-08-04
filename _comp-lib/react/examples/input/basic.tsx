import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function InputExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="reference">Reference</Label>
      <Input id="reference" placeholder="Enter a reference" />
    </div>
  );
}
