import { useState } from "react";
import { Check, ChevronLeft } from "lucide-react";

export interface BookingProgressStep {
  id: string;
  label: string;
}

export interface BookingProgressIndicatorProps {
  steps: BookingProgressStep[];
  currentStepId: string;
  onBack?: () => void;
  onStepSelect?: (stepId: string) => void;
  ariaLabel?: string;
}

export function BookingProgressIndicator({
  steps,
  currentStepId,
  onBack,
  onStepSelect,
  ariaLabel = "Booking progress",
}: BookingProgressIndicatorProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentStepId));

  return (
    <nav aria-label={ariaLabel} className="w-full py-2">
      <div className="relative mx-auto max-w-md">
        {onBack && currentIndex > 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 top-3 z-10 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Go back one step"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
        ) : null}

        <ol className="flex items-start justify-center gap-8 sm:gap-16">
          {steps.map((step, index) => {
            const complete = index < currentIndex;
            const current = index === currentIndex;
            const canSelect = complete && Boolean(onStepSelect);
            const marker = (
              <>
                <span
                  className={`flex size-10 items-center justify-center rounded-full border-2 transition-colors ${
                    complete || current
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                  aria-hidden="true"
                >
                  {complete ? <Check className="size-5" /> : index + 1}
                </span>
                <span className="mt-2 hidden max-w-24 text-center text-xs sm:block">{step.label}</span>
              </>
            );

            return (
              <li key={step.id} className="flex flex-col items-center">
                {canSelect ? (
                  <button
                    type="button"
                    onClick={() => onStepSelect?.(step.id)}
                    className="flex flex-col items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Return to ${step.label}`}
                  >
                    {marker}
                  </button>
                ) : (
                  <span
                    className="flex flex-col items-center"
                    aria-current={current ? "step" : undefined}
                    aria-label={`${step.label}, ${current ? "current" : complete ? "complete" : "upcoming"}`}
                  >
                    {marker}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export interface BookingProgressIndicatorPreviewProps
  extends Omit<BookingProgressIndicatorProps, "currentStepId" | "onBack" | "onStepSelect"> {
  currentStepId: string;
  showBack?: boolean;
}

export function BookingProgressIndicatorPreview({
  steps,
  currentStepId: initialStepId,
  showBack = true,
  ...props
}: BookingProgressIndicatorPreviewProps) {
  const [currentStepId, setCurrentStepId] = useState(initialStepId);
  const currentIndex = Math.max(0, steps.findIndex((step) => step.id === currentStepId));

  return (
    <BookingProgressIndicator
      {...props}
      steps={steps}
      currentStepId={currentStepId}
      onStepSelect={setCurrentStepId}
      onBack={showBack && currentIndex > 0 ? () => setCurrentStepId(steps[currentIndex - 1]?.id ?? currentStepId) : undefined}
    />
  );
}
