import { useId, useState } from "react";
import { ChevronRight, Plus, X } from "lucide-react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@scudamores/ui/components/ui/select";
import { Stepper } from "@scudamores/ui/components/ui/stepper";

export interface CapacityTier {
  id: string;
  label: string;
  capacityPerUnit: number | null;
  maxQuantity?: number | null;
}

export interface CapacityProduct {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  tiers: CapacityTier[];
}

export interface CapacityTierLine {
  tierId: string;
  quantity: number;
}

export interface CapacityProductSelection {
  productId: string;
  lines: CapacityTierLine[];
}

export interface CapacityProductSelectorProps {
  products: CapacityProduct[];
  selectedProductIds: string[];
  selections: CapacityProductSelection[];
  targetCapacity: number;
  onToggleProduct: (productId: string, included: boolean) => void;
  onLinesChange: (productId: string, lines: CapacityTierLine[]) => void;
}

function coverageFor(product: CapacityProduct, lines: CapacityTierLine[]) {
  if (!product.tiers.some((tier) => tier.capacityPerUnit !== null)) return null;
  return lines.reduce((total, line) => {
    const tier = product.tiers.find((candidate) => candidate.id === line.tierId);
    return total + (tier?.capacityPerUnit ?? 0) * line.quantity;
  }, 0);
}

export function CapacityProductSelector({
  products,
  selectedProductIds,
  selections,
  targetCapacity,
  onToggleProduct,
  onLinesChange,
}: CapacityProductSelectorProps) {
  const instanceId = useId();
  return (
    <div className="space-y-2" aria-label="Products" data-pattern="capacity-product-selector">
      {products.map((product) => {
        const included = selectedProductIds.includes(product.id);
        const lines = selections.find((selection) => selection.productId === product.id)?.lines ?? [];
        const usedTierIds = new Set(lines.map((line) => line.tierId));
        const coverage = coverageFor(product, lines);

        const updateLine = (index: number, next: CapacityTierLine) => {
          const updated = lines.map((line, lineIndex) => (lineIndex === index ? next : line));
          onLinesChange(product.id, updated);
        };

        return (
          <section
            key={product.id}
            className={`rounded-lg border transition-colors ${product.disabled ? "opacity-40" : ""} ${
              included ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            <button
              type="button"
              disabled={product.disabled}
              onClick={() => onToggleProduct(product.id, !included)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              aria-expanded={included}
              aria-controls={`${instanceId}-capacity-product-${product.id}`}
            >
              <span>
                <span className={included ? "font-medium text-primary" : "font-medium"}>{product.label}</span>
                {product.description ? <span className="mt-0.5 block text-xs text-foreground/85">{product.description}</span> : null}
              </span>
              <ChevronRight aria-hidden="true" className={`size-4 shrink-0 text-muted-foreground transition-transform ${included ? "rotate-90" : ""}`} />
            </button>

            <div id={`${instanceId}-capacity-product-${product.id}`} hidden={!included} className="border-t border-primary/20 px-3 pb-3 pt-3">
              {coverage !== null ? (
                <div className="mb-3" aria-live="polite">
                  {coverage < targetCapacity ? (
                    <Badge variant="destructive">{coverage} of {targetCapacity} places covered</Badge>
                  ) : coverage > targetCapacity ? (
                    <Badge variant="warning">{coverage} places — more than needed</Badge>
                  ) : (
                    <Badge variant="success">{coverage} places covered</Badge>
                  )}
                </div>
              ) : null}

              <div className="space-y-2">
                {lines.length === 0 ? <p className="text-xs text-muted-foreground">No options added yet.</p> : null}
                {lines.map((line, index) => {
                  const tier = product.tiers.find((candidate) => candidate.id === line.tierId);
                  return (
                    <div key={`${line.tierId}-${index}`} className="flex items-center gap-2">
                      <Select value={line.tierId} onValueChange={(tierId) => updateLine(index, { ...line, tierId })}>
                        <SelectTrigger className="h-8 flex-1 text-sm" aria-label={`Option ${index + 1} for ${product.label}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {product.tiers.map((candidate) => (
                            <SelectItem
                              key={candidate.id}
                              value={candidate.id}
                              disabled={candidate.id !== line.tierId && usedTierIds.has(candidate.id)}
                            >
                              {candidate.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Stepper
                        value={line.quantity}
                        min={1}
                        max={tier?.maxQuantity ?? null}
                        disabled={product.disabled}
                        onChange={(quantity) => updateLine(index, { ...line, quantity })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => onLinesChange(product.id, lines.filter((_, lineIndex) => lineIndex !== index))}
                        aria-label={`Remove option ${index + 1} from ${product.label}`}
                      >
                        <X aria-hidden="true" className="size-3.5" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {usedTierIds.size < product.tiers.length ? (
                <Button
                  data-contrast-action
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 h-8"
                  onClick={() => {
                    const tier = product.tiers.find((candidate) => !usedTierIds.has(candidate.id));
                    if (tier) onLinesChange(product.id, [...lines, { tierId: tier.id, quantity: 1 }]);
                  }}
                >
                  <Plus aria-hidden="true" className="size-3.5" />
                  Add option
                </Button>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export type CapacityProductSelectorPreviewProps = Omit<
  CapacityProductSelectorProps,
  "onToggleProduct" | "onLinesChange"
>;

export function CapacityProductSelectorPreview({
  selectedProductIds: initialProductIds,
  selections: initialSelections,
  ...props
}: CapacityProductSelectorPreviewProps) {
  const [selectedProductIds, setSelectedProductIds] = useState(initialProductIds);
  const [selections, setSelections] = useState(initialSelections);

  return (
    <CapacityProductSelector
      {...props}
      selectedProductIds={selectedProductIds}
      selections={selections}
      onToggleProduct={(productId, included) => setSelectedProductIds((current) => included ? [...new Set([...current, productId])] : current.filter((id) => id !== productId))}
      onLinesChange={(productId, lines) => setSelections((current) => {
        const exists = current.some((selection) => selection.productId === productId);
        return exists
          ? current.map((selection) => selection.productId === productId ? { productId, lines } : selection)
          : [...current, { productId, lines }];
      })}
    />
  );
}
