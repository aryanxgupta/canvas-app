import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore'; 
import Squares from './Squares';


export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  const { width, height, setCanvas, setSelectedObject } = useEditorStore();
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        preserveObjectStacking: true ,
      });
      fabricRef.current = initCanvas;

      setCanvas(initCanvas)

      initCanvas.on('selection:created', (e) => {
        setSelectedObject(e.selected[0]);
      });

      initCanvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected[0]);
      });

      initCanvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      return () => {
        initCanvas.dispose();
        fabricRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    const calculateZoom = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const padding = 50;
      const availableWidth = containerWidth - padding;
      const availableHeight = containerHeight - padding;

      const widthRatio = availableWidth / width;
      const heightRatio = availableHeight / height;

      const finalZoom = Math.min(widthRatio, heightRatio);

      setZoom(finalZoom);
    };

    calculateZoom();

    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);
  }, [width, height]); 

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.setDimensions({ width, height });
      fabricRef.current.renderAll();
    }
  }, [width, height]);

  return (
    <div ref={containerRef} className="workspace relative">
      <Squares 
      speed={0.3} 
      squareSize={40}
      direction='diagonal' 
      borderColor='#271e37'
      hoverFillColor='#222'
      
      />
      <div 
        className="canvas-wrapper"
        style={{
          width: width,
          height: height,
          transform: `translate(-50%, -50%) scale(${zoom})`
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};