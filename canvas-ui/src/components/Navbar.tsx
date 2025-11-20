import { Link } from "wouter"
import Magnet from "./Magnet"

const Navbar = () => {
  return (
    <div className="fixed left-0 top-0 z-100 w-full text-white bg-transparent font-font6 flex items-center py-5 pb-15 justify-between px-20 gap-5 cursor-pointer">
        <div>LOGO</div>
        <div className="flex items-center justify-center gap-10">
            <div className="mx-3 cursor-pointer">
                <Magnet padding={30} disabled={false} magnetStrength={5}>
                    <Link href="/">HOME</Link>
                </Magnet>
            </div>

            <div className="mx-3 cursor-pointer">
                <Magnet padding={7} disabled={false} magnetStrength={2}>
                    <Link href="/create">CREATE</Link>
                </Magnet>
            </div>

            <div className="mx-3 cursor-pointer">
                <Magnet padding={30} disabled={false} magnetStrength={5}>
                    <Link href="/">ABOUT</Link>
                </Magnet>
            </div>
        </div>
        <div>®2025</div>
    </div>
  )
}

export default Navbar