import { Layer } from "@/types/editor";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function OpacityControl({
  layer,
  onLayerUpdate
}: {
  layer: Layer;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">Opacity</Label>
      <Slider
        value={[(layer.opacity ?? 1) * 100]}
        onValueChange={([v]) => onLayerUpdate(layer.id, { opacity: v / 100 })}
        min={0} max={100}
      />
      <div className="text-xs mt-1">{Math.round((layer.opacity ?? 1) * 100)}%</div>
    </div>
  );
}
