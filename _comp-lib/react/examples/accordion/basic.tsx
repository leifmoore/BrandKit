"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

export function AccordionExample() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="installation">
        <AccordionTrigger>How do I install a component?</AccordionTrigger>
        <AccordionContent>Copy its source and install the dependencies listed in the catalogue.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="themes">
        <AccordionTrigger>Does it support dark mode?</AccordionTrigger>
        <AccordionContent>Yes. Apply the dark class to the host theme scope.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
