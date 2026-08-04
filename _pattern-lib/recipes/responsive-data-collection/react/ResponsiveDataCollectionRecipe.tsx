"use client";

import * as React from "react";
import { Eye } from "lucide-react";

import { Badge, type BadgeProps } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent } from "@scudamores/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@scudamores/ui/components/ui/table";

export interface ResponsiveCollectionColumn {
  id: string;
  label: string;
  align?: "left" | "right";
  hideOnMobile?: boolean;
}

export interface ResponsiveCollectionCell {
  text: string;
  detail?: string;
  mono?: boolean;
  badgeVariant?: BadgeProps["variant"];
}

export interface ResponsiveCollectionItem {
  id: string;
  cells: Record<string, ResponsiveCollectionCell>;
}

export interface ResponsiveDataCollectionRecipeProps {
  caption: string;
  columns: readonly ResponsiveCollectionColumn[];
  items: readonly ResponsiveCollectionItem[];
  primaryColumnId: string;
  secondaryColumnId?: string;
  actionLabel?: string;
  onActivate?: (id: string) => void;
  emptyMessage?: string;
}

function CellValue({ cell }: { cell?: ResponsiveCollectionCell }) {
  if (!cell) return <span aria-hidden="true">—</span>;

  if (cell.badgeVariant) {
    return <Badge variant={cell.badgeVariant}>{cell.text}</Badge>;
  }

  return (
    <span className={cell.mono ? "font-mono text-sm" : undefined}>
      <span className="block">{cell.text}</span>
      {cell.detail ? <span className="block text-xs text-muted-foreground">{cell.detail}</span> : null}
    </span>
  );
}

/**
 * One dataset rendered as a semantic table from `sm` upward and as readable
 * cards below it. The host provides already sorted/paginated neutral rows.
 */
export function ResponsiveDataCollectionRecipe({
  caption,
  columns,
  items,
  primaryColumnId,
  secondaryColumnId,
  actionLabel = "View",
  onActivate,
  emptyMessage = "No records found.",
}: ResponsiveDataCollectionRecipeProps) {
  if (items.length === 0) {
    return <p className="rounded-lg border bg-card px-6 py-10 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border sm:block">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.align === "right" ? "text-right" : undefined}>{column.label}</TableHead>
              ))}
              {onActivate ? <TableHead><span className="sr-only">Actions</span></TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                    <CellValue cell={item.cells[column.id]} />
                  </TableCell>
                ))}
                {onActivate ? (
                  <TableCell className="text-right">
                    <Button data-contrast-action variant="outline" size="sm" style={{ color: "var(--foreground)" }} onClick={() => onActivate(item.id)} aria-label={`${actionLabel} ${item.cells[primaryColumnId]?.text ?? item.id}`}>
                      <Eye aria-hidden="true" />{actionLabel}
                    </Button>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 sm:hidden" aria-label={caption}>
        {items.map((item) => {
          const primary = item.cells[primaryColumnId];
          const secondary = secondaryColumnId ? item.cells[secondaryColumnId] : undefined;
          const detailColumns = columns.filter((column) =>
            !column.hideOnMobile && column.id !== primaryColumnId && column.id !== secondaryColumnId,
          );

          return (
            <article key={item.id}>
              <Card>
                <CardContent className="space-y-4 p-4">
                  <header>
                    <h3 className="font-medium"><CellValue cell={primary} /></h3>
                    {secondary ? <div className="mt-1 text-sm text-muted-foreground"><CellValue cell={secondary} /></div> : null}
                  </header>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {detailColumns.map((column) => (
                      <div key={column.id} className={column.align === "right" ? "text-right" : undefined}>
                        <dt className="text-xs text-muted-foreground">{column.label}</dt>
                        <dd className="mt-0.5"><CellValue cell={item.cells[column.id]} /></dd>
                      </div>
                    ))}
                  </dl>
                  {onActivate ? (
                    <Button data-contrast-action variant="outline" className="w-full" style={{ color: "var(--foreground)" }} onClick={() => onActivate(item.id)}>
                      <Eye aria-hidden="true" />{actionLabel}
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </article>
          );
        })}
      </div>
    </>
  );
}

export type ResponsiveDataCollectionFixture = Omit<ResponsiveDataCollectionRecipeProps, "onActivate">;

/** Fixture adapter that demonstrates a host-owned row action. */
export function ResponsiveDataCollectionPreview(fixture: ResponsiveDataCollectionFixture) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  return (
    <div className="space-y-3">
      <ResponsiveDataCollectionRecipe {...fixture} onActivate={setActiveId} />
      <p className="text-xs text-muted-foreground" aria-live="polite">{activeId ? `Activated ${activeId}` : "Choose a row action to preview the callback."}</p>
    </div>
  );
}
