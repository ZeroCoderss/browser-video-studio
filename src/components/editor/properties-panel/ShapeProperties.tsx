import { ShapeLayer } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Maximize2, Minimize2 } from "lucide-react";

export default function ShapeProperties({
  layer,
  onLayerUpdate
}: {
  layer: ShapeLayer;
  onLayerUpdate: (id: string, updates: Partial<ShapeLayer>) => void;
}) {
  const resize = (factor: number) => {
    const w = layer.width || 200;
    const h = layer.height || 200;

    onLayerUpdate(layer.id, {
      width: Math.min(1280, Math.max(20, w * factor)),
      height: Math.min(720, Math.max(20, h * factor)),
    });
  };

  return (
    <div className="space-y-4">
      <Label className="text-xs text-muted-foreground">Shape Size</Label>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => resize(0.8)}>
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={() => resize(1.25)}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Fill Color</Label>
        <Input
          type="color"
          value={layer.fill || "#3b82f6"}
          onChange={(e) => onLayerUpdate(layer.id, { fill: e.target.value })}
          className="mt-1 h-10"
        />
      </div>
    </div>
  );
}
