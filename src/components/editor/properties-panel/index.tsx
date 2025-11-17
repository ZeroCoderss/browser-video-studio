import { Layer, TextLayer, ShapeLayer, ImageLayer } from "@/types/editor";
import { Separator } from "@/components/ui/separator";

import LayerName from "./LayerName";
import TextProperties from "./TextProperties";
import ImageProperties from "./ImageProperties";
import ShapeProperties from "./ShapeProperties";
import OpacityControl from "./OpacityControl";
import RotationControl from "./RotationControl";
import Actions from "./Actions";

interface Props {
  layer: Layer | undefined;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  onLayerRemove: (id: string) => void;
  onLayerDuplicate: (id: string) => void;
}

export default function PropertiesPanel({
  layer,
  onLayerUpdate,
  onLayerRemove,
  onLayerDuplicate,
}: Props) {
  if (!layer)
    return (
      <div className="w-70 bg-panel-bg overflow-y-auto">
        <div className="text-center text-muted-foreground py-12">
          Select a layer to edit properties
        </div>
      </div>
    );

  return (
    <div className="w-70 bg-panel-bg overflow-y-auto space-y-6 p-4">
      <h3 className="text-sm font-semibold mb-2">Layer Properties</h3>

      <LayerName layer={layer} onLayerUpdate={onLayerUpdate} />

      {layer.type === "text" && (
        <TextProperties layer={layer as TextLayer} onLayerUpdate={onLayerUpdate} />
      )}

      {layer.type === "image" && (
        <ImageProperties layer={layer as ImageLayer} onLayerUpdate={onLayerUpdate} />
      )}

      {layer.type === "shape" && (
        <ShapeProperties layer={layer as ShapeLayer} onLayerUpdate={onLayerUpdate} />
      )}

      <Separator />

      <OpacityControl layer={layer} onLayerUpdate={onLayerUpdate} />
      <RotationControl layer={layer} onLayerUpdate={onLayerUpdate} />

      <Separator />

      <Actions
        layer={layer}
        onLayerRemove={onLayerRemove}
        onLayerDuplicate={onLayerDuplicate}
      />
    </div>
  );
}
