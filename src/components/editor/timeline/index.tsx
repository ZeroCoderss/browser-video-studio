import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { CanvasTimeline } from "./CanvasTimeline";
import { Layer } from "@/types/editor";

interface TimelineProps {
  layers: Layer[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onLayerSelect: (id: string) => void;
  onLayerChange: (layer: Layer) => void;
}

export const Timeline = ({
  layers,
  currentTime,
  duration,
  isPlaying,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onLayerSelect,
  onLayerChange,
}: TimelineProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-timeline-bg border-t border-border p-2 space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {!isPlaying ? (
            <Button size="sm" onClick={onPlay}>
              <Play className="w-4 h-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={onPause}>
              <Pause className="w-4 h-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={onStop}>
            <Square className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 flex items-center gap-4">
          <span className="text-sm font-mono text-muted-foreground">
            {formatTime(currentTime)}
          </span>

          <Slider
            value={[currentTime]}
            onValueChange={([v]) => onSeek(v)}
            min={0}
            max={duration}
            step={0.01}
            className="flex-1"
          />

          <span className="text-sm font-mono min-w-[80px] text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      {/* Canvas Timeline */}
      <CanvasTimeline
        duration={duration}
        currentTime={currentTime}
        layers={layers}
        onSeek={onSeek}
        onLayerSelect={onLayerSelect}
        onLayerChange={onLayerChange}
      />
    </div>
  );
};
