import { Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../react/components/ui/card";

export interface QuickLaunchItem {
  id: string;
  name: string;
  subtitle: string;
}

export interface QuickLaunchRecipeProps {
  items: QuickLaunchItem[];
  onLaunch: (item: QuickLaunchItem) => void;
}

const tints = ["bg-info/10 ring-info/20", "bg-status-success/10 ring-status-success/20", "bg-status-warning/10 ring-status-warning/20"];

export function QuickLaunchRecipe({ items, onLaunch }: QuickLaunchRecipeProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick launch</CardTitle>
        <CardDescription>Open a frequently used sales channel.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onLaunch(item)}
            className={`flex items-center justify-between gap-3 rounded-xl border border-transparent p-4 text-left ring-1 ring-inset transition-shadow hover:shadow-md ${tints[index % tints.length]}`}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{item.name}</span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">{item.subtitle}</span>
            </span>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/60">
              <Rocket className="size-4" aria-hidden="true" />
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
