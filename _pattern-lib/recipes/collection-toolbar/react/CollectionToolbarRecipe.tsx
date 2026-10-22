"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Grid2X2, List, RotateCcw, Search } from "lucide-react";

import { Button } from "@scudamores/ui/components/ui/button";
import { Input } from "@scudamores/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@scudamores/ui/components/ui/select";

export interface CollectionToolbarOption {
  value: string;
  label: string;
}

export interface CollectionToolbarFilter {
  id: string;
  label: string;
  value: string;
  options: readonly CollectionToolbarOption[];
}

export interface CollectionToolbarSort {
  value: string;
  direction: "asc" | "desc";
  options: readonly CollectionToolbarOption[];
}

export interface CollectionToolbarRecipeProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters?: readonly CollectionToolbarFilter[];
  onFilterChange?: (id: string, value: string) => void;
  sort?: CollectionToolbarSort;
  onSortChange?: (value: string, direction: "asc" | "desc") => void;
  layout?: "list" | "grid";
  onLayoutChange?: (layout: "list" | "grid") => void;
  onReset?: () => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  resultCount?: number;
  resultLabel?: string;
  actions?: React.ReactNode;
}

/** A compact, wrapping search/filter/sort toolbar for data collections. */
export function CollectionToolbarRecipe({
  search,
  onSearchChange,
  filters = [],
  onFilterChange,
  sort,
  onSortChange,
  layout,
  onLayoutChange,
  onReset,
  searchLabel = "Search collection",
  searchPlaceholder = "Search…",
  resultCount,
  resultLabel = "results",
  actions,
}: CollectionToolbarRecipeProps) {
  return (
    <div className="rounded-lg border bg-card p-3 text-card-foreground" role="search" aria-label="Collection controls">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-52 flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.currentTarget.value)}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            className="pl-9"
          />
        </div>

        {filters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={(value) => onFilterChange?.(filter.id, value)}>
            <SelectTrigger className="w-full sm:w-40" aria-label={filter.label}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {sort ? (
          <>
            <Select value={sort.value} onValueChange={(value) => onSortChange?.(value, sort.direction)}>
              <SelectTrigger className="w-full sm:w-36" aria-label="Sort by">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sort.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              aria-label={`Sort ${sort.direction === "asc" ? "descending" : "ascending"}`}
              onClick={() => onSortChange?.(sort.value, sort.direction === "asc" ? "desc" : "asc")}
            >
              {sort.direction === "asc" ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
            </Button>
          </>
        ) : null}

        {layout && onLayoutChange ? (
          <div className="flex items-center rounded-md border p-0.5" aria-label="Collection layout">
            <Button variant={layout === "list" ? "secondary" : "ghost"} size="icon" aria-label="List view" aria-pressed={layout === "list"} onClick={() => onLayoutChange("list")}>
              <List aria-hidden="true" />
            </Button>
            <Button variant={layout === "grid" ? "secondary" : "ghost"} size="icon" aria-label="Grid view" aria-pressed={layout === "grid"} onClick={() => onLayoutChange("grid")}>
              <Grid2X2 aria-hidden="true" />
            </Button>
          </div>
        ) : null}

        {onReset ? (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        ) : null}

        {actions}
      </div>

      {typeof resultCount === "number" ? (
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {resultCount.toLocaleString()} {resultLabel}
        </p>
      ) : null}
    </div>
  );
}

export interface CollectionToolbarFixture {
  search: string;
  filters?: CollectionToolbarFilter[];
  sort?: CollectionToolbarSort;
  layout?: "list" | "grid";
  searchLabel?: string;
  searchPlaceholder?: string;
  resultCount?: number;
  resultLabel?: string;
}

/** Stateful fixture adapter used by the documentation preview registry. */
export function CollectionToolbarPreview(fixture: CollectionToolbarFixture) {
  const [search, setSearch] = React.useState(fixture.search);
  const [filters, setFilters] = React.useState(fixture.filters ?? []);
  const [sort, setSort] = React.useState(fixture.sort);
  const [layout, setLayout] = React.useState(fixture.layout);

  const reset = () => {
    setSearch("");
    setFilters((current) => current.map((filter) => ({ ...filter, value: filter.options[0]?.value ?? "" })));
  };

  return (
    <CollectionToolbarRecipe
      {...fixture}
      search={search}
      filters={filters}
      sort={sort}
      layout={layout}
      onSearchChange={setSearch}
      onFilterChange={(id, value) => setFilters((current) => current.map((filter) => filter.id === id ? { ...filter, value } : filter))}
      onSortChange={(value, direction) => setSort((current) => current ? { ...current, value, direction } : undefined)}
      onLayoutChange={setLayout}
      onReset={reset}
    />
  );
}
