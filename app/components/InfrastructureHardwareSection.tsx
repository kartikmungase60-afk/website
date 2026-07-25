"use client"

import { useRef, useState, useEffect, useLayoutEffect } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Activity, Cpu, Database, Globe2, HardDrive, MemoryStick, Network, Server, ShieldCheck } from "lucide-react"

const hardware = [
  { icon: Cpu, label: "Game compute", value: "AMD Epyc 7763", detail: "Visible on eligible game plans" },
  { icon: Cpu, label: "Cloud compute", value: "Cloud AMD 7", detail: "VPS and dedicated profiles" },
  { icon: MemoryStick, label: "Memory", value: "DDR4 & DDR5", detail: "Allocation shown per plan" },
  { icon: HardDrive, label: "Storage", value: "SSD & NVMe", detail: "Capacity disclosed before order" },
]

const networkLayers = [
  {
    title: "Mumbai-first network",
    text: "Primary Mumbai location with Singapore, Frankfurt and USA options.",
    icon: Globe2
  },
  {
    title: "Traffic filtering",
    text: "DDoS-filtered connectivity on supported services.",
    icon: ShieldCheck
  },
  {
    title: "Redundant Routing",
    text: "Multiple premium transit providers ensuring maximum uptime and lowest latency.",
    icon: Network
  },
  {
    title: "10Gbps Uplinks",
    text: "High-speed enterprise-grade connectivity for all compute profiles.",
    icon: Activity
  }
]

export default function InfrastructureHardwareSection() {

  return (
    <section id="hardware" className="relative overflow-hidden border-b border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Premium Dark Gradients & Glows */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(156,163,175,.03),transparent_30%),radial-gradient(circle_at_85%_70%,rgba(59,130,246,.05),transparent_40%)] pointer-events-none" />
      <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl z-10">
        <header 
          data-aos="fade-up"
          className="mx-auto max-w-3xl text-center flex flex-col items-center"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-red-500" />
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">Inside Hostlixo Infrastructure</p>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-red-500" />
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-xl">
            Hardware details before the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-400 animate-pulse-slow">checkout screen</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 font-medium">
            Move from the platform overview into the technical details. Compare processor families, assigned memory, storage and regional availability before choosing a Hostlixo Cloud service.
          </p>
        </header>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          {/* Left Panel - Compute Profiles */}
          <div 
            data-aos="fade-right"
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A] shadow-2xl transition duration-500 hover:bg-[#050505] hover:border-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 flex flex-col h-full transform-gpu will-change-transform"
          >
            {/* Premium Glass Sheen */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none transform-gpu" />
            {/* Spotlights (Optimized for 90FPS) */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform-gpu will-change-opacity" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-[100%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] -translate-y-1/2 translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform-gpu will-change-opacity" />

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 relative z-10 bg-white/[0.01]">
              <div className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-white group-hover:text-red-50 transition-colors">
                <Server className="h-5 w-5 text-red-400 group-hover:animate-bounce" /> Compute Profiles
              </div>
              <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-red-300 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                Plan Verified
              </span>
            </div>
            
            <div 
              className="grid sm:grid-cols-2 relative z-10"
            >
              {hardware.map((item, index) => (
                <article 
                  key={item.label} 
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className={`relative p-6 transition duration-500 hover:bg-white/[0.02] cursor-pointer group/item
                    ${index % 2 ? "sm:border-l sm:border-white/5" : ""} 
                    ${index > 1 ? "border-t border-white/5" : index === 1 ? "border-t border-white/5 sm:border-t-0" : ""}`}
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/60 border border-white/5 shadow-inner group-hover/item:bg-red-500/20 group-hover/item:border-red-500/40 group-hover/item:scale-110 transition duration-300 group-hover/item:shadow-[0_0_20px_rgba(59,130,246,0.3)] transform-gpu">
                      <item.icon className="h-6 w-6 text-gray-400 group-hover/item:text-red-300 transition-colors" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 group-hover/item:text-gray-300 transition-colors">{item.label}</p>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-wide group-hover/item:text-transparent group-hover/item:bg-clip-text group-hover/item:bg-gradient-to-r group-hover/item:from-white group-hover/item:to-red-300 transition-colors">{item.value}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400 font-medium group-hover/item:text-gray-300">{item.detail}</p>
                </article>
              ))}
            </div>
            
            <div className="grid grid-cols-3 border-t border-white/5 bg-[#121212] text-center relative z-10 flex-grow">
              <Metric value="4" label="Regions" />
              <Metric value="99.9%" label="Uptime target" border />
              <Metric value="NVMe" label="Fast storage" border />
            </div>
          </div>

          {/* Right Panel - Network Path */}
          <div 
            data-aos="fade-left"
            data-aos-delay="200"
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl transition duration-500 hover:bg-[#050505] hover:border-white/10 hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:-translate-y-1 flex flex-col h-full transform-gpu will-change-transform"
          >
            {/* Premium Glass Sheen */}
            <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.04] via-transparent to-transparent pointer-events-none transform-gpu" />
            {/* Spotlights (Optimized for 90FPS) */}
            <div className="absolute inset-0 bg-gradient-to-bl from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform-gpu will-change-opacity" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-[100%] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_60%)] translate-y-1/2 -translate-x-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform-gpu will-change-opacity" />

            <div className="flex items-center gap-3 relative z-10 mb-8">
              <Database className="h-6 w-6 text-rose-400 group-hover:rotate-12 transition-transform duration-500" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest group-hover:text-rose-50 transition-colors">Hostlixo Network Path</h3>
            </div>
            
            <NetworkPathList layers={networkLayers} />
          </div>
        </div>

        {/* Bottom Disclosures */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Disclosure icon={Cpu} title="CPU allocation" text="Core or CPU percentage is listed on each eligible plan." />
          <Disclosure icon={HardDrive} title="Storage allocation" text="SSD or NVMe capacity is visible before purchase." />
          <Disclosure icon={ShieldCheck} title="Network scope" text="Protection and location descriptions avoid unsupported guarantees." />
        </div>
      </div>
    </section>
  )
}

function Metric({ value, label, border = false }: { value: string; label: string; border?: boolean }) { 
  return (
    <div 
      className={`px-4 py-6 cursor-default transition-colors duration-500 flex flex-col items-center justify-center h-full w-full hover:bg-white/[0.03] group/metric ${border ? "border-l border-white/5" : ""}`}
    >
      <div className="transition-transform duration-300 group-hover/metric:-translate-y-1 group-hover/metric:scale-105">
        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-md">{value}</p>
        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.25em] text-gray-500 transition-colors">{label}</p>
      </div>
    </div>
  ) 
}

function Disclosure({ icon: Icon, title, text }: { icon: typeof Cpu; title: string; text: string }) { 
  return (
    <article 
      data-aos="fade-up"
      className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#121212] p-5 cursor-pointer transition duration-300 hover:bg-[#1A1A1A] hover:border-white/15 hover:shadow-lg hover:-translate-y-[2px] hover:scale-[1.01] transform-gpu"
    >
      <Icon className="mt-0.5 h-5 w-5 flex-none text-gray-400 group-hover:text-red-400 group-hover:scale-110 group-hover:-rotate-6 transition duration-300 transform-gpu" />
      <div>
        <h3 className="text-sm font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-red-200 transition-colors">{title}</h3>
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-400 font-medium">{text}</p>
      </div>
    </article> 
  ) 
}

function NetworkPathList({ layers }: { layers: typeof networkLayers }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setSvgHeight(containerRef.current.offsetHeight);
      
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setSvgHeight((entry.target as HTMLElement).offsetHeight);
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end 80%"]
  });

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });
  
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <div ref={containerRef} className="relative z-10 pt-4 pb-4 flex-grow flex flex-col justify-between" style={{ paddingLeft: "50px" }}>
      {/* Aceternity Tracing Beam */}
      <div className="absolute top-0 bottom-0 pointer-events-none -z-10" style={{ left: "0px", width: "40px" }}>
        
        {/* Moving Dot at the top */}
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow: scrollYProgress.get() > 0 ? "none" : "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="absolute h-4 w-4 rounded-full border border-white/20 shadow-sm flex items-center justify-center bg-[#050505] z-30"
          style={{ 
            left: "24px", 
            top: "4px", 
            transform: "translateX(-50%)" 
          }}
        >
          <motion.div
            transition={{ duration: 0.2, delay: 0.5 }}
            animate={{
              backgroundColor: scrollYProgress.get() > 0 ? "white" : "#22d3ee",
              borderColor: scrollYProgress.get() > 0 ? "white" : "#0891b2",
            }}
            className="h-2 w-2 rounded-full border border-white/40 bg-cyan-400"
          />
        </motion.div>

        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.05"
            transition={{ duration: 10 }}
          />
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{ duration: 10 }}
          />
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#3b82f6" stopOpacity="0"></stop>
              <stop stopColor="#3b82f6"></stop>
              <stop offset="0.325" stopColor="#22d3ee"></stop>
              <stop offset="1" stopColor="#22d3ee" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex-grow flex flex-col gap-6">
        {layers.map((layer, index) => (
          <NetworkPathItem 
            key={layer.title} 
            layer={layer} 
            index={index} 
          />
        ))}
      </div>
    </div>
  )
}

function NetworkPathItem({ layer, index }: any) {
  return (
    <div 
      data-aos="fade-left"
      data-aos-delay={index * 100}
      data-aos-once="false"
      data-aos-mirror="true"
      className="group/layer relative flex gap-4 sm:gap-6 rounded-2xl bg-[#0F0F10] p-5 sm:p-6 cursor-pointer transition duration-500 border border-white/5 shadow-[0_0_40px_rgba(59,130,246,0.05)] hover:bg-[#151516] hover:border-white/10 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transform-gpu will-change-transform"
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 border border-cyan-400/50 transition-colors duration-500 overflow-hidden shadow-inner group-hover/layer:border-cyan-400/80 group-hover/layer:bg-blue-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover/layer:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <layer.icon className="relative z-10 h-6 w-6 text-blue-300 drop-shadow-md group-hover/layer:-rotate-6 transition-transform duration-500" strokeWidth={1.5} />
      </div>
      
      <div className="flex flex-col justify-center">
        <h4 className="text-base font-black text-white group-hover/layer:text-transparent group-hover/layer:bg-clip-text group-hover/layer:bg-gradient-to-r group-hover/layer:from-white group-hover/layer:to-blue-200 transition-colors">{layer.title}</h4>
        <p className="mt-1 text-[11px] leading-relaxed text-gray-400 font-medium group-hover/layer:text-gray-300">{layer.text}</p>
      </div>
    </div>
  )
}
