import { useState } from "react"
import StepOne from "./forms/StepOne"
import StepTwo from "./forms/StepTwo"
import StepThree from "./forms/StepThree"
import StepFour from "./forms/StepFour"

export default function MultiStepFormSection() {
  const [step, setStep] = useState(1)

  return (
    <div className="
  w-full relative px-[10vw] py-32 
  bg-gradient-to-b from-black via-[#0e0e0e] to-black
  overflow-visible
">


      {/* Glow that matches hero */}
      <div className="absolute inset-0 bg-gradient-to-b 
        from-transparent 
        via-[#6d28d91a] 
        to-black 
        pointer-events-none">
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-white">

        <h2 className="text-4xl font-bold-heading mb-14 text-center text-white">
          Create Your Retail Media Creative
        </h2>

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
  )
}
