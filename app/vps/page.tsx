import FeaturesSection from "../components/FeaturesSection"
import VPSPricingSection from "../components/vps/VPSPricingSection"
import OSSelectionSection from "../components/vps/OSSelectionSection"
import FAQSection from "../components/FAQSection"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import HostingComparisonSection from "../components/HostingComparisonSection"
import { Cpu, HardDrive, Network, ShieldCheck } from "lucide-react"
import { getServiceData } from "../lib/db-data"

export const dynamic = "force-dynamic"

export default async function Home() {
  const dbData = await getServiceData("vps-hosting")
  
  const vpsOffers = (dbData?.plans || []).map((plan: any) => ({
    "@type": "Offer",
    name: `${plan.name} India VPS`,
    url: "https://billing.hostlixo.com",
    priceCurrency: "INR",
    price: plan.price,
    availability: plan.outOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    category: "Virtual Private Server",
  }))

  const vpsServiceSchema = {
    "@type": "Service",
    "@id": "https://hostlixo.com/vps#service",
    name: "Hostlixo India AMD Ryzen VPS Hosting",
    serviceType: "Virtual private server hosting",
    description: "AMD Ryzen VPS hosting from Mumbai, India with NVMe storage, administrative access, INR pricing and protected connectivity.",
    url: "https://hostlixo.com/vps",
    provider: { "@id": "https://hostlixo.com/#organization" },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "India" },
      { "@type": "Country", name: "Singapore" },
      { "@type": "Country", name: "Germany" },
    ],
    offers: vpsOffers,
  }

  const vpsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      vpsServiceSchema,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hostlixo Cloud", item: "https://hostlixo.com" },
          { "@type": "ListItem", position: 2, name: "VPS Hosting India", item: "https://hostlixo.com/vps" },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vpsSchema) }}
      />
      <Navbar />
      <VPSPricingSection />
      <section className="border-y border-white/[0.06] bg-[#080a10] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-2xl"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gray-300">Platform clarity</p><h2 className="mt-2 text-3xl font-black">Two CPU ranges, clearly separated.</h2><p className="mt-3 text-sm leading-6 text-gray-400">Choose the AMD Ryzen 7 or Ryzen 9 tab above. Every plan card stays within the selected processor family; assigned cores, memory, storage and transfer are shown before checkout.</p></header>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><PlatformFact icon={Cpu} title="Processor" value="Ryzen 7 or Ryzen 9" text="Never mixed within a selected plan range." /><PlatformFact icon={HardDrive} title="Storage" value="25-256 GB NVMe" text="Capacity is listed on every plan." /><PlatformFact icon={Network} title="Transfer" value="Plan-defined" text="Monthly allowance is shown where applicable." /><PlatformFact icon={ShieldCheck} title="Network" value="DDoS-filtered" text="Included alongside normal server security practices." /></div>
          <div className="mt-5 rounded-xl border border-white/20 bg-white/[0.05] p-5"><h3 className="text-sm font-black text-gray-300">Backup policy</h3><p className="mt-2 text-xs leading-6 text-gray-400">A VPS remains customer-managed. Keep independent application and data backups outside the server. Any snapshot or backup option shown in the customer dashboard supplements, rather than replaces, your own recovery plan.</p></div>
        </div>
      </section>
      <HostingComparisonSection product="VPS" />
      <OSSelectionSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  )
}

function PlatformFact({ icon: Icon, title, value, text }: { icon: typeof Cpu; title: string; value: string; text: string }) { return <article className="rounded-xl border border-white/[0.08] bg-[#10131a] p-5"><Icon className="h-5 w-5 text-gray-300" /><p className="mt-4 text-[10px] font-black uppercase tracking-wider text-gray-500">{title}</p><h3 className="mt-1 font-black">{value}</h3><p className="mt-2 text-[11px] leading-5 text-gray-500">{text}</p></article> }
