import { Layer } from "@/types/editor";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
            onValueChange={([value]) => onSeek(value)}
            min={0}
            max={duration}
            step={0.01}
            className="flex-1"
          />
          <span className="text-sm font-mono text-muted-foreground min-w-[80px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto h-[13vh]">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-smooth"
            onClick={() => onLayerSelect(layer.id)}
          >
            <div className="text-xs font-medium min-w-[100px] truncate">
              {layer.name}
            </div>
            <div className="flex-1 relative h-8 bg-secondary rounded">
              <div
                className="absolute top-0 left-0 h-full bg-layer-bar rounded"
                style={{
                  left: `${(layer.startTime / duration) * 100}%`,
                  width: `${((layer.endTime - layer.startTime) / duration) * 100}%`,
                }}
              />
            </div>
            <div className="text-xs text-muted-foreground min-w-[60px] text-right">
              {formatTime(layer.startTime)} - {formatTime(layer.endTime)}
            </div>
          </div>
        ))}
        {layers.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">No layers yet. Add some elements to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
