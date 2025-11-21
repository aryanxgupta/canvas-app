import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore, type AIResponse, type LayoutConfig  } from '../store/editorStore';
import { CaseSensitive, Circle, Download, RectangleHorizontal, Triangle, Upload } from 'lucide-react';

const fullCampaign: AIResponse = {
instagram_story: {
    width: 1080,
    height: 1920,
    backgroundColor: "#0f0c29",
    backgroundGradient: {
      type: "linear",
      coords: { x1: 0, y1: 0, x2: 0, y2: 1920 },
      stops: [
        { offset: 0, color: "#24243e" },
        { offset: 0.5, color: "#0f0c29" },
        { offset: 1, color: "#000000" }
      ]
    },
    elements: [
      {
        type: "rect",
        top: 40,
        left: 40,
        width: 1000,
        height: 1840,
        fill: "transparent",
        stroke: "rgba(0, 210, 255, 0.3)",
        strokeWidth: 2
      },
      {
        type: "circle",
        top: 400,
        left: 100,
        radius: 300,
        fill: "rgba(0, 210, 255, 0.05)"
      },
      {
        type: "rect",
        top: 200,
        left: 540,
        originX: "center",
        width: 2,
        height: 100,
        fill: "#00d2ff"
      },
      {
        type: "text",
        content: "PURE",
        top: 320,
        left: 540,
        originX: "center",
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff",
        charSpacing: 200
      },
      {
        type: "text",
        content: "AUDIO",
        top: 400,
        left: 540,
        originX: "center",
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#00d2ff",
        charSpacing: 200
      },
      {
        type: "text",
        content: "SILENCE",
        top: 600,
        left: 540,
        originX: "center",
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff",
        opacity: 0.05,
        scaleX: 2,
        scaleY: 2
      },
      {
        type: "image",
        url: "https://placehold.co/600x600",
        top: 960,
        left: 540,
        originX: "center",
        originY: "center",
        width: 900,
        angle: -10,
        shadow: { color: "rgba(0, 210, 255, 0.4)", blur: 80, offsetY: 40 }
      },
      {
        type: "rect",
        top: 1400,
        left: 200,
        width: 50,
        height: 4,
        fill: "#00d2ff"
      },
      {
        type: "text",
        content: "NOISE CANCELLING",
        top: 1420,
        left: 200,
        fontSize: 30,
        fontFamily: "Oswald",
        color: "#ffffff"
      },
      {
        type: "rect",
        top: 1650,
        left: 540,
        originX: "center",
        width: 500,
        height: 80,
        fill: "transparent",
        stroke: "#00d2ff",
        strokeWidth: 2,
        rx: 40,
        ry: 40
      },
      {
        type: "text",
        content: "PRE-ORDER NOW",
        top: 1672,
        left: 540,
        originX: "center",
        fontSize: 30,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff"
      }
    ]
  },

  instagram_post: {
    width: 1080,
    height: 1080,
    backgroundColor: "#0f0c29",
    backgroundGradient: {
      type: "radial",
      coords: { x1: 540, y1: 540, x2: 540, y2: 540, r1: 0, r2: 800 },
      stops: [
        { offset: 0, color: "#302b63" },
        { offset: 1, color: "#0f0c29" }
      ]
    },
    elements: [
      {
        type: "circle",
        top: 540,
        left: 540,
        originX: "center",
        originY: "center",
        radius: 380,
        fill: "transparent",
        stroke: "#00d2ff",
        strokeWidth: 1,
        opacity: 0.3
      },
      {
        type: "circle",
        top: 540,
        left: 540,
        originX: "center",
        originY: "center",
        radius: 420,
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: 1,
        strokeDashArray: [20, 30],
        opacity: 0.2
      },
      {
        type: "text",
        content: "AETHER",
        top: 100,
        left: 540,
        originX: "center",
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff",
        charSpacing: 150
      },
      {
        type: "rect",
        top: 190,
        left: 540,
        originX: "center",
        width: 60,
        height: 4,
        fill: "#00d2ff"
      },
      {
        type: "text",
        content: "STUDIO",
        top: 480,
        left: 540,
        originX: "center",
        originY: "center",
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff",
        opacity: 0.1,
        scaleX: 3,
        scaleY: 3
      },
      {
        type: "image",
        url: "https://placehold.co/600x600",
        top: 540,
        left: 540,
        originX: "center",
        originY: "center",
        width: 600,
        angle: 5,
        shadow: { color: "rgba(0, 0, 0, 0.6)", blur: 50, offsetY: 30 }
      },
      {
        type: "rect",
        top: 880,
        left: 540,
        originX: "center",
        width: 300,
        height: 70,
        fill: "#ffffff",
        shadow: { color: "rgba(0, 210, 255, 0.4)", blur: 20 }
      },
      {
        type: "text",
        content: "BUY NOW",
        top: 895,
        left: 540,
        originX: "center",
        fontSize: 30,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#0f0c29"
      }
    ]
  },

  facebook_ad: {
    width: 1200,
    height: 628,
    backgroundColor: "#0f0c29",
    backgroundGradient: {
      type: "linear",
      coords: { x1: 0, y1: 0, x2: 1200, y2: 0 },
      stops: [
        { offset: 0, color: "#0f0c29" },
        { offset: 1, color: "#24243e" }
      ]
    },
    elements: [
      {
        type: "rect",
        top: 0,
        left: 700,
        width: 500,
        height: 700,
        fill: "#00d2ff",
        opacity: 0.05,
        angle: 20
      },
      {
        type: "rect",
        top: 30,
        left: 30,
        width: 1140,
        height: 568,
        fill: "transparent",
        stroke: "#ffffff",
        strokeWidth: 2,
        opacity: 0.2
      },
      {
        type: "text",
        content: "WIRELESS",
        top: 160,
        left: 80,
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff"
      },
      {
        type: "text",
        content: "PERFECTION",
        top: 240,
        left: 80,
        fontSize: 70,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#00d2ff"
      },
      {
        type: "rect",
        top: 330,
        left: 80,
        width: 150,
        height: 4,
        fill: "#ffffff"
      },
      {
        type: "text",
        content: "40HR BATTERY LIFE",
        top: 360,
        left: 80,
        fontSize: 26,
        fontFamily: "Roboto",
        color: "#cccccc",
        charSpacing: 50
      },
      {
        type: "rect",
        top: 460,
        left: 80,
        width: 240,
        height: 60,
        fill: "transparent",
        stroke: "#00d2ff",
        strokeWidth: 2
      },
      {
        type: "text",
        content: "SHOP AETHER",
        top: 474,
        left: 200,
        originX: "center",
        fontSize: 24,
        fontFamily: "Oswald",
        fontWeight: "bold",
        color: "#ffffff"
      },
      {
        type: "image",
        url: "https://placehold.co/600x600",
        top: 314,
        left: 900,
        originX: "center",
        originY: "center",
        width: 500,
        angle: -15,
        shadow: { color: "rgba(0, 210, 255, 0.3)", blur: 50 }
      }
    ]
  }
}

// --- 2. TOOLBAR COMPONENT ---
export const Toolbar = () => {
  const { canvas, width, height, aiDesign, setAiDesign } = useEditorStore();
  const [loading, setLoading] = useState(false);

  // --- 3. RENDER ENGINE ---
  const renderDesign = async (data: AIResponse) => {
    if (!canvas) return;
    canvas.clear();

    // Set background
    if (data.backgroundGradient) {
      const bgGradient = new fabric.Gradient({
        type: data.backgroundGradient.type,
        coords: data.backgroundGradient.coords,
        colorStops: data.backgroundGradient.stops
      });
      // @ts-ignore
      canvas.backgroundColor = bgGradient;
    } else {
      // @ts-ignore
      canvas.backgroundColor = data.backgroundColor || '#ffffff';
    }

    // Render Shapes (Rect, Circle, etc.)
    data.elements.forEach(item => {
      if (item.type === 'rect') {
        const rect = new fabric.Rect({
          top: item.top,
          left: item.left,
          width: item.width,
          height: item.height,
          fill: item.fill || 'transparent',
          stroke: item.stroke,
          strokeWidth: item.strokeWidth || 0,
          rx: item.rx || 0,
          ry: item.ry || 0,
          angle: item.angle || 0,
          originX: item.originX || 'left',
          originY: item.originY || 'top',
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        canvas.add(rect);
      }

      if (item.type === 'circle') {
        const circle = new fabric.Circle({
          top: item.top,
          left: item.left,
          radius: item.radius || 50,
          fill: item.fill || 'transparent',
          stroke: item.stroke,
          strokeWidth: item.strokeWidth || 0,
          opacity: item.opacity !== undefined ? item.opacity : 1,
          originX: item.originX || 'left',
          originY: item.originY || 'top',
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        
        // Apply shadow/blur effect if needed
        if (item.blur) {
          circle.set('shadow', new fabric.Shadow({
            color: item.fill || 'rgba(0,0,0,0.5)',
            blur: item.blur,
            offsetX: 0,
            offsetY: 0
          }));
        }
        
        canvas.add(circle);
      }
      
      if (item.type === 'text' && item.content) {
        let baseSize = Math.min(item.fontSize || 40, 80); 
        const textObj = new fabric.IText(item.content, {
          top: item.top,
          left: item.left,
          fontSize: baseSize,
          fontFamily: item.fontFamily || 'Arial',
          fontWeight: item.fontWeight || 'normal',
          fill: item.color || '#000',
          originX: item.originX || 'left',
          originY: item.originY || 'top',
          skewX: item.skewX,
          charSpacing: item.charSpacing || 0,
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        
        // Scale workaround for large text
        if (item.fontSize && item.fontSize > baseSize) {
          textObj.scaleToHeight(item.fontSize);
        }
        canvas.add(textObj);
      }
    });

    // Load images asynchronously
    const imageItems = data.elements.filter(i => i.type === "image" && i.url);
    await Promise.all(imageItems.map(item =>
      new Promise<void>((resolve) => {
        fabric.FabricImage.fromURL(item.url!, { crossOrigin: 'anonymous' }).then(img => {
          img.set({
            top: item.top,
            left: item.left,
            originX: item.originX || 'left',
            originY: item.originY || 'top',
            angle: item.angle || 0,
            selectable: item.selectable !== undefined ? item.selectable : true
          });
          
          if (item.width) img.scaleToWidth(item.width);
          
          if (item.shadow) {
            img.set('shadow', new fabric.Shadow({
              color: item.shadow.color || 'rgba(0,0,0,0.5)',
              blur: item.shadow.blur || 10,
              offsetX: item.shadow.offsetX || 0,
              offsetY: item.shadow.offsetY || 0
            }));
          }

          canvas.add(img);
          // If background texture, send to back, otherwise keep logical order
          // Simple layering: usually images are main subjects, so we keep them added in order
          resolve();
        });
      })
    ));

    canvas.requestRenderAll();
  };

  useEffect(() => {
    if (!aiDesign || !canvas) return;

    console.log(`Detecting size change: ${width}x${height}`);

    let layoutToRender: LayoutConfig | null = null;

    // Match current size to the correct design key
    if (width === 1080 && height === 1920) {
      layoutToRender = aiDesign.instagram_story;
    } else if (width === 1080 && height === 1080) {
      layoutToRender = aiDesign.instagram_post;
    } else if (width === 1200 && height === 628) {
      layoutToRender = aiDesign.facebook_ad;
    }

    if (layoutToRender) {
      renderDesign(layoutToRender);
    }

  }, [width, height, aiDesign, canvas]); // <--- Dependencies trigger the effect  

  // --- 4. LOAD CAMPAIGN ACTION (BURGER AD STYLE) ---
  const loadAIcampaign = async () => {
    setLoading(true);

// MOCK: Simulating AI returning 3 variations for the sneaker ad
    setAiDesign(fullCampaign)
    setLoading(false);
  };

  // --- 5. STANDARD TOOLS ---
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Double Click to Edit', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#333333',
      fontWeight: 'bold'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  };

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      fill: '#ffde7d',
      width: 200,
      height: 100,
      rx: 10,
      ry: 10
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: '#f6416c',
      radius: 60
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const triangle = new fabric.Triangle({
      left: 200,
      top: 200,
      fill: '#6366f1',
      width: 100,
      height: 100
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.requestRenderAll();
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
    const currentZoom = canvas.getZoom();
    const multiplier = (1 / currentZoom) * 3;
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1, multiplier: multiplier, enableRetinaScaling: true });
    const link = document.createElement('a');
    link.download = 'ai-ad-design.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={loadAIcampaign}
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none' }}
        className='font-soft tracking-wider text-xl rounded-xl hover:scale-105 cursor-pointer transition-all duration-75 p-2 py-3 flex items-center justify-center'
      >
        {loading ? <span className="animate-spin">⏳</span> : "AI"}
      </button>
      <hr style={{ width: '100%', borderColor: '#333', margin: '10px 0' }} />

      <button onClick={addText} className='p-3 flex items-center justify-center bg-pink-700 text-white rounded-2xl hover:scale-105 cursor-pointer transition-all duration-75'>
        <CaseSensitive size={32} />
      </button>
      <button onClick={addCircle} className='p-3 flex items-center justify-center bg-pink-700 text-white rounded-2xl hover:scale-105 cursor-pointer transition-all duration-75'>
        <Circle size={32} />
      </button>
      <button onClick={addRectangle} className='p-3 flex items-center justify-center bg-pink-700 text-white rounded-2xl hover:scale-105 cursor-pointer transition-all duration-75'>
        <RectangleHorizontal size={32} />
      </button>
      <button onClick={addTriangle} className='p-3 flex items-center justify-center bg-pink-700 text-white rounded-2xl hover:scale-105 cursor-pointer transition-all duration-75'>
        <Triangle size={32} />
      </button>

      <div style={{ marginTop: '20px', width: '100%' }}>
        <button
          onClick={downloadCanvas}
          style={{ background: '#10b981', color: 'white', border: 'none' }}
          className='text-md rounded-2xl font-soft font-bold p-4 tracking-wider hover:scale-105 cursor-pointer transition-all duration-75 w-full flex justify-center'
        >
          <Download size={24} />
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '80px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '15px',
  padding: '20px 10px',
  backgroundColor: '#060010'
};