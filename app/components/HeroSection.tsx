"use client"

import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useCurrency } from "./ui/InrPricing"
import homepageConfig from "../config/sections/homepage.json"

const slides = homepageConfig.heroSlides

export default function HeroSection() {
  const [active, setActive] = useState(0)
  const slide = slides[active] ?? slides[0]
  const { convertPrice } = useCurrency()

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 7000)
    return () => window.clearInterval(timer)
  }, [])

  if (!slide) return null

  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden border-b border-white/[0.04] px-4 pb-16 pt-28 sm:px-6 lg:px-8 bg-[#030303]">
      {/* Dynamic Background Image with Blur */}
      {slides.map((s, index) => (
        <div
          key={s.image}
          className={`absolute inset-0 -z-30 transform-gpu transition-all duration-1000 ease-in-out ${active === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
        >
          <Image src={s.image} alt={`${s.title} from Hostlixo Cloud`} fill priority={index === 0} quality={92} sizes="100vw" className="object-cover object-center" />
        </div>
      ))}

      {/* Deep Shadow & Noise Overlays */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#030303] via-[#030303]/70 to-transparent" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#030303]/90 via-transparent to-transparent" />
      {/* Heavy SVG noise filter removed for performance */}

      <div className="mx-auto flex w-full max-w-7xl items-center gap-12">
        
        {/* Left side content */}
        <div 
          key={slide.id} 
          className="max-w-3xl text-left relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          {/* Glowing Orb Behind Text */}
          <div className="absolute -left-20 top-20 -z-10 h-64 w-64 rounded-full bg-red-500/20 blur-[120px]" />

          <p 
            className="inline-flex rounded-full border border-white/10 bg-[#1a1a24] px-4 py-1.5 text-[11px] font-black text-gray-200 uppercase tracking-[0.2em] shadow-2xl animate-in zoom-in duration-500 delay-200 fill-mode-both"
          >
            {slide.eyebrow}
          </p>
          
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl drop-shadow-2xl">
            {slide.title}
          </h1>
            
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {slide.description}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {slide.benefits.map((benefit, i) => (
                <span 
                  key={benefit} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 animate-in fade-in slide-in-from-left-4 duration-500 fill-mode-both"
                  style={{ animationDelay: `${300 + i * 100}ms` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-red-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  {benefit}
                </span>
              ))}
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex flex-wrap gap-4">
                <Link href={slide.href} className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-black transition hover:scale-105 transform-gpu hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started 
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-gray-200 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
                <Link href={slide.href} className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#15151e] px-8 py-4 text-sm font-black text-white transition hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  View Plans
                </Link>
              </div>
              <div className="flex flex-col pl-2 sm:border-l sm:border-white/10 sm:pl-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Starting at</span>
                <span className="text-2xl font-black text-white drop-shadow-md">{convertPrice(slide.price, "INR")}/<span className="text-sm font-bold text-gray-400">mo</span></span>
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}
