"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  ChevronDown,
  FileText,
  Gamepad2,
  Globe,
  Home,
  Info,
  Menu,
  Scale,
  Server,
  Shield,
  User,
  X,
  Sun,
  Moon
} from "lucide-react"
import { FaDiscord } from "react-icons/fa6"
import { useEffect, useState, useRef } from "react"
import type { ElementType } from "react"
import { motion } from "framer-motion"
import navigationConfig from "../config/sections/navigation.json"
import heroConfig from "../config/sections/hero.json"
import type { DropdownItem, NavigationConfig, NavigationItem } from "../types/navigation"
import type { HeroConfig } from "../types/hero"
import { useCurrency } from "./ui/InrPricing"
import { cn } from "@/lib/utils"

const config = navigationConfig as NavigationConfig
const hero = heroConfig as HeroConfig
const icons: Record<string, ElementType> = {
  Building2,
  FaDiscord,
  FileText,
  Gamepad2,
  Globe,
  Home,
  Info,
  Scale,
  Server,
  Shield,
  User,
}
const getIcon = (name?: string) => name ? icons[name] : undefined

function matchesRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

function itemIsActive(item: NavigationItem, pathname: string) {
  if (matchesRoute(pathname, item.href)) return true
  return Boolean(item.dropdownItems?.some((entry) => matchesRoute(pathname, entry.href)))
}

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 10)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setExpanded(null)
  }, [pathname])

  // Split navigation items (5 total) into left (3) and right (2)
  const leftItems = config.mainNavigation.slice(0, 3)
  const rightItems = config.mainNavigation.slice(3)

  return (
    <>
      <header className={cn("fixed top-0 inset-x-0 z-50 h-16 flex px-0 transition duration-300", scrolled ? "drop-shadow-[0_18px_25px_rgba(0,0,0,0.5)]" : "")}>
        
        {/* Left Side Bar */}
        <div className="flex-1 h-10 z-20 relative min-w-0 overflow-hidden bg-[#030303]">
          <motion.div 
            className="absolute bottom-[0.5px] h-[2px] w-[150px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10"
            animate={{ left: ["-50%", "150%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} className="text-red-500/50" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} className="text-white" />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-16 relative z-10 shrink-0 -ml-px">
          
          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 overflow-hidden z-0">
            <div className="absolute inset-0 bg-[#030303]" style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 50 64">
              <motion.path 
                d="M0 39.5 C25 39.5 25 63.5 50 63.5" 
                fill="none" 
                stroke="cyan" 
                strokeWidth={2}
                initial={{ pathLength: 0.3, pathOffset: -0.3 }}
                animate={{ 
                  pathOffset: [-0.3, -0.3, 1, 1],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.45, 1], ease: "linear" }}
              />
            </svg>
            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 50 64">
              <path d="M0 39.5 C25 39.5 25 63.5 50 63.5" fill="none" stroke="currentColor" strokeOpacity={1} strokeWidth={1.5} className="text-red-500" />
              <path d="M0 36.5 C25 36.5 25 60.5 50 60.5" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} className="text-white" />
            </svg>
          </div>

          {/* Center Slice */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
             
             {/* Background Layer (z-0) */}
             <div className="absolute inset-0 z-0 bg-[#030303]">
                 <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" preserveAspectRatio="none">
                   <line x1="0" y1="63.5" x2="100%" y2="63.5" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} className="text-red-500/50" />
                   <line x1="0" y1="60.5" x2="100%" y2="60.5" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} className="text-white" />
                 </svg>
                 <motion.div 
                   className="absolute bottom-[0.5px] left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10"
                   animate={{ width: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
                   transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1], ease: "easeInOut" }}
                 />
             </div>

             {/* Content Layer (z-10) */}
             <div className="relative z-10 w-full h-full flex items-end justify-between pb-2 px-4 md:px-8">
               
               {/* Desktop Left Nav */}
               <nav className="hidden lg:flex gap-1 mb-1 shrink-0" onMouseLeave={() => setHoveredItem(null)}>
                {leftItems.map((item) => <DesktopItem key={item.name} item={item} pathname={pathname} isHovered={hoveredItem === item.name} setHovered={() => setHoveredItem(item.name)} />)}
              </nav>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden mb-1 p-1 text-white/70 hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo (Center) */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                <Link href="/" className="group flex flex-none items-center gap-2.5 mb-1" aria-label="Hostlixo Cloud home">
                  
                  {/* Logo Icon */}
                  <span className="relative grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/[0.04] shadow-[0_4px_14px_rgba(0,0,0,0.3)] transition-transform duration-300 group-hover:-translate-y-px group-hover:scale-105">
                    {/* Glowing background layer (Hardware Accelerated Opacity) */}
                    <motion.div 
                      className="absolute inset-0 rounded-lg shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                      animate={{ opacity: [0, 0, 1, 0, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1], ease: "linear" }}
                    />
                    <Image src={hero.navbar.logo} alt="Hostlixo Cloud logo" fill priority sizes="32px" className="object-contain p-1 relative z-10" />
                  </span>

                  {/* Brand Name Text */}
                  <span className="relative hidden sm:inline-block orbitron-font text-sm font-black tracking-normal sm:text-base">
                    {/* The glowing version (Hardware Accelerated Opacity) */}
                    <motion.span 
                      className="absolute inset-0 text-[#22d3ee] drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10 whitespace-nowrap"
                      animate={{ opacity: [0, 0, 1, 0, 0] }}
                      transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.5, 0.6, 1], ease: "linear" }}
                      aria-hidden="true"
                    >
                      {hero.navbar.brandName}
                      <span>{hero.navbar.brandAccent}</span>
                    </motion.span>
                    
                    {/* The static base version */}
                    <span className="relative z-0 text-white whitespace-nowrap">
                      {hero.navbar.brandName}
                      <span className="text-red-500">{hero.navbar.brandAccent}</span>
                    </span>
                  </span>

                </Link>
              </div>

              {/* Desktop Right Nav */}
              <nav className="hidden lg:flex gap-1 items-center shrink-0" onMouseLeave={() => setHoveredItem(null)}>
                {rightItems.map((item) => <DesktopItem key={item.name} item={item} pathname={pathname} isHovered={hoveredItem === item.name} setHovered={() => setHoveredItem(item.name)} />)}
                
                <div className="flex gap-3 pl-4 border-l border-white/10 shrink-0 items-center mb-1">
                  <CurrencyToggle />
                  <MagneticButton>
                    <a 
                      href={config.clientSpace.href} 
                      className="group relative flex h-9 items-center justify-center overflow-hidden rounded-md bg-red-600 px-5 text-sm font-black text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:brightness-110"
                    >
                      {/* Invisible placeholder to maintain button width */}
                      <span className="invisible">{config.clientSpace.name}</span>
                      
                      {/* Text One (Default) */}
                      <span className="absolute left-0 top-1/2 w-full -translate-y-1/2 text-center transition-all duration-500 group-hover:-top-full">
                        {config.clientSpace.name}
                      </span>
                      
                      {/* Text Two (Hover) */}
                      <span className="absolute left-0 top-[150%] w-full -translate-y-1/2 text-center transition-all duration-500 group-hover:top-1/2">
                        Let's Go!
                      </span>
                    </a>
                  </MagneticButton>
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="lg:hidden flex items-center gap-2 mb-1">
                 {/* Empty for mobile, currency toggle is inside the menu */}
              </div>

             </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px overflow-hidden z-0">
            <div className="absolute inset-0 bg-[#030303]" style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 50 64">
              <motion.path 
                d="M0 63.5 C25 63.5 25 39.5 50 39.5" 
                fill="none" 
                stroke="cyan" 
                strokeWidth={2}
                initial={{ pathLength: 0.3, pathOffset: 1 }}
                animate={{ 
                  pathOffset: [1, 1, -0.3, -0.3],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.45, 1], ease: "linear" }}
              />
            </svg>
            <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 50 64">
              <path d="M0 63.5 C25 63.5 25 39.5 50 39.5" fill="none" stroke="currentColor" strokeOpacity={1} strokeWidth={1.5} className="text-red-500" />
              <path d="M0 60.5 C25 60.5 25 36.5 50 36.5" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} className="text-white" />
            </svg>
          </div>

        </div>

        {/* Right Side Bar */}
        <div className="flex-1 h-10 z-20 relative min-w-0 -ml-px overflow-hidden bg-[#030303]">
          <motion.div 
            className="absolute bottom-[0.5px] h-[2px] w-[150px] bg-gradient-to-l from-transparent via-cyan-400 to-transparent z-10"
            animate={{ right: ["-50%", "150%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" preserveAspectRatio="none">
            <line x1="0" y1="39.5" x2="100%" y2="39.5" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} className="text-red-500/50" />
            <line x1="0" y1="36.5" x2="100%" y2="36.5" stroke="currentColor" strokeOpacity={0.15} strokeWidth={0.5} className="text-white" />
          </svg>
        </div>

      </header>

      {/* Mobile Menu Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-x-0 top-16 z-40 bg-[#07070a]/98 border-b border-white/10 lg:hidden shadow-lg overflow-y-auto max-h-[calc(100vh-4rem)] animate-in fade-in slide-in-from-top-4 duration-200"
          >
             <div className="mx-auto max-w-6xl space-y-2 px-4 py-4 sm:px-6">
                {config.mainNavigation.map((item, index) => <MobileItem key={item.name} item={item} pathname={pathname} expanded={expanded === item.name} onToggle={() => setExpanded(expanded === item.name ? null : item.name)} index={index} />)}
                <div className="grid grid-cols-[auto_1fr] gap-2 pt-2">
                  <CurrencyToggle mobile />
                  <a href={config.clientSpace.href} className="group relative flex h-11 items-center justify-center overflow-hidden rounded-md bg-[#00A3FF] px-4 text-sm font-black text-white shadow-[0_0_15px_rgba(0,163,255,0.4)] transition-all hover:shadow-[0_0_25px_rgba(0,163,255,0.6)] hover:brightness-110">
                    <span className="invisible">{config.clientSpace.name}</span>
                    <span className="absolute left-0 top-1/2 w-full -translate-y-1/2 text-center transition-all duration-500 group-hover:-top-full">
                      {config.clientSpace.name}
                    </span>
                    <span className="absolute left-0 top-[150%] w-full -translate-y-1/2 text-center transition-all duration-500 group-hover:top-1/2">
                      Let's Go!
                    </span>
                  </a>
                </div>
              </div>
          </div>
        )}
    </>
  )
}

function CurrencyToggle({ mobile = false }: { mobile?: boolean }) {
  const { currency, setCurrency } = useCurrency()
  const options = [
    { code: "USD" as const, label: "$ USD" },
    { code: "INR" as const, label: "\u20b9 INR" },
  ]

  return (
    <div className={`flex overflow-hidden rounded-md border border-white/10 bg-[#111111] shadow-inner ${mobile ? "h-11" : "h-9"}`} aria-label="Currency selector">
      {options.map((option) => {
        const active = currency === option.code
        return (
          <button key={option.code} type="button" onClick={() => setCurrency(option.code)} className={`${mobile ? "px-4" : "px-3"} text-xs font-black transition-all duration-300 relative ${active ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] z-10" : "text-gray-400 hover:bg-white/5 hover:text-white"} ${option.code === "INR" ? "border-l border-white/5" : ""}`}>
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function DesktopItem({ item, pathname, isHovered, setHovered }: { item: NavigationItem; pathname: string; isHovered: boolean; setHovered: () => void }) {
  const Icon = getIcon(item.icon)
  const active = itemIsActive(item, pathname)

  return (
    <div className="group relative flex h-14 items-center" onMouseEnter={setHovered}>
      <Link href={item.href} className={`relative flex h-9 items-center gap-1.5 rounded-md px-3 text-[12px] font-bold transition-colors duration-300 z-10 ${active || isHovered ? "text-white" : "text-gray-400 hover:text-white"}`}>
        {isHovered && (
          <div
            className="absolute inset-0 -z-10 rounded-md bg-white/[0.08] shadow-[0_4px_12px_rgba(255,255,255,0.02)] border border-white/5 animate-in fade-in zoom-in-95 duration-200"
          />
        )}
        {active && !isHovered && (
          <div className="absolute inset-0 -z-10 rounded-md bg-white/[0.04]" />
        )}
        {Icon && <Icon className={`h-3.5 w-3.5 transition-colors duration-300 ${active || isHovered ? "text-red-500" : "text-gray-500"}`} />}
        <span>{item.name}</span>
        {item.hasDropdown && <ChevronDown className="h-3 w-3 text-gray-500 transition-transform duration-300 group-hover:rotate-180 group-hover:text-gray-300" />}
      </Link>
      {item.hasDropdown && item.dropdownItems && (
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%-1px)] w-[310px] -translate-x-1/2 translate-y-2 scale-[.98] opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 z-50">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0b0f] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.6)] transform-gpu">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2">
              <span className="text-[9px] font-black uppercase tracking-[.2em] text-gray-500">{item.name}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_14px_rgba(239,68,68,.8)]" />
            </div>
            <div className="pt-1">
              {item.dropdownItems.map((entry) => <DropdownEntry key={entry.name} entry={entry} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownEntry({ entry }: { entry: DropdownItem }) {
  const EntryIcon = getIcon(entry.icon) || Info
  return (
    <Link href={entry.href} className="group/entry flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/[0.06]">
      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md border border-white/10 bg-white/[0.04] transition group-hover/entry:border-white/25 group-hover/entry:bg-white/[0.08]">
        <EntryIcon className="h-3.5 w-3.5 text-gray-300" />
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-bold text-white">{entry.name}</span>
        {entry.description && <span className="mt-0.5 block truncate text-[10px] text-gray-500">{entry.description}</span>}
      </span>
    </Link>
  )
}

function MobileItem({ item, pathname, expanded, onToggle, index }: { item: NavigationItem; pathname: string; expanded: boolean; onToggle: () => void; index: number }) {
  const Icon = getIcon(item.icon)
  const active = itemIsActive(item, pathname)

  return (
    <div style={{ animationDelay: `${index * 30}ms` }} className={`overflow-hidden rounded-lg border animate-in fade-in slide-in-from-left-4 duration-300 fill-mode-both ${active ? "border-[#6aa8ff]/45 bg-white/[0.07]" : "border-white/10 bg-white/[0.025]"}`}>
      <div className="flex">
        <Link href={item.href} className={`flex flex-1 items-center gap-3 px-4 py-3 text-sm font-bold ${active ? "text-white" : "text-gray-200"}`}>
          {Icon && <Icon className="h-4 w-4 text-gray-400" />}
          {item.name}
        </Link>
        {item.hasDropdown && <button type="button" onClick={onToggle} aria-expanded={expanded} aria-label={`Toggle ${item.name} menu`} className="w-12 border-l border-white/10 text-gray-400"><span className={`flex justify-center transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}><ChevronDown className="h-4 w-4" /></span></button>}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-1 border-t border-white/10 p-2">
            {item.dropdownItems?.map((entry) => {
              const EntryIcon = getIcon(entry.icon) || Info
              return (
                <Link key={entry.name} href={entry.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.05] hover:text-white">
                  <EntryIcon className="h-4 w-4 text-gray-400" />
                  <span className="min-w-0">
                    <span className="block font-semibold">{entry.name}</span>
                    {entry.description && <span className="block truncate text-[10px] text-gray-500">{entry.description}</span>}
                  </span>
                </Link>
              )
            })}
          </div>
      </div>
    </div>
  )
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-block">
      {children}
    </div>
  )
}
