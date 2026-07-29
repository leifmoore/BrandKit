import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export function AvatarExample() {
  return (
    <Avatar>
      <AvatarImage
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23e5e7eb'/%3E%3Ccircle cx='48' cy='38' r='18' fill='%236b7280'/%3E%3Cpath d='M16 94c3-23 16-34 32-34s29 11 32 34' fill='%236b7280'/%3E%3C/svg%3E"
        alt="Alex Morgan"
      />
      <AvatarFallback>AM</AvatarFallback>
    </Avatar>
  );
}
