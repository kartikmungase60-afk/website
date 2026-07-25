"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Plug, Package, Users, Settings, Server, Map, ChevronRight, ExternalLink, BarChart3 } from "lucide-react";

const features = [
  {
    id: "console",
    icon: Terminal,
    title: "Real-Time Console",
    desc: "Start, restart, stop and monitor server logs from one clean control surface.",
    label: "CONSOLE",
    image: "/assets/panel/console-red.png",
  },
  {
    id: "plugins",
    icon: Plug,
    title: "Plugin Installer",
    desc: "Search and install popular Minecraft plugins with filters, versions and quick actions.",
    label: "PLUGINS",
    image: "/assets/panel/plugins-red.png",
  },
  {
    id: "mods",
    icon: Package,
    title: "Mod Installer",
    desc: "Install Fabric, Forge and modded server additions without leaving the panel.",
    label: "MODS",
    image: "/assets/panel/mods-red.png",
  },
  {
    id: "players",
    icon: Users,
    title: "Player Manager",
    desc: "Review online players, bans, operators and whitelist actions from one page.",
    label: "PLAYERS",
    image: "/assets/panel/players-red.png",
  },
  {
    id: "configuration",
    icon: Settings,
    title: "Configuration",
    desc: "Update server properties with toggles, inputs and safer configuration controls.",
    label: "CONFIGURATION",
    image: "/assets/panel/configuration-red.png",
  },
  {
    id: "software",
    icon: Server,
    title: "Version Changer",
    desc: "Switch between Vanilla, Paper, Fabric, Forge, Purpur and other server builds.",
    label: "VERSIONS",
    image: "/assets/panel/versions-red.png",
  },
  {
    id: "worlds",
    icon: Map,
    title: "World Manager",
    desc: "Browse maps, import worlds and manage world files directly from the panel.",
    label: "WORLDS",
    image: "/assets/panel/worlds-red.png",
  },
];

export default function PanelShowcase() {
  const [active, setActive] = useState(0);
  const feature = features[active];

  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-[#030303] py-24 px-4 sm:px-6 lg:px-8 lg:py-32">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/noise.svg')] opacity-[0.02] mix-blend-screen pointer-events-none" />
      <div className="absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute left-0 bottom-0 -z-10 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/3 rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
          <div
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <BarChart3 className="w-4 h-4" /> Server Control Panel
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white orbitron-font leading-[1.1] mb-6 drop-shadow-xl">
              Control your game server<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">without leaving the browser</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Use the Hostlixo Cloud dashboard to monitor logs, install supported plugins and mods, manage players, edit properties, select server software and organize world files.
            </p>
          </div>

          {/* Right info */}
          <div className="flex-shrink-0 space-y-4 lg:w-80"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <a href="https://control.hostlixo.com" target="_blank" rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 bg-[#1a1a1f] border border-white/10 hover:border-white/30 hover:bg-[#25252a] rounded-2xl px-6 py-4 text-white text-sm font-black transition shadow-lg transform-gpu">
              Open Cloud Dashboard 
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </span>
            </a>
            <div className="grid grid-cols-3 gap-3">
              {[
                { big: "Live", small: "CONSOLE" },
                { big: "SFTP", small: "FILES" },
                { big: "Power", small: "CONTROLS" },
              ].map((s) => (
                <div key={s.small} className="bg-[#111115] border border-white/5 rounded-2xl px-4 py-4 text-center transition-colors hover:bg-[#1a1a1f]">
                  <div className="text-white font-black text-base">{s.big}</div>
                  <div className="text-gray-500 text-[9px] font-bold tracking-[0.2em] mt-1">{s.small}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">

          {/* Feature list */}
          <div 
            className="space-y-3 relative"
          >
            {features.map((f, i) => (
              <button key={f.id} onClick={() => setActive(i)} 
                data-aos="fade-right"
                data-aos-delay={i * 50}
                className={`group relative w-full flex items-center gap-5 text-left rounded-2xl p-5 transition-all duration-300 overflow-hidden ${
                  active === i
                    ? 'shadow-[0_10px_30px_rgba(0,0,0,0.3)] scale-[1.02]'
                    : 'bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                }`}>
                
                {/* Premium Sliding Active Background */}
                {active === i && (
                  <motion.div 
                    layoutId="active-panel-tab"
                    className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20 rounded-2xl pointer-events-none"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 z-10 ${active === i ? 'bg-red-500/20 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-black/40 border border-white/10 group-hover:bg-white/5'}`}>
                  <f.icon className={`w-5 h-5 transition-colors ${active === i ? 'text-red-400' : 'text-gray-400 group-hover:text-gray-300'}`} />
                </div>
                
                <div className="flex-1 min-w-0 z-10">
                  <div className={`font-black text-sm transition-colors ${active === i ? 'text-white' : 'text-gray-300'}`}>{f.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed mt-1 line-clamp-2">{f.desc}</div>
                </div>
                
                <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-all z-10 ${active === i ? 'text-red-400 translate-x-1' : 'text-gray-600 group-hover:text-gray-400'}`} />
              </button>
            ))}
          </div>

          {/* Preview column */}
          <div className="flex flex-col relative h-[500px] lg:h-auto">
            {/* Ambient glow behind preview */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-rose-500/10 blur-3xl -z-10" />

            {/* Preview */}
            <div
              className="bg-[#0c0c0e] border border-white/10 rounded-3xl overflow-hidden flex-1 flex flex-col shadow-2xl relative"
            >
              {/* Browser bar */}
              <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                </div>
                <div className="flex-1 flex justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-black/50 border border-white/5 rounded-xl px-4 py-1.5 text-gray-400 text-xs font-bold tracking-wide flex items-center gap-2 whitespace-nowrap"
                    >
                      <span className="text-gray-600 hidden sm:inline">https://</span>control.hostlixo.com <span className="text-gray-600">/</span> <span className="text-white">{feature.id}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="hidden sm:flex gap-2">
                  <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">LIVE</span>
                </div>
              </div>

              {/* Screenshot - Pre-rendered to fix lag */}
              <div className="relative flex-1 min-h-[400px] bg-[#09090b] p-4 sm:p-6 overflow-hidden">
                <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  {features.map((f, i) => (
                    <Image 
                      key={f.id}
                      src={f.image} 
                      alt={f.title} 
                      fill 
                      className={`object-cover object-left-top transition-all duration-700 ease-in-out absolute inset-0 ${
                        active === i ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[1.05] z-0 pointer-events-none'
                      }`} 
                      sizes="(max-width: 1024px) 100vw, 800px" 
                      priority={i === 0} // Prioritize first image
                    />
                  ))}
                </div>
              </div>

              {/* Bottom info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 sm:px-8 border-t border-white/5 bg-white/[0.01]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-red-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{feature.label}</div>
                    <div className="text-white font-black text-xl tracking-wide">{feature.title}</div>
                    <div className="text-gray-400 text-sm mt-2 max-w-md leading-relaxed">{feature.desc}</div>
                  </motion.div>
                </AnimatePresence>
                <a href="https://control.hostlixo.com" target="_blank" rel="noopener noreferrer"
                  className="group flex-shrink-0 flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-xl text-sm font-black transition hover:bg-gray-200 hover:scale-105 transform-gpu">
                  Open Dashboard 
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
