"use client"

import Image from "next/image"
import { Check, Cpu, HardDrive, MemoryStick, Network, Server, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"
import RegionalLatencyCard, { hostingRegions } from "./RegionalLatencyCard"
import { useCurrency } from "./ui/InrPricing"

type Plan = { id: string; name: string; badge?: string; cpu: string; cpuDetail: string; ram: string; ramDetail: string; storage: string; storageDetail: string; bandwidth?: string; bandwidthDetail?: string; uptime?: string; price: string; period: string; features?: string[]; outOfStock?: boolean; orderLink?: string }
type PlanType = { id: string; displayName: string; image: string }

export default function CompactPricingCatalog({ kind, title, accent, description, hero, planTypes, plans, locations }: { kind: string; title: string; accent: string; description: string; hero: string; planTypes: PlanType[]; plans: Record<string, Plan[]>; locations?: { id: string; outOfStock?: boolean }[] }) {
  const defaultTypeId = planTypes?.[0]?.id || ""
  const [type, setType] = useState(defaultTypeId)
  const [region, setRegion] = useState("india")
  const { convertPrice } = useCurrency()
  const currentPlans = useMemo(() => plans?.[type] || plans?.[defaultTypeId] || [], [plans, type, defaultTypeId])

  return <main className="min-h-screen bg-[#060609] pb-24 pt-20 text-white">
    <section className="relative isolate flex min-h-[270px] items-center justify-center overflow-hidden border-b border-white/[0.07] px-4 text-center">
      <Image src={hero} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#060609]/55 via-[#060609]/75 to-[#060609]" />
      <div className="hero-reveal max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-300"><Server className="h-3.5 w-3.5" />{kind}</span><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">{title} <span style={{ color: accent }}>Hosting</span></h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-300">{description}</p></div>
    </section>
    <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 lg:px-8">
      <header className="text-center"><p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gray-600">Choose your infrastructure</p><h2 className="mt-3 text-3xl font-black">Configure your {kind}</h2></header>
      <div className="mx-auto mt-7 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-4">{hostingRegions.map((item) => {
        const isOutOfStock = locations?.find((loc) => loc.id === item.id)?.outOfStock;
        return <RegionalLatencyCard key={item.id} region={item} selected={region === item.id} onSelect={isOutOfStock ? undefined : () => setRegion(item.id)} outOfStock={isOutOfStock} />
      })}</div>
      <div className="mt-7 flex flex-wrap justify-center gap-2">{(planTypes || []).map((item) => <button key={item.id} onClick={() => setType(item.id)} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition ${type === item.id ? "border-white/20 bg-gray-800 text-white shadow-lg shadow-black/25" : "border-white/10 bg-[#101014] text-gray-400 hover:border-white/20 hover:text-white"}`}><Image src={item.image.replace('/cpu/', '/assets/hardware/').replace('ryzen7.png','amd-ryzen-7.png').replace('ryzen9.png','amd-ryzen-9.png').replace('/icons/inteli7.png','/assets/hardware/intel-core-i7.png')} alt="" width={22} height={22} className="h-5 w-5 object-contain" />{item.displayName}</button>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{currentPlans.map((plan, index) => {
        const isOutOfStock = Boolean(plan.outOfStock || (plan as any).OUTOFSTOCK || (plan as any).outofstock);
        return (
          <article key={plan.id} style={{ animationDelay: `${index * 55}ms` }} className={`animate-plan-rise group relative flex min-h-[390px] flex-col overflow-hidden rounded-xl border bg-[#0d0e13] p-5 transition duration-300 transform-gpu ${index === 1 ? "border-white/20 shadow-xl shadow-black/25" : "border-white/10"} ${!isOutOfStock && "hover:-translate-y-1 hover:border-white/20"}`}>
            <div className={`absolute inset-x-0 top-0 h-0.5 ${index === 1 ? "bg-gray-800" : "bg-white/10 group-hover:bg-white/60"}`} />
            {index === 1 && !isOutOfStock && <span className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-300"><Sparkles className="mr-1 inline h-3 w-3" />Popular</span>}
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-300">{kind} · {hostingRegions.find((item) => item.id === region)?.name}</p><h3 className="mt-2 pr-20 text-xl font-black">{plan.name}</h3>
            <div className="mt-5 flex items-end gap-1 border-b border-white/10 pb-5"><span className="text-3xl font-black">{convertPrice(plan.price)}</span><span className="pb-1 text-xs text-gray-500">{plan.period}</span></div>
            <dl className="mt-5 grid grid-cols-2 gap-4"><Spec icon={Cpu} label={plan.cpuDetail} value={plan.cpu} /><Spec icon={MemoryStick} label={plan.ramDetail} value={plan.ram} /><Spec icon={HardDrive} label={plan.storageDetail} value={plan.storage} /><Spec icon={Network} label={plan.bandwidthDetail || "Network"} value={plan.bandwidth || "Protected"} /></dl>
            <ul className="mt-5 space-y-2 text-[11px] text-gray-400">{(plan.features?.slice(0,4) || [plan.uptime || "99.9% uptime target", "DDoS-filtered network", "Hostlixo control panel", "24/7 service monitoring"]).map((feature) => <li key={feature} className="flex items-center gap-2"><Check className="h-3 w-3 text-gray-300" />{feature}</li>)}</ul>
            
            {isOutOfStock ? (
              <>
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-black/80">
                  <div className="relative w-64 h-56 pointer-events-none drop-shadow-2xl -mt-1">
                    <Image src="/assets/out-of-stock.png" alt="Out of stock" fill sizes="300px" className="object-contain object-top drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" />
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-center rounded-lg bg-[#1a1a20] py-2.5 text-xs font-black text-gray-600 opacity-0 pointer-events-none">Order Now</div>
              </>
            ) : (
              <a href={plan.orderLink || "https://billing.hostlixo.com"} className="mt-auto flex items-center justify-center rounded-lg bg-gray-800 py-2.5 text-xs font-black text-white transition hover:bg-gray-700">Order Now</a>
            )}
          </article>
        )
      })}</div>
    </section>
  </main>
}

function Spec({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: string }) { return <div><dt className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-600"><Icon className="h-3 w-3" />{label}</dt><dd className="mt-1 text-xs font-bold text-gray-200">{value}</dd></div> }
