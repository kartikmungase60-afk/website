"use client"

import Image from "next/image"
import Link from "next/link"
import { FaDiscord } from "react-icons/fa6"
import { ArrowUp, ExternalLink, FileText, Gauge, Mail, MapPin, Server, ShieldCheck } from "lucide-react"

type FooterLink = { name: string; href: string }

const footerLinks: Record<string, FooterLink[]> = {
  Hosting: [
    { name: "Minecraft Hosting", href: "/games/minecraft" },
    { name: "Game Server Hosting", href: "/games" },
    { name: "VPS Hosting India", href: "/vps" },
    { name: "Dedicated Servers", href: "/dedicated" },
    { name: "Discord Bot Hosting", href: "/discord" },
    { name: "Web Hosting", href: "/webhosting" },
  ],
  Resources: [
    { name: "Infrastructure", href: "/infrastructure" },
    { name: "Global Network", href: "/network" },
    { name: "Knowledge Base", href: "/kb" },
    { name: "Hosting Guides", href: "/blog" },
    { name: "Looking Glass", href: "/looking-glass" },
    { name: "Service Status", href: "/status" },
  ],
  Company: [
    { name: "About Hostlixo", href: "/about" },
    { name: "Commitment", href: "/commitment" },
    { name: "Partnerships", href: "/partnership" },
    { name: "Customer Feedback", href: "/reviews" },
    { name: "Contact Support", href: "/contact" },
  ],
  Legal: [
    { name: "Terms of Service", href: "/terms-of-services" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Cloud Dashboard", href: "https://control.hostlixo.com" },
  ],
}

const highlights = [
  { icon: MapPin, label: "Mumbai-first", text: "India headquarters" },
  { icon: Server, label: "NVMe hosting", text: "Game, VPS and bots" },
  { icon: ShieldCheck, label: "DDoS filtered", text: "Protected network" },
  { icon: Gauge, label: "Fast setup", text: "Panel managed" },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <footer className="relative border-t border-white/10 bg-[#070707] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))]">
          <div className="lg:pr-8" data-aos="fade-up">
            <Link href="/" className="flex items-center gap-3" aria-label="Hostlixo Cloud home">
              <Image src="/assets/branding/hostlixo-logo.svg" alt="Hostlixo Cloud logo" width={40} height={40} className="rounded-lg border border-white/10 bg-white/[0.04]" />
              <span className="text-lg font-black tracking-tight text-white">Hostlixo <span className="text-gray-300">Cloud</span></span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              India-based hosting for Minecraft communities, Discord bots, VPS, dedicated compute and websites with clear resources and INR pricing.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://discord.gg/97CrJNkJ2T" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black text-gray-100 transition hover:border-white/25 hover:bg-white/[0.08]">
                <FaDiscord className="h-4 w-4" />
                Discord
              </a>
              <a href="mailto:support@hostlixo.com" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-black text-black transition hover:bg-gray-200">
                <Mail className="h-4 w-4" />
                Support
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links], index) => (
            <nav key={category} aria-label={`${category} footer links`} data-aos="fade-up" data-aos-delay={index * 50}>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-200">{category}</h2>
              <ul className="mt-4 space-y-3">
                {links.map((link) => <FooterLinkItem key={link.name} link={link} />)}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
              <item.icon className="h-4 w-4 text-gray-300" />
              <p className="mt-3 text-sm font-black text-white">{item.label}</p>
              <p className="mt-1 text-[11px] leading-5 text-gray-500">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-gray-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>&copy; {new Date().getFullYear()} Hostlixo Cloud. All rights reserved.</p>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-800" />Mumbai-based cloud platform</span>
            <a href="mailto:support@hostlixo.com" className="inline-flex items-center gap-1 text-gray-400 hover:text-white"><Mail className="h-3.5 w-3.5" />support@hostlixo.com</a>
          </div>
          <button onClick={scrollToTop} className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-gray-400 transition hover:border-white/25 hover:text-white">
            <ArrowUp className="h-3.5 w-3.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkItem({ link }: { link: FooterLink }) {
  const external = link.href.startsWith("http")
  if (external) {
    return (
      <li>
        <a href={link.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
          <span className="h-1 w-1 rounded-full bg-gray-700 transition group-hover:bg-white" />
          {link.name}
          <ExternalLink className="h-3 w-3 opacity-60" />
        </a>
      </li>
    )
  }

  return (
    <li>
      <Link href={link.href} className="group flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
        <span className="h-1 w-1 rounded-full bg-gray-700 transition group-hover:bg-white" />
        {link.name}
        {link.href.includes("terms") && <FileText className="h-3 w-3 opacity-50" />}
      </Link>
    </li>
  )
}
