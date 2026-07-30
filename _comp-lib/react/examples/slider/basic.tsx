"use client";

import * as React from "react";

import { Slider } from "../../components/ui/slider";

export function SliderExample() {
  const [value, setValue] = React.useState([40]);

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex justify-between text-sm"><span>Volume</span><span>{value[0]}%</span></div>
      <Slider value={value} onValueChange={setValue} aria-label="Volume" />
    </div>
  );
}
