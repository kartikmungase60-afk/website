import { Check, Clock3, Cpu, CreditCard, HelpCircle, Server, ShieldCheck, Zap } from "lucide-react"

const badges = [
  { icon: CreditCard, title: "Secure checkout", detail: "Billing portal" },
  { icon: ShieldCheck, title: "DDoS filtered", detail: "Supported services" },
  { icon: Zap, title: "Automated setup", detail: "Eligible orders" },
  { icon: Clock3, title: "99.9% target", detail: "Published uptime goal" },
  { icon: Cpu, title: "Ryzen profiles", detail: "VPS & dedicated" },
]

const rows = [
  ["Modern CPU profiles", "Available", "Verify model"], ["NVMe storage", "Plan-defined", "Varies"], ["Automated setup", "Eligible services", "Varies"], ["DDoS filtering", "Service-defined", "Verify scope"], ["24/7 monitoring", "Published", "Verify coverage"], ["INR pricing", "Displayed", "Varies"],
]

export default function HomepageTrustComparison() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.04] bg-[#030303] px-4 py-24 sm:px-6 lg:px-8">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.05),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl z-10">
        
        {/* Badges Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {badges.map((badge, index) => (
            <article 
              key={badge.title} 
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0e] p-5 text-center shadow-lg transition hover:-translate-y-1.5 hover:bg-[#111115] hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-gpu"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-black/40 border border-white/10 shadow-inner group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-colors">
                <badge.icon className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </div>
              <h3 className="mt-4 text-sm font-black text-white">{badge.title}</h3>
              <p className="mt-1.5 text-[10px] uppercase tracking-wider text-gray-500">{badge.detail}</p>
            </article>
          ))}
        </div>

        {/* Comparison Header */}
        <header className="mx-auto mt-24 max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-red-500/50" />
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400 drop-shadow-md">A transparent comparison</p>
            <span className="h-px w-8 bg-red-500/50" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white drop-shadow-xl">Hostlixo vs <span className="text-gray-500">Unspecified Provider</span></h2>
          <p className="mt-6 text-base leading-relaxed text-gray-400">
            Use this as a verification checklist. The comparison does not claim every competitor lacks a feature, but highlights our transparent baseline.
          </p>
        </header>

        {/* Comparison Table */}
        <div className="mt-12 overflow-x-auto rounded-3xl border border-white/10 bg-[#07070a] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transform-gpu">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead className="bg-black/50 border-b border-white/10">
              <tr>
                <th className="p-6 text-xs uppercase tracking-widest text-gray-500 font-bold w-1/3">Feature Focus</th>
                <th className="p-6 text-center border-x border-white/10 bg-red-500/5 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-red-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                  <span className="text-base font-black text-white tracking-wide">Hostlixo Cloud</span>
                </th>
                <th className="p-6 text-center text-sm font-bold text-gray-500 w-1/3">Other Provider</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, index) => (
                <tr key={row[0]} className={`group transition-colors hover:bg-white/[0.02] ${index % 2 === 0 ? 'bg-transparent' : 'bg-black/20'}`}>
                  <th className="p-6 text-sm font-bold text-gray-300">{row[0]}</th>
                  <td className="p-6 text-center border-x border-white/10 bg-red-500/[0.02] group-hover:bg-red-500/[0.04] transition-colors">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-white">
                      <Check className="h-4 w-4 text-red-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                      {row[1]}
                    </span>
                  </td>
                  <td className="p-6 text-center text-sm text-gray-500">
                    <span className="inline-flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 opacity-50" />
                      {row[2]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <p className="mt-6 flex justify-center items-center gap-2 text-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">
          <Server className="h-3.5 w-3.5" />
          Exact resources, setup eligibility and protection scope are confirmed at checkout.
        </p>
      </div>
    </section>
  )
}
