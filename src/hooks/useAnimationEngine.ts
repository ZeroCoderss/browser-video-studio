import { useMemo } from "react";
import { Animation, Layer, EasingType } from "@/types/editor";

const easing = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export const useAnimationEngine = (
  layers: Layer[],
  animations: Animation[],
  currentTime: number
) => {
  const animatedLayers = useMemo(() => {
    return layers.map((layer) => {
      const layerAnimations = animations.filter(
        (anim) => anim.layerId === layer.id
      );

      let animatedProps = { ...layer };

      layerAnimations.forEach((animation) => {
        if (
          currentTime >= animation.startTime &&
          currentTime <= animation.endTime
        ) {
          const progress =
            (currentTime - animation.startTime) /
            (animation.endTime - animation.startTime);
          const easingFunc = easing[animation.easing || "linear"];
          const easedProgress = easingFunc(progress);

          switch (animation.type) {
            case "fadeIn":
              animatedProps.opacity = easedProgress;
              break;
            case "fadeOut":
              animatedProps.opacity = 1 - easedProgress;
              break;
            case "slideUp":
              animatedProps.y = layer.y + (1 - easedProgress) * 100;
              break;
            case "zoomIn":
              animatedProps.scaleX = easedProgress;
              animatedProps.scaleY = easedProgress;
              break;
          }
        } else if (currentTime < animation.startTime) {
          // Before animation starts
          switch (animation.type) {
            case "fadeIn":
              animatedProps.opacity = 0;
              break;
            case "zoomIn":
              animatedProps.scaleX = 0;
              animatedProps.scaleY = 0;
              break;
          }
        }
      });

      // Check if layer should be visible based on time
      const isVisible =
        currentTime >= layer.startTime && currentTime <= layer.endTime;
      animatedProps.visible = isVisible && (animatedProps.visible ?? true);

      return animatedProps;
    });
  }, [layers, animations, currentTime]);

  return animatedLayers;
};
