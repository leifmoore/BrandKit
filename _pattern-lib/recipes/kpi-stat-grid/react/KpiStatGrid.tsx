import * as React from "react";
import { DollarSign, Receipt, TrendingUp, Users } from "lucide-react";
import { Badge } from "@scudamores/ui/components/ui/badge";
import { Card } from "@scudamores/ui/components/ui/card";

export type KpiIcon = "sales" | "bookings" | "average" | "commission";
export type KpiTone = "default" | "success" | "warning" | "destructive";

export interface KpiMetric {
  id: string;
  label: string;
  displayValue: string;
  valueMinor?: number;
  currency?: string;
  numericValue?: number;
  icon?: KpiIcon;
  tone?: KpiTone;
  trend?: {
    direction: "up" | "down" | "flat";
    displayValue: string;
    label: string;
  };
}

export interface KpiStatGridProps {
  metrics: KpiMetric[];
  label?: string;
}

const icons = {
  sales: DollarSign,
  bookings: Users,
  average: TrendingUp,
  commission: Receipt,
};

const trendVariants = {
  up: "success",
  down: "destructive",
  flat: "secondary",
} as const;

export function KpiStatGrid({ metrics, label = "Report summary" }: KpiStatGridProps) {
  return (
    <section aria-label={label}>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon ? icons[metric.icon] : null;
          return (
            <Card key={metric.id} className={(metric.tone === "destructive" ? "border-destructive/50 " : "") + "gap-0 p-4"}>
              <dt className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                <span>{metric.label}</span>
                {Icon && <Icon aria-hidden="true" className="size-4 text-muted-foreground" />}
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums">
                {metric.displayValue}
                {metric.trend && (
                  <span className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-normal text-muted-foreground">
                    <Badge variant={trendVariants[metric.trend.direction]}>{metric.trend.displayValue}</Badge>
                    <span>{metric.trend.label}</span>
                  </span>
                )}
              </dd>
            </Card>
          );
        })}
      </dl>
    </section>
  );
}

export function KpiStatGridPreview(props: KpiStatGridProps) {
  return <KpiStatGrid {...props} />;
}
