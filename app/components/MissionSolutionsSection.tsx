"use client"

import Image from "next/image"
import Link from "next/link"
import { Bot, Globe2, Headphones, MonitorCog, Server, ShieldCheck, Target, Zap } from "lucide-react"
import { FaDiscord } from "react-icons/fa6"
import { useRef } from "react"

const missionPoints = [
  {
    icon: Zap,
    title: "Performance first",
    text: "Modern compute, NVMe storage and regional routing selected for consistent hosting performance.",
  },
  {
    icon: Headphones,
    title: "Support that responds",
    text: "Clear documentation, account tickets and community support when you need practical help.",
  },
  {
    icon: ShieldCheck,
    title: "Infrastructure you control",
    text: "Transparent resources, protected connectivity and straightforward management from one dashboard.",
  },
]

const solutions = [
  { title: "Game Servers", text: "Minecraft, Hytale, Palworld and more.", href: "/games", image: "/assets/homepage/solutions/game-server-hosting.webp", icon: Target },
  { title: "Cloud VPS", text: "Root access and dedicated resources.", href: "/vps", image: "/assets/homepage/solutions/vps-hosting.webp", icon: Server },
  { title: "Dedicated Servers", text: "High-capacity compute for demanding workloads.", href: "/dedicated", image: "/assets/homepage/solutions/dedicated-server-hosting.webp", icon: Zap },
  { title: "Web Hosting", text: "SSL-ready hosting for websites and stores.", href: "/webhosting", image: "/assets/homepage/solutions/web-hosting.webp", icon: Globe2 },
  { title: "Bot Hosting", text: "Always-on runtimes for Discord bots.", href: "/discord", image: "/assets/homepage/solutions/discord-bot-hosting.webp", icon: Bot },
]

export default function MissionSolutionsSection() {
  const carousel = useRef<HTMLDivElement>(null)

  const moveCarousel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!carousel.current) return
    event.preventDefault()
    carousel.current.scrollBy({ left: event.deltaY || event.deltaX, behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden border-b border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.02),transparent_60%)] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl z-10">
        <header className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/20" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 drop-shadow-md">Our Mission</p>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="mt-2 text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xl">
            Hosting built around <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-600">clarity and control</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-400">
            Hostlixo Cloud helps teams launch and manage online services without confusing plans, hidden resource limits or unnecessary complexity.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {missionPoints.map((point) => (
            <article key={point.title} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0e] p-8 shadow-2xl transform-gpu transition duration-500 hover:-translate-y-2 hover:bg-[#111115] hover:border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:bg-white/10 transition-colors">
                  <point.icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">{point.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">{point.text}</p>
              </div>
            </article>
          ))}
        </div>

        <dl 
          data-aos="fade-up"
          className="mt-8 grid grid-cols-2 overflow-hidden rounded-[2rem] border border-white/10 bg-[#050506] md:grid-cols-4 shadow-2xl transform-gpu"
        >
          {[
            { value: "4", label: "Global regions", color: "from-blue-500/10 to-transparent", hoverColor: "group-hover:text-blue-400" },
            { value: "99.9%", label: "Uptime target", color: "from-emerald-500/10 to-transparent", hoverColor: "group-hover:text-emerald-400" },
            { value: "NVMe", label: "Fast storage", color: "from-purple-500/10 to-transparent", hoverColor: "group-hover:text-purple-400" },
            { value: "24/7", label: "Service monitoring", color: "from-red-500/10 to-transparent", hoverColor: "group-hover:text-red-400" }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className={`group relative p-10 text-center transition-all duration-500 hover:bg-[#0f0f13] ${index ? "border-t border-white/5 md:border-l md:border-t-0" : ""}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              
              <dt 
                className={`relative z-10 text-4xl sm:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105 ${stat.hoverColor}`}
              >
                {stat.value}
              </dt>
              <dd className="relative z-10 mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 group-hover:text-gray-300 transition-colors duration-500">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-32 text-center flex flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <MonitorCog className="h-4 w-4 drop-shadow-md" /> Beyond game hosting
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-xl">Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500">Hosting Solution</span></h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400">One provider for game communities, applications, websites and production workloads.</p>
        </div>

        <div ref={carousel} onWheel={moveCarousel} className="solution-carousel mt-16 overflow-x-auto overscroll-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 -mx-4 sm:px-0 sm:mx-0" aria-label="Hostlixo hosting solutions">
          <div className="solution-track flex w-max gap-6 py-4">
          {[...solutions, ...solutions].map((solution, index) => {
            const duplicate = index >= solutions.length
            return (
            <Link key={`${solution.title}-${index}`} href={solution.href} aria-hidden={duplicate || undefined} tabIndex={duplicate ? -1 : undefined} 
              className="group w-[280px] flex-none overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0e] transform-gpu shadow-xl transition duration-300 hover:scale-[1.02] hover:border-white/30 hover:bg-[#111115]">
              <div className="relative h-36 border-b border-white/5 overflow-hidden">
                <Image src={solution.image} alt={`${solution.title} from Hostlixo Cloud`} fill sizes="(max-width: 1024px) 50vw, 280px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6 text-left relative">
                <div className="absolute -top-6 right-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#151515] shadow-lg transform-gpu group-hover:border-white/30 group-hover:bg-white/10 transition-colors">
                  <solution.icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </div>
                <h3 className="mt-2 text-base font-black text-white tracking-wide">{solution.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-400 line-clamp-2">{solution.text}</p>
              </div>
            </Link>
          )})}
          </div>
        </div>

        <div className="mt-16 relative overflow-hidden rounded-3xl border border-[#5865f2]/30 bg-gradient-to-r from-[#5865f2]/40 to-[#101015] p-8 sm:p-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl transform-gpu">
          <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.05] mix-blend-screen pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white drop-shadow-md">Join the Hostlixo Discord</h3>
            <p className="mt-2 text-sm leading-relaxed text-red-100/70 max-w-md">Get community help, service updates, product announcements and chat with our team.</p>
          </div>
          <a href="https://discord.gg/97CrJNkJ2T" target="_blank" rel="noopener noreferrer" 
            className="group relative z-10 inline-flex flex-shrink-0 items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-black uppercase tracking-wider text-[#414bb7] transition hover:bg-gray-200 hover:scale-105 transform-gpu shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <FaDiscord className="h-5 w-5 group-hover:scale-110 transition-transform" /> Join our Discord
          </a>
        </div>
      </div>
    </section>
  )
}
