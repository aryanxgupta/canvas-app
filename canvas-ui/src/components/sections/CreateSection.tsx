import { Canvas } from '../Canvas';
import { SettingsPanel } from '../SettingsPanel';
import { SizePanel } from '../SizePanel';
import { Toolbar } from '../Toolbar';

export default function CreateSection() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }} className='max-h-[100vh]'>
      <SizePanel />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} className='bg-[#060010]'>
        <Toolbar /> 
        <Canvas />  
        <SettingsPanel />
      </div>
    </div>
  );
}