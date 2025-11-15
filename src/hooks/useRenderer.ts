import { useState, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import Konva from "konva";
import { EditorTemplate } from "@/types/editor";

export const useRenderer = () => {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ffmpeg] = useState(() => new FFmpeg());
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);

  const loadFFmpeg = useCallback(async () => {
    if (isFFmpegLoaded) return;

    try {
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      console.log("Loading FFmpeg...");
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsFFmpegLoaded(true);
      console.log("FFmpeg loaded successfully");
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      throw new Error(`Failed to load FFmpeg: ${error}`);
    }
  }, [ffmpeg, isFFmpegLoaded]);

  const captureFrame = useCallback((stage: Konva.Stage): Blob => {
    return stage.toCanvas().toBlob() as Blob;
  }, []);

  const renderVideo = useCallback(
    async (
      stage: Konva.Stage,
      template: EditorTemplate,
      onFrameCapture: (time: number) => void
    ) => {
      setIsRendering(true);
      setProgress(0);

      try {
        // Ensure FFmpeg is loaded
        await loadFFmpeg();
        console.log("Starting video render...", {
          duration: template.duration,
          fps: template.fps,
          width: template.width,
          height: template.height,
        });

        const { duration, fps, width, height } = template;
        const totalFrames = Math.ceil(duration * fps);

        // Set stage size
        stage.width(width);
        stage.height(height);
        stage.draw();

        // Capture frames and write directly to FFmpeg
        for (let i = 0; i < totalFrames; i++) {
          const time = i / fps;
          onFrameCapture(time);

          // Wait for animation frame to render
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              setTimeout(resolve, 16); // ~60fps
            });
          });

          try {
            // Get frame as blob
            const canvas = stage.toCanvas({ pixelRatio: 1 });
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((b) => {
                if (b) resolve(b);
              }, "image/png");
            });

            // Convert blob to Uint8Array
            const arrayBuffer = await blob.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);

            // Write frame to FFmpeg
            const fileName = `frame${String(i).padStart(6, "0")}.png`;
            await ffmpeg.writeFile(fileName, data);

            setProgress((i + 1) / totalFrames * 0.7); // First 70% is capturing
          } catch (frameError) {
            console.error(`Error capturing frame ${i}:`, frameError);
            throw frameError;
          }
        }

        console.log("Frames captured, creating video...");

        // Create video with FFmpeg
        try {
          await ffmpeg.exec([
            "-framerate",
            String(fps),
            "-i",
            "frame%06d.png",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-preset",
            "ultrafast",
            "-crf",
            "28",
            "output.mp4",
          ]);
          setProgress(0.9);
        } catch (ffError) {
          console.error("FFmpeg exec error:", ffError);
          throw new Error(`FFmpeg encoding failed: ${ffError}`);
        }

        // Read output file
        console.log("Reading output file...");
        const data = await ffmpeg.readFile("output.mp4");

        if (!data || (data as Uint8Array).length === 0) {
          throw new Error("Output video file is empty");
        }

        const videoBlob = new Blob([data as BlobPart], { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);

        setProgress(1);
        console.log("Video rendering complete!");

        return url;
      } catch (error) {
        console.error("Rendering failed:", error);
        throw error;
      } finally {
        setIsRendering(false);
        // Clean up FFmpeg files
        try {
          await ffmpeg.deleteFile("*");
        } catch (e) {
          console.warn("Failed to cleanup FFmpeg files:", e);
        }
      }
    },
    [loadFFmpeg, ffmpeg]
  );

  return {
    isRendering,
    progress,
    renderVideo,
    isFFmpegLoaded,
  };
};
