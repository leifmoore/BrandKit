import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export function TableExample() {
  return (
    <Table>
      <TableCaption>Recent bookings</TableCaption>
      <TableHeader><TableRow><TableHead>Reference</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
      <TableBody>
        <TableRow><TableCell>BK-1024</TableCell><TableCell>Confirmed</TableCell></TableRow>
        <TableRow><TableCell>BK-1025</TableCell><TableCell>Pending</TableCell></TableRow>
      </TableBody>
    </Table>
  );
}
