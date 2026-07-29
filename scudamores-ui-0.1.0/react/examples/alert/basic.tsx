"use client";

import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";

export function AlertExample() {
  return (
    <Alert className="max-w-lg">
      <CircleAlert />
      <AlertTitle>Booking updated</AlertTitle>
      <AlertDescription>The new collection time has been saved.</AlertDescription>
    </Alert>
  );
}
