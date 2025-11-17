import { Layer } from "@/types/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LayerName({
  layer,
  onLayerUpdate
}: {
  layer: Layer;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
}) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">Name</Label>
      <Input
        value={layer.name}
        onChange={(e) => onLayerUpdate(layer.id, { name: e.target.value })}
        className="mt-1"
      />
    </div>
  );
}
