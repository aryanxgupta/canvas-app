import DarkVeil from "./components/DarkVeil"
import Navbar from "./components/Navbar"
import HeroSection from "./components/sections/HeroSection"
import MultiStepFormSection from "./components/sections/MultiStepFormSection"

function App() {
  return (
    <div className="relative w-screen bg-[#020000]">
      <div style={{ width: '100%', height: '600px', position: 'absolute', left: 0, zIndex: 9 }}>
        <DarkVeil />
      </div>
      <Navbar />
      <HeroSection />
      
      <MultiStepFormSection />
    </div>
  )
}

export default App
