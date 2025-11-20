import React from 'react'
import DarkVeil from '../DarkVeil'
import Navbar from '../Navbar'
import HeroSection from './HeroSection'

const Home = () => {
  return (
    <div className="relative w-screen bg-[#020000]">
      <div style={{ width: '100%', height: '600px', position: 'absolute', left: 0, zIndex: 9 }}>
        <DarkVeil />
      </div>
      <Navbar />
      <HeroSection />
    </div>
  )
}

export default Home