import { useState } from "react";
import { useCanvasEngine } from "@/hooks/useCanvasEngine";
import { useAnimationEngine } from "@/hooks/useAnimationEngine";
import { useTimeline } from "@/hooks/useTimeline";
import { useRenderer } from "@/hooks/useRenderer";
import { EditorCanvas } from "@/components/editor/EditorCanvas";
import PropertiesPanel from "@/components/editor/properties-panel";
// import Timeline from "@/components/editor/timeline";
import { Timeline } from "@/components/editor/timeline";
import { Toolbar } from "@/components/editor/Toolbar";
import { TextLayer, ImageLayer, ShapeLayer, Animation } from "@/types/editor";
import { toast } from "sonner";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, X, CheckCircle2, AlertCircle } from "lucide-react";

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
      setRenderStatus("rendering");
      setRenderError("");
      toast.info("Starting video render...");

      const url = await renderVideo(stageRef.current, template, (time) => {
        seek(time);
      });

      // Download the video
      const a = document.createElement("a");
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setRenderStatus("success");
      toast.success("Video rendered and downloaded successfully!");

      // Auto-close success modal after 3 seconds
      setTimeout(() => setRenderStatus("idle"), 3000);
    } catch (error) {
      console.error("Render error:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to render video";
      setRenderStatus("error");
      setRenderError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const selectedLayer = selectedLayerId ? getLayer(selectedLayerId) : undefined;
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [renderStatus, setRenderStatus] = useState<"idle" | "rendering" | "success" | "error">("idle");
  const [renderError, setRenderError] = useState<string>("");

  return (
    <SidebarProvider>
      <Toolbar
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onAddShape={handleAddShape}
      />
      <SidebarInset className="flex flex-col h-screen overflow-hidden w-full">
        {/* Header */}
        <header className="flex h-12 md:h-16 shrink-0 items-center justify-between px-2 md:px-4 border-b border-border bg-background gap-2">
          <div className="flex items-center gap-1 md:gap-2">
            <SidebarTrigger className="-ml-1 hidden sm:flex" />
            <Separator
              orientation="vertical"
              className="hidden sm:block mr-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-sm md:text-base font-semibold">Video Studio</h1>
          </div>

          <Button
            onClick={handleRenderVideo}
            disabled={isRendering}
            className="ml-auto text-xs md:text-sm py-1 md:py-2"
            size="sm"
          >
            <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">
              {isRendering
                ? `Rendering ${Math.round(progress * 100)}%`
                : "Render Video"}
            </span>
            <span className="sm:hidden">
              {isRendering ? `${Math.round(progress * 100)}%` : "Render"}
            </span>
          </Button>
        </header>

        {/* Main Content Area - Flex column that splits into canvas + timeline */}
        <div className="flex flex-col flex-1 overflow-hidden w-full">
          {/* Canvas + Properties (flex row on desktop) */}
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Canvas - Always visible */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
              <div className="flex-1 overflow-auto bg-muted/50">
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
            </div>

            {/* Properties Panel - Desktop: side panel, Mobile: modal/drawer */}
            <div
              className={`hidden md:flex md:w-80 flex-col border-l border-border bg-card overflow-hidden`}
            >
              <div className="flex-1 overflow-y-auto p-4">
                <PropertiesPanel
                  layer={selectedLayer}
                  onLayerUpdate={updateLayer}
                  onLayerRemove={removeLayer}
                  onLayerDuplicate={duplicateLayer}
                />
              </div>
            </div>

            {/* Mobile Properties Drawer */}
            <div
              className={`fixed md:hidden inset-0 z-50 transition-all duration-300 ${showPropertiesPanel ? "visible" : "invisible"
                }`}
            >
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowPropertiesPanel(false)} />
              <div
                className={`absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-border transform transition-transform duration-300 ${showPropertiesPanel ? "translate-x-0" : "translate-x-full"
                  } overflow-y-auto`}
              >
                <div className="flex items-center justify-between p-3 border-b border-border sticky top-0 bg-card z-10">
                  <h2 className="font-semibold text-sm">Properties</h2>
                  <button
                    onClick={() => setShowPropertiesPanel(false)}
                    className="p-1 hover:bg-accent rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <PropertiesPanel
                    layer={selectedLayer}
                    onLayerUpdate={updateLayer}
                    onLayerRemove={removeLayer}
                    onLayerDuplicate={duplicateLayer}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline - Desktop: below, Mobile: collapsible drawer */}
          <div className="hidden md:flex border-t border-border bg-card h-1/4 overflow-hidden flex-col">
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
              onLayerChange={(l) => updateLayer(l.id, l)}
            />
          </div>
        </div>

        {/* Mobile Bottom Controls */}
        <div className="flex md:hidden border-t border-border bg-card p-2 gap-2">
          <Button
            size="sm"
            variant={showPropertiesPanel ? "default" : "outline"}
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            className="text-xs flex-1"
          >
            Properties
          </Button>
          <Button
            size="sm"
            variant={showTimeline ? "default" : "outline"}
            onClick={() => setShowTimeline(!showTimeline)}
            className="text-xs flex-1"
          >
            Timeline
          </Button>
        </div>

        {/* Mobile Timeline Modal */}
        {showTimeline && (
          <div className="fixed inset-0 md:hidden z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowTimeline(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border h-[40vh] max-h-[60vh] overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between p-3 bg-card border-b border-border z-10">
                <h2 className="font-semibold text-sm">Timeline</h2>
                <button
                  onClick={() => setShowTimeline(false)}
                  className="p-1 hover:bg-accent rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
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
                  onLayerChange={(l) => updateLayer(l.id, l)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Full-Screen Render Progress Modal */}
        {(isRendering || renderStatus !== "idle") && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-card rounded-lg shadow-2xl p-8 max-w-md w-11/12 border border-border">
              {(renderStatus === "rendering" || isRendering) && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-center">Rendering Video</h2>
                    <p className="text-center text-muted-foreground text-sm">
                      Please wait while your video is being processed...
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                    <p className="text-center font-semibold text-lg">
                      {Math.round(progress * 100)}%
                    </p>
                  </div>

                  {/* Details */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      Frames processed: {Math.round(progress * 100)} / 100
                    </p>
                    <p className="text-muted-foreground">
                      Time remaining: ~{Math.max(0, Math.round((1 - progress) * 10))}s
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setRenderStatus("idle")}
                    >
                      Minimize
                    </Button>
                  </div>
                </div>
              )}

              {renderStatus === "success" && !isRendering && (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Success!</h2>
                    <p className="text-muted-foreground">
                      Your video has been rendered and downloaded successfully.
                    </p>
                  </div>
                  <Button
                    onClick={() => setRenderStatus("idle")}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              )}

              {renderStatus === "error" && !isRendering && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <AlertCircle className="w-16 h-16 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-center">Render Failed</h2>
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                      <p className="text-sm text-destructive">
                        {renderError || "An unknown error occurred during rendering"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setRenderStatus("idle")}
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleRenderVideo}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Index;
