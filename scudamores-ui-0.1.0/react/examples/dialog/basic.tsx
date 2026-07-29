"use client";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit booking</DialogTitle>
          <DialogDescription>Review the details before saving.</DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">Dialog content</div>
        <DialogFooter><Button>Save changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
