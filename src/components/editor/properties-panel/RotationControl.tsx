import { Layer } from "@/types/editor";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function RotationControl({
  layer,
  onLayerUpdate
}: {
  layer: Layer;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">Rotation</Label>

      <Slider
        value={[layer.rotation || 0]}
        onValueChange={([v]) => onLayerUpdate(layer.id, { rotation: v })}
        min={0} max={360}
      />

      <div className="text-xs mt-1">{Math.round(layer.rotation || 0)}°</div>
    </div>
  );
}
