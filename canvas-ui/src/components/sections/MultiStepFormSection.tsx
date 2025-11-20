import { useState } from "react"
import StepOne from "./forms/StepOne"
import StepTwo from "./forms/StepTwo"
import StepThree from "./forms/StepThree"
import StepFour from "./forms/StepFour"
import Orb from "../Orb"
import Navbar from "../Navbar"

export default function MultiStepFormSection() {
  const [step, setStep] = useState(1)

  return (
    <>
      <Navbar />
      <div className="
    w-screen relative px-[10vw] py-32 
    overflow-hidden bg-[#020000]
  ">
        <div className="w-full h-full absolute inset-0">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
        {/* Glow that matches hero */}
        <div className="absolute inset-0 
          pointer-events-none">
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-white">

          <div className="backdrop-blur-xl bg-[#0b0b0b]/80 
    border border-black 
    shadow-2xl p-10 rounded-2xl">


            {step === 1 && <StepOne onNext={() => setStep(2)} />}
            {step === 2 && <StepTwo onNext={() => setStep(3)} onBack={() => setStep(1)} />}
            {step === 3 && <StepThree onNext={() => setStep(4)} onBack={() => setStep(2)} />}
            {step === 4 && <StepFour onBack={() => setStep(3)} />}

          </div>
        </div>
      </div>
    </>
  )
}
