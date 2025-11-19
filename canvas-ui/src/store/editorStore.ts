import { create } from 'zustand';
import * as fabric from 'fabric';

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  
  selectedObject: fabric.Object | null; // The active shape
  setSelectedObject: (object: fabric.Object | null) => void;

  width: number;
  height: number;
  setSize: (width: number, height: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  
  selectedObject: null,
  setSelectedObject: (object) => set({ selectedObject: object }),
  
  width: 1080,
  height: 1080,
  setSize: (width, height) => set({ width, height }),
}));