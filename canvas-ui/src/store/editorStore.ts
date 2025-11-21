import { create } from 'zustand';
import * as fabric from 'fabric';

// --- TYPES ---

export interface AIElement {
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
  originX?: fabric.TOriginX;
  originY?: fabric.TOriginY;
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

// --- STORE ---

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  
  selectedObject: fabric.Object | null;
  setSelectedObject: (object: fabric.Object | null) => void;

  // Canvas Dimensions
  width: number;
  height: number;
  setSize: (width: number, height: number) => void;

  // AI Data Storage
  aiDesign: AIResponse | null;
  setAiDesign: (design: AIResponse | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  
  selectedObject: null,
  setSelectedObject: (object) => set({ selectedObject: object }),
  
  width: 1080,
  height: 1920, // Default to Story size
  setSize: (width, height) => set({ width, height }),

  aiDesign: null,
  setAiDesign: (design) => set({ aiDesign: design }),
}));