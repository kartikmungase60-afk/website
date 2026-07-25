"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useCurrency } from "./ui/InrPricing";
import homepageConfig from "../config/sections/homepage.json";

const pricing = homepageConfig.pricing;
const plans = pricing.plans;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PricingSection() {
  const titleLines = pricing.title.split("\n");

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#020202] overflow-hidden">
      {/* Background ambient glows (Optimized for 90FPS) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,transparent_60%)] pointer-events-none transform-gpu will-change-transform" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.12)_0%,transparent_60%)] pointer-events-none translate-y-1/3 -translate-x-1/4 transform-gpu will-change-transform" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <div className="text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              {pricing.eyebrow}
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white orbitron-font mb-4 leading-[1.1] tracking-tight">
              {titleLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-gray-400 text-sm max-w-lg font-medium leading-relaxed">
              {pricing.description}
            </p>
          </div>
          <Link
            href={pricing.exploreHref}
            className="group flex-shrink-0 flex items-center gap-2 border border-white/10 bg-[#0f0f0f] hover:bg-[#202020] hover:border-rose-500/50 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transform-gpu"
          >
            {pricing.exploreText}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {plans.map((plan, i) => (
            <PricingCard key={plan.badge} plan={plan} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingCard({ plan, index }: { plan: any; index: number }) {
  const { convertPrice } = useCurrency();
  const isOutOfStock = Boolean(plan.outOfStock || plan.OUTOFSTOCK || plan.outofstock);
  
  return (
    <motion.div
      variants={itemVariants}
      className={`group relative bg-[#000000] rounded-3xl overflow-hidden border border-white/[0.05] transition duration-500 flex flex-col transform-gpu will-change-transform ${!isOutOfStock ? "hover:border-rose-500/30 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] hover:-translate-y-2" : ""}`}
    >
      {isOutOfStock && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-start bg-black/80 rounded-3xl">
          <div className="relative w-72 h-64 pointer-events-none drop-shadow-2xl -mt-1">
            <Image src="/assets/out-of-stock.png" alt="Out of stock" fill sizes="300px" className="object-contain object-top drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" />
          </div>
        </div>
      )}

      {/* Top Edge Glow (Pure CSS fallback for 90FPS optimization) */}
      <div className="absolute top-0 inset-x-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:via-rose-500/50 transition-colors duration-500 z-10 transform-gpu" />
      
      {/* Premium Glass Sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform-gpu" />

      <div className="relative p-6 z-10 flex flex-col flex-grow">
        {/* Badge */}
        <div className="inline-block bg-white/5 border border-white/10 text-gray-300 group-hover:text-rose-200 group-hover:border-rose-500/30 group-hover:bg-rose-500/10 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-5 w-max transition-colors duration-300 shadow-sm">
          {plan.badge}
        </div>

        {/* Dynamic Image Container */}
        <div className="relative h-[150px] w-full rounded-2xl overflow-hidden mb-6 bg-black/50 ring-1 ring-white/5 group-hover:ring-rose-500/20 transition shadow-inner">
          <Image 
            src={plan.image} 
            alt={plan.title} 
            fill 
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-out transform-gpu" 
            sizes="(max-width: 768px) 100vw, 300px" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-black/20 to-transparent" />
        </div>

        {/* Text Content */}
        <h3 className="text-white font-black text-xl mb-1.5 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-rose-300 transition duration-300">
          {plan.title}
        </h3>
        <p className="text-gray-400 text-xs font-semibold mb-6">{plan.subtitle}</p>

        {/* Pricing Area */}
        <div className="mb-6 flex items-baseline gap-1">
          <span className="text-white font-black text-3xl orbitron-font tracking-tighter drop-shadow-md">
            {convertPrice(plan.price)}
          </span>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">/mo</span>
        </div>

        {/* Features List */}
        <ul className="space-y-3 flex-grow mb-8">
          {plan.features.map((feature: string) => (
            <li key={feature} className="flex items-start gap-3 text-gray-400 text-xs font-medium group-hover:text-gray-300 transition-colors">
              <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/5 border border-white/10 group-hover:bg-rose-500/20 group-hover:border-rose-500/40 group-hover:text-rose-300 transition mt-0.5">
                <Check className="w-2.5 h-2.5" />
              </span>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {isOutOfStock ? (
          <div className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider border border-white/5 bg-white/5 text-gray-500 opacity-60 pointer-events-none cursor-not-allowed">
            Out of Stock
          </div>
        ) : (
          <Link
            href={plan.href}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition duration-300 border border-white/10 bg-white/5 text-white hover:bg-rose-600 hover:border-rose-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden relative transform-gpu hover:scale-[1.02]"
          >
            {/* Shine effect on button hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
            <span className="relative z-10">{plan.cta}</span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
