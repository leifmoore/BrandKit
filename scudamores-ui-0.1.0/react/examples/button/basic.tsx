import { ArrowRight } from "lucide-react";

import { Button } from "../../components/ui/button";

export function ButtonExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>Continue <ArrowRight /></Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
