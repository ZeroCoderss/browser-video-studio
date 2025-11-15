import { Layer, TextLayer, ShapeLayer } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy } from "lucide-react";

interface PropertiesPanelProps {
  layer: Layer | undefined;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  onLayerRemove: (id: string) => void;
  onLayerDuplicate: (id: string) => void;
}

export const PropertiesPanel = ({
  layer,
  onLayerUpdate,
  onLayerRemove,
  onLayerDuplicate,
}: PropertiesPanelProps) => {
  if (!layer) {
    return (
      <div className="w-80 bg-panel-bg border-l border-border p-6 overflow-y-auto">
        <div className="text-center text-muted-foreground py-12">
          <p>Select a layer to edit properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-panel-bg border-l border-border p-6 overflow-y-auto space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-4">Layer Properties</h3>
        
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input
              value={layer.name}
              onChange={(e) => onLayerUpdate(layer.id, { name: e.target.value })}
              className="mt-1"
            />
          </div>

          {layer.type === "text" && (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Text Content</Label>
                <Input
                  value={(layer as TextLayer).content}
                  onChange={(e) =>
                    onLayerUpdate(layer.id, { content: e.target.value } as Partial<TextLayer>)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Font Size</Label>
                <Slider
                  value={[(layer as TextLayer).fontSize || 32]}
                  onValueChange={([value]) =>
                    onLayerUpdate(layer.id, { fontSize: value } as Partial<TextLayer>)
                  }
                  min={12}
                  max={200}
                  step={1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {(layer as TextLayer).fontSize || 32}px
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Color</Label>
                <Input
                  type="color"
                  value={(layer as TextLayer).fill || "#ffffff"}
                  onChange={(e) =>
                    onLayerUpdate(layer.id, { fill: e.target.value } as Partial<TextLayer>)
                  }
                  className="mt-1 h-10"
                />
              </div>
            </>
          )}

          {layer.type === "shape" && (
            <>
              <div>
                <Label className="text-xs text-muted-foreground">Fill Color</Label>
                <Input
                  type="color"
                  value={(layer as ShapeLayer).fill || "#3b82f6"}
                  onChange={(e) =>
                    onLayerUpdate(layer.id, { fill: e.target.value } as Partial<ShapeLayer>)
                  }
                  className="mt-1 h-10"
                />
              </div>
            </>
          )}

          <Separator />

          <div>
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <Slider
              value={[(layer.opacity ?? 1) * 100]}
              onValueChange={([value]) =>
                onLayerUpdate(layer.id, { opacity: value / 100 })
              }
              min={0}
              max={100}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((layer.opacity ?? 1) * 100)}%
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Rotation</Label>
            <Slider
              value={[layer.rotation || 0]}
              onValueChange={([value]) =>
                onLayerUpdate(layer.id, { rotation: value })
              }
              min={0}
              max={360}
              step={1}
              className="mt-2"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(layer.rotation || 0)}°
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onLayerDuplicate(layer.id)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => onLayerRemove(layer.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
