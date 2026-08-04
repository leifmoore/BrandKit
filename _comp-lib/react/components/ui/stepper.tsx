import { Button } from './button';

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number | null;
  disabled?: boolean;
}

// Generalizes the -/count/+ icon-button pattern already proven in
// people-popover.tsx (PeoplePopoverContent) into a real shared primitive —
// no generic quantity stepper existed in ui/ before this.
export function Stepper({ value, onChange, min = 0, max = null, disabled = false }: StepperProps) {
  const atMin = value <= min;
  const atMax = max !== null && value >= max;

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        aria-label="Decrease value"
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || atMin}
      >
        -
      </Button>
      <span className="w-6 text-center text-sm tabular-nums">{value}</span>
      <Button
        type="button"
        aria-label="Increase value"
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(max !== null ? Math.min(max, value + 1) : value + 1)}
        disabled={disabled || atMax}
      >
        +
      </Button>
    </div>
  );
}
