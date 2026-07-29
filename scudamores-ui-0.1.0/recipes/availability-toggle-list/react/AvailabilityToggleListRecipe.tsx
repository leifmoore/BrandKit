import { Badge } from "../../../react/components/ui/badge";
import { Button } from "../../../react/components/ui/button";
import { Switch } from "../../../react/components/ui/switch";

export interface AvailabilityItem {
  id: string;
  label: string;
  sublabel?: string;
  available: boolean;
  lockedReason?: string;
}

export interface AvailabilityToggleListRecipeProps {
  items: AvailabilityItem[];
  defaultId: string | null;
  onToggle: (id: string, available: boolean) => void;
  onSetDefault: (id: string) => void;
  emptyMessage?: string;
}

export function AvailabilityToggleListRecipe({ items, defaultId, onToggle, onSetDefault, emptyMessage = "Nothing to configure yet." }: AvailabilityToggleListRecipeProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return <div className="space-y-2">{items.map((item) => {
    const isDefault = item.id === defaultId;
    return <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
      <span className="min-w-0"><span className="block truncate text-sm font-medium">{item.label}</span>{item.sublabel && <span className="block truncate text-xs text-muted-foreground">{item.sublabel}</span>}</span>
      <span className="flex shrink-0 items-center gap-3">
        {isDefault ? <Badge variant="secondary">Default</Badge> : item.lockedReason ? <span className="max-w-56 text-right text-xs italic text-muted-foreground">{item.lockedReason}</span> : <Button variant="ghost" size="sm" disabled={!item.available} onClick={() => onSetDefault(item.id)}>Set default</Button>}
        <span className="flex items-center gap-2">
          <span className="w-20 text-right text-xs text-muted-foreground">{item.available ? "Available" : "Unavailable"}</span>
          <Switch aria-label={`${item.label} availability`} checked={item.available} disabled={isDefault && item.available} onCheckedChange={(checked) => onToggle(item.id, checked)} />
        </span>
      </span>
    </div>;
  })}</div>;
}
