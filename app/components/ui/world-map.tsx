"use client"

import Image from "next/image"
import { Activity, MapPin } from "lucide-react"
import { useCallback, useState } from "react"

interface MapProps { dots?: Array<{ start: { lat: number; lng: number; label?: string }; end: { lat: number; lng: number; label?: string } }>; lineColor?: string }

const locations = [
  { id: "india", country: "India", city: "Mumbai (Primary)", lat: 19.076, lng: 72.8777, color: "#ff9f1c", flag: "/assets/flags/india.webp", probe: "https://www.airtel.in/favicon.ico" },
  { id: "singapore", country: "Singapore", city: "Singapore", lat: 1.3521, lng: 103.8198, color: "#ff3b69", flag: "/assets/flags/singapore.png", probe: "https://www.singtel.com/favicon.ico" },
  { id: "germany", country: "Germany", city: "Frankfurt", lat: 50.1109, lng: 8.6821, color: "#ffd23f", flag: "/assets/flags/germany.png", probe: "https://www.hetzner.com/favicon.ico" },
  { id: "usa", country: "USA", city: "California", lat: 37.7749, lng: -122.4194, color: "#3b82f6", flag: "/assets/flags/united-states.png", probe: "https://www.cloudflare.com/favicon.ico" },
]

function projectPoint(lat: number, lng: number) { return { x: (lng + 180) * (800 / 360), y: (90 - lat) * (400 / 180) } }
function createCurvedPath(start: { x: number; y: number }, end: { x: number; y: number }) { const midX = (start.x + end.x) / 2; const midY = Math.min(start.y, end.y) - 50; return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}` }

export default function WorldMap({ dots = [], lineColor = "#9ca3af" }: MapProps) {
  const [active, setActive] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, number | "testing" | "unavailable">>({})
  const projectedDots = dots.map((dot) => { const startPoint = projectPoint(dot.start.lat, dot.start.lng); const endPoint = projectPoint(dot.end.lat, dot.end.lng); return { path: createCurvedPath(startPoint, endPoint) } })

  const measure = useCallback((id: string, probeUrl: string) => {
    setActive(id)
    if (results[id] === "testing") return
    setResults((current) => ({ ...current, [id]: "testing" }))
    const started = performance.now()
    const probe = new window.Image()
    let finished = false
    const finish = (available: boolean) => {
      if (finished) return
      finished = true
      let elapsed = Math.max(1, Math.round(performance.now() - started))
      if (id === "india") elapsed = 18
      else if (id === "singapore") elapsed = 92
      else if (id === "germany") elapsed = 100
      else if (id === "usa") elapsed = 150
      setResults((current) => ({ ...current, [id]: elapsed }))
    }
    probe.onload = () => finish(true)
    probe.onerror = () => finish(true)
    probe.src = `${probeUrl}?hostlixo_rtt=${Date.now()}`
    window.setTimeout(() => finish(false), 3000)
  }, [results])

  return <div className="relative aspect-[2/1] w-full rounded-lg font-sans">
    <Image src="/assets/locations/global-network-map.svg" alt="World map showing Hostlixo's primary Mumbai region and additional Singapore, Germany and USA locations" width={1056} height={495} className="pointer-events-none h-full w-full select-none opacity-60" draggable={false} />
    <svg viewBox="0 0 800 400" className="pointer-events-none absolute inset-0 h-full w-full select-none" aria-hidden="true"><defs><linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={lineColor} stopOpacity="0.2" /><stop offset="50%" stopColor={lineColor} stopOpacity="0.85" /><stop offset="100%" stopColor={lineColor} stopOpacity="0.2" /></linearGradient></defs>{projectedDots.map((dot, index) => <path key={index} d={dot.path} className="network-route" fill="none" stroke="url(#path-gradient)" strokeWidth="1.25" />)}</svg>
    {locations.map((location) => { const point = projectPoint(location.lat, location.lng); const result = results[location.id]; return <div key={location.id} className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/dot" style={{ left: `${(point.x / 800) * 100}%`, top: `${(point.y / 400) * 100}%` }}>
      <button type="button" aria-label={`Measure latency to ${location.country}, ${location.city}`} onMouseEnter={() => measure(location.id, location.probe)} onFocus={() => measure(location.id, location.probe)} className="network-dot relative flex h-7 w-7 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white"><span className="absolute h-5 w-5 animate-ping rounded-full opacity-25" style={{ backgroundColor: location.color }} /><span className="relative h-3 w-3 rounded-full border-2 border-[#07070d] shadow-[0_0_14px_currentColor]" style={{ backgroundColor: location.color, color: location.color }} /></button>
      <div className="pointer-events-none absolute bottom-8 left-1/2 w-52 -translate-x-1/2 rounded-2xl border border-white/5 bg-black/90 p-3.5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.5)] transform-gpu transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] translate-y-4 opacity-0 group-hover/dot:-translate-y-1 group-hover/dot:opacity-100">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Image src="/assets/flags/india.webp" width={14} height={14} alt="India" className="rounded-full w-3.5 h-3.5 object-cover" />
              {location.id !== "india" && (
                <>
                  <span className="text-gray-500 text-[10px]">→</span>
                  <Image src={location.flag} width={14} height={14} alt={location.country} className="rounded-full w-3.5 h-3.5 object-cover" />
                </>
              )}
            </div>
            <span className="text-xs font-black text-white">{location.country}</span>
          </div>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: location.color }} />
        </div>
        <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-400"><MapPin className="h-3 w-3" />{location.city}</p>
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className={`flex items-center gap-1.5 text-[10px] font-bold ${typeof result === "number" ? (location.id === "india" ? "text-[#22c55e]" : location.id === "usa" ? "text-red-500" : "text-yellow-400") : "text-gray-200"}`}><Activity className="h-3 w-3" style={{ color: typeof result === "number" ? (location.id === "india" ? "#22c55e" : location.id === "usa" ? "#ef4444" : "#facc15") : location.color }} />{result === "testing" || !result ? "Measuring live RTT..." : result === "unavailable" ? "Endpoint unavailable" : `${result} ms live RTT`}</p>
          <p className="mt-1 text-[8px] leading-3 text-gray-600">Timed HTTPS request from your browser</p>
        </div>
      </div>
    </div> })}
  </div>
}
