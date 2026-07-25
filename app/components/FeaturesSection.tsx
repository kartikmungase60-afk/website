"use client"


import {
  Cpu,
  Gauge,
  Globe2,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react"
import type { ReactNode } from "react"

const AutomatedProvisioningVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid Background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_20%,transparent_80%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700 transform-gpu" />
    
    {/* Ambient Glow */}
    <div 
      className="absolute top-1/2 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] transform-gpu animate-pulse"
    />

    {/* Cascading Provisioning Nodes */}
    <div className="absolute right-8 top-12 w-64 opacity-60 group-hover:opacity-100 transition-all duration-700 transform-gpu">
      
      {/* Node 1 */}
      <div className="absolute top-0 right-0 w-full rounded-xl border border-white/5 bg-[#101014] p-4 shadow-xl transform translate-x-6 translate-y-6 -rotate-2 group-hover:translate-x-12 group-hover:-rotate-3 group-hover:translate-y-8 transition-all duration-700">
        <div className="flex items-center justify-between mb-3">
           <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Node 01</div>
           <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <div className="space-y-2">
           <div className="h-1.5 bg-white/10 rounded-full w-full" />
           <div className="h-1.5 bg-white/10 rounded-full w-4/5" />
        </div>
      </div>

      {/* Node 2 */}
      <div className="absolute top-12 right-0 w-full rounded-xl border border-white/10 bg-[#15151a]/95 p-4 shadow-2xl transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-700 z-10">
        <div className="flex gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="h-1.5 bg-red-400/40 rounded-full w-3/4 animate-pulse" />
            <span className="text-[9px] text-red-400/80 font-mono tracking-widest uppercase">Deploying</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full w-full" />
          <div className="h-1.5 bg-white/10 rounded-full w-3/4" />
        </div>
      </div>
    </div>

    {/* Floating Data Packets */}
    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-red-400 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] transform-gpu animate-bounce" />
    <div className="absolute top-1/3 left-1/3 w-1.5 h-1.5 bg-red-300 rounded-full shadow-[0_0_10px_rgba(252,165,165,1)] transform-gpu animate-bounce" style={{ animationDelay: '0.5s' }} />
  </div>
);

const DdosVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -bottom-12 -right-12 w-48 h-48 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute inset-0 border-2 border-red-500/20 rounded-full animate-pulse" />
      <div className="absolute inset-4 border border-red-400/30 rounded-full animate-pulse" style={{ animationDelay: '500ms' }} />
      <div className="absolute inset-8 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1000ms' }} />
      <ShieldCheck className="w-16 h-16 text-red-500/10 transform rotate-12" />
    </div>
  </div>
);

const UptimeVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 group-hover:opacity-100 transition-opacity duration-700 flex items-end">
      <svg className="w-full h-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(239,68,68,0.2)" />
            <stop offset="100%" stopColor="rgba(239,68,68,0)" />
          </linearGradient>
        </defs>
        <path 
          d="M0 100 L0 60 L10 50 L20 70 L30 40 L40 60 L50 30 L60 50 L70 20 L80 40 L90 30 L100 10 L100 100 Z" 
          fill="url(#sparkline-grad)" 
        />
        <path 
          d="M0 60 L10 50 L20 70 L30 40 L40 60 L50 30 L60 50 L70 20 L80 40 L90 30 L100 10" 
          fill="none" 
          stroke="rgba(239,68,68,0.5)" 
          strokeWidth="1.5"
        />
      </svg>
    </div>
  </div>
);

const SupportVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute top-10 right-10 w-16 h-16 bg-[#15151a] rounded-2xl border border-white/10 flex flex-col items-start justify-center p-3 shadow-lg transform-gpu">
      <div className="w-2.5 h-2.5 rounded-full bg-red-400/60 absolute -top-1 -right-1 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
      <div className="w-8 h-1.5 rounded-full bg-white/20 mb-2" />
      <div className="w-5 h-1.5 rounded-full bg-white/10" />
    </div>
    <div className="absolute bottom-10 right-24 w-12 h-12 bg-[#15151a] rounded-full border border-white/10 shadow-lg transform-gpu animate-bounce" />
  </div>
);

const RyzenVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-end pr-12">
    <div className="relative w-48 h-48 grid grid-cols-4 grid-rows-4 gap-1.5 transform rotate-12 scale-110">
      {[...Array(16)].map((_, i) => (
        <div 
          key={i} 
          className="bg-red-500/20 border border-white/[0.04] rounded-md transform-gpu"
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-black/90 border border-red-500/40 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)] transform-gpu">
          <Cpu className="w-10 h-10 text-red-400/90 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  </div>
);

const NetworkVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-700">
    <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-[radial-gradient(circle_at_80%_50%,rgba(239,68,68,0.08),transparent_70%)]" />
    <svg className="absolute right-0 inset-y-0 w-full h-full opacity-70" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid slice">
      <circle cx="160" cy="50" r="4" fill="rgba(239,68,68,0.9)" className="animate-pulse" />
      <circle cx="160" cy="50" r="18" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="1" />
      
      {/* Connections */}
      <path d="M160 50 Q120 20 80 35" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="80" cy="35" r="2.5" fill="rgba(255,255,255,0.4)" />
      
      <path d="M160 50 Q130 90 90 75" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="90" cy="75" r="2.5" fill="rgba(255,255,255,0.4)" />
      
      <path d="M160 50 Q190 20 195 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="195" cy="40" r="2.5" fill="rgba(255,255,255,0.4)" />
    </svg>
  </div>
);

type Feature = {
  icon: any
  title: string
  description: string
  iconStyle: string
  visual: ReactNode
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "Automated Provisioning",
    description: "Eligible services are created after payment verification and become manageable from the Hostlixo dashboard.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <AutomatedProvisioningVisual />,
  },
  {
    icon: ShieldCheck,
    title: "DDoS Protection",
    description: "Network filtering helps absorb malicious traffic before it reaches your game server, VPS, bot or website.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <DdosVisual />,
  },
  {
    icon: Gauge,
    title: "99.9% Uptime Target",
    description: "Infrastructure monitoring and stable routing support a 99.9% service uptime target.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <UptimeVisual />,
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get account and technical assistance through the cloud dashboard, support tickets and community channels.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <SupportVisual />,
  },
  {
    icon: Cpu,
    title: "Ryzen Compute",
    description: "Selected plans use AMD Ryzen processors and NVMe storage; exact resources are listed before checkout.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <RyzenVisual />,
  },
  {
    icon: Globe2,
    title: "Mumbai-First Network",
    description: "Primary infrastructure in Mumbai serves Indian users, with additional regions for customers in Southeast Asia, Europe and North America.",
    iconStyle: "border-white/30 bg-white/10 text-gray-300",
    visual: <NetworkVisual />,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#030303] px-4 py-24 sm:px-6 lg:px-8">
      {/* Background Orbs & Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/noise.svg')] pointer-events-none transform-gpu" />
      <div className="absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[120px] pointer-events-none transform-gpu" />
      <div className="absolute right-0 top-0 -z-10 h-[400px] w-[400px] translate-x-1/3 -translate-y-1/3 rounded-full bg-red-500/10 blur-[120px] pointer-events-none transform-gpu" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div
          data-aos="fade-up"
          className="mb-16 flex flex-col items-center text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4 w-full max-w-3xl">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h2 className="orbitron-font text-sm font-black uppercase tracking-[0.3em] text-red-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              Infrastructure
            </h2>
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-xl">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-400">Scale</span>
          </h3>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-400">
            Practical infrastructure and management tools designed to keep your game servers, apps, and websites fast, secure, and online.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            // Define span logic for Bento Box
            let spanClass = "col-span-1 md:col-span-1 lg:col-span-1";
            if (index === 0) spanClass = "col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2"; // Large feature 1
            if (index === 5) spanClass = "col-span-1 md:col-span-2 lg:col-span-2"; // Wide feature bottom
            if (index === 2) spanClass = "col-span-1 md:col-span-2 lg:col-span-2"; // Wide feature middle
            if (index === 4) spanClass = "col-span-1 md:col-span-1 lg:col-span-2"; // Wide feature middle

            return (
              <article
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0c] p-7 shadow-2xl transform-gpu transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:bg-[#101014] hover:border-white/20 hover:shadow-[0_0_40px_rgba(239,68,68,0.1)] ${spanClass} flex flex-col justify-between`}
              >
                {/* Visual Background Component */}
                {feature.visual}

                {/* Always-visible premium static grid and gradient */}
                <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_80%_20%,#000_10%,transparent_100%)] pointer-events-none transform-gpu" />
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-red-500/10 via-transparent to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none transform-gpu" />

                {/* Subtle gradient hover effect inside card */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent pointer-events-none transform-gpu" />

                <div className="relative z-10 flex flex-col h-full pointer-events-none">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/60 shadow-inner group-hover:scale-110 group-hover:bg-white/10 transition duration-500 ${feature.iconStyle}`}>
                    <Icon className="h-6 w-6 text-white group-hover:text-red-400 transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  
                  <div className="mt-auto">
                    <h3 className="text-xl font-black text-white tracking-wide mb-3 group-hover:text-red-50 transition-colors duration-500 drop-shadow-md">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-200 transition-colors duration-500 line-clamp-3 md:line-clamp-none max-w-sm drop-shadow-sm">{feature.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  )
}
