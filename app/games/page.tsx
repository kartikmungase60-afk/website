"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Gamepad2, HardDrive, Shield, Zap } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import FeaturesSection from "../components/FeaturesSection"
import FAQSection from "../components/FAQSection"
import { useCurrency } from "../components/ui/InrPricing"

const games = [
  {
    id: "minecraft",
    name: "Minecraft Java",
    category: "PC",
    banner: "/assets/games/minecraft/minecraft-server-hero.webp",
    icon: "/assets/games/minecraft/minecraft-icon.webp",
    price: 60,
    desc: "AMD Ryzen Minecraft hosting for SMP, Lifesteal, survival, modded and public community servers.",
    tags: ["DDoS", "Auto setup", "NVMe"],
  },
  {
    id: "hytale",
    name: "Hytale",
    category: "PC",
    banner: "/assets/games/hytale/hytale-server-hero.jpg",
    icon: "/assets/games/hytale/hytale-icon.webp",
    price: 45,
    desc: "Hytale server hosting with NVMe storage, protected connectivity and dashboard management across global regions.",
    tags: ["DDoS", "Auto setup", "NVMe"],
  },
  {
    id: "palworld",
    name: "Palworld",
    category: "PC",
    banner: "/assets/games/palworld/palworld-server-hero.jpg",
    icon: "/assets/games/palworld/palworld-icon.png",
    price: 45,
    desc: "Run a private Palworld world with configurable resources, file access and automated service provisioning.",
    tags: ["DDoS", "Auto setup", "NVMe"],
  },
]

export default function GamesPage() {
  const { convertPrice } = useCurrency()

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      <main className="px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-12 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-200">
              <Gamepad2 className="h-4 w-4" />
              Game Server Hosting
            </div>
            <h1 className="orbitron-font mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Game Server Hosting<br />
              <span className="text-gray-300">across four global regions</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-gray-400 sm:text-lg">
              Deploy Minecraft, Hytale or Palworld servers with Hostlixo Cloud. Every plan includes dashboard access, protected connectivity, NVMe storage and transparent INR pricing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game, index) => (
              <Link key={game.id} href={`/games/${game.id}`}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d12] transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_22px_55px_rgba(0,0,0,0.35)]">
                  <div className="relative h-[190px] overflow-hidden">
                    <Image src={game.banner} alt={game.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-black/45 to-transparent" />
                    <div className="absolute left-3 top-3 rounded bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-black">
                      {game.category}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <Image src={game.icon} alt={game.name} width={32} height={32} className="rounded-lg" />
                      <div>
                        <div className="text-sm font-bold text-white">{game.name}</div>
                        <div className="text-[10px] text-gray-300">Starting {convertPrice(game.price, "INR")}/mo</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-2 mb-4 text-xs leading-relaxed text-gray-400">{game.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <div key={tag} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-gray-400">
                          {tag === "DDoS" && <Shield className="h-2.5 w-2.5 text-gray-300" />}
                          {tag === "Auto setup" && <Zap className="h-2.5 w-2.5 text-gray-300" />}
                          {tag === "NVMe" && <HardDrive className="h-2.5 w-2.5 text-gray-300" />}
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
