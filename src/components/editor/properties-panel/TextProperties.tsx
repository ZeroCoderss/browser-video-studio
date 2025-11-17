import { TextLayer } from "@/types/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function TextProperties({
  layer,
  onLayerUpdate,
}: {
  layer: TextLayer;
  onLayerUpdate: (id: string, updates: Partial<TextLayer>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs text-muted-foreground">Text Content</Label>
        <Input
          value={layer.content}
          onChange={(e) => onLayerUpdate(layer.id, { content: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Font Size</Label>
        <Slider
          value={[layer.fontSize || 32]}
          onValueChange={([v]) => onLayerUpdate(layer.id, { fontSize: v })}
          min={12} max={200} step={1}
          className="mt-2"
        />
        <div className="text-xs mt-1">{layer.fontSize}px</div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Color</Label>
        <Input
          type="color"
          value={layer.fill || "#ffffff"}
          onChange={(e) => onLayerUpdate(layer.id, { fill: e.target.value })}
          className="mt-1 h-10"
        />
      </div>
    </div>
  );
}
