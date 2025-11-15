import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Type, Image, Square, Circle, Download, Upload } from "lucide-react";
import { TextLayer, ImageLayer, ShapeLayer } from "@/types/editor";
import { useRef } from "react";

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: (src: string) => void;
  onAddShape: (shapeType: "rectangle" | "circle") => void;
  onRenderVideo: () => void;
  isRendering: boolean;
  renderProgress: number;
}

export const Toolbar = ({
  onAddText,
  onAddImage,
  onAddShape,
  onRenderVideo,
  isRendering,
  renderProgress,
}: ToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onAddImage(src);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-16 bg-card border-b border-border px-4 flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onAddText}>
        <Type className="w-4 h-4 mr-2" />
        Add Text
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        <Image className="w-4 h-4 mr-2" />
        Add Image
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddShape("rectangle")}
      >
        <Square className="w-4 h-4 mr-2" />
        Rectangle
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddShape("circle")}
      >
        <Circle className="w-4 h-4 mr-2" />
        Circle
      </Button>

      <Separator orientation="vertical" className="h-8 mx-2" />

      <Button
        onClick={onRenderVideo}
        disabled={isRendering}
        className="ml-auto"
      >
        <Download className="w-4 h-4 mr-2" />
        {isRendering
          ? `Rendering ${Math.round(renderProgress * 100)}%`
          : "Render Video"}
      </Button>
    </div>
  );
};
