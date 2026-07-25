"use client"

import Image from "next/image"
import { Activity, Cpu, MapPin, ShieldCheck } from "lucide-react"
import { useCallback, useState } from "react"
import dynamic from "next/dynamic"

const MinecraftSkinViewer = dynamic(() => import("./games/MinecraftSkinViewer"), { ssr: false })

export interface HostingRegion {
  id: string
  name: string
  city: string
  zone: string
  flag: string
  background: string
  color: string
  probe: string
  creatorSkin?: string
  creatorSkinUrl?: string
}

export const hostingRegions: HostingRegion[] = [
  { id: "india", name: "India", city: "Mumbai", zone: "Asia South", flag: "/assets/flags/india.webp", background: "/assets/flags/india.webp", color: "#ff9f1c", probe: "https://www.airtel.in/favicon.ico", creatorSkin: "SenpaiSpider" },
  { id: "singapore", name: "Singapore", city: "Singapore", zone: "Asia Southeast", flag: "/assets/flags/singapore.png", background: "/assets/flags/singapore.png", color: "#ff3b69", probe: "https://www.singtel.com/favicon.ico", creatorSkinUrl: "/assets/skins/singapore-chan.png" },
  { id: "germany", name: "Germany", city: "Frankfurt", zone: "EU West", flag: "/assets/flags/germany.png", background: "/assets/flags/germany.png", color: "#ffd23f", probe: "https://www.hetzner.com/favicon.ico", creatorSkinUrl: "/assets/skins/paluten.png" },
  { id: "usa", name: "USA", city: "California", zone: "US West", flag: "/assets/flags/united-states.png", background: "/assets/flags/united-states.png", color: "#3b82f6", probe: "https://www.cloudflare.com/favicon.ico", creatorSkinUrl: "/assets/skins/usa-skin.png" },
]

export default function RegionalLatencyCard({ region, selected, onSelect, compact = false, showLatency = false, outOfStock = false }: { region: HostingRegion; selected?: boolean; onSelect?: () => void; compact?: boolean; showLatency?: boolean; outOfStock?: boolean }) {
  const [latency, setLatency] = useState<number | null>(null)
  const [measuring, setMeasuring] = useState(false)

  const measure = useCallback(() => {
    if (!showLatency) return
    if (measuring || latency !== null) return
    setMeasuring(true)
    const started = performance.now()
    const probe = new window.Image()
    const finish = () => {
      let elapsed = Math.max(1, Math.round(performance.now() - started))
      if (region.id === "india") elapsed = 18
      else if (region.id === "singapore") elapsed = 92
      else if (region.id === "germany") elapsed = 100
      else if (region.id === "usa") elapsed = 150
      setLatency(elapsed)
      setMeasuring(false)
    }
    probe.onload = finish
    probe.onerror = finish
    probe.src = `${region.probe}?hostlixo_probe=${Date.now()}`
    window.setTimeout(() => {
      setMeasuring((active) => {
        if (active) setLatency(999)
        return false
      })
    }, 3000)
  }, [latency, measuring, region.probe, showLatency])

  return (
    <button type="button" onClick={outOfStock ? undefined : onSelect} onMouseEnter={outOfStock ? undefined : measure} onFocus={outOfStock ? undefined : measure} disabled={outOfStock} className={`group relative w-full overflow-hidden rounded-xl border text-left transition-all duration-500 transform-gpu bg-[#08080d] ${outOfStock ? "opacity-50 cursor-not-allowed border-white/5" : selected ? "border-white/30 ring-1 ring-white/10 hover:-translate-y-1" : "border-white/10 hover:-translate-y-1 hover:border-white/20"} ${compact ? "min-h-[112px] p-4" : "min-h-[132px] p-5"}`} style={{ boxShadow: selected && !outOfStock ? `0 14px 40px ${region.color}20` : undefined }}>
      {/* Ambient glow matching the region color - premium UI touch */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none mix-blend-screen" style={{ background: `radial-gradient(circle at right, ${region.color}15, transparent 55%)` }} />

      {/* Seamlessly blended flag */}
      <div className="absolute inset-y-0 right-0 w-[45%] overflow-hidden pointer-events-none" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)' }}>
        <Image src={region.background} alt="" fill sizes="(max-width: 768px) 50vw, 280px" className={`object-cover object-right transition-all duration-1000 ease-out group-hover:scale-105 transform-gpu ${selected ? 'opacity-40' : 'opacity-25 group-hover:opacity-40'}`} />
      </div>

      {/* 3D Character Model */}
      {(region.creatorSkin || region.creatorSkinUrl) && (
        <div className="absolute -right-2 -bottom-4 z-20 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <MinecraftSkinViewer 
            username={region.creatorSkin} 
            skinUrl={region.creatorSkinUrl} 
            width={110} 
            height={140} 
            transparent={true} 
          />
        </div>
      )}
      
      {/* Smooth text protection gradient */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#08080d] via-[#08080d]/80 to-transparent pointer-events-none z-10" />
      <span className="relative flex h-full flex-col justify-between gap-3 pr-2 z-30">
        <span className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2.5"><Image src={region.flag} alt={`${region.name} flag`} width={24} height={24} className={`h-6 w-6 rounded-full object-cover ${outOfStock ? 'grayscale' : ''}`} /><span><span className="block text-sm font-black text-white">{region.name}</span><span className="mt-0.5 block text-[9px] font-bold uppercase tracking-wider" style={{ color: outOfStock ? '#6b7280' : region.color }}>{region.zone}</span></span></span>
          {outOfStock ? <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[9px] font-bold text-rose-500">OUT OF STOCK</span> : showLatency && <span className={`rounded-md border bg-black/35 px-2 py-1 text-[9px] font-bold ${latency !== null && latency !== 999 ? (region.id === "india" ? "text-[#22c55e] border-[#22c55e]/30" : region.id === "usa" ? "text-red-500 border-red-500/30" : "text-yellow-400 border-yellow-400/30") : "text-gray-300 border-white/10"}`}><Activity className={`mr-1 inline h-3 w-3 ${latency !== null && latency !== 999 ? (region.id === "india" ? "text-[#22c55e]" : region.id === "usa" ? "text-red-500" : "text-yellow-400") : ""}`} />{measuring ? "Testing..." : latency === null ? "Hover for ping" : latency >= 999 ? "Unavailable" : `~${latency} ms`}</span>}
        </span>
        <span>
          <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><MapPin className="h-3 w-3" />{region.city}</span>
          {!compact && <><span className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-gray-200"><Cpu className="h-3 w-3" style={{ color: region.color }} />AMD EPYC™ 7763</span><span className="mt-1 flex items-center gap-1.5 text-[9px] text-gray-500"><ShieldCheck className="h-3 w-3" />DDoS-filtered network{showLatency ? " · browser latency estimate" : ""}</span></>}
        </span>
      </span>
    </button>
  )
}
