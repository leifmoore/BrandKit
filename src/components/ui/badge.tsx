import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-status-danger/15 text-status-danger-foreground [a&]:hover:bg-status-danger/20",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-status-success/15 text-status-success-foreground [a&]:hover:bg-status-success/20",
        warning:
          "border-transparent bg-status-warning/15 text-status-warning-foreground [a&]:hover:bg-status-warning/20",
        tint: "border-transparent ring-1 ring-inset",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Dot color per variant — status variants use the base status hue (not the
// tinted -foreground text color) per tokens.md's "base hue: dots, rings, tint
// derivations" convention. `tint` has no baked-in hue (caller supplies it via
// className), so its dot inherits text color instead.
const badgeDotVariants = cva("size-2 shrink-0 rounded-full", {
  variants: {
    variant: {
      default: "bg-primary-foreground",
      secondary: "bg-secondary-foreground",
      destructive: "bg-status-danger",
      outline: "bg-foreground",
      success: "bg-status-success",
      warning: "bg-status-warning",
      tint: "bg-current",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    dot?: boolean;
  };

function Badge({
  className,
  variant,
  asChild = false,
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && !asChild ? (
        <>
          <span aria-hidden="true" className={cn(badgeDotVariants({ variant }))} />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
