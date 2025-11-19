import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import * as fabric from 'fabric';
import { ArrowDownToDot, ArrowUpFromDot, ChevronDown, ChevronUp, LockIcon, Trash2Icon } from 'lucide-react'

const buttonStyle: React.CSSProperties = {
  flex: 1,
  padding: '8px 5px',
  fontSize: '11px',
  background: '#f3f4f6',
  border: '1px solid #ddd',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteBtnStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '20px'
};

const FONT_FAMILIES = ["Arial", "Roboto", "Times New Roman", "Courier New", "Georgia", "Verdana", "Oswald", "Permanent Marker", "Playfair Display", "Montserrat"];
const BLEND_MODES = ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn"];

export const SettingsPanel = () => {
  const { selectedObject, canvas } = useEditorStore();
  
  // Props
  const [color, setColor] = useState<string>('#000000');
  const [isTransparent, setIsTransparent] = useState<boolean>(false); 

  const [stroke, setStroke] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [opacity, setOpacity] = useState<number>(1);
  const [skewX, setSkewX] = useState<number>(0);
  const [blendMode, setBlendMode] = useState<string>('normal');
  
  // Text Props
  const [type, setType] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [charSpacing, setCharSpacing] = useState<number>(0);
  const [textContent, setTextContent] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string>('Arial');

  // Image Filter Props
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  // Shadow Props
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowBlur, setShadowBlur] = useState(0);
  const [shadowOffsetX, setShadowOffsetX] = useState(0);
  const [shadowOffsetY, setShadowOffsetY] = useState(0);

  // Lock State
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (selectedObject) {
      setType(selectedObject.type);
      setOpacity(selectedObject.opacity || 1);
      setSkewX(selectedObject.skewX || 0);
      setStrokeWidth(selectedObject.strokeWidth || 0);
      
      // Sync Lock
      setIsLocked(selectedObject.lockMovementX || false);

      // @ts-ignore
      setBlendMode(selectedObject.globalCompositeOperation || 'normal');

      // --- [FIXED] ROBUST COLOR SYNCING ---
      
      // 1. Fill Color & Transparency
      const currentFill = selectedObject.fill;
      if (!currentFill || currentFill === 'transparent') {
          setIsTransparent(true);
          setColor('#000000'); 
      } else {
          setIsTransparent(false);
          // Convert any color format (name, rgb, hex) to 6-digit Hex for the input
          const hex = new fabric.Color(currentFill as string).toHex();
          setColor(`#${hex}`);
      }

      // 2. Border Color (Stroke) - THE BUG FIX
      const currentStroke = selectedObject.stroke;
      if (currentStroke && currentStroke !== 'transparent') {
          try {
              const strokeColor = new fabric.Color(currentStroke as string);
              setStroke(`#${strokeColor.toHex()}`);
          } catch {
              setStroke('#ffffff');
          }
      } else {
          // Object has no stroke defined - default to white
          setStroke('#ffffff');
      }
      // ------------------------------------

      if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
        const textObj = selectedObject as fabric.IText;
        setFontSize(textObj.fontSize || 20);
        setTextContent(textObj.text || '');
        setFontFamily(textObj.fontFamily || 'Arial');
        setCharSpacing(textObj.charSpacing || 0);
      }

      // Sync Filters
      if (selectedObject.type === 'image') {
        const img = selectedObject as fabric.FabricImage;
        setBlur(0); setBrightness(0); setContrast(0);
        if (img.filters) {
          img.filters.forEach((filter: any) => {
             if (filter.type === 'Blur') setBlur(filter.blur);
             if (filter.type === 'Brightness') setBrightness(filter.brightness);
             if (filter.type === 'Contrast') setContrast(filter.contrast);
          });
        }
      }

      // Sync Shadow
      if (selectedObject.shadow) {
        setShadowEnabled(true);
        const s = selectedObject.shadow as fabric.Shadow;
        const shadowHex = new fabric.Color(s.color || '#000000').toHex();
        setShadowColor(`#${shadowHex}`);
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
    }
  }, [selectedObject]);

  // --- HANDLERS ---

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setColor(val);
    setIsTransparent(false); 
    
    if (selectedObject && canvas) {
      selectedObject.set({ fill: val });
      canvas.requestRenderAll();
    }
  };

  const toggleTransparent = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setIsTransparent(checked);

      if (selectedObject && canvas) {
          if (checked) { selectedObject.set({ fill: 'transparent' }); } 
          else { selectedObject.set({ fill: color }); }
          canvas.requestRenderAll();
      }
  };
  
  const toggleLock = (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setIsLocked(checked);
      if (selectedObject && canvas) {
          selectedObject.set({
              lockMovementX: checked,
              lockMovementY: checked,
              lockRotation: checked,
              lockScalingX: checked,
              lockScalingY: checked
          });
          canvas.requestRenderAll();
      }
  };

  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStroke(val);
    if (selectedObject && canvas) {
      selectedObject.set({ stroke: val });
      canvas.requestRenderAll();
    }
  };

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setStrokeWidth(val);
    if (selectedObject && canvas) {
      selectedObject.set({ strokeWidth: val });
      canvas.requestRenderAll();
    }
  };

  const handleSkewXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSkewX(val);
    if (selectedObject && canvas) {
      selectedObject.set({ skewX: val });
      canvas.requestRenderAll();
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setOpacity(val);
    if (selectedObject && canvas) {
      selectedObject.set({ opacity: val });
      canvas.requestRenderAll();
    }
  };
  
  const handleBlendModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBlendMode(val);
    if (selectedObject && canvas) {
      selectedObject.set({ globalCompositeOperation: val });
      canvas.requestRenderAll();
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setFontFamily(val);
    if (selectedObject && canvas) {
      (selectedObject as fabric.IText).set({ fontFamily: val });
      canvas.requestRenderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setFontSize(val);
    if (selectedObject && canvas) {
      selectedObject.set({ fontSize: val });
      canvas.requestRenderAll();
    }
  };
  
  const handleCharSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCharSpacing(val);
    if (selectedObject && canvas) {
      (selectedObject as fabric.IText).set({ charSpacing: val });
      canvas.requestRenderAll();
    }
  };
  
  const handleTextContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTextContent(val);
    if (selectedObject && canvas && (selectedObject.type === 'i-text')) {
      (selectedObject as fabric.IText).set({ text: val });
      canvas.requestRenderAll();
    }
  };

  const applyFilterValue = (type: 'blur' | 'brightness' | 'contrast', value: number) => {
     if (selectedObject && canvas && selectedObject.type === 'image') {
        const img = selectedObject as fabric.FabricImage;
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
    if (key === 'blur') setShadowBlur(value as number);
    if (key === 'offsetX') setShadowOffsetX(value as number);
    if (key === 'offsetY') setShadowOffsetY(value as number);

    if (selectedObject && canvas && selectedObject.shadow) {
      (selectedObject.shadow as any)[key] = value;
      canvas.requestRenderAll();
    }
  };

  const moveUp = () => { if (selectedObject && canvas) { canvas.bringObjectForward(selectedObject); canvas.requestRenderAll(); } };
  const moveDown = () => { if (selectedObject && canvas) { canvas.sendObjectBackwards(selectedObject); canvas.requestRenderAll(); } };
  const moveToTop = () => { if (selectedObject && canvas) { canvas.bringObjectToFront(selectedObject); canvas.requestRenderAll(); } };
  const moveToBottom = () => { if (selectedObject && canvas) { canvas.sendObjectToBack(selectedObject); canvas.requestRenderAll(); } };
  
  const deleteObject = () => { if (selectedObject && canvas) { canvas.remove(selectedObject); canvas.discardActiveObject(); canvas.requestRenderAll(); } };
  
  const handleCanvasBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvas.backgroundColor = e.target.value;
      canvas.requestRenderAll();
    }
  };
  
  if (!selectedObject) {
    return (
      <div style={panelStyle} >
        <h3 className='font-font6 tracking-wide text-lg'>Canvas Settings</h3>
        <div style={rowStyle}>
          <label style={labelStyle} className='font-font7 tracking-wider'>Background Color</label>
          <input type="color" onChange={handleCanvasBgChange} defaultValue="#ffffff" className='mt-2 size-10 rounded-2xl cursor-pointer'/>
        </div>
      </div>
    );
  }

  return (
    <div style={panelStyle}>
      <h3 className='font-font6 tracking-wide text-lg mb-2'>Properties</h3>

      <div style={{marginBottom: '15px', background:'transparent', padding:'10px', borderRadius:'5px', display:'flex', justifyContent:'space-between', alignItems:'center'}} className='text-white'>
         <label style={{ color:'white', cursor:'pointer'}} className='text-sm font-font7 tracking-wide flex items-center justify-start gap-2'>
            <LockIcon className='size-5'/> Lock Position
         </label>
         <input type="checkbox" checked={isLocked} onChange={toggleLock} style={{cursor:'pointer'}} />
      </div>

      {type === 'image' && (
        <div style={{ marginBottom: '20px', paddingBottom: '10px', background: '#060010', borderRadius: '5px' }}>
           <label style={{...labelStyle, color: 'white', marginTop: 0}} className='font-font6 text-lg tracking-wide'>Image Filters</label>
           <label style={labelStyle} className='font-font7 tracking-wide'>Blur: {blur}</label>
           <input type="range" min="0" max="1" step="0.05" value={blur} onChange={(e) => applyFilterValue('blur', parseFloat(e.target.value))} style={{width: '100%'}} />
           <label style={labelStyle} className='font-font7 tracking-wide'>Brightness: {brightness}</label>
           <input type="range" min="-1" max="1" step="0.05" value={brightness} onChange={(e) => applyFilterValue('brightness', parseFloat(e.target.value))} style={{width: '100%'}} />
           <label style={labelStyle} className='font-font7 tracking-wide'>Contrast: {contrast}</label>
           <input type="range" min="-1" max="1" step="0.05" value={contrast} onChange={(e) => applyFilterValue('contrast', parseFloat(e.target.value))} style={{width: '100%'}} />
        </div>
      )}

      <div style={rowStyle}>
        <label style={labelStyle}>Opacity: {Math.round(opacity * 100)}%</label>
        <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={handleOpacityChange} style={{width: '100%'}} />
      </div>

      <div style={rowStyle}>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Blend Mode</label>
          <select value={blendMode} onChange={handleBlendModeChange} style={textInputStyle} className='bg-[#060010] font-font7 tracking-wide outline-1 outline-white p-2 rounded-lg'>
             {BLEND_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle} className='font-font7 tracking-wide text-lg'>Tilt (Skew): {skewX}°</label>
        <input type="range" min="-50" max="50" step="1" value={skewX} onChange={handleSkewXChange} style={{width: '100%'}} />
      </div>
      
      {(type === 'i-text' || type === 'text') && (
        <div style={{ marginBottom: '20px', paddingBottom: '10px', marginTop: '30px'}}>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Content</label>
          <input type="text" value={textContent} onChange={handleTextContentChange} style={textInputStyle} className='outline-1 outline-white rounded-lg p-2 font-font7 tracking-wide'/>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Font Family</label>
          <select value={fontFamily} onChange={handleFontFamilyChange} style={textInputStyle} className='outline-1 outline-white p-2 rounded-lg'>
             {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Font Size</label>
          <input type="number" value={fontSize} onChange={handleFontSizeChange} style={numberInputStyle} className='outline-1 outline-white rounded-lg p-2 font-font7 tracking-wide'/>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Letter Spacing: {charSpacing}</label>
          <input type="range" min="-50" max="1000" step="10" value={charSpacing} onChange={handleCharSpacingChange} style={{width:'100%'}} />
        </div>
      )}

      {type !== 'image' && (
        <div style={rowStyle}>
          <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Fill Color</label>
          
          <div style={{display:'flex', gap: '10px', alignItems:'center', justifyContent: 'space-between'}}>
              <input type="color" value={color} onChange={handleColorChange} disabled={isTransparent} style={{opacity: isTransparent ? 0.5 : 1, cursor: isTransparent ? 'not-allowed' : 'pointer'}} className='size-10 rounded-xl border-none'/>
              <label style={{fontSize:'12px', display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                  <input type="checkbox" checked={isTransparent} onChange={toggleTransparent} className='font-font7 tracking-wide'/>
                  Transparent
              </label>
          </div>
          
          <div style={{marginTop: '10px'}}>
            <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Border Color</label>
            <input type="color" value={stroke} onChange={handleStrokeChange} className='size-10 rounded-xl border-none'/>
          </div>
          <div style={{marginTop: '10px'}}>
             <label style={labelStyle} className='font-font6 tracking-wide text-lg'>Border Width: {strokeWidth}px</label>
             <input type="range" min="0" max="20" value={strokeWidth} onChange={handleStrokeWidthChange} style={{width: '100%'}} />
          </div>
        </div>
      )}

      <div style={{ marginBottom: '20px', paddingTop: '15px', marginTop:'30px'}}>
         <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <label style={{...labelStyle, marginTop:0}} className='font-font6 tracking-wide text-lg'>Shadow / Glow</label>
            <input type="checkbox" checked={shadowEnabled} onChange={toggleShadow} style={{cursor:'pointer'}} className='font-font7 tracking-wide'/>
         </div>
         {shadowEnabled && (
             <div style={{marginTop: '10px', paddingLeft: '10px'}} className='font-font7 text-white tracking-wide' >
                 <div style={{marginBottom: '10px'}} className='flex items-center justify-between'>
                     <label>Color</label>
                     <input type="color" value={shadowColor} onChange={(e) => updateShadow('color', e.target.value)} className='size-10 rounded-xl border-none'/>
                 </div>
                 <div style={{marginBottom: '10px'}}>
                     <label>Blur: {shadowBlur}</label>
                     <input type="range" min="0" max="100" value={shadowBlur} onChange={(e) => updateShadow('blur', parseInt(e.target.value))} style={{width: '100%'}} />
                 </div>
                 <div style={{marginBottom: '10px'}}>
                     <label>Offset X: {shadowOffsetX}</label>
                     <input type="range" min="-50" max="50" value={shadowOffsetX} onChange={(e) => updateShadow('offsetX', parseInt(e.target.value))} style={{width: '100%'}} />
                 </div>
                 <div style={{marginBottom: '10px'}}>
                     <label>Offset Y: {shadowOffsetY}</label>
                     <input type="range" min="-50" max="50" value={shadowOffsetY} onChange={(e) => updateShadow('offsetY', parseInt(e.target.value))} style={{width: '100%'}} />
                 </div>
             </div>
         )}
      </div>
      
      <div style={{ marginBottom: '20px', paddingTop: '15px' }}>
        <label style={labelStyle} className='font-font6 tracking-wide text-lg mb-2'>Layering</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <button onClick={moveToTop}  title="Bring to Front" className='bg-pink-700 p-2 rounded-lg font-soft tracking-wide cursor-pointer hover:scale-105 transition-all duration-75'>
            <ArrowUpFromDot className='size-6 font-bold'/>
          </button>
          <button onClick={moveUp}  title="Bring Forward" className='bg-pink-700 p-2 rounded-lg font-soft tracking-wide cursor-pointer hover:scale-105 transition-all duration-75'>
            <ChevronUp className='size-6 font-bold' />
          </button>
          <button onClick={moveDown}  title="Send Backward" className='bg-pink-700 p-2 rounded-lg font-soft tracking-wide cursor-pointer hover:scale-105 transition-all duration-75'>
            <ChevronDown className='size-6 font-bold' />
          </button>
          <button onClick={moveToBottom}  title="Send to Back" className='bg-pink-700 p-2 rounded-lg font-soft tracking-wide cursor-pointer hover:scale-105 transition-all duration-75'>
            <ArrowDownToDot className='size-6 font-bold' />
          </button>
        </div>
      </div>

      <button onClick={deleteObject} style={deleteBtnStyle} className='flex items-center justify-start gap-5 bg-red-600 rounded-2xl'><Trash2Icon /> Delete Object</button>
    </div>
  );
};

const panelStyle: React.CSSProperties = { width: '300px', padding: '20px', background: '#060010', overflowY: 'auto', color: 'white' };
const labelStyle: React.CSSProperties = { display: 'block', marginTop: '10px' };
const textInputStyle: React.CSSProperties = { width: '100%', marginTop: '5px' };
const numberInputStyle: React.CSSProperties = { width: '100%', marginTop: '5px' };
const rowStyle: React.CSSProperties = { marginTop: '15px' };