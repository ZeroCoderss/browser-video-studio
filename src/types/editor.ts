export type LayerType = "text" | "image" | "shape" | "background";

export type AnimationType = "fadeIn" | "fadeOut" | "slideUp" | "zoomIn";

export type EasingType = "linear" | "easeIn" | "easeOut" | "easeInOut";

export interface BaseLayer {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  visible?: boolean;
  locked?: boolean;
  startTime: number;
  endTime: number;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fill?: string;
  align?: string;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  shapeType: "rectangle" | "circle" | "triangle";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface BackgroundLayer extends BaseLayer {
  type: "background";
  fill?: string;
  imageSrc?: string;
}

export type Layer = TextLayer | ImageLayer | ShapeLayer | BackgroundLayer;

export interface Animation {
  id: string;
  layerId: string;
  type: AnimationType;
  startTime: number;
  endTime: number;
  easing?: EasingType;
}

export interface EditorTemplate {
  duration: number;
  width: number;
  height: number;
  fps: number;
  layers: Layer[];
  animations: Animation[];
  audio?: {
    src: string;
    volume: number;
  };
}

export interface TransformState {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}
