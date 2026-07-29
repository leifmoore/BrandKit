import { useId } from "react";
import { Info } from "lucide-react";
import { Button } from "../../../react/components/ui/button";
import { Label } from "../../../react/components/ui/label";
import { Switch } from "../../../react/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../react/components/ui/tooltip";

export interface PeopleCounts { adults: number; children: number; infants: number; pets: number }
const labels: Record<keyof PeopleCounts, string> = { adults: "Adults", children: "Children", infants: "Infants", pets: "Pets" };
export function PeoplePopoverContentRecipe({ people, onPeopleChange, accessibilityAccess, onAccessibilityChange }: { people: PeopleCounts; onPeopleChange: (people: PeopleCounts) => void; accessibilityAccess: boolean; onAccessibilityChange: (value: boolean) => void }) {
  const accessibilityId = useId();
  const change = (key: keyof PeopleCounts, delta: number) => onPeopleChange({ ...people, [key]: Math.max(key === "adults" ? 1 : 0, people[key] + delta) });
  return <div className="space-y-4"><div><h3 className="text-base font-semibold">People</h3><p className="text-sm text-muted-foreground">Select the people included in this booking.</p></div><div className="space-y-3">{(Object.keys(labels) as Array<keyof PeopleCounts>).map((key) => <div key={key} className="flex items-center justify-between"><span className="text-sm font-medium">{labels[key]}</span><span className="flex items-center gap-3"><Button variant="outline" size="icon" className="size-8" aria-label={`Remove ${labels[key].toLowerCase()}`} disabled={people[key] <= (key === "adults" ? 1 : 0)} onClick={() => change(key, -1)}>-</Button><span className="w-8 text-center text-sm">{people[key]}</span><Button variant="outline" size="icon" className="size-8" aria-label={`Add ${labels[key].toLowerCase()}`} onClick={() => change(key, 1)}>+</Button></span></div>)}</div><div className="flex items-center justify-between border-t pt-3"><span className="flex items-center gap-2"><Label htmlFor={accessibilityId}>Accessibility access</Label><TooltipProvider><Tooltip><TooltipTrigger asChild><button type="button" aria-label="About accessibility access"><Info aria-hidden="true" className="size-4 text-muted-foreground" /></button></TooltipTrigger><TooltipContent>Limit results to step-free or wheelchair-accessible options.</TooltipContent></Tooltip></TooltipProvider></span><Switch id={accessibilityId} checked={accessibilityAccess} onCheckedChange={onAccessibilityChange} /></div></div>;
}
