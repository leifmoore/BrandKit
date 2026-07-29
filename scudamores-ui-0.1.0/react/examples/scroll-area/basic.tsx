import { ScrollArea } from "../../components/ui/scroll-area";

export function ScrollAreaExample() {
  return (
    <ScrollArea className="h-48 w-72 rounded-lg border p-4">
      {Array.from({ length: 18 }, (_, index) => (
        <div key={index} className="border-b py-2 text-sm last:border-0">Activity item {index + 1}</div>
      ))}
    </ScrollArea>
  );
}
