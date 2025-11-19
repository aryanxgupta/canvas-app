import { useEditorStore } from '../store/editorStore';
import { CANVAS_PRESETS } from '../constants/canvas-presets';

export const SizePanel = () => {
  const { width, height, setSize } = useEditorStore();

  return (
    <div style={{ padding: '10px', background: '#060010'}} className='text-white'>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }} className='font-soft tracking-wider font-light'>Canvas Size:</label>
        
        <select 
          value={`${width}x${height}`} 
          onChange={(e) => {
            const [w, h] = e.target.value.split('x').map(Number);
            setSize(w, h);
          }}
          style={{ padding: '5px' }}
          className='font-font7 tracking-wide'
        >
          {CANVAS_PRESETS.map((preset) => (
            <option 
              key={preset.name} 
              value={`${preset.width}x${preset.height}`}
              className='bg-[#060010] font-font7 tracking-wide'
            >
              {preset.name} ({preset.width} x {preset.height})
            </option>
          ))}
        </select>

      </div>
    </div>
  );
};