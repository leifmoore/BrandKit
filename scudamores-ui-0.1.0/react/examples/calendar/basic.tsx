"use client";

import * as React from "react";

import { Calendar } from "../../components/ui/calendar";

export function CalendarExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      showYearMonthDropdowns
      className="rounded-lg border"
    />
  );
}
