import { useState } from "react";
import { useCanvasEngine } from "@/hooks/useCanvasEngine";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { useTimeline } from "@/hooks/useTimeline";
import { useRenderer } from "@/hooks/useRenderer";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { Timeline } from "@/components/editor/Timeline";
import { Toolbar } from "@/components/editor/Toolbar";
import { TextLayer, ImageLayer, ShapeLayer, Animation } from "@/types/editor";
import { toast } from "sonner";

const Index = () => {
  const {
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
  } = useCanvasEngine();

  const { currentTime, isPlaying, play, pause, stop, seek } = useTimeline(
    template.duration
  );

  const animatedLayers = useAnimationEngine(
    template.layers,
    template.animations,
    currentTime
  );

  const { isRendering, progress, renderVideo } = useRenderer();

  const handleAddText = () => {
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      name: "New Text",
      content: "Double click to edit",
      x: 400,
      y: 300,
      fontSize: 48,
      fontFamily: "Inter",
      fill: "#ffffff",
      startTime: 0,
      endTime: template.duration,
      opacity: 1,
      visible: true,
    };
    addLayer(newLayer);
    toast.success("Text layer added");
  };

  const handleAddImage = (src: string) => {
    const newLayer: ImageLayer = {
      id: `image-${Date.now()}`,
      type: "image",
      name: "New Image",
      src,
      x: 400,
      y: 300,
      width: 200,
      height: 200,
      startTime: 0,
      endTime: template.duration,
      opacity: 1,
      visible: true,
    };
    addLayer(newLayer);
    toast.success("Image layer added");
  };

  const handleAddShape = (shapeType: "rectangle" | "circle") => {
    const newLayer: ShapeLayer = {
      id: `shape-${Date.now()}`,
      type: "shape",
      name: `New ${shapeType}`,
      shapeType,
      x: 400,
      y: 300,
      width: 200,
      height: 200,
      fill: "#3b82f6",
      startTime: 0,
      endTime: template.duration,
      opacity: 1,
      visible: true,
    };
    addLayer(newLayer);
    toast.success(`${shapeType} added`);
  };

  const handleRenderVideo = async () => {
    if (!stageRef.current) {
      toast.error("Canvas not ready");
      return;
    }

    if (template.layers.length === 0) {
      toast.error("Add some layers before rendering");
      return;
    }

    try {
      toast.info("Starting video render...");
      
      const url = await renderVideo(stageRef.current, template, (time) => {
        seek(time);
      });

      // Download the video
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      a.click();

      toast.success("Video rendered successfully!");
    } catch (error) {
      console.error("Render error:", error);
      toast.error("Failed to render video");
    }
  };

  const selectedLayer = selectedLayerId ? getLayer(selectedLayerId) : undefined;

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onAddShape={handleAddShape}
        onRenderVideo={handleRenderVideo}
        isRendering={isRendering}
        renderProgress={progress}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-8">
          <EditorCanvas
            layers={animatedLayers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={setSelectedLayerId}
            onLayerUpdate={updateLayer}
            stageRef={stageRef}
            width={template.width}
            height={template.height}
          />
        </div>

        <PropertiesPanel
          layer={selectedLayer}
          onLayerUpdate={updateLayer}
          onLayerRemove={removeLayer}
          onLayerDuplicate={duplicateLayer}
        />
      </div>

      <Timeline
        layers={template.layers}
        currentTime={currentTime}
        duration={template.duration}
        isPlaying={isPlaying}
        onPlay={play}
        onPause={pause}
        onStop={stop}
        onSeek={seek}
        onLayerSelect={setSelectedLayerId}
      />
    </div>
  );
};

export default Index;
