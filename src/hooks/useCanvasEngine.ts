import { useState, useCallback, useRef, useEffect } from "react";
import Konva from "konva";
import { Layer, EditorTemplate } from "@/types/editor";

export const useCanvasEngine = () => {
  const [template, setTemplate] = useState<EditorTemplate>({
    duration: 10,
    width: 1280,
    height: 720,
    fps: 30,
    layers: [],
    animations: [],
  });

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);

  const addLayer = useCallback((layer: Layer) => {
    setTemplate((prev) => ({
      ...prev,
      layers: [...prev.layers, layer],
    }));
    setSelectedLayerId(layer.id);
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<Layer>) => {
    setTemplate((prev) => ({
      ...prev,
      layers: prev.layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } as Layer : layer
      ),
    }));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setTemplate((prev) => ({
      ...prev,
      layers: prev.layers.filter((layer) => layer.id !== layerId),
      animations: prev.animations.filter((anim) => anim.layerId !== layerId),
    }));
    setSelectedLayerId(null);
  }, []);

  const getLayer = useCallback(
    (layerId: string) => {
      return template.layers.find((layer) => layer.id === layerId);
    },
    [template.layers]
  );

  const duplicateLayer = useCallback((layerId: string) => {
    const layer = getLayer(layerId);
    if (!layer) return;

    const newLayer = {
      ...layer,
      id: `${layer.type}-${Date.now()}`,
      name: `${layer.name} Copy`,
      x: layer.x + 20,
      y: layer.y + 20,
    };

    addLayer(newLayer);
  }, [getLayer, addLayer]);

  return {
    template,
    setTemplate,
    selectedLayerId,
    setSelectedLayerId,
    stageRef,
    addLayer,
    updateLayer,
    removeLayer,
    getLayer,
    duplicateLayer,
  };
};
