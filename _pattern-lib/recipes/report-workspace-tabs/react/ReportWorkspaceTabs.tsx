import * as React from "react";
import { Badge, type BadgeProps } from "@scudamores/ui/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@scudamores/ui/components/ui/tabs";

export interface ReportWorkspaceTab {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
  status?: {
    label: string;
    variant?: BadgeProps["variant"];
  };
}

export interface ReportWorkspaceTabsProps {
  tabs: ReportWorkspaceTab[];
  value: string;
  onValueChange: (value: string) => void;
  renderPanel: (tab: ReportWorkspaceTab) => React.ReactNode;
  ariaLabel?: string;
}

export function ReportWorkspaceTabs({
  tabs,
  value,
  onValueChange,
  renderPanel,
  ariaLabel = "Report views",
}: ReportWorkspaceTabsProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>("[data-state='active']")
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [value]);

  return (
    <Tabs value={value} onValueChange={onValueChange} data-pattern="report-workspace-tabs">
      <div ref={listRef} className="max-w-full overflow-x-auto">
        <TabsList aria-label={ariaLabel} className="h-auto min-w-max justify-start gap-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              disabled={tab.disabled}
              className="shrink-0 px-2 py-1.5 text-xs text-foreground/80 data-[state=active]:text-foreground sm:px-3 sm:text-sm"
            >
              {tab.label}
              {tab.status && (
                <Badge variant={tab.status.variant ?? "secondary"} className="ml-1 px-1.5 py-0 text-[10px] text-foreground">
                  {tab.status.label}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-2" tabIndex={0}>
          {renderPanel(tab)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export interface ReportWorkspaceTabsPreviewProps {
  tabs: Array<ReportWorkspaceTab & { content: string }>;
  initialValue: string;
}

export function ReportWorkspaceTabsPreview({ tabs, initialValue }: ReportWorkspaceTabsPreviewProps) {
  const [value, setValue] = React.useState(initialValue);
  return (
    <ReportWorkspaceTabs
      tabs={tabs}
      value={value}
      onValueChange={setValue}
      renderPanel={(tab) => {
        const previewTab = tabs.find((item) => item.id === tab.id);
        return (
          <section className="rounded-lg border bg-card p-6" aria-label={`${tab.label} preview`}>
            <h3 className="font-semibold">{tab.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{previewTab?.content ?? tab.description}</p>
          </section>
        );
      }}
    />
  );
}
