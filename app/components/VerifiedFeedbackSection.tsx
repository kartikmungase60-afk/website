"use client"

import { BadgeCheck, MessageSquareText, Quote, Send } from "lucide-react"

const proofPoints = [
  { 
    icon: BadgeCheck, 
    title: "Verification standard", 
    text: "Customer relationship and publication consent should be confirmed before a quote appears.",
    accent: "from-blue-500/10 to-transparent",
    borderGlow: "group-hover:border-blue-500/30",
    shadowGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]",
    iconGlow: "group-hover:text-blue-400",
    iconRing: "group-hover:border-blue-500/30"
  },
  { 
    icon: Quote, 
    title: "No anonymous filler", 
    text: "No stock testimonials, invented star ratings or unsupported customer counts are shown.",
    accent: "from-emerald-500/10 to-transparent",
    borderGlow: "group-hover:border-emerald-500/30",
    shadowGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]",
    iconGlow: "group-hover:text-emerald-400",
    iconRing: "group-hover:border-emerald-500/30"
  },
  { 
    icon: MessageSquareText, 
    title: "Open conversation", 
    text: "Prospective customers can ask questions in the Hostlixo community before ordering.",
    accent: "from-purple-500/10 to-transparent",
    borderGlow: "group-hover:border-purple-500/30",
    shadowGlow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]",
    iconGlow: "group-hover:text-purple-400",
    iconRing: "group-hover:border-purple-500/30"
  },
  { 
    icon: Send, 
    title: "Feedback pathway", 
    text: "Customers can submit product feedback directly to Hostlixo support for review.",
    accent: "from-rose-500/10 to-transparent",
    borderGlow: "group-hover:border-rose-500/30",
    shadowGlow: "group-hover:shadow-[0_0_30px_rgba(244,63,113,0.1)]",
    iconGlow: "group-hover:text-rose-400",
    iconRing: "group-hover:border-rose-500/30"
  }
]

export default function VerifiedFeedbackSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/5 blur-[150px] pointer-events-none" />
      
      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_1fr] z-10">
        
        {/* Left Side: Call to Action */}
        <div 
          data-aos="fade-right"
          className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#050506] p-8 sm:p-12 shadow-2xl transform-gpu flex flex-col justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-red-500/50" />
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">Customer Feedback</p>
            </div>
            
            <h2 className="mt-4 text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-xl leading-[1.1]">
              Real voices, <br/>published with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-500 drop-shadow-[0_0_15px_rgba(244,63,113,0.3)]">permission</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-400 max-w-lg">
              Hostlixo will not invent customer names, ratings or quotes. Public testimonials should be connected to a verifiable customer or community account and approved before publication.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <a 
                href="https://discord.gg/97CrJNkJ2T" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative inline-flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-8 py-4 text-sm font-black text-white transition-all duration-300 hover:bg-red-500/20 hover:scale-105 transform-gpu hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
                <MessageSquareText className="h-4 w-4 text-red-400" />
                <span>Ask the community</span>
              </a>
              <a 
                href="mailto:support@hostlixo.com?subject=Hostlixo%20customer%20feedback" 
                className="group relative inline-flex items-center gap-3 rounded-xl border border-white/10 bg-transparent px-8 py-4 text-sm font-black text-gray-300 transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-white/20"
              >
                <Send className="h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white transition-all duration-300" />
                <span>Submit feedback</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Proof Points Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {proofPoints.map((point, index) => {
            const Icon = point.icon
            return (
              <article 
                key={point.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className={`group relative overflow-hidden rounded-[1.5rem] border border-white/[0.06] bg-[#08080a] p-8 transform-gpu transition-all duration-500 hover:-translate-y-1 hover:bg-[#0c0c0f] ${point.borderGlow} ${point.shadowGlow}`}
              >
                {/* Accent Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${point.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner transition-all duration-500 ${point.iconRing} group-hover:bg-black/60`}>
                    <Icon className={`h-5 w-5 text-gray-500 transition-colors duration-500 ${point.iconGlow}`} />
                  </div>
                  <h3 className="mt-auto text-base font-black text-white tracking-wide drop-shadow-md">{point.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-500">{point.text}</p>
                </div>
              </article> 
            )
          })}
        </div>
        
      </div>
    </section>
  )
}
