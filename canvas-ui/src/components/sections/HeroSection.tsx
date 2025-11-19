
import ImageTrail from "../ImageTrail"
import RotatingText from "../RotatingText"
import ShinyText from "../ShinyText"

function HeroSection(){
    return (
        <div className="relative w-screen h-screen bg-transparent flex flex-col items-start justify-center px-[10vw] overflow-visible z-10">

            <ShinyText 
                text="Anunciante" 
                disabled={false} 
                speed={2} 
                className='custom-class text-[12vw] font-bold-heading z-10' // Added z-10
            />
            
            <div className="flex items-center justify-start gap-4 -my-10 w-full z-10"> {/* Added z-10 */}
                <div className="text-white w-fit font-sub-heading text-xl "><h1>Generate Campaingns that are</h1></div>
                <RotatingText
                    texts={['STUNNING!', 'VIRAL!', 'PROFESSIONAL!', 'COOL!']}
                    mainClassName="px-2 sm:px-2 md:px-3 bg-violet-300 text-zinc-800 font-bold text-xl font-sub-heading overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                />
            </div>
            
            <ImageTrail />

            
        </div>
    )
}

export default HeroSection