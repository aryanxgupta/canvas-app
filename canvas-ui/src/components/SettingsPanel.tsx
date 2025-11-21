import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import * as fabric from 'fabric';
import { ArrowDownToDot, ArrowUpFromDot, ChevronDown, ChevronUp, LockIcon, Trash2Icon } from 'lucide-react';

// --- STYLES ---
const deleteBtnStyle: React.CSSProperties = {
  width: '100%', padding: '10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px'
};

const tabStyle = (isActive: boolean): React.CSSProperties => ({
  flex: 1, padding: '8px', fontSize: '12px', textAlign: 'center', cursor: 'pointer',
  background: isActive ? '#6366f1' : 'rgba(255,255,255,0.1)',
  color: 'white', fontWeight: isActive ? 'bold' : 'normal', borderRadius: '6px', transition: 'all 0.2s'
});

const FONT_FAMILIES = [
  "Arial",
  "Roboto",
  "Montserrat",      // Modern / Startup
  "Poppins",         // Clean / Geometric
  "Oswald",          // Bold / Sporty
  "Bebas Neue",      // Tall / Headlines
  "Playfair Display",// Luxury / Serif
  "Lobster",         // Fun / Retro
  "Pacifico",        // Handwritten / Vibes
  "Dancing Script",  // Elegant / Wedding
  "Anton",           // Heavy / Impact
  "Open Sans",       // Neutral
  "Times New Roman",
  "Courier New",
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

  // [RESTORED] Background State
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
  const [bgColor1, setBgColor1] = useState('#ffffff');
  const [bgColor2, setBgColor2] = useState('#ffffff');

  // --- SYNC WITH SELECTION ---
  useEffect(() => {
    if (!selectedObject) return;

    setType(selectedObject.type);
    setOpacity(selectedObject.opacity || 1);
    setSkewX(selectedObject.skewX || 0);
    setStrokeWidth(selectedObject.strokeWidth || 0);
    setIsLocked(selectedObject.lockMovementX || false);
    
    // @ts-ignore
    setBlendMode(selectedObject.globalCompositeOperation || 'normal');

    // 1. Sync Fill
    const fill = selectedObject.fill;
    if (!fill || fill === 'transparent') {
        setIsTransparent(true);
        setColor('#000000');
    } else {
        setIsTransparent(false);
        const hex = new fabric.Color(fill as string).toHex();
        setColor(`#${hex}`);
    }

    // 2. Sync Stroke
    const objStroke = selectedObject.stroke;
    if (!objStroke || objStroke === 'transparent') {
        setStroke('#ffffff'); 
    } else {
        const hex = new fabric.Color(objStroke as string).toHex();
        setStroke(`#${hex}`);
    }

    // 3. Text
    if (selectedObject.type === 'i-text' || selectedObject.type === 'text') {
      const textObj = selectedObject as fabric.IText;
      setFontSize(textObj.fontSize || 20);
      setTextContent(textObj.text || '');
      setFontFamily(textObj.fontFamily || 'Arial');
      setCharSpacing(textObj.charSpacing || 0);
    }

    // 4. Filters
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

  // [RESTORED] Background Handlers
  const updateBackground = (type: 'solid' | 'gradient', c1: string, c2: string) => {
    if (!canvas) return;
    if (type === 'solid') {
        // @ts-ignore
        canvas.backgroundColor = c1;
    } else {
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords: { x1: 0, y1: 0, x2: canvas.width || 0, y2: canvas.height || 0 },
            colorStops: [ { offset: 0, color: c1 }, { offset: 1, color: c2 } ]
        });
        // @ts-ignore
        canvas.backgroundColor = gradient;
    }
    canvas.requestRenderAll();
  };

  const handleBgTypeChange = (type: 'solid' | 'gradient') => {
      setBgType(type);
      updateBackground(type, bgColor1, bgColor2);
  };

  const handleBgColor1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBgColor1(e.target.value);
      updateBackground(bgType, e.target.value, bgColor2);
  };

  const handleBgColor2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBgColor2(e.target.value);
      updateBackground(bgType, bgColor1, e.target.value);
  };

  // Object Handlers
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => { setColor(e.target.value); setIsTransparent(false); if (selectedObject && canvas) { selectedObject.set({ fill: e.target.value }); canvas.requestRenderAll(); } };
  const toggleTransparent = (e: React.ChangeEvent<HTMLInputElement>) => { const checked = e.target.checked; setIsTransparent(checked); if (selectedObject && canvas) { selectedObject.set({ fill: checked ? 'transparent' : color }); canvas.requestRenderAll(); } };
  const toggleLock = (e: React.ChangeEvent<HTMLInputElement>) => { const checked = e.target.checked; setIsLocked(checked); if (selectedObject && canvas) { selectedObject.set({ lockMovementX: checked, lockMovementY: checked, lockRotation: checked, lockScalingX: checked, lockScalingY: checked }); canvas.requestRenderAll(); } };
  const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => { setStroke(e.target.value); if (selectedObject && canvas) { selectedObject.set({ stroke: e.target.value }); canvas.requestRenderAll(); } };
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseInt(e.target.value); setStrokeWidth(val); if (selectedObject && canvas) { selectedObject.set({ strokeWidth: val }); canvas.requestRenderAll(); } };
  const handleSkewXChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseInt(e.target.value); setSkewX(val); if (selectedObject && canvas) { selectedObject.set({ skewX: val }); canvas.requestRenderAll(); } };
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseFloat(e.target.value); setOpacity(val); if (selectedObject && canvas) { selectedObject.set({ opacity: val }); canvas.requestRenderAll(); } };
  const handleBlendModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const val = e.target.value; setBlendMode(val); if (selectedObject && canvas) { selectedObject.set({ globalCompositeOperation: val }); canvas.requestRenderAll(); } };
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => { const val = e.target.value; setFontFamily(val); if (selectedObject && canvas) { (selectedObject as fabric.IText).set({ fontFamily: val }); canvas.requestRenderAll(); } };
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseInt(e.target.value, 10); setFontSize(val); if (selectedObject && canvas) { selectedObject.set({ fontSize: val }); canvas.requestRenderAll(); } };
  const handleCharSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = parseInt(e.target.value, 10); setCharSpacing(val); if (selectedObject && canvas) { (selectedObject as fabric.IText).set({ charSpacing: val }); canvas.requestRenderAll(); } };
  const handleTextContentChange = (e: React.ChangeEvent<HTMLInputElement>) => { const val = e.target.value; setTextContent(val); if (selectedObject && canvas && (selectedObject.type === 'i-text')) { (selectedObject as fabric.IText).set({ text: val }); canvas.requestRenderAll(); } };
  const applyFilterValue = (type: 'blur' | 'brightness' | 'contrast', value: number) => { if (selectedObject && canvas && selectedObject.type === 'image') { const img = selectedObject as fabric.FabricImage; if (type === 'blur') setBlur(value); if (type === 'brightness') setBrightness(value); if (type === 'contrast') setContrast(value); const newFilters = []; const currentBlur = type === 'blur' ? value : blur; const currentBright = type === 'brightness' ? value : brightness; const currentContrast = type === 'contrast' ? value : contrast; if (currentBlur > 0) newFilters.push(new fabric.filters.Blur({ blur: currentBlur })); if (currentBright !== 0) newFilters.push(new fabric.filters.Brightness({ brightness: currentBright })); if (currentContrast !== 0) newFilters.push(new fabric.filters.Contrast({ contrast: currentContrast })); img.filters = newFilters; img.applyFilters(); canvas.requestRenderAll(); } };
  const toggleShadow = (e: React.ChangeEvent<HTMLInputElement>) => { const isChecked = e.target.checked; setShadowEnabled(isChecked); if (selectedObject && canvas) { if (isChecked) { const shadow = new fabric.Shadow({ color: shadowColor, blur: shadowBlur, offsetX: shadowOffsetX, offsetY: shadowOffsetY }); selectedObject.set('shadow', shadow); } else { selectedObject.set('shadow', null); } canvas.requestRenderAll(); } };
  const updateShadow = (key: 'color' | 'blur' | 'offsetX' | 'offsetY', value: string | number) => { if (key === 'color') setShadowColor(value as string); if (key === 'blur') setShadowBlur(value as number); if (key === 'offsetX') setShadowOffsetX(value as number); if (key === 'offsetY') setShadowOffsetY(value as number); if (selectedObject && canvas && selectedObject.shadow) { (selectedObject.shadow as any)[key] = value; canvas.requestRenderAll(); } };
  const moveUp = () => { if (selectedObject && canvas) { canvas.bringObjectForward(selectedObject); canvas.requestRenderAll(); } };
  const moveDown = () => { if (selectedObject && canvas) { canvas.sendObjectBackwards(selectedObject); canvas.requestRenderAll(); } };
  const moveToTop = () => { if (selectedObject && canvas) { canvas.bringObjectToFront(selectedObject); canvas.requestRenderAll(); } };
  const moveToBottom = () => { if (selectedObject && canvas) { canvas.sendObjectToBack(selectedObject); canvas.requestRenderAll(); } };
  const deleteObject = () => { if (selectedObject && canvas) { canvas.remove(selectedObject); canvas.discardActiveObject(); canvas.requestRenderAll(); } };

  // --- RENDER CANVAS SETTINGS (No Selection) ---
  if (!selectedObject) {
    return (
      <div style={panelStyle}>
        <h3 className='font-font6 tracking-wide text-lg mb-4'>Canvas Background</h3>
        
        {/* Gradient Toggle Tabs */}
        <div style={{display: 'flex', gap: '5px', marginBottom: '20px', background: '#1a1a1a', padding: '4px', borderRadius: '8px'}}>
            <div onClick={() => handleBgTypeChange('solid')} style={tabStyle(bgType === 'solid')}>Solid</div>
            <div onClick={() => handleBgTypeChange('gradient')} style={tabStyle(bgType === 'gradient')}>Gradient</div>
        </div>

        {bgType === 'solid' ? (
            <div style={rowStyle}>
                <label style={labelStyle} className='font-font7 tracking-wide'>Color</label>
                <input type="color" value={bgColor1} onChange={handleBgColor1Change} className='mt-2 size-10 rounded-xl cursor-pointer border-none'/>
            </div>
        ) : (
            <div style={{display:'flex', flexDirection:'col', gap:'10px'}}>
                <div style={rowStyle}>
                    <label style={labelStyle} className='font-font7 tracking-wide'>Start Color</label>
                    <input type="color" value={bgColor1} onChange={handleBgColor1Change} className='mt-2 size-10 rounded-xl cursor-pointer border-none'/>
                </div>
                <div style={rowStyle}>
                    <label style={labelStyle} className='font-font7 tracking-wide'>End Color</label>
                    <input type="color" value={bgColor2} onChange={handleBgColor2Change} className='mt-2 size-10 rounded-xl cursor-pointer border-none'/>
                </div>
            </div>
        )}
        
        <div className="mt-10 p-4 bg-white/5 rounded-xl text-sm text-gray-400">
            <p>Select an object on the canvas to edit its properties.</p>
        </div>
      </div>
    );
  }

  // --- RENDER OBJECT PROPERTIES ---
  return (
    <div style={panelStyle}>
      <h3 className='font-font6 tracking-wide text-lg mb-2'>Properties</h3>

      {/* Lock */}
      <div style={{marginBottom: '15px', background:'transparent', padding:'10px', borderRadius:'5px', display:'flex', justifyContent:'space-between', alignItems:'center'}} className='text-white'>
         <label style={{ color:'white', cursor:'pointer'}} className='text-sm font-font7 tracking-wide flex items-center justify-start gap-2'>
            <LockIcon className='size-5'/> Lock Position
         </label>
         <input type="checkbox" checked={isLocked} onChange={toggleLock} style={{cursor:'pointer'}} />
      </div>

      {/* Image Filters */}
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

      {/* Common Props */}
      <div style={rowStyle}>
        <label style={labelStyle}>Opacity</label>
        <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={handleOpacityChange} style={{width: '100%'}} />
      </div>

      <div style={rowStyle}>
          <label style={labelStyle}>Blend Mode</label>
          <select value={blendMode} onChange={handleBlendModeChange} style={textInputStyle} className='bg-[#060010] font-font7 tracking-wide outline-1 outline-white p-2 rounded-lg'>
             {BLEND_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>
      </div>

      <div style={rowStyle}>
        <label style={labelStyle}>Tilt (Skew)</label>
        <input type="range" min="-50" max="50" step="1" value={skewX} onChange={handleSkewXChange} style={{width: '100%'}} />
      </div>
      
      {/* Text Props */}
      {(type === 'i-text' || type === 'text') && (
        <div style={{ marginBottom: '20px', paddingBottom: '10px', marginTop: '30px'}}>
          <label style={labelStyle}>Content</label>
          <input type="text" value={textContent} onChange={handleTextContentChange} style={textInputStyle} className='outline-1 outline-white rounded-lg p-2 font-font7 tracking-wide'/>
          <label style={labelStyle}>Font</label>
          <select value={fontFamily} onChange={handleFontFamilyChange} style={textInputStyle} className='outline-1 outline-white p-2 bg-[#060010] rounded-lg'>
             {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
          </select>
          <label style={labelStyle}>Size</label>
          <input type="number" value={fontSize} onChange={handleFontSizeChange} style={numberInputStyle} className='outline-1 outline-white rounded-lg p-2 font-font7 tracking-wide'/>
          <label style={labelStyle}>Spacing</label>
          <input type="range" min="-50" max="1000" step="10" value={charSpacing} onChange={handleCharSpacingChange} style={{width:'100%'}} />
        </div>
      )}

      {/* Colors */}
      {type !== 'image' && (
        <div style={rowStyle}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div>
                  <label style={labelStyle}>Fill</label>
                  <input type="color" value={color} onChange={handleColorChange} disabled={isTransparent} style={{opacity: isTransparent ? 0.5 : 1}} className='size-10 rounded-xl border-none'/>
              </div>
              <label style={{fontSize:'12px', display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                  <input type="checkbox" checked={isTransparent} onChange={toggleTransparent} /> Transparent
              </label>
          </div>
          
          <div style={{marginTop: '15px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
                <label style={labelStyle}>Border</label>
                <input type="color" value={stroke} onChange={handleStrokeChange} className='size-10 rounded-xl border-none'/>
            </div>
            <div style={{width: '60%'}}>
                <label style={labelStyle}>Width: {strokeWidth}px</label>
                <input type="range" min="0" max="20" value={strokeWidth} onChange={handleStrokeWidthChange} style={{width: '100%'}} />
            </div>
          </div>
        </div>
      )}

      {/* Shadow */}
      <div style={{ marginBottom: '20px', paddingTop: '15px', marginTop:'30px'}}>
         <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <label style={{...labelStyle, marginTop:0}}>Shadow / Glow</label>
            <input type="checkbox" checked={shadowEnabled} onChange={toggleShadow} style={{cursor:'pointer'}} />
         </div>
         {shadowEnabled && (
             <div style={{marginTop: '10px', paddingLeft: '10px'}} className='font-font7 text-white tracking-wide' >
                 <div style={{marginBottom: '10px', display:'flex', justifyContent:'space-between'}}>
                     <label>Color</label>
                     <input type="color" value={shadowColor} onChange={(e) => updateShadow('color', e.target.value)} className='size-8 rounded-lg border-none'/>
                 </div>
                 <div style={{marginBottom: '5px'}}><label>Blur</label><input type="range" min="0" max="100" value={shadowBlur} onChange={(e) => updateShadow('blur', parseInt(e.target.value))} style={{width: '100%'}} /></div>
                 <div style={{marginBottom: '5px'}}><label>X</label><input type="range" min="-50" max="50" value={shadowOffsetX} onChange={(e) => updateShadow('offsetX', parseInt(e.target.value))} style={{width: '100%'}} /></div>
                 <div style={{marginBottom: '5px'}}><label>Y</label><input type="range" min="-50" max="50" value={shadowOffsetY} onChange={(e) => updateShadow('offsetY', parseInt(e.target.value))} style={{width: '100%'}} /></div>
             </div>
         )}
      </div>
      
      {/* Layering */}
      <div style={{ marginBottom: '20px', paddingTop: '15px' }}>
        <label style={labelStyle} className='font-font6 tracking-wide text-lg mb-2'>Layering</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <button onClick={moveToTop} title="Top" className='bg-pink-700 p-2 rounded-lg hover:scale-105'><ArrowUpFromDot className='size-5'/></button>
          <button onClick={moveUp} title="Up" className='bg-pink-700 p-2 rounded-lg hover:scale-105'><ChevronUp className='size-5'/></button>
          <button onClick={moveDown} title="Down" className='bg-pink-700 p-2 rounded-lg hover:scale-105'><ChevronDown className='size-5'/></button>
          <button onClick={moveToBottom} title="Bottom" className='bg-pink-700 p-2 rounded-lg hover:scale-105'><ArrowDownToDot className='size-5'/></button>
        </div>
      </div>

      <button onClick={deleteObject} style={deleteBtnStyle} className='flex items-center justify-center gap-2 bg-red-600 rounded-xl'><Trash2Icon size={18}/> Delete Object</button>
    </div>
  );
};

const panelStyle: React.CSSProperties = { width: '300px', padding: '20px', background: '#060010', overflowY: 'auto', color: 'white' };
const labelStyle: React.CSSProperties = { display: 'block', marginTop: '10px', fontSize: '12px', opacity: 0.8 };
const textInputStyle: React.CSSProperties = { width: '100%', marginTop: '5px' };
const numberInputStyle: React.CSSProperties = { width: '100%', marginTop: '5px' };
const rowStyle: React.CSSProperties = { marginTop: '15px' };