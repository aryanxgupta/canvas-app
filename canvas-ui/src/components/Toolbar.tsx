import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { useEditorStore, type AIResponse, type LayoutConfig  } from '../store/editorStore';
import { 
  CaseSensitive, 
  Circle, 
  Download, 
  RectangleHorizontal, 
  Triangle, 
  Sparkles 
} from 'lucide-react';
import { ValidateButton } from './ValidateButton';

// --- FULL MOCK DATA ---
export const fullCampaign: AIResponse = {
  "instagram_story": {
    "width": 1080,
    "height": 1920,
    "backgroundColor": "#ffffff",
    "backgroundGradient": {
      "type": "linear",
      "coords": { "x1": 0, "y1": 0, "x2": 0, "y2": 1920 },
      "stops": [
        { "offset": 0, "color": "#fdfbfb" },
        { "offset": 1, "color": "#d4fc79" }
      ]
    },
    "elements": [
      // LOGO (Top Center - Below 250px safe zone)
      {
        "type": "image",
        "url": "https://via.placeholder.com/200x100?text=LOGO",
        "top": 300,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "scaleX": 1.2,
        "scaleY": 1.2,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // HEADLINE
      {
        "type": "text",
        "content": "SUMMER SPECIAL",
        "top": 420,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "fontSize": 60,
        "fontFamily": "Oswald",
        "fontWeight": "bold",
        "fill": "#333",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // SUBHEADLINE
      {
        "type": "text",
        "content": "Refresh your senses",
        "top": 490,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "fontSize": 35,
        "fontFamily": "Arial",
        "fill": "#666",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // PRODUCT (Dynamic Scale)
      {
        "type": "image",
        "url": "https://via.placeholder.com/800x800?text=Product",
        "top": 920,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "scaleX": 0.85,
        "scaleY": 0.85,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      
      // --- CLUBCARD STACK (Flattened) ---
      // 1. Regular Price Rect (White)
      {
        "type": "rect",
        "top": 1300,
        "left": 380,
        "width": 320,
        "height": 60,
        "fill": "#ffffff",
        "stroke": "#cccccc",
        "strokeWidth": 2,
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 2. Regular Price Text
      {
        "type": "text",
        "content": "Reg: €12.00",
        "top": 1315,
        "left": 450,
        "fontSize": 32,
        "fill": "#333",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 3. Promo Yellow Rect (Starts 5px below Reg)
      // Top = 1300 + 60 + 5 = 1365
      {
        "type": "rect",
        "top": 1365,
        "left": 380,
        "width": 320,
        "height": 120,
        "fill": "#FFD700",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 4. Promo Price Text
      {
        "type": "text",
        "content": "€9.00",
        "top": 1385,
        "left": 450,
        "fontSize": 75,
        "fontWeight": "bold",
        "fill": "black",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 5. Blue Clubcard Label (Rounded, Inside Yellow)
      // Placed near bottom of yellow rect
      {
        "type": "rect",
        "top": 1450,
        "left": 400,
        "width": 280,
        "height": 30,
        "fill": "#00539F",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 6. Clubcard Label Text
      {
        "type": "text",
        "content": "Clubcard Price",
        "top": 1455,
        "left": 475,
        "fontSize": 18,
        "fontWeight": "bold",
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // --- LEGAL PILL (Separate - Flattened) ---
      // Must be below stack with margin. Stack ends at 1365 + 120 = 1485.
      // Pill Top = 1485 + 30px margin = 1515
      {
        "type": "rect",
        "top": 1515,
        "left": 370,
        "width": 340,
        "height": 40,
        "fill": "#00539F",
        "rx": 20,
        "ry": 20,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Clubcard/app required. Ends: 24/08",
        "top": 1523,
        "left": 395,
        "fontSize": 16,
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // DRINKAWARE (Bottom Right - Above 250px safe zone)
      {
        "type": "image",
        "url": "https://res.cloudinary.com/video-app-/image/upload/v1764867609/drinkaware_logo_rgb_znlbh0.png",
        "top": 1550,
        "left": 850,
        "width": 150,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      }
    ]
  },
  "instagram_post": {
    "width": 1080,
    "height": 1080,
    "backgroundColor": "#ffffff",
    "backgroundGradient": {
      "type": "linear",
      "coords": { "x1": 0, "y1": 0, "x2": 1080, "y2": 1080 },
      "stops": [
        { "offset": 0, "color": "#fdfbfb" },
        { "offset": 1, "color": "#ebedee" }
      ]
    },
    "elements": [
      // LOGO
      {
        "type": "image",
        "url": "https://via.placeholder.com/150x80?text=LOGO",
        "top": 40,
        "left": 40,
        "width": 150,
        "originX": "left",
        "originY": "top",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // EXCLUSIVE TAG
      {
        "type": "image",
        "url": "https://res.cloudinary.com/video-app-/image/upload/v1764857735/exclusive-tag_hri0yi.png",
        "top": 40,
        "left": 880,
        "width": 160,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // HEADLINE
      {
        "type": "text",
        "content": "SUMMER SPECIAL",
        "top": 150,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "fontSize": 70,
        "fontFamily": "Oswald",
        "fontWeight": "bold",
        "fill": "#333",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // SUBHEADLINE
      {
        "type": "text",
        "content": "Refresh your senses",
        "top": 220,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "fontSize": 35,
        "fontFamily": "Arial",
        "fill": "#666",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // PRODUCT
      {
        "type": "image",
        "url": "https://via.placeholder.com/600x600?text=Product",
        "top": 540,
        "left": 540,
        "originX": "center",
        "originY": "center",
        "scaleX": 0.8,
        "scaleY": 0.8,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // --- CLUBCARD STACK (Flattened) ---
      // Base Top: 780, Left: 720
      // 1. Reg Price
      {
        "type": "rect",
        "top": 780,
        "left": 720,
        "width": 320,
        "height": 60,
        "fill": "#ffffff",
        "stroke": "#cccccc",
        "strokeWidth": 2,
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Reg: €12.00",
        "top": 795,
        "left": 790,
        "fontSize": 32,
        "fill": "#333",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 2. Promo Price (Top + 60 + 5px Gap = 845)
      {
        "type": "rect",
        "top": 845,
        "left": 720,
        "width": 320,
        "height": 120,
        "fill": "#FFD700",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "€9.00",
        "top": 865,
        "left": 790,
        "fontSize": 75,
        "fontWeight": "bold",
        "fill": "black",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 3. Blue Rounded Label (Inside Yellow)
      {
        "type": "rect",
        "top": 930,
        "left": 740,
        "width": 280,
        "height": 30,
        "fill": "#00539F",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Clubcard Price",
        "top": 935,
        "left": 815,
        "fontSize": 18,
        "fontWeight": "bold",
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // --- LEGAL PILL (Flattened) ---
      // Base Top: 1000, Left: Center
      {
        "type": "rect",
        "top": 1000,
        "left": 370,
        "width": 340,
        "height": 40,
        "fill": "#00539F",
        "rx": 20,
        "ry": 20,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Clubcard/app required. Ends: 24/08",
        "top": 1008,
        "left": 395,
        "fontSize": 16,
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // DRINKAWARE
      {
        "type": "image",
        "url": "https://res.cloudinary.com/video-app-/image/upload/v1764867609/drinkaware_logo_rgb_znlbh0.png",
        "top": 980,
        "left": 40,
        "width": 150,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      }
    ]
  },
  "facebook_ad": {
    "width": 1200,
    "height": 628,
    "backgroundColor": "#ffffff",
    "backgroundGradient": {
      "type": "linear",
      "coords": { "x1": 0, "y1": 0, "x2": 1200, "y2": 0 },
      "stops": [
        { "offset": 0, "color": "#fdfbfb" },
        { "offset": 1, "color": "#d4fc79" }
      ]
    },
    "elements": [
      // LOGO
      {
        "type": "image",
        "url": "https://via.placeholder.com/150x80?text=LOGO",
        "top": 30,
        "left": 30,
        "width": 120,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // HEADLINE
      {
        "type": "text",
        "content": "SUMMER SPECIAL",
        "top": 130,
        "left": 30,
        "fontSize": 50,
        "fontFamily": "Oswald",
        "fontWeight": "bold",
        "fill": "#333",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // SUBHEADLINE
      {
        "type": "text",
        "content": "Refresh your senses",
        "top": 190,
        "left": 30,
        "fontSize": 30,
        "fontFamily": "Arial",
        "fill": "#666",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // --- CLUBCARD STACK (Flattened) ---
      // Base Top: 280, Left: 30
      // 1. Reg Price
      {
        "type": "rect",
        "top": 280,
        "left": 30,
        "width": 320,
        "height": 60,
        "fill": "#ffffff",
        "stroke": "#cccccc",
        "strokeWidth": 2,
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Reg: €12.00",
        "top": 295,
        "left": 100,
        "fontSize": 32,
        "fill": "#333",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 2. Promo Price (Top + 60 + 5px Gap = 345)
      {
        "type": "rect",
        "top": 345,
        "left": 30,
        "width": 320,
        "height": 120,
        "fill": "#FFD700",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "€9.00",
        "top": 365,
        "left": 100,
        "fontSize": 75,
        "fontWeight": "bold",
        "fill": "black",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // 3. Blue Rounded Label (Inside Yellow)
      {
        "type": "rect",
        "top": 430,
        "left": 50,
        "width": 280,
        "height": 30,
        "fill": "#00539F",
        "rx": 15,
        "ry": 15,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Clubcard Price",
        "top": 435,
        "left": 125,
        "fontSize": 18,
        "fontWeight": "bold",
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // --- LEGAL PILL (Flattened) ---
      // Below stack. Stack bottom: 345 + 120 = 465.
      // Top = 465 + 24px = 489
      {
        "type": "rect",
        "top": 489,
        "left": 30,
        "width": 340,
        "height": 40,
        "fill": "#00539F",
        "rx": 20,
        "ry": 20,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      {
        "type": "text",
        "content": "Clubcard/app required. Ends: 24/08",
        "top": 497,
        "left": 55,
        "fontSize": 16,
        "fill": "white",
        "fontFamily": "Arial",
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },

      // PRODUCT
      {
        "type": "image",
        "url": "https://via.placeholder.com/600x600?text=Product",
        "top": 314,
        "left": 900,
        "originX": "center",
        "originY": "center",
        "scaleX": 0.9,
        "scaleY": 0.9,
        opacity: undefined,
        textAlign: '',
        radius: 0
      },
      // DRINKAWARE
      {
        "type": "image",
        "url": "https://res.cloudinary.com/video-app-/image/upload/v1764867609/drinkaware_logo_rgb_znlbh0.png",
        "top": 550,
        "left": 1020,
        "width": 150,
        scaleX: undefined,
        scaleY: undefined,
        opacity: undefined,
        textAlign: '',
        radius: 0
      }
    ]
  }
};
// --- TOOLBAR COMPONENT ---
export const Toolbar = () => {
  const { canvas, width, height, aiDesign, setAiDesign } = useEditorStore();
  const [loading, setLoading] = useState(false);

  // --- ACTIONS ---
  const loadAIcampaign = async () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        setAiDesign(fullCampaign); 
        setLoading(false);
    }, 500);
  };

  const renderDesign = async (data: LayoutConfig) => {
    if (!canvas) return;
    canvas.clear();

    // 1. Set Background
    if (data.backgroundGradient) {
      const bgGradient = new fabric.Gradient({
        type: data.backgroundGradient.type,
        coords: data.backgroundGradient.coords,
        colorStops: data.backgroundGradient.stops
      });
      canvas.setBackgroundColor(bgGradient as any, canvas.renderAll.bind(canvas));
    } else {
      canvas.setBackgroundColor(data.backgroundColor || '#ffffff', canvas.renderAll.bind(canvas));
    }

    // 2. Render Elements
    const renderPromises = data.elements.map(async (item) => {
      // RECTANGLE
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
          originX: item.originX as any || 'left',
          originY: item.originY as any || 'top',
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        
        // Add shadow for rects
        if (item.shadow) {
          // @ts-ignore
          rect.set('shadow', new fabric.Shadow({ ...item.shadow }));
        }
        
        canvas.add(rect);
      }

      // CIRCLE
      if (item.type === 'circle') {
        const circle = new fabric.Circle({
          top: item.top,
          left: item.left,
          radius: item.radius || 50,
          fill: item.fill || 'transparent',
          stroke: item.stroke,
          strokeWidth: item.strokeWidth || 0,
          opacity: item.opacity !== undefined ? item.opacity : 1,
          originX: item.originX as any || 'left',
          originY: item.originY as any || 'top',
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        
        if (item.shadow) {
          // @ts-ignore
          circle.set('shadow', new fabric.Shadow({ ...item.shadow }));
        }
        canvas.add(circle);
      }
      
      // TEXT ✅ FIXED - Now uses item.fill || item.color
      if (item.type === 'text' && item.content) {
        let baseSize = Math.min(item.fontSize || 40, 80); 
        const textObj = new fabric.IText(item.content, {
          top: item.top,
          left: item.left,
          fontSize: baseSize,
          fontFamily: item.fontFamily || 'Arial',
          fontWeight: item.fontWeight || 'normal',
          fill: item.fill || item.color || '#333333', // ✅ FIXED: Prioritizes 'fill' from mock data
          textAlign: item.textAlign || 'left',
          originX: item.originX as any || 'left',
          originY: item.originY as any || 'top',
          skewX: item.skewX,
          charSpacing: item.charSpacing || 0,
          selectable: item.selectable !== undefined ? item.selectable : true
        });
        
        if (item.fontSize && item.fontSize > baseSize) {
          textObj.scaleToHeight(item.fontSize);
        }
        if (item.scaleX) textObj.set({ scaleX: item.scaleX });
        if (item.scaleY) textObj.set({ scaleY: item.scaleY });
        if (item.opacity) textObj.set({ opacity: item.opacity });

        canvas.add(textObj);
      }

      // IMAGE (Using correct v5 syntax)
      if (item.type === 'image' && item.url) {
        return new Promise<void>((resolve) => {
          fabric.Image.fromURL(item.url!, (img) => {
            img.set({
              top: item.top,
              left: item.left,
              originX: item.originX as any || 'left',
              originY: item.originY as any || 'top',
              angle: item.angle || 0,
              selectable: item.selectable !== undefined ? item.selectable : true
            });
            
            if (item.width) img.scaleToWidth(item.width);
            
            // --- SHADOW FIX ---
            if (item.shadow) {
              // @ts-ignore
              img.set('shadow', new fabric.Shadow({ ...item.shadow }));
            }

            // --- FILTERS FIX (New Code) ---
            // @ts-ignore
            if (item.filters && Array.isArray(item.filters)) {
                const newFilters: fabric.IBaseFilter[] = [];
                
                // @ts-ignore
                item.filters.forEach((f: any) => {
                    if (f.type === 'Blur') newFilters.push(new fabric.Image.filters.Blur({ blur: f.blur }));
                    if (f.type === 'Brightness') newFilters.push(new fabric.Image.filters.Brightness({ brightness: f.brightness }));
                    if (f.type === 'Contrast') newFilters.push(new fabric.Image.filters.Contrast({ contrast: f.contrast }));
                });
                
                // Also check our own explicit properties
                // @ts-ignore
                if (item.blur) newFilters.push(new fabric.Image.filters.Blur({ blur: item.blur }));
                
                img.filters = newFilters;
                img.applyFilters();
            }

            canvas.add(img);
            resolve();
          }, { crossOrigin: 'anonymous' });
        });
      }
    });

    await Promise.all(renderPromises);
    canvas.requestRenderAll();
  };

  // --- EFFECT: WATCH FOR SIZE CHANGES OR NEW AI DATA ---
  useEffect(() => {
    if (!aiDesign || !canvas) return;

    let layoutToRender: LayoutConfig | null = null;

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
  }, [width, height, aiDesign, canvas]);

  // --- STANDARD TOOLS ---
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('Double Click to Edit', {
      left: 100, top: 100, fontFamily: 'Arial', fontSize: 40, fill: '#333333', fontWeight: 'bold'
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
      left: 150, top: 150, fill: '#f6416c', radius: 60
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;
    const triangle = new fabric.Triangle({
      left: 200, top: 200, fill: '#6366f1', width: 100, height: 100
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
    <div className="w-[80px] h-full flex flex-col gap-4 p-4 bg-[#060010] border-r border-gray-800 items-center">
      <button
        onClick={loadAIcampaign}
        className='w-full aspect-square bg-gradient-to-br from-[#6366f1] to-[#a855f7] text-white rounded-xl hover:scale-105 transition-all flex items-center justify-center shadow-lg shadow-purple-500/20'
        title="Generate AI Design"
      >
        {loading ? <span className="animate-spin">⏳</span> : <Sparkles size={24} />}
      </button>
      
      <div className="w-full h-px bg-gray-800 my-2" />

      <button onClick={addText} className='w-full aspect-square bg-[#1a1a2e] hover:bg-[#6366f1] text-white rounded-xl transition-all flex items-center justify-center border border-gray-700'>
        <CaseSensitive size={24} />
      </button>
      <button onClick={addCircle} className='w-full aspect-square bg-[#1a1a2e] hover:bg-[#6366f1] text-white rounded-xl transition-all flex items-center justify-center border border-gray-700'>
        <Circle size={24} />
      </button>
      <button onClick={addRectangle} className='w-full aspect-square bg-[#1a1a2e] hover:bg-[#6366f1] text-white rounded-xl transition-all flex items-center justify-center border border-gray-700'>
        <RectangleHorizontal size={24} />
      </button>
      <button onClick={addTriangle} className='w-full aspect-square bg-[#1a1a2e] hover:bg-[#6366f1] text-white rounded-xl transition-all flex items-center justify-center border border-gray-700'>
        <Triangle size={24} />
      </button>

      <div className="mt-auto w-full flex flex-col gap-3">

  {/* ✅ VALIDATE BUTTON */}
  <ValidateButton />

  {/* ⬇️ DOWNLOAD BUTTON */}
  <button
    onClick={downloadCanvas}
    className='w-full aspect-square bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20'
    title="Download PNG"
  >
    <Download size={24} />
  </button>

</div>

    </div>
  );
};
