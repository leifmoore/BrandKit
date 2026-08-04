import { useId, useRef } from "react";
import { Check, Upload } from "lucide-react";
import { Badge } from "../../../react/components/ui/badge";
import { Button } from "../../../react/components/ui/button";
import { Label } from "../../../react/components/ui/label";
import { Switch } from "../../../react/components/ui/switch";

export interface LogoOption { id: string; label: string; imageUrl?: string }
export interface ChannelLogoPickerRecipeProps {
  showLogo: boolean;
  onShowLogoChange: (value: boolean) => void;
  logos: LogoOption[];
  selectedLogoId: string | null;
  onSelectedLogoChange: (id: string) => void;
  onUpload?: (file: File) => Promise<void> | void;
}

export function ChannelLogoPickerRecipe(props: ChannelLogoPickerRecipeProps) {
  const input = useRef<HTMLInputElement>(null);
  const showLogoId = useId();
  return <div className="space-y-4">
    <div className="flex items-center justify-between"><span><Label htmlFor={showLogoId}>Show logo</Label><span className="block text-xs text-muted-foreground">Display an organisation logo on this channel.</span></span><Switch id={showLogoId} checked={props.showLogo} onCheckedChange={props.onShowLogoChange} /></div>
    <div aria-disabled={!props.showLogo} className={props.showLogo ? "space-y-3" : "pointer-events-none space-y-3 opacity-50"}>
      <p className="text-sm font-medium">Organisation logo gallery</p>
      <div className="flex flex-wrap gap-3">{props.logos.map((logo) => <button key={logo.id} type="button" disabled={!props.showLogo} aria-pressed={props.selectedLogoId === logo.id} aria-label={`Select ${logo.label}`} onClick={() => props.onSelectedLogoChange(logo.id)} className={`relative flex size-16 items-center justify-center overflow-hidden rounded-md border-2 bg-muted text-xs font-medium transition disabled:cursor-not-allowed ${props.selectedLogoId === logo.id ? "border-ring" : "border-border hover:border-muted-foreground"}`}>
        {logo.imageUrl ? <img src={logo.imageUrl} alt="" className="size-full object-contain p-2" /> : logo.label.slice(0, 2).toUpperCase()}
        {props.selectedLogoId === logo.id && <Badge className="absolute -bottom-1 -right-1 size-5 rounded-full p-0"><Check aria-hidden="true" className="size-3" /><span className="sr-only">Selected</span></Badge>}
      </button>)}</div>
      {props.onUpload && <><input ref={input} type="file" accept="image/*" aria-label="Upload new logo" disabled={!props.showLogo} className="hidden" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) props.onUpload?.(file); }} /><Button type="button" variant="outline" size="sm" disabled={!props.showLogo} onClick={() => input.current?.click()}><Upload aria-hidden="true" className="size-4" />Upload new logo</Button></>}
    </div>
  </div>;
}
