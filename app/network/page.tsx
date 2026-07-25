import Image from "next/image"
import Link from "next/link"
import { Activity, ArrowRight, Cpu, Gauge, Globe2, HardDrive, Network, ShieldCheck } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({
  title: "Hostlixo India Network | Mumbai Hosting Location",
  description: "Explore Hostlixo's primary Mumbai hosting location and additional regions in Singapore, Frankfurt and the USA, with route testing and hardware details.",
  path: "/network",
  keywords: ["Hostlixo network", "Mumbai hosting", "Singapore VPS", "Germany hosting", "USA cloud hosting", "hosting latency test"],
})

const locations = [
  { country: "India", city: "Mumbai", flag: "/assets/flags/india.webp", audience: "India and South Asia", route: "Test from your ISP" },
  { country: "Singapore", city: "Singapore", flag: "/assets/flags/singapore.png", audience: "Southeast Asia", route: "Test from your ISP" },
  { country: "Germany", city: "Frankfurt", flag: "/assets/flags/germany.png", audience: "Europe", route: "Test from your ISP" },
  { country: "United States", city: "California", flag: "/assets/flags/united-states.png", audience: "North America", route: "Test from your ISP" },
]

const networkSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Hostlixo Cloud Global Hosting Network",
  provider: { "@id": "https://hostlixo.com/#organization" },
  areaServed: locations.map(({ country }) => ({ "@type": "Country", name: country })),
  url: "https://hostlixo.com/network",
}

export default function NetworkPage() {
  return <div className="min-h-screen bg-[#07080d] text-white">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(networkSchema) }} />
    <Navbar />
    <main className="pb-24 pt-28">
      <section className="relative overflow-hidden border-b border-white/[0.06] px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(156,163,175,.14),transparent_48%)]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-gray-300">India-based network</p>
          <h1 className="mt-4 text-4xl font-black sm:text-6xl">Mumbai at the core. Global when you need it.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400">Hostlixo is headquartered in Mumbai, India. Choose our primary Mumbai location or deploy closer to other audiences through Singapore, Frankfurt and the United States.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/looking-glass" className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-xs font-black hover:bg-gray-800">Run route tests <ArrowRight className="h-4 w-4" /></Link><Link href="/infrastructure" className="rounded-lg border border-white/15 px-5 py-3 text-xs font-black hover:border-white/35">View infrastructure</Link></div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8" aria-labelledby="locations-heading">
        <header className="max-w-2xl"><p className="text-[10px] font-black uppercase tracking-wider text-gray-300">Regional availability</p><h2 id="locations-heading" className="mt-2 text-3xl font-black">Choose the region nearest your audience</h2><p className="mt-3 text-sm leading-6 text-gray-400">Availability varies by product and plan. The looking glass measures your current browser route; application latency can differ.</p></header>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{locations.map((location) => <article key={location.city} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#050505] transition hover:-translate-y-1 hover:border-white/35"><div className="relative h-32 border-b border-white/[0.07] bg-gradient-to-br from-gray-700/[0.12] to-gray-900/[0.05]"><Image src={location.flag} alt={`${location.country} flag`} width={72} height={48} className="absolute bottom-5 left-5 h-10 w-auto rounded object-cover shadow-xl" /><Globe2 className="absolute right-5 top-5 h-5 w-5 text-gray-300" /></div><div className="p-5"><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{location.country}</p><h3 className="mt-1 text-xl font-black">{location.city}</h3><p className="mt-3 text-xs leading-5 text-gray-400">Best suited for {location.audience}</p><div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-4 text-[10px]"><span className="inline-flex items-center gap-1.5 text-gray-300"><Activity className="h-3 w-3" />Monitored</span><span className="text-gray-500">{location.route}</span></div></div></article>)}</div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8"><header className="text-center"><p className="text-[10px] font-black uppercase tracking-wider text-gray-300">Technical profile</p><h2 className="mt-2 text-3xl font-black">Transparent infrastructure layers</h2></header><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"><Technical icon={Cpu} title="Compute" value="Ryzen & Xeon profiles" text="The processor family is shown by product. Exact assigned resources remain visible before checkout." /><Technical icon={HardDrive} title="Storage" value="SSD & NVMe" text="Plan storage type and capacity are disclosed in the product catalog." /><Technical icon={Network} title="Connectivity" value="Up to 1 Gbps on game plans" text="Network allocation depends on the selected service and is shown with the plan." /><Technical icon={ShieldCheck} title="Protection" value="DDoS-filtered routing" text="Supported services include traffic filtering alongside account and application security guidance." /></div></section>

      <section className="mx-auto mt-16 max-w-4xl px-4 sm:px-6"><div className="rounded-2xl border border-white/20 bg-white/[0.05] p-7 sm:p-9"><div className="flex flex-col gap-6 sm:flex-row sm:items-center"><span className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-white/10"><Gauge className="h-6 w-6 text-gray-300" /></span><div><h2 className="text-2xl font-black">Latency is a route, not a marketing number.</h2><p className="mt-2 text-sm leading-6 text-gray-400">Distance, peering, congestion and your ISP all affect response time. Test from the same networks your players or customers use, ideally during peak hours.</p></div></div></div></section>
    </main>
    <Footer />
  </div>
}

function Technical({ icon: Icon, title, value, text }: { icon: typeof Cpu; title: string; value: string; text: string }) { return <article className="rounded-xl border border-white/[0.08] bg-[#101019] p-5"><Icon className="h-5 w-5 text-gray-300" /><p className="mt-4 text-[10px] font-black uppercase tracking-wider text-gray-500">{title}</p><h3 className="mt-1 font-black">{value}</h3><p className="mt-3 text-[11px] leading-5 text-gray-500">{text}</p></article> }
