import { useState, type ReactNode } from "react";
import { Button } from "../../react/components/ui/button";

export type PreviewDevice = "mobile-s" | "mobile-l" | "tablet" | "desktop";
const widths: Record<PreviewDevice, number> = { "mobile-s": 375, "mobile-l": 414, tablet: 768, desktop: 1024 };
const labels: Record<PreviewDevice, string> = { "mobile-s": "Small mobile", "mobile-l": "Large mobile", tablet: "Tablet", desktop: "Desktop" };

export function DevicePreviewFrame({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  return <div className="space-y-3"><div className="flex flex-wrap items-center gap-2">{(Object.keys(widths) as PreviewDevice[]).map((key) => <Button key={key} type="button" variant={device === key ? "default" : "outline"} size="sm" onClick={() => setDevice(key)}>{labels[key]}</Button>)}<span className="ml-auto text-xs text-muted-foreground">{widths[device]}px</span></div><div className="w-full overflow-x-auto rounded-lg border bg-muted/40 p-4"><div className="mx-auto transition-[max-width]" style={{ maxWidth: widths[device] }}>{children}</div></div></div>;
}
