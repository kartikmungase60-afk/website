import Link from "next/link"
import { Check, HelpCircle, Minus, ShieldCheck } from "lucide-react"

const rows = [
  ["Resource visibility", "CPU, RAM and storage shown", "Often simplified", "Usually shown"],
  ["Regional choice", "Mumbai primary + 3 global regions", "May be limited", "Varies by provider"],
  ["INR pricing", "Displayed on Hostlixo pages", "Varies", "Often foreign currency"],
  ["Management", "Hostlixo dashboard", "Managed panel", "Usually self-managed"],
  ["Network filtering", "Described per service", "Must be verified", "Must be verified"],
  ["Refund terms", "Published 24-hour conditions", "Varies", "Varies"],
]

export default function HostingComparisonSection({ product }: { product: "VPS" | "Dedicated Server" }) {
  return <section className="border-y border-white/[0.06] bg-[#08090e] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
    <div className="mx-auto max-w-6xl"><header className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gray-300">Compare the buying experience</p><h2 className="mt-3 text-3xl font-black">Hostlixo {product} vs common hosting models</h2><p className="mt-4 text-sm leading-7 text-gray-400">An objective checklist of information buyers should verify. Competitor capabilities and terms change, so this table avoids unsupported brand claims.</p></header>
      <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-[#10131a]"><tr><th className="p-4 text-[10px] uppercase tracking-wider text-gray-500">Area</th><th className="border-l border-white/10 p-4 text-xs text-gray-300">Hostlixo Cloud</th><th className="border-l border-white/10 p-4 text-xs text-gray-300">Typical shared/managed host</th><th className="border-l border-white/10 p-4 text-xs text-gray-300">Typical unmanaged provider</th></tr></thead><tbody>{rows.map((row, index) => <tr key={row[0]} className={index % 2 ? "bg-white/[0.015]" : "bg-[#0b0d12]"}><th className="p-4 text-xs font-bold text-white">{row[0]}</th>{row.slice(1).map((value, column) => <td key={value} className="border-l border-white/[0.07] p-4 text-[11px] text-gray-400">{column === 0 ? <Check className="mr-2 inline h-3.5 w-3.5 text-gray-300" /> : <Minus className="mr-2 inline h-3.5 w-3.5 text-gray-600" />}{value}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/[0.04] p-5 text-center sm:flex-row sm:text-left"><p className="max-w-3xl text-[11px] leading-5 text-gray-400"><HelpCircle className="mr-2 inline h-4 w-4 text-gray-300" />Always compare the current checkout configuration, support scope and legal terms. “Typical” columns are evaluation prompts, not claims about a named competitor.</p><Link href="/benchmarks" className="flex-none text-xs font-black text-gray-300">Benchmark guide →</Link></div>
      <p className="mt-4 text-center text-[10px] text-gray-600"><ShieldCheck className="mr-1 inline h-3 w-3" />Last reviewed June 21, 2026.</p>
    </div>
  </section>
}
