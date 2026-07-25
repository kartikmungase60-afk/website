import Footer from "../components/Footer"
import LookingGlassClient from "../components/LookingGlassClient"
import Navbar from "../components/Navbar"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({ title: "Looking Glass & Browser Network Tests", description: "Run browser-based regional RTT and download tests, understand routing limits and request Hostlixo network diagnostics.", path: "/looking-glass", keywords: ["Hostlixo looking glass", "hosting ping test", "VPS network test", "Mumbai server latency"] })
export default function LookingGlassPage() { return <div className="min-h-screen bg-[#07080d] text-white"><Navbar /><main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8"><header className="max-w-3xl"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gray-300">Network diagnostics</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Hostlixo Looking Glass</h1><p className="mt-5 text-sm leading-7 text-gray-400">Run browser-based tests for regional responsiveness and your current download path. Results vary by ISP, peering, browser and time of day.</p></header><div className="mt-10"><LookingGlassClient /></div></main><Footer /></div> }
