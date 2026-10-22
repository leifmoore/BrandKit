import { format, parseISO } from "date-fns";
import { useId, useState } from "react";
import { CalendarDays, ChevronDown, Users } from "lucide-react";
import { Button } from "@scudamores/ui/components/ui/button";
import { Calendar } from "@scudamores/ui/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Checkbox } from "@scudamores/ui/components/ui/checkbox";
import { Label } from "@scudamores/ui/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@scudamores/ui/components/ui/popover";
import { Stepper } from "@scudamores/ui/components/ui/stepper";

export interface BookingPartyCategory {
  id: string;
  label: string;
  description?: string;
  count: number;
  min?: number;
  max?: number | null;
}

export interface BookingCriteriaPanelProps {
  date: string | null;
  minimumDate?: string;
  party: BookingPartyCategory[];
  accessibilityAccess: boolean;
  onDateChange: (date: string | null) => void;
  onPartyChange: (categoryId: string, count: number) => void;
  onAccessibilityChange: (required: boolean) => void;
  title?: string;
  description?: string;
}

function asLocalIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function BookingCriteriaPanel({
  date,
  minimumDate,
  party,
  accessibilityAccess,
  onDateChange,
  onPartyChange,
  onAccessibilityChange,
  title = "Plan your visit",
  description = "Choose a date and tell us who is coming.",
}: BookingCriteriaPanelProps) {
  const dateTriggerId = useId();
  const partyTriggerId = useId();
  const accessibilityId = useId();
  const accessibilityDescriptionId = useId();
  const totalPeople = party.reduce((total, category) => total + category.count, 0);
  const selectedDate = date ? parseISO(date) : undefined;
  const earliestDate = minimumDate ? parseISO(minimumDate) : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={dateTriggerId}>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id={dateTriggerId} variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarDays aria-hidden="true" className="size-4" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(nextDate) => onDateChange(nextDate ? asLocalIsoDate(nextDate) : null)}
                disabled={earliestDate ? { before: earliestDate } : undefined}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor={partyTriggerId}>Who</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button id={partyTriggerId} variant="outline" className="w-full justify-between font-normal">
                <span className="flex items-center gap-2">
                  <Users aria-hidden="true" className="size-4" />
                  {totalPeople} {totalPeople === 1 ? "person" : "people"}
                </span>
                <ChevronDown aria-hidden="true" className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-4">
              <div className="space-y-4" aria-label="Party composition">
                {party.map((category) => (
                  <div key={category.id} className="flex items-center justify-between gap-4">
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{category.label}</span>
                      {category.description ? <span className="block text-xs text-muted-foreground">{category.description}</span> : null}
                    </span>
                    <Stepper
                      value={category.count}
                      min={category.min ?? 0}
                      max={category.max ?? null}
                      onChange={(count) => onPartyChange(category.id, count)}
                    />
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex items-start gap-2 text-sm">
                    <Checkbox
                      id={accessibilityId}
                      checked={accessibilityAccess}
                      onCheckedChange={(checked) => onAccessibilityChange(checked === true)}
                      aria-describedby={accessibilityDescriptionId}
                    />
                    <span>
                      <Label htmlFor={accessibilityId}>Accessibility access required</Label>
                      <span id={accessibilityDescriptionId} className="block text-xs text-muted-foreground">
                        Let the host adapt available products and arrival guidance.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}

export type BookingCriteriaPanelPreviewProps = Omit<
  BookingCriteriaPanelProps,
  "onDateChange" | "onPartyChange" | "onAccessibilityChange"
>;

export function BookingCriteriaPanelPreview({
  date: initialDate,
  party: initialParty,
  accessibilityAccess: initialAccessibility,
  ...props
}: BookingCriteriaPanelPreviewProps) {
  const [date, setDate] = useState(initialDate);
  const [party, setParty] = useState(initialParty);
  const [accessibilityAccess, setAccessibilityAccess] = useState(initialAccessibility);

  return (
    <BookingCriteriaPanel
      {...props}
      date={date}
      party={party}
      accessibilityAccess={accessibilityAccess}
      onDateChange={setDate}
      onPartyChange={(categoryId, count) => setParty((current) => current.map((category) => category.id === categoryId ? { ...category, count } : category))}
      onAccessibilityChange={setAccessibilityAccess}
    />
  );
}
