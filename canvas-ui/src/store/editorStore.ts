import { create } from 'zustand';
import { fabric } from 'fabric';

export interface AIElement {
  opacity: undefined;
  textAlign: string;
  scaleX: any;
  scaleY: any;
  radius: number;
  type: string;
  top: number;
  left: number;
  content?: string;
  url?: string;
  width?: number;
  height?: number;
  fill?: string;
  angle?: number;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  fontStyle?: string;
  color?: string;
  selectable?: boolean;
  rx?: number;
  ry?: number;
  originX?: string;
  originY?: string;
  shadow?: { color?: string; blur?: number; offsetX?: number; offsetY?: number };
  glow?: { color?: string; blur?: number };
  skewX?: number;
  skewY?: number;
  gradient?: {
    type: 'linear' | 'radial';
    coords: { x1: number, y1: number, x2: number, y2: number };
    stops: Array<{ offset: number, color: string }>;
  };
  charSpacing?: number;
  blendMode?: string;
  filters?: { blur?: number; brightness?: number; contrast?: number };
  stroke?: string;
  strokeWidth?: number;
  blur?: number;        // simple 0-1
  brightness?: number;  // simple -1 to 1
  contrast?: number;    // simple -1 to 1
}

export interface LayoutConfig {
  width: number;
  height: number;
  backgroundColor: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    coords: { x1: number, y1: number, x2: number, y2: number };
    stops: Array<{ offset: number, color: string }>;
  };
  texture?: { url: string; opacity: number; blendMode: string };
  elements: AIElement[];
}

export interface AIResponse {
  instagram_story: LayoutConfig;
  instagram_post: LayoutConfig;
  facebook_ad: LayoutConfig;
}

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  
  selectedObject: fabric.Object | null;
  setSelectedObject: (object: fabric.Object | null) => void;

  width: number;
  height: number;
  setSize: (width: number, height: number) => void;

  aiDesign: AIResponse | null;
  setAiDesign: (design: AIResponse | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  
  selectedObject: null,
  setSelectedObject: (object) => set({ selectedObject: object }),
  
  width: 1080,
  height: 1920,
  setSize: (width, height) => set({ width, height }),

  aiDesign: null,
  setAiDesign: (design) => set({ aiDesign: design }),
}));