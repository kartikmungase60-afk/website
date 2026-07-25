"use client"

import { MapPin } from "lucide-react"
import WorldMap from "./ui/world-map"
import RegionalLatencyCard, { hostingRegions } from "./RegionalLatencyCard"

const routes = [
  { start: { lat: 19.076, lng: 72.8777 }, end: { lat: 1.3521, lng: 103.8198 } },
  { start: { lat: 19.076, lng: 72.8777 }, end: { lat: 50.1109, lng: 8.6821 } },
  { start: { lat: 19.076, lng: 72.8777 }, end: { lat: 37.7749, lng: -122.4194 } },
]

export default function LocationsSection() {
  return (
    <section id="infrastructure" className="relative scroll-mt-24 overflow-hidden border-y border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 opacity-[0.02] mix-blend-screen bg-[url('/assets/noise.svg')] pointer-events-none" />
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl z-10">
        <header 
          data-aos="fade-up"
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <MapPin className="h-5 w-5 text-red-400 drop-shadow-md" />
            </div>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50" />
          </div>
          <p className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-red-400">Mumbai-First Hosting Network</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white drop-shadow-xl">
            Built in India, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Connected Globally</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400">
            Hostlixo is headquartered in Mumbai, India, with additional premium service regions in Singapore, Germany and the United States. Test the real browser route from your connection.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div 
            data-aos="fade-right"
            className="relative min-h-[450px] rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-8 shadow-2xl group"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3b82f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="absolute left-6 top-6 z-10 flex items-center gap-3 rounded-full border border-white/5 bg-black/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 shadow-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Mumbai Headquarters
            </div>
            
            <div className="absolute inset-0 z-20">
              <WorldMap dots={routes} lineColor="#3b82f6" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-3 sm:grid-cols-4 z-10">
              {hostingRegions.map((region) => (
                <div key={region.id} className="rounded-xl border border-white/10 bg-black/90 px-4 py-3 transform-gpu transition-transform hover:-translate-y-1 hover:border-white/20 hover:bg-[#1a1a1a]">
                  <p className="text-sm font-black text-white">{region.city}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-red-400">{region.zone}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {hostingRegions.map((region, index) => (
              <div 
                key={region.id} 
                data-aos="fade-left"
                data-aos-delay={index * 50}
                className="transition duration-300 hover:scale-[1.02] hover:-translate-y-1 transform-gpu"
              >
                <RegionalLatencyCard region={region} compact />
              </div>
            ))}
          </div>
        </div>
        
        <p className="mt-8 flex justify-center items-center gap-2 text-center text-[11px] font-bold uppercase tracking-widest text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          Live RTT measures a real HTTPS request to a public regional endpoint. It is not ICMP ping and may differ from purchased server latency.
        </p>
      </div>
    </section>
  )
}
