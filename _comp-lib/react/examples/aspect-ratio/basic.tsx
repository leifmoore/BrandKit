import { AspectRatio } from "../../components/ui/aspect-ratio";

export function AspectRatioExample() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border">
      <AspectRatio ratio={16 / 9}>
        <div className="flex size-full items-center justify-center bg-muted text-sm text-muted-foreground">
          16:9 media
        </div>
      </AspectRatio>
    </div>
  );
}
