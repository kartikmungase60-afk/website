"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

const stats = [
  { value: "4", label: "Global regions" },
  { value: "5", label: "Hosting categories" },
  { value: "99.9%", label: "Uptime target" },
  { value: "24/7", label: "Service monitoring" },
]

export default function WhyHostlixo() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Immersive Background Glows */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="absolute left-1/4 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px]" />
      <div className="absolute right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-600/10 blur-[150px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_.9fr]">
        <div className="animate-plan-rise z-10 relative">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-red-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">Why Hostlixo stands out</p>
          </div>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[1.1] text-white sm:text-5xl lg:text-6xl drop-shadow-2xl">
            Cloud hosting designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">control</span>, speed and growth
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400">
            Hostlixo brings game servers, VPS, dedicated compute, web hosting and bot hosting into one clear platform. Compare assigned resources, pay in INR and manage active services without moving between providers.
          </p>
          
          <div className="mt-8 grid gap-3 sm:grid-cols-2 relative z-10">
            {["Ryzen CPU profiles", "NVMe-backed plans", "Automated setup", "Four global locations", "DDoS-filtered connectivity", "24/7 service monitoring", "Software and mod management", "One customer dashboard"].map((item, index) => (
              <div 
                key={item} 
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="group relative flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#0a0a0c] p-3.5 shadow-lg transition-all hover:border-white/20 hover:bg-[#121216] hover:shadow-[0_0_30px_rgba(16,185,129,0.08)] hover:-translate-y-[2px] overflow-hidden"
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                
                {/* Icon Container with glowing ring */}
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/60 shadow-inner group-hover:bg-black/80 transition-colors duration-500">
                  <div className="absolute inset-0 rounded-full border border-emerald-500/30 opacity-50 group-hover:opacity-100 group-hover:border-emerald-400/60 group-hover:scale-110 transition-all duration-500" />
                  <div className="absolute inset-[6px] rounded-full border border-white/5 bg-white/5" />
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={2.5} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="relative z-10 h-4 w-4 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:text-emerald-400 transition-colors duration-500"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-10">
            <Link href="/games" className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-black transition hover:scale-105 transform-gpu hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Explore hosting plans 
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          </div>
          
          <dl className="mt-12 grid max-w-xl grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className={index ? "sm:border-l sm:border-white/10 sm:pl-8" : ""}>
                <dt className="text-3xl font-black text-white sm:text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{stat.value}</dt>
                <dd className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 leading-tight">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        
        {/* Floating Imagery with Glow */}
        <div className="relative mx-auto h-[400px] w-full max-w-[600px] lg:h-[500px] z-10">
          <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 blur-[80px] animate-pulse" style={{ animationDuration: '4s' }} />
          <Image src="/assets/homepage/hosting-community-characters.png" alt="Minecraft characters representing Hostlixo game server hosting" fill sizes="(max-width: 1024px) 90vw, 600px" className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,.6)] animate-float" />
        </div>
      </div>

      {/* Add inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </section>
  )
}
