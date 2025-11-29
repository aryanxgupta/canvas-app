import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '../store/editorStore'; 
import Squares from './Squares';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);

  const { width, height, setCanvas, setSelectedObject } = useEditorStore();

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || isReadyRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true,
      enableRetinaScaling: true,
    });
    
    isReadyRef.current = true;
    setCanvas(initCanvas);

    initCanvas.on('selection:created', (e: any) => setSelectedObject(e.selected ? e.selected[0] : null));
    initCanvas.on('selection:updated', (e: any) => setSelectedObject(e.selected ? e.selected[0] : null));
    initCanvas.on('selection:cleared', () => setSelectedObject(null));

    const handleResize = () => {
      if (!containerRef.current || !initCanvas) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const padding = 60; 
      const availableW = containerWidth - padding;
      const availableH = containerHeight - padding;

      const scaleX = availableW / width;
      const scaleY = availableH / height;
      const zoom = Math.min(scaleX, scaleY); 

      initCanvas.setZoom(zoom);
      
      initCanvas.setWidth(width * zoom);
      initCanvas.setHeight(height * zoom);
      
      initCanvas.renderAll();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      initCanvas.dispose();
      setCanvas(null);
      isReadyRef.current = false;
    };
  }, [width, height, setCanvas, setSelectedObject]); 

  return (
    <div 
      ref={containerRef} 
      className="workspace" 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}
    >
      <Squares 
        speed={0.3} 
        squareSize={40}
        direction='diagonal' 
        borderColor='#271e37'
        hoverFillColor='#222'
      />
      
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};