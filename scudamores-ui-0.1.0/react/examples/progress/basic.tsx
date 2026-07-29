import { Progress } from "../../components/ui/progress";

export function ProgressExample() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex justify-between text-sm"><span>Importing</span><span>68%</span></div>
      <Progress value={68} aria-label="Import progress" />
    </div>
  );
}
