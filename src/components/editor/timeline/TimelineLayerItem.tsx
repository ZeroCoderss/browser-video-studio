import { Group, Rect, Text } from "react-konva";
import { useState } from "react";
import { Layer } from "@/types/editor";

const HANDLE_SIZE = 8;
const MIN_DURATION = 0.2; // prevent collapse

interface ItemProps {
  layer: Layer;
  pxPerSec: number;
  onChange: (layer: Layer) => void;
  onSelect: (id: string) => void;
}

export const TimelineLayerItem = ({
  layer,
  pxPerSec,
  onChange,
  onSelect,
}: ItemProps) => {
  const [dragging, setDragging] = useState(false);

  const x = layer.startTime * pxPerSec;
  const width = (layer.endTime - layer.startTime) * pxPerSec;

  return (
    <Group
      x={x}
      y={50}
      draggable
      onMouseEnter={() => document.body.style.cursor = "grab"}
      onMouseLeave={() => document.body.style.cursor = "default"}
      onDragStart={() => {
        setDragging(true);
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(e) => {
        setDragging(false);
        document.body.style.cursor = "default";

        const newStart = e.target.x() / pxPerSec;
        const delta = newStart - layer.startTime;

        onChange({
          ...layer,
          startTime: newStart,
          endTime: layer.endTime + delta,
        });
      }}
      onClick={() => onSelect(layer.id)}
    >
      {/* Background to increase drag area */}
      <Rect
        width={width}
        height={36}
        fill="transparent"
      />

      {/* Main bar */}
      <Rect
        y={3}
        width={width}
        height={30}
        cornerRadius={4}
        fill="#4f46e5"
        opacity={dragging ? 0.85 : 1}
      />

      {/* Left trim handle */}
      <Rect
        x={0}
        y={3}
        width={HANDLE_SIZE}
        height={30}
        fill="red"
        draggable
        onMouseEnter={() => document.body.style.cursor = "ew-resize"}
        onMouseLeave={() => document.body.style.cursor = "default"}
        onDragMove={(e) => {
          const localX = e.target.x();
          const newStart = (x + localX) / pxPerSec;

          if (layer.endTime - newStart > MIN_DURATION) {
            onChange({ ...layer, startTime: newStart });
          }
        }}
        onDragEnd={() => {
          document.body.style.cursor = "default";
        }}
      />

      {/* Right trim handle */}
      <Rect
        x={width - HANDLE_SIZE}
        y={3}
        width={HANDLE_SIZE}
        height={30}
        fill="red"
        draggable
        onMouseEnter={() => document.body.style.cursor = "ew-resize"}
        onMouseLeave={() => document.body.style.cursor = "default"}
        onDragMove={(e) => {
          const localX = e.target.x();
          const newEnd = (x + localX + HANDLE_SIZE) / pxPerSec;

          if (newEnd - layer.startTime > MIN_DURATION) {
            onChange({ ...layer, endTime: newEnd });
          }
        }}
        onDragEnd={() => {
          document.body.style.cursor = "default";
        }}
      />

      {/* Label */}
      <Text
        text={layer.name}
        x={10}
        y={10}
        fontSize={12}
        fill="white"
        width={width - 20}
        ellipsis
      />
    </Group>
  );
};
