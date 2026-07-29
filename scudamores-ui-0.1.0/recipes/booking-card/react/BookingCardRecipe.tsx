import { Eye } from "lucide-react";
import { Badge } from "../../../react/components/ui/badge";
import { Button } from "../../../react/components/ui/button";
import { Card, CardContent } from "../../../react/components/ui/card";

export type BookingExampleStatus = "Active" | "Cancelled" | "Rescheduled";
export interface BookingCardExample { id: string; customerName: string; customerEmail: string; status: BookingExampleStatus }
const variants = { Active: "success", Cancelled: "destructive", Rescheduled: "warning" } as const;

export function BookingCardRecipe({ booking, onView }: { booking: BookingCardExample; onView: (booking: BookingCardExample) => void }) {
  return <Card><CardContent className="flex items-center justify-between gap-3 p-4">
    <span className="min-w-0"><span className="block truncate font-medium">{booking.customerName}</span><span className="block truncate text-sm text-muted-foreground">{booking.customerEmail}</span><span className="mt-1 block font-mono text-xs text-muted-foreground">{booking.id}</span></span>
    <span className="flex shrink-0 flex-col items-end gap-2"><Badge variant={variants[booking.status]}>{booking.status}</Badge><Button variant="outline" size="sm" onClick={() => onView(booking)}><Eye aria-hidden="true" className="size-4" />View</Button></span>
  </CardContent></Card>;
}
