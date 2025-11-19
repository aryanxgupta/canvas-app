import DarkVeil from "./components/DarkVeil"
import Navbar from "./components/Navbar"
import CreateSection from "./components/sections/CreateSection"
import HeroSection from "./components/sections/HeroSection"

function App() {
  return(
    // <div className="relative w-screen bg-[#020000]">
    //   <div style={{ width: '100%', height: '600px', position: 'absolute', left: 0, zIndex: 9}}>
    //       <DarkVeil />
    //   </div>
    //   <Navbar />
    //   <HeroSection />
    // </div>
    <CreateSection />
  )
}

export default App
