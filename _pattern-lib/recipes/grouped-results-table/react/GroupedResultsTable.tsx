import * as React from "react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Card, CardContent, CardHeader } from "@scudamores/ui/components/ui/card";
import { Label } from "@scudamores/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@scudamores/ui/components/ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@scudamores/ui/components/ui/table";

export type ResultCellTone = "default" | "muted" | "destructive" | "badge";

export interface ResultCell {
  displayValue: string;
  valueMinor?: number;
  currency?: string;
  numericValue?: number;
  tone?: ResultCellTone;
}

export interface ResultColumn {
  id: string;
  label: string;
  align?: "left" | "right";
}

export interface ResultRow {
  id: string;
  cells: Record<string, ResultCell>;
}

export interface ReportResultGroup {
  id: string;
  label?: string;
  rows: ResultRow[];
  subtotal?: Record<string, ResultCell>;
}

export interface GroupOption {
  id: string;
  label: string;
}

export interface GroupedResultsTableProps {
  title: string;
  caption: string;
  columns: ResultColumn[];
  groups: ReportResultGroup[];
  groupBy: string;
  groupOptions: GroupOption[];
  grandTotal?: Record<string, ResultCell>;
  emptyMessage?: string;
  onGroupByChange: (value: string) => void;
}

function CellValue({ cell }: { cell?: ResultCell }) {
  if (!cell) return null;
  if (cell.tone === "badge") return <Badge variant="outline" style={{ color: "var(--foreground)" }}>{cell.displayValue}</Badge>;
  return (
    <span className={cell.tone === "destructive" ? "text-destructive" : cell.tone === "muted" ? "text-muted-foreground" : undefined}>
      {cell.displayValue}
    </span>
  );
}

export function GroupedResultsTable({
  title,
  caption,
  columns,
  groups,
  groupBy,
  groupOptions,
  grandTotal,
  emptyMessage = "No results in the selected range",
  onGroupByChange,
}: GroupedResultsTableProps) {
  const rowCount = groups.reduce((count, group) => count + group.rows.length, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="report-group-by" className="text-xs text-muted-foreground">Group by</Label>
          <Select value={groupBy} onValueChange={onGroupByChange}>
            <SelectTrigger id="report-group-by" className="h-7 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groupOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {groups.map((group) => (
            <TableBody key={group.id}>
              {group.label && (
                <TableRow className="bg-muted/50">
                  <TableHead scope="rowgroup" colSpan={columns.length} className="py-1.5 font-semibold text-foreground">
                    {group.label} <span className="font-normal text-muted-foreground">({group.rows.length})</span>
                  </TableHead>
                </TableRow>
              )}
              {group.rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column, index) => index === 0 ? (
                    <TableHead key={column.id} scope="row" className="font-medium text-foreground">
                      <CellValue cell={row.cells[column.id]} />
                    </TableHead>
                  ) : (
                    <TableCell key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                      <CellValue cell={row.cells[column.id]} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {group.label && group.subtotal && (
                <TableRow className="bg-muted/30 font-semibold">
                  {columns.map((column, index) => index === 0 ? (
                    <TableHead key={column.id} scope="row" className="font-semibold text-foreground">Subtotal ({group.rows.length})</TableHead>
                  ) : (
                    <TableCell key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                      <CellValue cell={group.subtotal?.[column.id]} />
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          ))}
          {rowCount === 0 && (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
          {rowCount > 0 && grandTotal && (
            <TableFooter>
              <TableRow>
                {columns.map((column, index) => index === 0 ? (
                  <TableHead key={column.id} scope="row" className="font-semibold text-foreground">Grand total ({rowCount})</TableHead>
                ) : (
                  <TableCell key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                    <CellValue cell={grandTotal[column.id]} />
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

export interface GroupedResultsTablePreviewProps extends Omit<GroupedResultsTableProps, "groups" | "groupBy" | "onGroupByChange"> {
  initialGroupBy: string;
  views: Record<string, ReportResultGroup[]>;
}

export function GroupedResultsTablePreview({ initialGroupBy, views, ...props }: GroupedResultsTablePreviewProps) {
  const [groupBy, setGroupBy] = React.useState(initialGroupBy);
  return (
    <GroupedResultsTable
      {...props}
      groupBy={groupBy}
      groups={views[groupBy] ?? []}
      onGroupByChange={setGroupBy}
    />
  );
}
