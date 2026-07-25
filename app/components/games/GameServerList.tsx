"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Server, Shield, Cpu, HardDrive, MemoryStick, Zap, Check, X } from "lucide-react"
import gamesConfig from "../../config/sections/games.json"
import type { GamesConfig, Game, GamePlan, GameLocation } from "../../types/games"
import { useCurrency } from "../ui/InrPricing"

const config = gamesConfig as GamesConfig

// Plan tier metadata — extend this as you add more plan types
const PLAN_META: Record<string, { label: string; badge?: string; badgeColor?: string }> = {
  budget:  { label: "Budget" },
  premium: { label: "Premium", badge: "Best Value", badgeColor: "bg-gray-800 text-white" },
}

// Features shown in every plan card
const PLAN_FEATURES = [
  { key: "pterodactyl", label: "Pterodactyl Panel", included: true },
  { key: "provision",   label: "Automated setup",  included: true },
  { key: "backups",     label: "2 Backups",         included: true },
  { key: "support",     label: "24/7 Support",      included: true },
  { key: "ddos",        label: "DDoS Shield",       included: true },
  { key: "domain",      label: "Custom Domain",     included: false },
]

export default function GameServerList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { convertPrice } = useCurrency()
  const [selectedGame, setSelectedGame]             = useState<string>(config.games[0]?.id || "")
  const [selectedLocation, setSelectedLocation]     = useState<string>(config.locations.find((location) => location.id === "usa")?.id || config.locations[0]?.id || "")
  const [selectedPlanType, setSelectedPlanType]     = useState<"budget" | "premium">("budget")

  useEffect(() => {
    const game     = searchParams.get("game")
    const location = searchParams.get("location")
    const plan     = searchParams.get("plan") as "budget" | "premium"
    if (game     && config.games.some((g: Game) => g.id === game))          setSelectedGame(game)
    if (location && config.locations.some((l) => l.id === location))        setSelectedLocation(location)
    if (plan     && ["budget", "premium"].includes(plan))                    setSelectedPlanType(plan)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set("game",     selectedGame)
    params.set("location", selectedLocation)
    params.set("plan",     selectedPlanType)
    const newUrl     = `/games/plans?${params.toString()}`
    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) router.replace(newUrl)
  }, [selectedGame, selectedLocation, selectedPlanType, router])

  const currentGame     = config.games.find((g: Game) => g.id === selectedGame)
  const currentLocation = config.locations.find((loc) => loc.id === selectedLocation)
  const availablePlanTypes = currentLocation?.availablePlanTypes || []

  const handlePlanTypeSelection = (planType: "budget" | "premium") => {
    setSelectedPlanType(planType)
    const currentLoc = config.locations.find((loc) => loc.id === selectedLocation)
    if (currentLoc && !currentLoc.availablePlanTypes.includes(planType)) {
      const compatible = config.locations.find((loc) => loc.availablePlanTypes.includes(planType))
      if (compatible) setSelectedLocation(compatible.id)
    }
  }

  const handleLocationSelection = (locationId: string) => {
    setSelectedLocation(locationId)
    const newLoc = config.locations.find((loc) => loc.id === locationId)
    if (newLoc && !newLoc.availablePlanTypes.includes(selectedPlanType)) {
      if (newLoc.availablePlanTypes.length > 0)
        setSelectedPlanType(newLoc.availablePlanTypes[0] as "budget" | "premium")
    }
  }

  if (!currentGame || !currentLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white/20" />
      </div>
    )
  }

  const plans: GamePlan[] = currentGame.plans[selectedPlanType] ?? []

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-transparent">

      {/* Purple ambient glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(156,163,175,.14) 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="relative z-10 mt-16 max-w-7xl mx-auto">

        {/* ── Page header ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-4">
                <Server className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300 text-sm">Game Servers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 orbitron-font">
                Choose your <span className="text-gray-300">Game Server</span>
              </h2>
              <p className="text-gray-400 text-sm max-w-2xl">
                Compare Hostlixo Cloud game plans by memory, storage and compute profile. Prices are displayed monthly in Indian rupees.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Game tabs ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Game</p>
          <div className="flex flex-wrap gap-2">
            {config.games.map((game: Game) => {
              const isSelected = selectedGame === game.id
              return (
                <button key={game.id} onClick={() => setSelectedGame(game.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition duration-200 border ${
                    isSelected
                      ? "bg-white/20 border-white/20 text-white shadow-[0_0_12px_rgba(156,163,175,.14)]"
                      : "bg-[#101014] border-gray-700/50 text-gray-400 hover:border-white/35 hover:text-white"
                  }`}>
                  <div className="relative w-5 h-5 rounded overflow-hidden flex-shrink-0">
                    <Image src={game.icon || "/assets/branding/image-placeholder.svg"} alt={game.name} fill sizes="20px" className="object-cover" />
                  </div>
                  {game.name}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ── Location tabs ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Location</p>
          <div className="flex flex-wrap gap-2">
            {config.locations.map((location: GameLocation) => {
              const isOutOfStock = Boolean(location.outOfStock)
              const hasAvailable = location.availablePlanTypes.length > 0 && !isOutOfStock
              const isSelected   = selectedLocation === location.id
              return (
                <button key={location.id} onClick={() => handleLocationSelection(location.id)} disabled={!hasAvailable}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-medium transition duration-200 border ${
                    isSelected
                      ? "bg-white/20 border-white/20 text-white shadow-[0_0_12px_rgba(156,163,175,.14)]"
                      : hasAvailable
                        ? "bg-[#101014] border-gray-700/50 text-gray-400 hover:border-white/35 hover:text-white"
                        : "bg-[#101014]/50 border-gray-800/30 text-gray-600 cursor-not-allowed opacity-40"
                  }`}>
                  <div className="relative w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={location.flag || "/assets/branding/image-placeholder.svg"} alt={location.name} fill sizes="20px" className="object-cover" />
                  </div>
                  {location.name}
                  {isOutOfStock && <span className="ml-1 text-[9px] uppercase tracking-wider text-rose-500 font-bold border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 rounded">Out</span>}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ══════════════════════════════════════════════
            MAIN PLAN BOX  (matches WammuHost layout)
        ══════════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-[#0a0a14] border border-gray-800/60 rounded-2xl overflow-hidden">

          {/* ── Tier tabs (Budget / Premium / …) ── */}
          <div className="flex items-center gap-1 px-5 pt-5 pb-0 flex-wrap">
            {config.planTypes.map((type) => {
              const isSelected  = selectedPlanType === type.id
              const isAvailable = availablePlanTypes.includes(type.id)
              const meta        = PLAN_META[type.id] ?? { label: type.name }
              return (
                <button key={type.id}
                  onClick={() => isAvailable && handlePlanTypeSelection(type.id as "budget" | "premium")}
                  disabled={!isAvailable}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-t-xl text-sm font-semibold transition duration-200 ${
                    isSelected
                      ? "bg-white text-black"
                      : isAvailable
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-700 cursor-not-allowed opacity-40"
                  }`}>
                  {meta.label}
                  {meta.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeColor ?? "bg-gray-700 text-gray-300"}`}>
                      {meta.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Info bar: processor + DDoS + quick badges ── */}
          <div className="mx-5 mt-1 mb-5 bg-[#111113] border border-gray-800/60 rounded-xl px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Processor</p>
                  <p className="text-white text-sm font-semibold">
                    {selectedPlanType === "premium" ? "Dedicated vCPU" : "Shared vCPU"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">DDoS</p>
                  <p className="text-white text-sm font-semibold">Basic DDoS Shield</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Control panel", "Automated setup", "Support tickets"].map((badge) => (
                <span key={badge}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-800 border border-gray-700/50 text-gray-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* ── Plan cards ── */}
          <div className="px-5 pb-5">
            {plans.length === 0 ? (
              <div className="py-16 text-center text-gray-500 text-sm">
                No plans available for this combination.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan: GamePlan, index: number) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    index={index}
                    convertPrice={convertPrice}
                    planTypeName={PLAN_META[selectedPlanType]?.label ?? selectedPlanType}
                  />
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  )
}

// ── Individual plan card ──────────────────────────────────────────────────────

function PlanCard({
  plan,
  index,
  convertPrice,
  planTypeName,
}: {
  plan: GamePlan
  index: number
  convertPrice: (p: string) => string
  planTypeName: string
}) {
  // Derive a short subtitle from the plan name
  const subtitle = plan.ram
    ? `Great for gaming — ${plan.ram} RAM`
    : plan.name
    
  const isOutOfStock = Boolean(plan.outOfStock || (plan as any).OUTOFSTOCK || (plan as any).outofstock);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative bg-[#111113] border border-gray-800/60 rounded-2xl overflow-hidden hover:border-white/35 hover:shadow-[0_0_24px_rgba(156,163,175,.14)] transition duration-300 flex flex-col ${isOutOfStock ? "pointer-events-none" : ""}`}
    >
      {isOutOfStock && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-black/80">
          <div className="relative w-64 h-56 pointer-events-none drop-shadow-2xl -mt-1">
            <Image src="/assets/out-of-stock.png" alt="Out of stock" fill sizes="300px" className="object-contain object-top drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      )}

      {/* Card header */}
      <div className="p-5 pb-4 border-b border-gray-800/60">
        <h3 className="text-white font-bold text-lg orbitron-font mb-0.5">
          {planTypeName} – {plan.name.replace(/^(Minecraft|Hytale|Palworld)\s*/i, "")}
        </h3>
        <p className="text-gray-500 text-xs">{subtitle}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-3xl font-extrabold text-white orbitron-font">
            {convertPrice(`$${plan.price}`)}
          </span>
          <span className="text-gray-500 text-sm">/mo</span>
        </div>
        <p className="text-gray-600 text-xs mt-0.5">Billed monthly · No contracts</p>
      </div>

      {/* Spec grid: RAM / CPU / Disk / Port */}
      <div className="grid grid-cols-2 gap-2 p-5 pb-4">
        {[
          { icon: MemoryStick, label: "RAM",  value: plan.ram     },
          { icon: Cpu,         label: "CPU",  value: plan.cpu     },
          { icon: HardDrive,   label: "DISK", value: plan.storage },
          { icon: Zap,         label: "PORT", value: "1 Gbps"     },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label}
            className="bg-[#0a0a14] border border-gray-800/50 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-800/60 flex items-center justify-center flex-shrink-0">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold leading-none mb-0.5">{label}</p>
              <p className="text-white text-sm font-semibold leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature checklist */}
      <div className="px-5 pb-5 flex-1 flex flex-col justify-between gap-4">
        <ul className="space-y-1.5">
          {PLAN_FEATURES.map((feat) => (
            <li key={feat.key} className="flex items-center gap-2.5">
              {feat.included ? (
                <span className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-gray-300" />
                </span>
              ) : (
                <span className="w-5 h-5 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center flex-shrink-0">
                  <X className="w-3 h-3 text-gray-600" />
                </span>
              )}
              <span className={`text-sm ${feat.included ? "text-gray-300" : "text-gray-600"}`}>
                {feat.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {isOutOfStock ? (
          <div className="w-full mt-2 bg-transparent border border-gray-600/50 text-gray-500 text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 opacity-60 pointer-events-none cursor-not-allowed">
            Out of Stock
          </div>
        ) : (
          <a
            href={plan.orderLink || "https://billing.hostlixo.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 bg-transparent border border-gray-600 hover:border-white/20 hover:bg-white/10 text-white text-sm font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 group"
          >
            Order Now
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  )
}
