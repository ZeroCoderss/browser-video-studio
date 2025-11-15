import { useEffect, useRef } from "react";
import { Stage, Layer as KonvaLayer, Transformer, Text, Image, Rect, Circle } from "react-konva";
import Konva from "konva";
import { Layer, TextLayer, ImageLayer, ShapeLayer } from "@/types/editor";
import useImage from "use-image";

interface EditorCanvasProps {
  layers: Layer[];
  selectedLayerId: string | null;
  onLayerSelect: (id: string | null) => void;
  onLayerUpdate: (id: string, updates: Partial<Layer>) => void;
  stageRef: React.MutableRefObject<Konva.Stage | null>;
  width: number;
  height: number;
}

const LayerImage = ({ layer }: { layer: ImageLayer }) => {
  const [image] = useImage(layer.src);
  return (
    <Image
      image={image}
      x={layer.x}
      y={layer.y}
      width={layer.width}
      height={layer.height}
      scaleX={layer.scaleX || 1}
      scaleY={layer.scaleY || 1}
      rotation={layer.rotation || 0}
      opacity={layer.opacity ?? 1}
      draggable
      id={layer.id}
    />
  );
};

export const EditorCanvas = ({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerUpdate,
  stageRef,
  width,
  height,
}: EditorCanvasProps) => {
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = 0.7; // Scale for preview

  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (selectedLayerId) {
      const node = stage.findOne(`#${selectedLayerId}`);
      if (node) {
        transformer.nodes([node]);
      }
    } else {
      transformer.nodes([]);
    }

    transformer.getLayer()?.batchDraw();
  }, [selectedLayerId, layers, stageRef]);

  const handleTransformEnd = (id: string, node: Konva.Node) => {
    onLayerUpdate(id, {
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });
  };

  const renderLayer = (layer: Layer) => {
    if (layer.visible === false) return null;

    const commonProps = {
      id: layer.id,
      draggable: !layer.locked,
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        onLayerUpdate(layer.id, {
          x: e.target.x(),
          y: e.target.y(),
        });
      },
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
        handleTransformEnd(layer.id, e.target);
      },
      onClick: () => onLayerSelect(layer.id),
      onTap: () => onLayerSelect(layer.id),
    };

    switch (layer.type) {
      case "text": {
        const textLayer = layer as TextLayer;
        return (
          <Text
            key={layer.id}
            {...commonProps}
            text={textLayer.content}
            x={textLayer.x}
            y={textLayer.y}
            fontSize={textLayer.fontSize || 32}
            fontFamily={textLayer.fontFamily || "Inter"}
            fontStyle={textLayer.fontStyle || "normal"}
            fill={textLayer.fill || "#ffffff"}
            align={textLayer.align || "left"}
            rotation={textLayer.rotation || 0}
            scaleX={textLayer.scaleX || 1}
            scaleY={textLayer.scaleY || 1}
            opacity={textLayer.opacity ?? 1}
          />
        );
      }

      case "image": {
        const imageLayer = layer as ImageLayer;
        return <LayerImage key={layer.id} layer={imageLayer} />;
      }

      case "shape": {
        const shapeLayer = layer as ShapeLayer;
        if (shapeLayer.shapeType === "rectangle") {
          return (
            <Rect
              key={layer.id}
              {...commonProps}
              x={shapeLayer.x}
              y={shapeLayer.y}
              width={shapeLayer.width || 100}
              height={shapeLayer.height || 100}
              fill={shapeLayer.fill || "#3b82f6"}
              stroke={shapeLayer.stroke}
              strokeWidth={shapeLayer.strokeWidth || 0}
              rotation={shapeLayer.rotation || 0}
              scaleX={shapeLayer.scaleX || 1}
              scaleY={shapeLayer.scaleY || 1}
              opacity={shapeLayer.opacity ?? 1}
            />
          );
        } else if (shapeLayer.shapeType === "circle") {
          return (
            <Circle
              key={layer.id}
              {...commonProps}
              x={shapeLayer.x}
              y={shapeLayer.y}
              radius={(shapeLayer.width || 100) / 2}
              fill={shapeLayer.fill || "#3b82f6"}
              stroke={shapeLayer.stroke}
              strokeWidth={shapeLayer.strokeWidth || 0}
              scaleX={shapeLayer.scaleX || 1}
              scaleY={shapeLayer.scaleY || 1}
              opacity={shapeLayer.opacity ?? 1}
            />
          );
        }
        return null;
      }

      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center bg-canvas-bg rounded-lg p-4">
      <div className="relative" style={{ width: width * scale, height: height * scale }}>
        <Stage
          width={width}
          height={height}
          scaleX={scale}
          scaleY={scale}
          ref={stageRef}
          className="bg-muted rounded shadow-lg"
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) {
              onLayerSelect(null);
            }
          }}
        >
          <KonvaLayer>
            {layers.map((layer) => renderLayer(layer))}
            <Transformer ref={transformerRef} />
          </KonvaLayer>
        </Stage>
      </div>
    </div>
  );
};
