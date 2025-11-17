import { Layer } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export default function Actions({
  layer,
  onLayerDuplicate,
  onLayerRemove
}: {
  layer: Layer;
  onLayerDuplicate: (id: string) => void;
  onLayerRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1" onClick={() => onLayerDuplicate(layer.id)}>
        <Copy className="w-4 h-4 mr-2" /> Duplicate
      </Button>

      <Button variant="destructive" size="sm" className="flex-1" onClick={() => onLayerRemove(layer.id)}>
        <Trash2 className="w-4 h-4 mr-2" /> Delete
      </Button>
    </div>
  );
}
