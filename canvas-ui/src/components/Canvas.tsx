import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore'; 
import Squares from './Squares';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  const { width, height, setCanvas, setSelectedObject } = useEditorStore();

  // 1. Initialize Fabric
  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: width,
        height: height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true,
        selection: true, // Enable group selection
      });
      
      fabricRef.current = initCanvas;
      setCanvas(initCanvas);

      // Events
      initCanvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
      initCanvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
      initCanvas.on('selection:cleared', () => setSelectedObject(null));

      return () => {
        initCanvas.dispose();
        setCanvas(null);
        fabricRef.current = null;
      };
    }
  }, []);

  // 2. INTERNAL ZOOM LOGIC (Fixes Ghost Screen)
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = fabricRef.current;
      if (!canvas || !containerRef.current) return;

      // Measure the Container (Workspace)
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // Add padding so it doesn't touch edges
      const padding = 60; 
      const availableW = containerWidth - padding;
      const availableH = containerHeight - padding;

      // Calculate the perfect Scale Ratio
      const scaleX = availableW / width;
      const scaleY = availableH / height;
      const zoom = Math.min(scaleX, scaleY); // Fit to screen

      // APPLY ZOOM (The Fix)
      // This physically shrinks the element to fit the screen
      canvas.setZoom(zoom);
      canvas.setDimensions({
        width: width * zoom,
        height: height * zoom
      });
      
      canvas.requestRenderAll();
    };

    // Initial Resize
    resizeCanvas();
    
    // Listen for window changes
    window.addEventListener('resize', resizeCanvas);
    
    // Also resize when the logical width/height changes (e.g. user switches template)
    if(fabricRef.current) {
        resizeCanvas();
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [width, height]); // Re-run when workspace dimensions change

  return (
    <div ref={containerRef} className="workspace">
      <Squares 
        speed={0.3} 
        squareSize={40}
        direction='diagonal' 
        borderColor='#271e37'
        hoverFillColor='#222'
      />
      
      {/* Wrapper is now just a container, no CSS transforms needed */}
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};