import { Badge } from "../../components/ui/badge";

export function BadgeExample() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge dot>Active</Badge>
      <Badge variant="success" dot>Complete</Badge>
      <Badge variant="warning" dot>Pending</Badge>
      <Badge variant="destructive" dot>Failed</Badge>
    </div>
  );
}
