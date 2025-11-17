import { ImageLayer } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Maximize2, Minimize2 } from "lucide-react";

export default function ImageProperties({
  layer,
  onLayerUpdate
}: {
  layer: ImageLayer;
  onLayerUpdate: (id: string, updates: Partial<ImageLayer>) => void;
}) {
  const resize = (factor: number) => {
    const w = layer.width || 200;
    const h = layer.height || 200;

    onLayerUpdate(layer.id, {
      width: Math.min(1280, Math.max(50, w * factor)),
      height: Math.min(720, Math.max(50, h * factor)),
    });
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground">Image Size</Label>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => resize(0.8)}>
          <Minimize2 className="mr-2 h-4 w-4" /> Smaller
        </Button>

        <Button variant="outline" size="sm" className="flex-1" onClick={() => resize(1.25)}>
          <Maximize2 className="mr-2 h-4 w-4" /> Larger
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        {Math.round(layer.width || 200)} × {Math.round(layer.height || 200)} px
      </div>
    </div>
  );
}
