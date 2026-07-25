"use client"

import Image from "next/image"
import { Archive, Boxes, Check, Cpu, Database, HardDrive, MemoryStick, Server, Sparkles } from "lucide-react"
import React, { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import RegionalLatencyCard, { hostingRegions } from "../RegionalLatencyCard"
import { useCurrency } from "../ui/InrPricing"
import SupportedSoftwareMarquee from "./SupportedSoftwareMarquee"
import AnimatedOrderButton from "../AnimatedOrderButton"


type GameId = "minecraft" | "hytale" | "palworld"
type GamePlanSpec = {
  name?: string
  ram: string
  cpu: string
  storage: string
  allocations: number
  databases: number
  backups: number
  price: number
  outOfStock?: boolean
  orderLink?: string
}

const gameDetails: Record<GameId, { name: string; image: string; video?: string; icon: string; imageAlt: string; accent: string; button: string }> = {
  minecraft: { name: "Minecraft", image: "/assets/games/minecraft/minecraft-server-hero.webp", video: "/assets/videos/minecraft720.mp4", icon: "/assets/games/minecraft/minecraft-icon.webp", imageAlt: "Minecraft landscape", accent: "text-gray-300", button: "bg-white text-black hover:bg-gray-200" },
  hytale: { name: "Hytale", image: "/assets/games/hytale/hytale-server-hero.jpg", video: "/assets/videos/hytalevideo.mp4", icon: "/assets/games/hytale/hytale-icon.webp", imageAlt: "Hytale landscape", accent: "text-gray-300", button: "bg-gray-800 text-white hover:bg-gray-800" },
  palworld: { name: "Palworld", image: "/assets/games/palworld/palworld-server-hero.jpg", icon: "/assets/games/palworld/palworld-icon.png", imageAlt: "Palworld landscape", accent: "text-gray-300", button: "bg-gray-800 text-white hover:bg-gray-800" },
}

export default function GameHostingLanding({ game, dbData }: { game: GameId; dbData: any }) {
  const [tier, setTier] = useState<"Budget" | "Deluxe">("Budget")
  const [selectedRegion, setSelectedRegion] = useState("india")
  const { convertPrice } = useCurrency()
  const details = gameDetails[game]
  
  const gameData = dbData.planTypes.find((g: any) => g.slug === game)
  const tierKey = game === "minecraft" ? "budget" : tier.toLowerCase() === "deluxe" ? "premium" : "budget"
  const selectedCategory = dbData.categories.find((c: any) => c.planTypeId === gameData?._id && c.slug === tierKey)
  const allCategoryPlans = selectedCategory ? (dbData.plans.filter((p: any) => p.categoryId === selectedCategory._id) as GamePlanSpec[]) : []
  const currentDbLocation = dbData.locations?.find((loc: any) => loc.slug === selectedRegion || (selectedRegion === 'india' && loc.slug === 'mumbai') || (selectedRegion === 'usa' && loc.slug === 'california') || (selectedRegion === 'germany' && loc.slug === 'frankfurt'))
  const plans = currentDbLocation ? allCategoryPlans.filter((p: any) => !p.locations || p.locations.length === 0 || p.locations.some((l: any) => (l._id || l) === currentDbLocation._id)) : allCategoryPlans

  const showTierSwitch = game !== "minecraft"
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${details.name} Server Hosting by Hostlixo Cloud`,
    description: `${details.name} server hosting with plan-based resources, NVMe storage and dashboard management.`,
    brand: { "@type": "Brand", name: "Hostlixo Cloud" },
    image: `https://hostlixo.com${details.image}`,
    offers: {
      "@type": "AggregateOffer",
      url: `https://hostlixo.com/games/${game}`,
      priceCurrency: "INR",
      lowPrice: String(Math.min(...plans.map((plan) => plan.price))),
      highPrice: String(Math.max(...plans.map((plan) => plan.price))),
      offerCount: plans.length,
      availability: "https://schema.org/InStock",
    },
  }
  const isOut = false; // Game-wide out of stock was removed to allow db values

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <main className="min-h-screen bg-[#07070a] pb-20 pt-20 text-white">
        <HeroParallax details={details} />

        {game === "minecraft" && <SupportedSoftwareMarquee />}



        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
          <header className="text-center">
            <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gray-600">
              {game === "minecraft" ? "HostLixo • AMD EPYC™ 7763 Minecraft Hosting Plans" : "Plans for communities of every size"}
            </p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              {game === "minecraft" ? "High-Performance Minecraft Hosting" : <>Choose the perfect plan<br />for your community</>}
            </h1>
            {game === "minecraft" && (
              <p className="mt-3 text-sm text-gray-400 font-medium">
                powered by <strong className="text-gray-200">AMD EPYC™ 7763</strong> with ultra-fast <strong className="text-gray-200">NVMe SSD Storage</strong>.
              </p>
            )}
            {showTierSwitch && (
              <div className="mt-5 inline-flex rounded-lg border border-white/10 bg-[#111116] p-1">
                {(["Budget", "Deluxe"] as const).map((name) => (
                  <button key={name} type="button" onClick={() => setTier(name)} className={`flex items-center gap-2 rounded-md px-5 py-2 text-xs font-bold transition ${tier === name ? "bg-gray-800 text-white shadow-lg shadow-black/25" : "text-gray-500 hover:text-white"}`}>
                    <Server className="h-3.5 w-3.5" />
                    {name}
                  </button>
                ))}
              </div>
            )}
          </header>

          <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Choose a hosting region">
            {hostingRegions.map((region) => {
              // Map region id to db slug, specifically handling india -> mumbai and usa -> california etc if they use city names
              const dbLocation = dbData.locations?.find((loc: any) => loc.slug === region.id || loc.slug === region.city.toLowerCase() || (region.id === 'india' && loc.slug === 'mumbai') || (region.id === 'usa' && loc.slug === 'california'));
              const hasPlans = dbLocation ? allCategoryPlans.some((p: any) => !p.locations || p.locations.length === 0 || p.locations.some((l: any) => (l._id || l) === dbLocation._id)) : false;
              const isOutOfStock = Boolean(dbLocation?.outOfStock) || !hasPlans;
              return (
                <RegionalLatencyCard 
                  key={region.id} 
                  region={region} 
                  selected={selectedRegion === region.id} 
                  onSelect={isOutOfStock ? undefined : () => setSelectedRegion(region.id)} 
                  outOfStock={isOutOfStock} 
                />
              );
            })}
          </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {plans.map((plan, index) => {
                  const isPopular = plan.name?.toLowerCase().includes("elite") || (game === "minecraft" && index === 1);
                  return (
                    <article 
                      key={`${game}-${tier}-${plan.ram}`} 
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                        isPopular 
                          ? 'border-red-500/40 bg-gradient-to-b from-[#16141d] via-[#101016] to-[#101014] shadow-[0_0_25px_rgba(239,68,68,0.15)]' 
                          : 'border-white/[0.09] bg-[#101014] hover:border-white/35 shadow-lg'
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl shadow-md border-b border-l border-red-400/30 flex items-center gap-1 z-20 uppercase">
                          <Sparkles className="w-3 h-3 text-yellow-300" /> Most Popular
                        </div>
                      )}
                      
                      {Boolean(isOut || plan.outOfStock || (plan as any).OUTOFSTOCK || (plan as any).outofstock) && (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-black/80">
                          <div className="relative w-72 h-56 pointer-events-none drop-shadow-2xl -mt-1">
                            <Image src="/assets/out-of-stock.png" alt="Out of stock" fill sizes="300px" className="object-contain object-top drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" />
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between gap-3 min-h-[44px]">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500">{details.name} - {hostingRegions.find((region) => region.id === selectedRegion)?.name}</p>
                            <h2 className="mt-0.5 text-base font-black text-white">{plan.name ? plan.name : `${plan.ram} ${game === "minecraft" ? "Minecraft" : tier}`}</h2>
                          </div>
                          <div className="relative h-9 w-9 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] flex-shrink-0">
                            <Image src={details.icon} alt="" fill sizes="36px" className="object-cover" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div className="flex items-end gap-1">
                            <span className={"text-2xl font-black " + (isPopular ? "text-red-400" : details.accent)}>{convertPrice(plan.price, "INR")}</span>
                            <span className="pb-0.5 text-[10px] text-gray-500">/month</span>
                          </div>
                        </div>
                        <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3 border-y border-white/[0.07] py-4">
                          <Spec icon={MemoryStick} label="RAM" value={plan.ram || "0GB"} />
                          <Spec icon={Cpu} label="CPU" value={plan.cpu || "Unmetered"} />
                          <Spec icon={HardDrive} label="NVMe SSD" value={plan.storage || "0GB"} />
                          <Spec icon={Boxes} label="Allocations" value={plan.allocations !== undefined ? String(plan.allocations) : "N/A"} />
                          <Spec icon={Database} label="Databases" value={plan.databases !== undefined ? String(plan.databases) : "N/A"} />
                          <Spec icon={Archive} label="Backups" value={plan.backups !== undefined ? String(plan.backups) : "N/A"} />
                        </dl>
                        <ul className="mt-4 space-y-2 text-[11px] text-gray-400">
                          {game === "minecraft" ? (
                            <>
                              <Feature text="AMD EPYC™ 7763 CPU" />
                              <Feature text="Enterprise NVMe SSD" />
                              <Feature text="DDoS Protection" />
                              <Feature text="Full FTP & File Manager" />
                              <Feature text="Instant Reinstall & Startup" />
                              <Feature text="Pterodactyl Panel" />
                              <Feature text="24/7 Support" />
                            </>
                          ) : (
                            <>
                              <Feature text={tier === "Deluxe" ? "Priority compute profile" : "Hostlixo game panel"} />
                              <Feature text="Automated deployment" />
                              <Feature text="DDoS-filtered network" />
                            </>
                          )}
                        </ul>
                      </div>

                      <div className="mt-6">
                        {Boolean(isOut || plan.outOfStock || (plan as any).OUTOFSTOCK || (plan as any).outofstock) ? (
                          <div className={`relative flex w-full overflow-hidden items-center justify-center rounded-lg py-2.5 text-xs font-black transition-colors pointer-events-none bg-[#1a1a20] border border-gray-700/50 text-gray-500`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse mr-2" />
                            <span className="relative z-10">Out of Stock</span>
                          </div>
                        ) : (
                          <AnimatedOrderButton link={plan.orderLink || "https://billing.hostlixo.com"} />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
          </section>
      </main>
    </>
  )
}

function Spec({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: string }) {
  return <div><dt className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-gray-600"><Icon className="h-3 w-3" />{label}</dt><dd className="mt-1 text-xs font-bold text-gray-200">{value}</dd></div>
}

function Feature({ text }: { text: string }) {
  return <li className="flex items-center gap-2"><Check className="h-3 w-3 text-gray-300" />{text}</li>
}

function HeroParallax({ details }: { details: { name: string; image: string; video?: string; imageAlt: string; accent: string } }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 100, damping: 30 })
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  
  const backgroundX = useTransform(springX, [-0.5, 0.5], ["-5%", "5%"])
  const backgroundY = useTransform(springY, [-0.5, 0.5], ["-5%", "5%"])
  const textX = useTransform(springX, [-0.5, 0.5], ["2%", "-2%"])
  const textY = useTransform(springY, [-0.5, 0.5], ["2%", "-2%"])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <section 
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate flex min-h-[450px] items-center justify-center overflow-hidden border-b border-white/[0.07] px-4 text-center"
    >
      <motion.div 
        style={{ x: backgroundX, y: backgroundY }}
        className="absolute inset-0 -z-20 w-[110%] h-[110%] -left-[5%] -top-[5%]"
      >
        {details.video ? (
          <video src={details.video} autoPlay loop muted playsInline className="object-cover object-center w-full h-full" />
        ) : (
          <Image src={details.image} alt={details.imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
        )}
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#07070a]/30 via-[#07070a]/50 to-[#07070a]" />
      
      <motion.div style={{ x: textX, y: textY }} className="pb-16">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl drop-shadow-2xl">
          Let&apos;s play <span className={details.accent}>{details.name}</span>
        </h1>
        <p className="mt-3 text-sm text-gray-300 drop-shadow-md">Multiplayer worlds hosted on dependable Hostlixo Cloud infrastructure.</p>
      </motion.div>
    </section>
  )
}

