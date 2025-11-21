import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { useEditorStore, type AIResponse, type LayoutConfig  } from '../store/editorStore';
import { CaseSensitive, Circle, Download, RectangleHorizontal, Triangle, Upload } from 'lucide-react';


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
    const fullCampaign: AIResponse = {
      instagram_story: {
        width: 1080, height: 1920,
        backgroundColor: "#509E66",
        elements: [
          // ... (Your existing vertical sneaker design)
           { type: "text", content: "STORY MODE", top: 100, left: 540, originX: "center", fontSize: 100, color: "white" },
           { type: "image", url: "https://png.pngtree.com/png-clipart/20240901/original/pngtree-sports-shoes-png-image_15910407.png", top: 900, left: 540, originX: "center", originY: "center", width: 900, angle: -15 }
        ]
      },
      instagram_post: {
        width: 1080, height: 1080,
        backgroundColor: "#509E66",
        elements: [
           // A square layout
           { type: "text", content: "SQUARE POST", top: 100, left: 540, originX: "center", fontSize: 80, color: "white" },
           { type: "image", url: "https://png.pngtree.com/png-clipart/20240901/original/pngtree-sports-shoes-png-image_15910407.png", top: 540, left: 540, originX: "center", originY: "center", width: 700, angle: 0 }
        ]
      },
      facebook_ad: {
        width: 1200, height: 628,
        backgroundColor: "#509E66",
        elements: [
           // A landscape layout
           { type: "text", content: "LANDSCAPE AD", top: 50, left: 600, originX: "center", fontSize: 60, color: "white" },
           { type: "image", url: "https://png.pngtree.com/png-clipart/20240901/original/pngtree-sports-shoes-png-image_15910407.png", top: 314, left: 600, originX: "center", originY: "center", width: 500, angle: -10 }
        ]
      }
    };

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