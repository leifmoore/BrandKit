"use client";

import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Toaster } from "../../components/ui/sonner";

export function ToastExample() {
  return (
    <>
      <Button onClick={() => toast.success("Changes saved")}>Show toast</Button>
      <Toaster position="bottom-right" />
    </>
  );
}
