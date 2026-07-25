import Link from "next/link"
import { Activity, BookOpen, Gauge, MessageSquareText, RotateCcw, ShieldCheck, Wrench } from "lucide-react"

const signals = [
  { icon: Activity, title: "Service transparency", text: "See how Hostlixo monitors infrastructure and communicates service events.", href: "/status", action: "View status information" },
  { icon: Gauge, title: "Hardware methodology", text: "Understand the measurements that matter for game servers, VPS and websites.", href: "/benchmarks", action: "Read benchmark methodology" },
  { icon: BookOpen, title: "Practical hosting guides", text: "Use clear guides to choose RAM, regions, storage and hosting products.", href: "/blog", action: "Browse hosting guides" },
  { icon: MessageSquareText, title: "Open community feedback", text: "Ask existing community members questions and share product feedback in the Hostlixo Discord.", href: "https://discord.gg/97CrJNkJ2T", action: "Join the community" },
]

export default function TrustSignalsSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl z-10">
        <header className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-white/20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Hostlixo Trust Center</p>
            <span className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="mt-3 text-4xl sm:text-5xl font-black text-white drop-shadow-xl tracking-tight">Proof, policies and <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">public accountability</span></h2>
          <p className="mt-6 text-base leading-relaxed text-gray-400">
            Review monitoring practices, measurement methods, hosting guidance and community feedback without relying on fabricated testimonials.
          </p>
        </header>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {signals.map((item, index) => (
            <article 
              key={item.title} 
              style={{ animationDelay: `${index * 100}ms` }} 
              className="group animate-plan-rise relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0e] p-8 shadow-2xl transform-gpu transition duration-500 hover:-translate-y-2 hover:bg-[#0f0f15] hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:bg-white/10 transition-colors">
                  <item.icon className="h-6 w-6 text-gray-300 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-black text-white tracking-wide">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">{item.text}</p>
              </div>
              
              <Link 
                href={item.href} 
                target={item.href.startsWith("http") ? "_blank" : undefined} 
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} 
                className="relative z-10 mt-8 inline-flex items-center text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                {item.action} 
                <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-[#0a0a0e] p-6 text-xs text-gray-400 sm:grid-cols-3 transform-gpu shadow-lg">
          <span className="flex items-center justify-center sm:justify-start gap-3"><ShieldCheck className="h-4 w-4 text-red-400" />DDoS-filtered connectivity</span>
          <span className="flex items-center justify-center sm:justify-start gap-3 sm:border-x sm:border-white/10 sm:px-6"><RotateCcw className="h-4 w-4 text-red-400" />24-hour refund policy conditions</span>
          <span className="flex items-center justify-center sm:justify-start gap-3 sm:pl-6"><Wrench className="h-4 w-4 text-rose-400" />Resource details shown before checkout</span>
        </div>

        <div className="mt-6 rounded-3xl border border-red-500/20 bg-[#150a0a] px-6 py-5 text-center text-[11px] leading-relaxed text-red-200/60 shadow-inner">
          <strong className="text-red-400 font-bold tracking-wide uppercase mr-2">99.9% monthly uptime target:</strong> 
          approximately 43 minutes and 50 seconds of potential unavailability in a 30-day month. This is a target, not a claim of independently audited historical uptime.
        </div>
      </div>
    </section>
  )
}
