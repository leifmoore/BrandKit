import * as React from "react";
import { Card, CardContent, CardHeader } from "@scudamores/ui/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@scudamores/ui/components/ui/table";

export interface BreakdownValue {
  displayValue: string;
  valueMinor?: number;
  currency?: string;
  numericValue?: number;
}

export interface BreakdownColumn {
  id: string;
  label: string;
  align?: "left" | "right";
}

export interface BreakdownItem {
  id: string;
  label: string;
  values: Record<string, BreakdownValue>;
}

export interface BreakdownGroup {
  id: string;
  label: string;
  values: Record<string, BreakdownValue>;
  items: BreakdownItem[];
}

export interface ReportBreakdownTableProps {
  title: string;
  caption: string;
  dimensionLabel: string;
  columns: BreakdownColumn[];
  groups: BreakdownGroup[];
  total?: Record<string, BreakdownValue>;
  visualisation?: React.ReactNode;
  emptyMessage?: string;
}

export function ReportBreakdownTable({
  title,
  caption,
  dimensionLabel,
  columns,
  groups,
  total,
  visualisation,
  emptyMessage = "No breakdown data for the selected filters",
}: ReportBreakdownTableProps) {
  const childCount = groups.reduce((count, group) => count + group.items.length, 0);
  return (
    <div className="space-y-4">
      {visualisation && (
        <section aria-label={`${title} visualisation`} className="rounded-lg border bg-card p-4">
          {visualisation}
        </section>
      )}
      <Card>
        <CardHeader><h3 className="text-sm font-semibold">{title}</h3></CardHeader>
        <CardContent>
          <Table>
            <caption className="sr-only">{caption}</caption>
            <TableHeader>
              <TableRow>
                <TableHead>{dimensionLabel}</TableHead>
                {columns.map((column) => (
                  <TableHead key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {groups.map((group) => (
              <TableBody key={group.id}>
                <TableRow className="bg-muted/50 font-semibold">
                  <TableHead scope="rowgroup" className="font-semibold text-foreground">{group.label}</TableHead>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.align === "right" ? "text-right tabular-nums" : undefined}>
                      {group.values[column.id]?.displayValue}
                    </TableCell>
                  ))}
                </TableRow>
                {group.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableHead scope="row" className="pl-6 font-normal text-foreground">{item.label}</TableHead>
                    {columns.map((column) => (
                      <TableCell key={column.id} className={column.align === "right" ? "text-right tabular-nums" : undefined}>
                        {item.values[column.id]?.displayValue}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            ))}
            {groups.length === 0 && (
              <TableBody><TableRow><TableCell colSpan={columns.length + 1} className="py-8 text-center text-muted-foreground">{emptyMessage}</TableCell></TableRow></TableBody>
            )}
            {groups.length > 0 && total && (
              <TableFooter>
                <TableRow>
                  <TableHead scope="row" className="text-foreground">Total ({childCount})</TableHead>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.align === "right" ? "text-right tabular-nums" : undefined}>
                      {total[column.id]?.displayValue}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export function ReportBreakdownTablePreview(props: Omit<ReportBreakdownTableProps, "visualisation">) {
  return <ReportBreakdownTable {...props} />;
}
