import React, { useRef } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/editorStore';
import { CaseSensitive, Circle, Download, RectangleHorizontal, Triangle } from 'lucide-react'

interface AIElement {
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
}

interface AIResponse {
  backgroundColor: string;
  texture?: { url: string; opacity: number; blendMode: string };
  elements: AIElement[];
}

export const Toolbar = () => {
  const { canvas } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Double Click to Edit', {
      left: 100, top: 100, fontFamily: 'Arial', fontSize: 40, fill: '#333333', fontWeight: 'bold',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  };

  const addRectangle = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 150, top: 150, fill: '#ffde7d', width: 200, height: 100, rx: 10, ry: 10
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 150, top: 150, fill: '#f6416c', radius: 60,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const triangle = new fabric.Triangle({
      left: 200, top: 200, fill: '#6366f1', width: 100, height: 100,
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.requestRenderAll();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      if (typeof data === 'string') {
        const imgObj = new Image();
        imgObj.src = data;
        imgObj.onload = () => {
          const imgInstance = new fabric.FabricImage(imgObj);
          imgInstance.scaleToWidth(300);
          imgInstance.set({ left: 200, top: 200 });
          canvas.add(imgInstance);
          canvas.setActiveObject(imgInstance);
          canvas.requestRenderAll();
        };
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; 
  };

  const downloadCanvas = () => {
    if (!canvas) return;
    
    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // 1. Get the current screen zoom (e.g., 0.4 on a laptop)
    const currentZoom = canvas.getZoom();
    
    // 2. Calculate the multiplier to restore original size (1 / 0.4 = 2.5)
    const baseMultiplier = 1 / currentZoom;

    // 3. Add High-Res Multiplier (3x for crisp Retina quality)
    const finalMultiplier = baseMultiplier * 3;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: finalMultiplier,
      enableRetinaScaling: true
    });

    const link = document.createElement('a');
    link.download = 'ai-ad-design.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- AI LOADER ---
  const loadAIcampaign = async () => {
    if (!canvas) return;
    canvas.clear();

    // "THE BLUE NIKE AD" JSON
    const aiResponse: AIResponse = {
      "backgroundColor": "#ffffff",
      "texture": {
         // Subtle Paper Texture
         "url": "https://www.transparenttextures.com/patterns/cream-paper.png",
         "opacity": 0.4,
         "blendMode": "multiply"
      },
      "elements": [
        // 1. Top Badge "On Sale!"
        {
            "type": "rect",
            "top": 60, "left": 540, "width": 200, "height": 60, 
            "fill": "#2c5c94", "rx": 10, "ry": 10, "originX": "center", "originY": "center"
        },
        {
            "type": "text",
            "content": "On Sale !",
            "top": 60, "left": 540, "originX": "center", "originY": "center",
            "fontSize": 30, "fontFamily": "Playfair Display", "fontStyle": "italic", "color": "white"
        },

        // 2. Vertical "NIKE" Text (Split for Layering Effect)
        // "N" and "I" are BEHIND the shoe
        {
            "type": "text",
            "content": "N",
            "top": 600, "left": 280, "fontSize": 650, "fontFamily": "Oswald", "fontWeight": "bold", "color": "#2c5c94",
            "originX": "center", "originY": "center"
        },
        {
            "type": "text",
            "content": "I",
            "top": 600, "left": 480, "fontSize": 650, "fontFamily": "Oswald", "fontWeight": "bold", "color": "#2c5c94",
            "originX": "center", "originY": "center"
        },
        
        // 3. The Shoe (Middle Layer)
        {
            "type": "image",
            "url": "https://images.unsplash.com/photo-1588117305388-c2631a279f82?q=80&w=500&auto=format&fit=crop", // Blue Nike equivalent
            "top": 600, "left": 540, "width": 800, "originX": "center", "originY": "center",
            "angle": -25, // Tilted like the reference
            "shadow": { "color": "rgba(0,0,0,0.4)", "blur": 30, "offsetX": 10, "offsetY": 20 }
        },

        // 4. "K" and "E" are IN FRONT of the shoe (The Layering Trick)
        // Actually, looking at your ref, the shoe is ON TOP of all text.
        // But let's put "E" slightly over the shoe heel for depth
        {
            "type": "text",
            "content": "K",
            "top": 600, "left": 650, "fontSize": 650, "fontFamily": "Oswald", "fontWeight": "bold", "color": "#2c5c94",
            "originX": "center", "originY": "center",
            "selectable": false // Keep it behind
        },
         {
            "type": "text",
            "content": "E",
            "top": 600, "left": 850, "fontSize": 650, "fontFamily": "Oswald", "fontWeight": "bold", "color": "#2c5c94",
            "originX": "center", "originY": "center",
        },

        // 5. The "Ripped Paper" Blue Bottom
        {
            "type": "rect", // Simulating the blue bottom area
            "top": 1400, "left": 0, "width": 1080, "height": 600,
            "fill": "#2c5c94", "selectable": false
        },
        
        // 6. Hand Drawn Arrow (White)
        {
             "type": "text", 
             "content": "↗", // Unicode arrow as placeholder
             "top": 1300, "left": 150, "fontSize": 150, "color": "white", "angle": 45
        },

        // 7. Footer Text
        {
             "type": "text",
             "content": "REJISH PANDIAN",
             "top": 1700, "left": 540, "originX": "center", "fontSize": 30, "fontFamily": "Montserrat", "color": "white", "charSpacing": 200
        }
      ]
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    canvas.backgroundColor = aiResponse.backgroundColor;

    for (const item of aiResponse.elements) {
      let fabricObj;

      if (item.type === 'text' && item.content) {
        fabricObj = new fabric.IText(item.content, {
          top: item.top, left: item.left, fontSize: item.fontSize, fill: item.color || '#000',
          fontFamily: item.fontFamily || 'Arial', fontWeight: item.fontWeight || 'normal',
          originX: item.originX || 'left', originY: item.originY || 'top', // Fix origin
          fontStyle: item.fontStyle === 'italic' ? 'italic' : 'normal',
          stroke: (item as any).stroke || undefined, strokeWidth: (item as any).strokeWidth || 0,
        });
      }

      if (item.type === 'rect') {
        fabricObj = new fabric.Rect({
          top: item.top, left: item.left, width: item.width, height: item.height, fill: item.fill,
          rx: item.rx || 0, ry: item.ry || 0, angle: item.angle || 0,
          originX: item.originX || 'left', originY: item.originY || 'top', 
          selectable: item.selectable !== undefined ? item.selectable : true 
        });
      }

      if (fabricObj) {
        if (item.charSpacing) fabricObj.set('charSpacing', item.charSpacing);
        if (item.blendMode) fabricObj.set('globalCompositeOperation', item.blendMode);
        if (item.skewX) fabricObj.set('skewX', item.skewX);
        if (item.gradient) {
            const gradient = new fabric.Gradient({ type: item.gradient.type, coords: item.gradient.coords, colorStops: item.gradient.stops });
            fabricObj.set('fill', gradient);
        }
        if (item.shadow) fabricObj.set('shadow', new fabric.Shadow({ color: item.shadow.color || 'rgba(0,0,0,0.5)', blur: item.shadow.blur || 10, offsetX: item.shadow.offsetX || 0, offsetY: item.shadow.offsetY || 0 }));
        if (item.glow) fabricObj.set('shadow', new fabric.Shadow({ color: item.glow.color || '#00FFFF', blur: item.glow.blur || 50, offsetX: 0, offsetY: 0 }));
        canvas.add(fabricObj);
      }

      if (item.type === 'image' && item.url) {
          fabric.FabricImage.fromURL(item.url, { crossOrigin: 'anonymous' }).then((img) => {
              img.set({ 
                  top: item.top, left: item.left, 
                  originX: item.originX || 'left', originY: item.originY || 'top', // Fix origin
                  angle: item.angle || 0,
                  selectable: item.selectable !== undefined ? item.selectable : true 
              });
              if (item.filters) {
                const filters = [];
                if (item.filters.blur) filters.push(new fabric.filters.Blur({ blur: item.filters.blur }));
                if (item.filters.brightness) filters.push(new fabric.filters.Brightness({ brightness: item.filters.brightness }));
                if (item.filters.contrast) filters.push(new fabric.filters.Contrast({ contrast: item.filters.contrast }));
                img.filters = filters;
                img.applyFilters(); 
              }
              if (item.skewX) img.set('skewX', item.skewX);
              if (item.blendMode) img.set('globalCompositeOperation', item.blendMode);
              if (item.shadow) img.set('shadow', new fabric.Shadow({ color: item.shadow.color || 'rgba(0,0,0,0.5)', blur: item.shadow.blur || 10, offsetX: item.shadow.offsetX || 0, offsetY: item.shadow.offsetY || 0 }));
              if(item.width) img.scaleToWidth(item.width);
              canvas.add(img);
              if (item.selectable === false) canvas.sendObjectToBack(img);
              canvas.requestRenderAll();
          });
      }
    }

    if (aiResponse.texture) {
       fabric.FabricImage.fromURL(aiResponse.texture.url, { crossOrigin: 'anonymous' }).then((img) => {
          img.set({ left: 0, top: 0, width: canvas.width, height: canvas.height, opacity: aiResponse.texture!.opacity || 0.2,
             selectable: false, evented: false, globalCompositeOperation: aiResponse.texture!.blendMode || 'multiply'
          });
          canvas.add(img);
          canvas.bringObjectToFront(img); 
          canvas.requestRenderAll();
       });
    }
    canvas.requestRenderAll();
  };

  return (
    <div style={containerStyle}>
      <button onClick={loadAIcampaign} style={{background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none'}} className='font-soft tracking-wider text-xl rounded-xl hover:scale-105 cursor-pointer transition-all duration-75 p-2 py-3'>
        AI
      </button>
      

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


      <div style={{marginTop: 'auto', width: '100%'}}>
        <button onClick={downloadCanvas} style={{background: '#10b981', color: 'white', border: 'none'}} className='text-md rounded-2xl font-soft font-bold p-4 tracking-wider hover:scale-105 cursor-pointer transition-all duration-75'>
          <Download size={24}/>
        </button>
      </div>
    </div>
  );
};

const containerStyle = {
  width: '80px',
  // borderRight: '1px solid #ddd',
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '15px',
  padding: '20px 10px',
  backgroundColor: '#060010'
};
