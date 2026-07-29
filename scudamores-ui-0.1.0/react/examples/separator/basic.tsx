import { Separator } from "../../components/ui/separator";

export function SeparatorExample() {
  return (
    <div className="w-full max-w-sm">
      <p className="font-medium">Account settings</p>
      <p className="text-sm text-muted-foreground">Manage preferences and notifications.</p>
      <Separator className="my-4" />
      <p className="text-sm">Profile · Security · Billing</p>
    </div>
  );
}
