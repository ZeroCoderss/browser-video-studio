import { useState, useCallback, useEffect, useRef } from "react";

export const useTimeline = (duration: number) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const play = useCallback(() => {
    setIsPlaying(true);
    lastTimeRef.current = performance.now();
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const seek = useCallback(
    (time: number) => {
      setCurrentTime(Math.max(0, Math.min(time, duration)));
    },
    [duration]
  );

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      setCurrentTime((prev) => {
        const newTime = prev + deltaTime;
        if (newTime >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return newTime;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, duration]);

  return {
    currentTime,
    isPlaying,
    play,
    pause,
    stop,
    seek,
  };
};
