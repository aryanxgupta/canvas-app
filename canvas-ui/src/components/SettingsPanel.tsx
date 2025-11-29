import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { fabric } from 'fabric';
import { 
  ArrowDownToDot, 
  ArrowUpFromDot, 
  ChevronDown, 
  ChevronUp, 
  LockIcon, 
  Trash2Icon, 
  Layers,
  Palette,
  Type,
  Image as ImageIcon,
  Sun
} from 'lucide-react';

// --- CONSTANTS ---
const FONT_FAMILIES = [
  "Arial", "Roboto", "Montserrat", "Poppins", "Oswald", 
  "Bebas Neue", "Playfair Display", "Lobster", "Pacifico", 
  "Dancing Script", "Anton", "Open Sans", "Times New Roman", "Courier New"
];

const BLEND_MODES = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn"];

export const SettingsPanel = () => {
  const { selectedObject, canvas } = useEditorStore();
  
  // --- STATE ---
  const [color, setColor] = useState<string>('#000000');
  const [isTransparent, setIsTransparent] = useState<boolean>(false); 
  const [stroke, setStroke] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [skewX, setSkewX] = useState<number>(0);
  const [blendMode, setBlendMode] = useState<string>('normal');
  
  // Text
  const [type, setType] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [charSpacing, setCharSpacing] = useState<number>(0);
  const [textContent, setTextContent] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('Arial');

  // Filters
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  // Shadow
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);

  // Lock
  const [isLocked, setIsLocked] = useState(false);

  // Background State
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
  const [bgColor1, setBgColor1] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#ffffff');

  // --- SYNC WITH SELECTION ---
  useEffect(() => {
    if (!selectedObject) return;

    setType(selectedObject.type || '');
    setOpacity(selectedObject.opacity || 1);
    setSkewX(selectedObject.skewX || 0);
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setIsLocked(selectedObject.lockMovementX || false);
    
    // @ts-ignore - globalCompositeOperation is valid in v5 but sometimes missing in types
    setBlendMode(selectedObject.globalCompositeOperation || 'normal');

    // 1. Sync Fill
    const fill = selectedObject.fill;
    if (!fill || fill === 'transparent') {
        setIsTransparent(true);
        setColor('#000000');
    } else {
        setIsTransparent(false);
        // Handle if fill is pattern or gradient (advanced), fallback to black if so
        if (typeof fill === 'string') {
             const hex = new fabric.Color(fill).toHex();
             setColor(`#${hex}`);
        }
    }

    // 2. Sync Stroke
    const objStroke = selectedObject.stroke;
    if (!objStroke || objStroke === 'transparent') {
        setStroke('#ffffff'); 
    } else {
        if (typeof objStroke === 'string') {
            const hex = new fabric.Color(objStroke).toHex();
            setStroke(`#${hex}`);
        }
    }

    // 3. Text
    if (selectedObject.type === 'i-text' || selectedObject.type === 'text' || selectedObject.type === 'textbox') {
      const textObj = selectedObject as fabric.IText;
      setFontSize(textObj.fontSize || 20);
      setTextContent(textObj.text || '');
      setFontFamily(textObj.fontFamily || 'Arial');
      setCharSpacing(textObj.charSpacing || 0);
    }

    // 4. Filters (Image only)
    if (selectedObject.type === 'image') {
      const img = selectedObject as fabric.Image;
      setBlur(0); setBrightness(0); setContrast(0);
      if (img.filters) {
        img.filters.forEach((filter: any) => {
           if (filter.type === 'Blur') setBlur(filter.blur);
           if (filter.type === 'Brightness') setBrightness(filter.brightness);
           if (filter.type === 'Contrast') setContrast(filter.contrast);
        });
      }
    }

    // 5. Shadow
    if (selectedObject.shadow) {
      setShadowEnabled(true);
      const s = selectedObject.shadow as fabric.Shadow;
      const sHex = new fabric.Color(s.color || '#000000').toHex();
      setShadowColor(`#${sHex}`);
      setShadowBlur(s.blur || 0);
      setShadowOffsetX(s.offsetX || 0);
      setShadowOffsetY(s.offsetY || 0);
    } else {
      setShadowEnabled(false);
      setShadowColor('#000000');
      setShadowBlur(15);
      setShadowOffsetX(5);
      setShadowOffsetY(5);
    }
  }, [selectedObject]);

  // --- HANDLERS ---

  const updateBackground = (type: 'solid' | 'gradient', c1: string, c2: string) => {
    if (!canvas) return;
    
    if (type === 'solid') {
        canvas.setBackgroundColor(c1, canvas.renderAll.bind(canvas));
    } else {
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords: { x1: 0, y1: 0, x2: canvas.width || 0, y2: canvas.height || 0 },
            colorStops: [ { offset: 0, color: c1 }, { offset: 1, color: c2 } ]
        });
        // Fabric v5 setBackgroundColor accepts Gradient objects
        canvas.setBackgroundColor(gradient as any, canvas.renderAll.bind(canvas));
    }
  };

  const handleBgTypeChange = (type: 'solid' | 'gradient') => {
      setBgType(type);
      updateBackground(type, bgColor1, bgColor2);
  };

  // Object Handlers (Simplified for brevity - logic remains same)
  const updateProp = (key: string, value: any) => {
      if(selectedObject && canvas) {
          selectedObject.set(key as any, value);
          canvas.requestRenderAll();
      }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => { setColor(e.target.value); setIsTransparent(false); updateProp('fill', e.target.value); };
  const toggleTransparent = (e: React.ChangeEvent<HTMLInputElement>) => { setIsTransparent(e.target.checked); updateProp('fill', e.target.checked ? 'transparent' : color); };
  const toggleLock = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const val = e.target.checked; 
      setIsLocked(val); 
      if(selectedObject && canvas) {
        selectedObject.set({ lockMovementX: val, lockMovementY: val, lockRotation: val, lockScalingX: val, lockScalingY: val });
        canvas.requestRenderAll();
      }
  };

  const applyFilterValue = (type: 'blur' | 'brightness' | 'contrast', value: number) => { 
    if (selectedObject && canvas && selectedObject.type === 'image') { 
        const img = selectedObject as fabric.Image; 
        if (type === 'blur') setBlur(value); 
        if (type === 'brightness') setBrightness(value); 
        if (type === 'contrast') setContrast(value); 
        
        const newFilters = []; 
        const currentBlur = type === 'blur' ? value : blur; 
        const currentBright = type === 'brightness' ? value : brightness; 
        const currentContrast = type === 'contrast' ? value : contrast; 
        
        if (currentBlur > 0) newFilters.push(new fabric.filters.Blur({ blur: currentBlur })); 
        if (currentBright !== 0) newFilters.push(new fabric.filters.Brightness({ brightness: currentBright })); 
        if (currentContrast !== 0) newFilters.push(new fabric.filters.Contrast({ contrast: currentContrast })); 
        
        img.filters = newFilters; 
        img.applyFilters(); 
        canvas.requestRenderAll(); 
    } 
  };

  const toggleShadow = (e: React.ChangeEvent<HTMLInputElement>) => { 
      const isChecked = e.target.checked; 
      setShadowEnabled(isChecked); 
      if (selectedObject && canvas) { 
          if (isChecked) { 
            const shadow = new fabric.Shadow({ color: shadowColor, blur: shadowBlur, offsetX: shadowOffsetX, offsetY: shadowOffsetY }); 
            selectedObject.set('shadow', shadow); 
          } else { 
            selectedObject.set('shadow', null); 
          } 
          canvas.requestRenderAll(); 
      } 
  };

  const updateShadow = (key: 'color' | 'blur' | 'offsetX' | 'offsetY', value: string | number) => {
       if (key === 'color') setShadowColor(value as string);
       else if (key === 'blur') setShadowBlur(value as number);
       else if (key === 'offsetX') setShadowOffsetX(value as number);
       else if (key === 'offsetY') setShadowOffsetY(value as number);
       
       if (selectedObject && canvas && selectedObject.shadow) {
           (selectedObject.shadow as any)[key] = value;
           canvas.requestRenderAll();
       }
  };

  const handleLayer = (action: 'top' | 'up' | 'down' | 'bottom') => {
      if(!selectedObject || !canvas) return;
      if(action === 'top') canvas.bringToFront(selectedObject);
      if(action === 'up') canvas.bringForward(selectedObject);
      if(action === 'down') canvas.sendBackwards(selectedObject);
      if(action === 'bottom') canvas.sendToBack(selectedObject);
      canvas.requestRenderAll();
  };

  const deleteObject = () => { 
      if (selectedObject && canvas) { 
          canvas.remove(selectedObject); 
          canvas.discardActiveObject(); 
          canvas.requestRenderAll(); 
      } 
  };

  // --- RENDER CANVAS SETTINGS (No Selection) ---
  if (!selectedObject) {
    return (
      <div className="w-[300px] h-full bg-[#060010] p-5 text-white overflow-y-auto border-l border-gray-800">
        <h3 className='font-font6 tracking-wide text-lg mb-4 flex items-center gap-2'>
            <Palette size={18} /> Canvas Background
        </h3>
        
        <div className="flex bg-[#1a1a1a] p-1 rounded-lg mb-6">
            <button 
                onClick={() => handleBgTypeChange('solid')} 
                className={`flex-1 py-2 text-xs rounded-md transition-all ${bgType === 'solid' ? 'bg-[#6366f1] font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Solid
            </button>
            <button 
                onClick={() => handleBgTypeChange('gradient')} 
                className={`flex-1 py-2 text-xs rounded-md transition-all ${bgType === 'gradient' ? 'bg-[#6366f1] font-bold' : 'text-gray-400 hover:text-white'}`}
            >
                Gradient
            </button>
        </div>

        {bgType === 'solid' ? (
            <div className="space-y-2">
                <label className="text-xs text-gray-400 block tracking-wide">Color</label>
                <div className="flex items-center gap-3 bg-[#1a1a2e] p-2 rounded-lg border border-gray-700">
                    <input type="color" value={bgColor1} onChange={(e) => { setBgColor1(e.target.value); updateBackground('solid', e.target.value, bgColor2); }} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
                    <span className="text-xs font-mono">{bgColor1}</span>
                </div>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 block tracking-wide">Start Color</label>
                    <div className="flex items-center gap-3 bg-[#1a1a2e] p-2 rounded-lg border border-gray-700">
                        <input type="color" value={bgColor1} onChange={(e) => { setBgColor1(e.target.value); updateBackground('gradient', e.target.value, bgColor2); }} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
                        <span className="text-xs font-mono">{bgColor1}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-400 block tracking-wide">End Color</label>
                    <div className="flex items-center gap-3 bg-[#1a1a2e] p-2 rounded-lg border border-gray-700">
                        <input type="color" value={bgColor2} onChange={(e) => { setBgColor2(e.target.value); updateBackground('gradient', bgColor1, e.target.value); }} className="w-8 h-8 rounded cursor-pointer bg-transparent" />
                        <span className="text-xs font-mono">{bgColor2}</span>
                    </div>
                </div>
            </div>
        )}
        
        <div className="mt-10 p-4 bg-white/5 rounded-xl text-sm text-gray-400 text-center border border-white/10">
            <p>Select an object to edit properties.</p>
        </div>
      </div>
    );
  }

  // --- RENDER OBJECT PROPERTIES ---
  return (
    <div className="w-[300px] h-full bg-[#060010] p-5 text-white overflow-y-auto border-l border-gray-800 font-font7">
      <div className="flex justify-between items-center mb-6">
        <h3 className='font-font6 tracking-wide text-lg'>Properties</h3>
        <div className="flex items-center gap-2 text-xs bg-[#1a1a2e] px-2 py-1 rounded border border-gray-700">
             <LockIcon size={12} className={isLocked ? 'text-red-400' : 'text-gray-400'}/>
             <label className="cursor-pointer select-none">
                Lock <input type="checkbox" checked={isLocked} onChange={toggleLock} className="ml-1 accent-[#6366f1]" />
             </label>
        </div>
      </div>

      {/* SECTION: IMAGE FILTERS */}
      {type === 'image' && (
        <div className="mb-6 p-4 bg-[#111122] rounded-xl border border-gray-800">
           <h4 className="flex items-center gap-2 font-font6 text-sm mb-3 text-purple-300">
               <Sun size={14} /> Image Filters
           </h4>
           <div className="space-y-3">
               <div>
                   <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Blur</span><span>{blur.toFixed(2)}</span></div>
                   <input type="range" min="0" max="1" step="0.05" value={blur} onChange={(e) => applyFilterValue('blur', parseFloat(e.target.value))} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
               </div>
               <div>
                   <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Brightness</span><span>{brightness.toFixed(2)}</span></div>
                   <input type="range" min="-1" max="1" step="0.05" value={brightness} onChange={(e) => applyFilterValue('brightness', parseFloat(e.target.value))} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
               </div>
               <div>
                   <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Contrast</span><span>{contrast.toFixed(2)}</span></div>
                   <input type="range" min="-1" max="1" step="0.05" value={contrast} onChange={(e) => applyFilterValue('contrast', parseFloat(e.target.value))} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
               </div>
           </div>
        </div>
      )}

      {/* SECTION: TEXT */}
      {(type === 'i-text' || type === 'text' || type === 'textbox') && (
        <div className="mb-6 space-y-4">
             <div className="flex items-center gap-2 text-sm font-font6 text-purple-300"><Type size={14}/> Text</div>
             <input 
                type="text" 
                value={textContent} 
                onChange={(e) => { setTextContent(e.target.value); updateProp('text', e.target.value); }} 
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded p-2 text-sm focus:border-[#6366f1] outline-none"
             />
             <div className="grid grid-cols-2 gap-2">
                 <select 
                    value={fontFamily} 
                    onChange={(e) => { setFontFamily(e.target.value); updateProp('fontFamily', e.target.value); }} 
                    className="bg-[#1a1a2e] border border-gray-700 rounded p-2 text-xs outline-none"
                 >
                    {FONT_FAMILIES.map(f => <option key={f} value={f}>{f}</option>)}
                 </select>
                 <input 
                    type="number" 
                    value={fontSize} 
                    onChange={(e) => { setFontSize(parseInt(e.target.value)); updateProp('fontSize', parseInt(e.target.value)); }} 
                    className="bg-[#1a1a2e] border border-gray-700 rounded p-2 text-xs outline-none"
                 />
             </div>
             <div>
                <label className="text-xs text-gray-400 block mb-1">Letter Spacing</label>
                <input type="range" min="-50" max="800" step="10" value={charSpacing} onChange={(e) => { setCharSpacing(parseInt(e.target.value)); updateProp('charSpacing', parseInt(e.target.value)); }} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none" />
             </div>
        </div>
      )}

      {/* SECTION: COLORS & STROKE */}
      {type !== 'image' && (
        <div className="mb-6 space-y-4 border-t border-gray-800 pt-4">
             <div className="flex items-center gap-2 text-sm font-font6 text-purple-300"><Palette size={14}/> Appearance</div>
             
             {/* Fill */}
             <div className="flex items-center justify-between">
                 <label className="text-xs text-gray-400">Fill Color</label>
                 <div className="flex items-center gap-2">
                     <div className="relative overflow-hidden w-8 h-8 rounded-full border border-gray-600">
                        <input type="color" value={color} onChange={handleColorChange} disabled={isTransparent} className={`absolute -top-2 -left-2 w-12 h-12 cursor-pointer ${isTransparent ? 'opacity-20' : ''}`} />
                     </div>
                     <label className="text-xs flex items-center gap-1 cursor-pointer select-none">
                        <input type="checkbox" checked={isTransparent} onChange={toggleTransparent} className="accent-[#6366f1]" /> 
                        No Fill
                     </label>
                 </div>
             </div>

             {/* Stroke */}
             <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400">Border</label>
                    <div className="relative overflow-hidden w-6 h-6 rounded-full border border-gray-600">
                        <input type="color" value={stroke} onChange={(e) => { setStroke(e.target.value); updateProp('stroke', e.target.value); }} className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer" />
                    </div>
                 </div>
                 <input type="range" min="0" max="20" value={strokeWidth} onChange={(e) => { setStrokeWidth(parseInt(e.target.value)); updateProp('strokeWidth', parseInt(e.target.value)); }} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none" />
             </div>
        </div>
      )}

      {/* SECTION: COMMON (Opacity, Blend, Shadow) */}
      <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Opacity</span><span>{Math.round(opacity * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => { setOpacity(parseFloat(e.target.value)); updateProp('opacity', parseFloat(e.target.value)); }} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded-lg appearance-none" />
          </div>

          <div>
             <label className="text-xs text-gray-400 block mb-1">Blend Mode</label>
             <select value={blendMode} onChange={(e) => { setBlendMode(e.target.value); updateProp('globalCompositeOperation', e.target.value); }} className="w-full bg-[#1a1a2e] border border-gray-700 rounded p-2 text-xs outline-none">
                {BLEND_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
             </select>
          </div>

          {/* Shadow Toggle */}
          <div className="bg-[#1a1a2e] p-3 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                 <label className="text-xs font-bold">Shadow</label>
                 <input type="checkbox" checked={shadowEnabled} onChange={toggleShadow} className="accent-[#6366f1]" />
              </div>
              {shadowEnabled && (
                  <div className="space-y-2 pt-2 border-t border-gray-700/50">
                      <div className="flex items-center justify-between">
                          <label className="text-[10px] text-gray-400">Color</label>
                          <input type="color" value={shadowColor} onChange={(e) => updateShadow('color', e.target.value)} className="w-4 h-4 rounded bg-transparent cursor-pointer" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div><label className="text-[10px] text-gray-400">Blur</label><input type="range" min="0" max="50" value={shadowBlur} onChange={(e) => updateShadow('blur', parseInt(e.target.value))} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded appearance-none" /></div>
                          <div><label className="text-[10px] text-gray-400">X</label><input type="range" min="-20" max="20" value={shadowOffsetX} onChange={(e) => updateShadow('offsetX', parseInt(e.target.value))} className="w-full accent-[#6366f1] h-1 bg-gray-700 rounded appearance-none" /></div>
                      </div>
                  </div>
              )}
          </div>
      </div>
      
      {/* SECTION: LAYERS */}
      <div className="mb-6">
        <label className='font-font6 tracking-wide text-sm mb-2 block text-purple-300 flex items-center gap-2'><Layers size={14}/> Layering</label>
        <div className="flex gap-2">
          <button onClick={() => handleLayer('top')} title="Bring to Front" className='flex-1 bg-[#1a1a2e] hover:bg-[#6366f1] p-2 rounded transition-colors flex justify-center border border-gray-700'><ArrowUpFromDot size={16}/></button>
          <button onClick={() => handleLayer('up')} title="Bring Forward" className='flex-1 bg-[#1a1a2e] hover:bg-[#6366f1] p-2 rounded transition-colors flex justify-center border border-gray-700'><ChevronUp size={16}/></button>
          <button onClick={() => handleLayer('down')} title="Send Backward" className='flex-1 bg-[#1a1a2e] hover:bg-[#6366f1] p-2 rounded transition-colors flex justify-center border border-gray-700'><ChevronDown size={16}/></button>
          <button onClick={() => handleLayer('bottom')} title="Send to Back" className='flex-1 bg-[#1a1a2e] hover:bg-[#6366f1] p-2 rounded transition-colors flex justify-center border border-gray-700'><ArrowDownToDot size={16}/></button>
        </div>
      </div>

      <button 
        onClick={deleteObject} 
        className='w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 p-2 rounded-lg transition-all font-bold text-sm mt-4'
      >
        <Trash2Icon size={16}/> Delete Layer
      </button>
    </div>
  );
};