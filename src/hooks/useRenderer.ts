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
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      setIsFFmpegLoaded(true);
    } catch (error) {
      console.error("Failed to load FFmpeg:", error);
      throw error;
    }
  }, [ffmpeg, isFFmpegLoaded]);

  const captureFrame = useCallback((stage: Konva.Stage): string => {
    return stage.toDataURL({ pixelRatio: 1 });
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
        await loadFFmpeg();

        const { duration, fps } = template;
        const totalFrames = Math.ceil(duration * fps);
        const frames: string[] = [];

        // Capture frames
        for (let i = 0; i < totalFrames; i++) {
          const time = i / fps;
          onFrameCapture(time);

          // Wait for next frame to ensure Konva has updated
          await new Promise((resolve) => setTimeout(resolve, 10));

          const dataUrl = captureFrame(stage);
          frames.push(dataUrl);

          setProgress((i + 1) / totalFrames * 0.5); // First 50% is capturing
        }

        // Convert frames to video using FFmpeg
        for (let i = 0; i < frames.length; i++) {
          const response = await fetch(frames[i]);
          const blob = await response.blob();
          const data = await fetchFile(blob);
          await ffmpeg.writeFile(`frame${String(i).padStart(5, "0")}.png`, data);
          setProgress(0.5 + (i + 1) / frames.length * 0.3); // 50-80% is writing frames
        }

        // Create video
        await ffmpeg.exec([
          "-framerate",
          String(fps),
          "-pattern_type",
          "glob",
          "-i",
          "frame*.png",
          "-c:v",
          "libx264",
          "-pix_fmt",
          "yuv420p",
          "-movflags",
          "+faststart",
          "output.mp4",
        ]);

        setProgress(0.9); // 90% done

        const data = await ffmpeg.readFile("output.mp4");
        const videoBlob = new Blob([data as BlobPart], { type: "video/mp4" });
        const url = URL.createObjectURL(videoBlob);

        setProgress(1); // 100% done

        return url;
      } catch (error) {
        console.error("Rendering failed:", error);
        throw error;
      } finally {
        setIsRendering(false);
      }
    },
    [loadFFmpeg, captureFrame, ffmpeg]
  );

  return {
    isRendering,
    progress,
    renderVideo,
    isFFmpegLoaded,
  };
};
