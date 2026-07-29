"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";

export type AspectRatioProps = React.ComponentProps<
  typeof AspectRatioPrimitive.Root
>;

function AspectRatio({
  ...props
}: AspectRatioProps) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
