import { Stage, Layer as KonvaLayer, Line, Text } from "react-konva";
import { TimelineLayerItem } from "./TimelineLayerItem";
import { Layer } from "@/types/editor";

interface CanvasTimelineProps {
  duration: number;
  currentTime: number;
  layers: Layer[];
  onSeek: (time: number) => void;
  onLayerSelect: (id: string) => void;
  onLayerChange: (l: Layer) => void;
}

export const CanvasTimeline = ({
  duration,
  currentTime,
  layers,
  onLayerSelect,
  onLayerChange,
}: CanvasTimelineProps) => {
  const PX_PER_SECOND = 140;
  const width = duration * PX_PER_SECOND;

  return (
    <div className="w-full h-[160px] overflow-x-auto bg-neutral-900 rounded flex justify-center">
      <Stage width={width} height={160}>
        <KonvaLayer>
          {/* Playhead */}
          <Line
            points={[currentTime * PX_PER_SECOND, 0, currentTime * PX_PER_SECOND, 160]}
            stroke="red"
            strokeWidth={2}
          />

          {/* Second grid lines */}
          {Array.from({ length: Math.ceil(duration+1) }).map((_, i) => (
            <Line
              key={`grid-${i}`}
              points={[i * PX_PER_SECOND, 0, i * PX_PER_SECOND, 160]}
              stroke="rgba(255,255,255,0.08)"
            />
          ))}

          {/* Second labels */}
          {Array.from({ length: Math.ceil(duration) }).map((_, i) => (
            <Text
              key={`label-${i}`}
              x={i * PX_PER_SECOND + 4}
              y={4}
              fontSize={12}
              text={`${i}s`}
              fill="#ccc"
            />
          ))}

          {/* Layer Items */}
          {layers.map((layer) => (
            <TimelineLayerItem
              key={layer.id}
              layer={layer}
              pxPerSec={PX_PER_SECOND}
              onChange={onLayerChange}
              onSelect={onLayerSelect}
            />
          ))}
        </KonvaLayer>
      </Stage>
    </div>
  );
};
