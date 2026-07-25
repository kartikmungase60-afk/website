"use client"

import Image from "next/image"

import { Check, Copy, Gift, Server, ShieldCheck, X, Zap } from "lucide-react"
import { useEffect, useState } from "react"

const STORAGE_KEY = "hostlixo_welcome_offer_last_seen"
const DAY_MS = 24 * 60 * 60 * 1000
const COUPON = "HX10"

const gameImages = [
  { src: "/assets/homepage/minecraft-hosting-hero.webp", alt: "Minecraft server hosting" },
  { src: "/assets/homepage/hytale-hosting-hero.jpg", alt: "Hytale server hosting" },
  { src: "/assets/homepage/palworld-hosting-hero.jpg", alt: "Palworld server hosting" },
]

export default function WelcomeOfferPopup() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const lastSeen = Number(window.localStorage.getItem(STORAGE_KEY) || 0)
    if (Date.now() - lastSeen < DAY_MS) return
    const timer = window.setTimeout(() => {
      setOpen(true)
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()))
    }, 700)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", onKeyDown)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = previous }
  }, [open])

  const copyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(COUPON)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return <>
    {open && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-labelledby="welcome-offer-title" className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#0c0e16] shadow-[0_30px_100px_rgba(0,0,0,.7)] animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-500 ease-out">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close welcome offer" className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/55 text-gray-300 transition hover:rotate-90 hover:border-white/35 hover:text-white"><X className="h-4 w-4" /></button>

        <div className="relative grid h-36 grid-cols-3 overflow-hidden border-b border-white/10">
          {gameImages.map((image, index) => <div key={image.src} style={{ animationDelay: `${index * 80}ms` }} className="relative animate-in zoom-in-105 duration-500 fill-mode-both"><Image src={image.src} alt={image.alt} fill sizes="145px" className="object-cover" /></div>)}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e16] via-transparent to-black/20" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gray-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-black/25"><Zap className="h-3 w-3 fill-current" />Welcome offer</span>
        </div>

        <div className="p-6 sm:p-7">
          <div className="text-center"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gray-300">New to Hostlixo Cloud?</p><h2 id="welcome-offer-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">Get 10% off your first order</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-400">Launch game hosting, VPS, dedicated servers, bot hosting or web hosting with protected infrastructure.</p></div>

          <div className="mt-5 rounded-xl border border-white/20 bg-white/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-300"><Gift className="h-4 w-4" />Exclusive coupon</div>
            <div className="grid grid-cols-[1fr_auto] gap-2"><div className="flex items-center justify-center rounded-lg border border-white/20 bg-[#111113] px-4 font-mono text-base font-black tracking-[.22em] text-white">{COUPON}</div><button type="button" onClick={copyCoupon} className="flex min-w-[92px] items-center justify-center gap-2 rounded-lg bg-gray-800 px-4 py-3 text-xs font-black text-white transition hover:bg-gray-800">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</button></div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[9px] font-semibold text-gray-400"><span className="rounded-lg border border-white/8 bg-white/[.025] px-2 py-2"><Zap className="mx-auto mb-1 h-3.5 w-3.5 text-gray-300" />Fast setup</span><span className="rounded-lg border border-white/8 bg-white/[.025] px-2 py-2"><ShieldCheck className="mx-auto mb-1 h-3.5 w-3.5 text-gray-300" />DDoS filtered</span><span className="rounded-lg border border-white/8 bg-white/[.025] px-2 py-2"><Server className="mx-auto mb-1 h-3.5 w-3.5 text-gray-300" />Global regions</span></div>

          <a href="https://billing.hostlixo.com" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-black shadow-lg shadow-black/35 transition hover:bg-gray-200 hover:-translate-y-px active:scale-95">Start hosting with HX10 <Zap className="h-4 w-4" /></a>
          <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full py-1 text-xs text-gray-600 transition hover:text-gray-400">No thanks, continue browsing</button>
          <p className="mt-3 text-center text-[9px] leading-4 text-gray-600">Shown once every 24 hours on this browser. Offer eligibility is confirmed at checkout.</p>
        </div>
      </section>
    </div>}
  </>
}
