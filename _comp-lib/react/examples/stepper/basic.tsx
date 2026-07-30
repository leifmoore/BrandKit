"use client";

import * as React from "react";

import { Stepper } from "../../components/ui/stepper";

export function StepperExample() {
  const [value, setValue] = React.useState(2);

  return <Stepper value={value} onChange={setValue} min={0} max={8} />;
}
