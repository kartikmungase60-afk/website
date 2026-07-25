"use client"

import Image from "next/image"
import { Check, Cpu, Database, HardDrive, MemoryStick, Server, Wifi } from "lucide-react"
import { useState } from "react"
import { useCurrency } from "../ui/InrPricing"

export default function DiscordPricingSection({ planTypes, plans, locations }: { planTypes: any[], plans: Record<string, any[]>, locations: any[] }) {
  const { convertPrice } = useCurrency()
  const defaultTypeId = planTypes?.[0]?.id || ""
  const [selectedPlanType, setSelectedPlanType] = useState(defaultTypeId)
  const currentPlans = plans?.[selectedPlanType] || plans?.[defaultTypeId] || []

  return (
    <main className="min-h-screen bg-[#07090d] pb-20 text-white">
      <section className="relative isolate flex min-h-[330px] items-center justify-center overflow-hidden border-b border-white/[0.07] px-4 pt-20 text-center">
        <Image src="/assets/services/bot/discord-bot-hosting-hero.webp" alt="Discord bot hosting infrastructure" fill priority quality={90} sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-[#07090d]" />
        <div className="hero-reveal">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-300">Managed application hosting</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Premium <span className="text-gray-300">Discord Bot Hosting</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-300">Run Node.js, Python and Java bots with automatic restart, file access, protected networking and transparent INR billing.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8">
        <header className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-600">Choose your runtime plan</p>
          <h2 className="mt-3 text-3xl font-black">Simple, Transparent Pricing</h2>
          <p className="mt-2 text-xs text-gray-500">Every plan includes deployment controls, support tickets and protected connectivity.</p>
          <div className="mt-6 inline-flex rounded-lg border border-white/10 bg-[#11141a] p-1">
            {(planTypes || []).map((type) => <button key={type.id} type="button" onClick={() => setSelectedPlanType(type.id)} className={`rounded-md px-5 py-2 text-xs font-bold transition ${selectedPlanType === type.id ? "bg-gray-800 text-[#031014]" : "text-gray-500 hover:text-white"}`}>{type.name}</button>)}
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {currentPlans.map((plan, index) => {
            const isOutOfStock = Boolean(plan.outOfStock || (plan as any).OUTOFSTOCK || (plan as any).outofstock);
            return (
              <article key={plan.id} style={{ animationDelay: `${index * 70}ms` }} className={`animate-plan-rise relative flex min-h-[410px] flex-col overflow-hidden rounded-xl border bg-[#0c1016] p-5 transition duration-300 transform-gpu hover:border-white/20 ${plan.badge ? "border-white/20" : "border-white/[0.09]"} ${!isOutOfStock && "hover:-translate-y-1 hover:border-white/20"}`}>
                {isOutOfStock && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-black/80">
                    <div className="relative w-64 h-56 pointer-events-none drop-shadow-2xl -mt-1">
                      <Image src="/assets/out-of-stock.png" alt="Out of stock" fill sizes="300px" className="object-contain object-top drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" />
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[9px] font-bold uppercase tracking-wider text-gray-300">Discord bot hosting</p><h3 className="mt-1 text-lg font-black">{plan.name}</h3></div>
                  <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/20 bg-white/10"><Image src="/assets/hardware/nodejs-runtime.png" alt="" fill sizes="36px" className="object-contain p-1.5" /></div>
                </div>
                {plan.badge && <span className="mt-3 w-fit rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-gray-300">{plan.badge}</span>}
                <div className="mt-5 flex items-end gap-1 border-b border-white/[0.07] pb-5"><span className="text-3xl font-black">{convertPrice(plan.price)}</span><span className="pb-1 text-[10px] text-gray-500">{plan.period}</span></div>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  <Spec icon={MemoryStick} label={plan.ramDetail} value={plan.ram} /><Spec icon={Cpu} label={plan.cpuDetail} value={plan.cpu} /><Spec icon={HardDrive} label={plan.storageDetail} value={plan.storage} /><Spec icon={Wifi} label={plan.bandwidthDetail || "Network"} value={plan.bandwidth || "Protected"} />
                </dl>
                <ul className="mt-5 space-y-2 text-[11px] text-gray-400"><Feature text="Automatic restart" /><Feature text="File and log access" /><Feature text="Database access" /><Feature text="Support tickets" /></ul>
                {isOutOfStock ? (
                  <div className="mt-auto flex w-full items-center justify-center rounded-lg bg-gray-800/50 border border-white/5 py-2.5 text-xs font-black text-gray-500 opacity-60 pointer-events-none cursor-not-allowed">Out of Stock</div>
                ) : (
                  <a href={plan.orderLink || "https://billing.hostlixo.com"} className="mt-auto flex w-full items-center justify-center rounded-lg bg-gray-800 py-2.5 text-xs font-black text-gray-100 transition hover:-translate-y-0.5 hover:bg-gray-700">Order Now</a>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

function Spec({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) { return <div><dt className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-600"><Icon className="h-3 w-3 text-gray-3000" />{label}</dt><dd className="mt-1 text-xs font-bold text-gray-200">{value}</dd></div> }
function Feature({ text }: { text: string }) { return <li className="flex items-center gap-2"><Check className="h-3 w-3 text-gray-300" />{text}</li> }
