"use client";

import * as React from "react";
import { ArrowLeft, Check, Copy, ExternalLink, Save } from "lucide-react";

import { Badge, type BadgeProps } from "@scudamores/ui/components/ui/badge";
import { Button } from "@scudamores/ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@scudamores/ui/components/ui/card";
import { Input } from "@scudamores/ui/components/ui/input";
import { Label } from "@scudamores/ui/components/ui/label";
import { Switch } from "@scudamores/ui/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@scudamores/ui/components/ui/tabs";

export type ConfigurationWorkbenchTab = "details" | "options" | "preview" | "handoff";

export interface ConfigurationWorkbenchRecipeProps {
  title: string;
  description: string;
  status?: string;
  statusVariant?: BadgeProps["variant"];
  activeTab: ConfigurationWorkbenchTab;
  onTabChange: (tab: ConfigurationWorkbenchTab) => void;
  details: React.ReactNode;
  options?: React.ReactNode;
  preview: React.ReactNode;
  handoff: React.ReactNode;
  onBack?: () => void;
  onSave?: () => void;
  saving?: boolean;
  dirty?: boolean;
  saveLabel?: string;
}

/**
 * A configuration shell that keeps editing, preview and implementation
 * handoff in one task-focused surface. All configuration data stays host-owned.
 */
export function ConfigurationWorkbenchRecipe({
  title,
  description,
  status,
  statusVariant = "secondary",
  activeTab,
  onTabChange,
  details,
  options,
  preview,
  handoff,
  onBack,
  onSave,
  saving = false,
  dirty = false,
  saveLabel = "Save configuration",
}: ConfigurationWorkbenchRecipeProps) {
  const tabs: Array<{ id: ConfigurationWorkbenchTab; label: string; content: React.ReactNode }> = [
    { id: "details", label: "Details", content: details },
    ...(options ? [{ id: "options" as const, label: "Options", content: options }] : []),
    { id: "preview", label: "Preview", content: preview },
    { id: "handoff", label: "Handoff", content: handoff },
  ];

  return (
    <Card data-pattern="configuration-workbench">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {onBack ? (
              <Button variant="ghost" size="icon" aria-label="Back to configurations" onClick={onBack}>
                <ArrowLeft aria-hidden="true" />
              </Button>
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{title}</CardTitle>
                {status ? <Badge variant={statusVariant}>{status}</Badge> : null}
                {dirty ? <span className="text-xs text-muted-foreground">Unsaved changes</span> : null}
              </div>
              <CardDescription className="mt-1">{description}</CardDescription>
            </div>
          </div>
          {onSave ? (
            <Button disabled={saving || !dirty} aria-busy={saving || undefined} onClick={onSave}>
              <Save aria-hidden="true" />{saving ? "Saving…" : saveLabel}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ConfigurationWorkbenchTab)}>
          <div className="overflow-x-auto pb-1">
            <TabsList className="w-max min-w-full justify-start">
              {tabs.map((tab) => <TabsTrigger key={tab.id} value={tab.id} className="text-foreground/80 data-[state=active]:text-foreground">{tab.label}</TabsTrigger>)}
            </TabsList>
          </div>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-5 focus-visible:outline-none">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

export interface ConfigurationWorkbenchFixture {
  title: string;
  description: string;
  status: string;
  fields: Array<{ id: string; label: string; value: string }>;
  enabled: boolean;
  previewTitle: string;
  previewDescription: string;
  handoffCode: string;
}

/** Fixture-driven adapter used by the external documentation preview. */
export function ConfigurationWorkbenchPreview(props: ConfigurationWorkbenchFixture) {
  const [activeTab, setActiveTab] = React.useState<ConfigurationWorkbenchTab>("details");
  const [fields, setFields] = React.useState(() => Object.fromEntries(props.fields.map((field) => [field.id, field.value])));
  const [enabled, setEnabled] = React.useState(props.enabled);
  const [saved, setSaved] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  const updateField = (id: string, value: string) => {
    setFields((current) => ({ ...current, [id]: value }));
    setSaved(false);
  };

  return (
    <ConfigurationWorkbenchRecipe
      title={fields.name || props.title}
      description={props.description}
      status={enabled ? props.status : "Draft"}
      statusVariant={enabled ? "success" : "secondary"}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      dirty={!saved}
      onSave={() => setSaved(true)}
      details={
        <div className="grid gap-4 sm:grid-cols-2">
          {props.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`configuration-${field.id}`}>{field.label}</Label>
              <Input id={`configuration-${field.id}`} value={fields[field.id] ?? ""} onChange={(event) => updateField(field.id, event.currentTarget.value)} />
            </div>
          ))}
        </div>
      }
      options={
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <span><span className="block text-sm font-medium">Enabled</span><span className="block text-xs text-muted-foreground">Make this configuration available to the host application.</span></span>
          <Switch checked={enabled} onCheckedChange={(value) => { setEnabled(value); setSaved(false); }} aria-label="Configuration enabled" />
        </div>
      }
      preview={
        <div className="mx-auto max-w-sm rounded-[2rem] border-8 border-foreground/15 bg-background p-4 shadow-sm">
          <div className="rounded-xl border bg-card p-5 text-card-foreground">
            <h3 className="font-semibold">{props.previewTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{props.previewDescription}</p>
            <Button className="mt-5 w-full" disabled={!enabled}>Continue</Button>
          </div>
        </div>
      }
      handoff={
        <div className="space-y-3">
          <div className="flex items-center justify-between"><div><h3 className="font-medium">Implementation snippet</h3><p className="text-sm text-muted-foreground">The host generates and validates this value.</p></div><ExternalLink aria-hidden="true" className="size-4 text-muted-foreground" /></div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs"><code>{props.handoffCode}</code></pre>
          <Button variant="outline" onClick={() => setCopied(true)}>{copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{copied ? "Copied" : "Copy snippet"}</Button>
        </div>
      }
    />
  );
}
