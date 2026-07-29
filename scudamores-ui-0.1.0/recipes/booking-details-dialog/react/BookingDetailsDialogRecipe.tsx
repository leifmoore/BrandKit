import { Badge } from "../../../react/components/ui/badge";
import { Button } from "../../../react/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../react/components/ui/dialog";

export type BookingDetailsStatus = "Active" | "Cancelled" | "Rescheduled";

export interface BookingDetailsExample {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  date: string;
  time: string;
  items: string;
  total: string;
}

export interface BookingDetailsDialogRecipeProps {
  booking: BookingDetailsExample;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

const statusVariants = { Active: "success", Cancelled: "destructive", Rescheduled: "warning" } as const;

export function BookingDetailsDialogRecipe({ booking, open, onOpenChange, onReschedule, onCancel }: BookingDetailsDialogRecipeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking details</DialogTitle>
          <DialogDescription className="sr-only">Details and available actions for booking {booking.id}.</DialogDescription>
        </DialogHeader>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Reference</dt><dd className="font-mono font-semibold">{booking.id}</dd></div>
          <div><dt className="text-muted-foreground">Status</dt><dd><Badge variant={statusVariants[booking.status as BookingDetailsStatus] ?? "secondary"}>{booking.status}</Badge></dd></div>
          <div><dt className="text-muted-foreground">Customer</dt><dd>{booking.customerName}<br />{booking.customerEmail}</dd></div>
          <div><dt className="text-muted-foreground">Date and time</dt><dd>{booking.date}<br />{booking.time}</dd></div>
          <div className="col-span-2"><dt className="text-muted-foreground">Items</dt><dd>{booking.items}</dd></div>
          <div><dt className="text-muted-foreground">Total</dt><dd className="font-semibold">{booking.total}</dd></div>
        </dl>
        <DialogFooter>
          <Button variant="outline" disabled={!onReschedule || booking.status !== "Active"} onClick={onReschedule}>Reschedule</Button>
          <Button variant="destructive" disabled={!onCancel || booking.status === "Cancelled"} onClick={onCancel}>Cancel booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
