import { useState, type KeyboardEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@scudamores/ui/components/ui/alert-dialog";
import { Button } from "@scudamores/ui/components/ui/button";

export interface BookingQuerySummary {
  id: string;
  partyLabel: string;
  dateLabel: string;
}

export interface MultiQueryManagerProps {
  queries: BookingQuerySummary[];
  selectedQueryId: string | null;
  maxQueries?: number;
  onSelectQuery: (queryId: string) => void;
  onAddQuery: () => void;
  onDeleteQuery: (queryId: string) => void;
  onClearAll: () => void;
}

export function MultiQueryManager({
  queries,
  selectedQueryId,
  maxQueries = 5,
  onSelectQuery,
  onAddQuery,
  onDeleteQuery,
  onClearAll,
}: MultiQueryManagerProps) {
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? queries.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + queries.length) % queries.length;
    const next = queries[nextIndex];
    if (!next) return;
    onSelectQuery(next.id);
    const options = event.currentTarget.closest('[role="toolbar"]')?.querySelectorAll<HTMLButtonElement>("[data-query-select]");
    options?.[nextIndex]?.focus();
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2" aria-label="Manage booking queries">
      <div role="toolbar" aria-label="Booking queries" className="flex shrink-0 items-center gap-2">
        {queries.map((query, index) => {
          const selected = query.id === selectedQueryId;
          return (
            <div
              key={query.id}
              className={`flex min-h-10 shrink-0 items-center rounded-full px-1 pl-3 text-sm font-medium transition-colors ${
                selected ? "bg-epos-accent text-epos-accent-foreground" : "bg-muted text-foreground hover:bg-accent dark:text-white"
              }`}
            >
              <button
                type="button"
                data-query-select
                aria-pressed={selected}
                tabIndex={selected || (!selectedQueryId && index === 0) ? 0 : -1}
                onClick={() => onSelectQuery(query.id)}
                onKeyDown={(event) => handleTabKey(event, index)}
                className="rounded-full py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {query.partyLabel} · {query.dateLabel}
              </button>
              <button
                type="button"
                onClick={() => onDeleteQuery(query.id)}
                className="ml-1 rounded-full p-1.5 transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Delete ${query.partyLabel} on ${query.dateLabel}`}
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            </div>
          );
        })}
      </div>

      {queries.length < maxQueries ? (
        <Button type="button" variant="outline" size="icon" onClick={onAddQuery} className="size-8 shrink-0 rounded-full" aria-label="Add another query">
          <Plus aria-hidden="true" className="size-4" />
        </Button>
      ) : null}

      {queries.length > 0 ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 shrink-0 rounded-full px-2 text-muted-foreground">
              <Trash2 aria-hidden="true" className="size-3.5" />
              Clear
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all queries?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes {queries.length === 1 ? "this query" : `all ${queries.length} queries`}. The host decides where the journey returns next.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearAll}>Clear all</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}

export type MultiQueryManagerPreviewProps = Omit<
  MultiQueryManagerProps,
  "onSelectQuery" | "onAddQuery" | "onDeleteQuery" | "onClearAll"
>;

export function MultiQueryManagerPreview({
  queries: initialQueries,
  selectedQueryId: initialSelectedId,
  ...props
}: MultiQueryManagerPreviewProps) {
  const [queries, setQueries] = useState(initialQueries);
  const [selectedQueryId, setSelectedQueryId] = useState(initialSelectedId);
  const [nextSequence, setNextSequence] = useState(initialQueries.length + 1);

  const remove = (queryId: string) => {
    const next = queries.filter((query) => query.id !== queryId);
    setQueries(next);
    if (selectedQueryId === queryId) setSelectedQueryId(next[0]?.id ?? null);
  };

  return (
    <MultiQueryManager
      {...props}
      queries={queries}
      selectedQueryId={selectedQueryId}
      onSelectQuery={setSelectedQueryId}
      onDeleteQuery={remove}
      onClearAll={() => { setQueries([]); setSelectedQueryId(null); }}
      onAddQuery={() => {
        const query = { id: `preview-query-${nextSequence}`, partyLabel: "1 person", dateLabel: "Choose date" };
        setQueries((current) => [...current, query]);
        setSelectedQueryId(query.id);
        setNextSequence((current) => current + 1);
      }}
    />
  );
}
