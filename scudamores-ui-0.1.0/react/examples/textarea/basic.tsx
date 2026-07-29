import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export function TextareaExample() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea id="notes" placeholder="Add internal notes…" />
    </div>
  );
}
