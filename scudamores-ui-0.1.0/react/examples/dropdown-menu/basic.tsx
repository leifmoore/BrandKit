"use client";

import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function DropdownMenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="outline">View options</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>Show completed</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Compact rows</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
