import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import Footer from "./Footer"
import Navbar from "./Navbar"

interface InfoPageProps {
  eyebrow: string
  title: string
  description: string
  highlights: string[]
  children?: React.ReactNode
}

export default function InfoPage({ eyebrow, title, description, highlights, children }: InfoPageProps) {
  return (
    <main className="min-h-screen bg-[#08080d] text-white">
      <Navbar />
      <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pb-28 lg:pt-44">
        <div className="absolute left-1/2 top-16 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-white/15 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-gray-300">{eyebrow}</p>
            <h1 className="orbitron-font mb-5 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
            <p className="text-base leading-8 text-gray-400 sm:text-lg">{description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-gray-300" />
                <span className="text-sm leading-6 text-gray-300">{highlight}</span>
              </div>
            ))}
          </div>

          {children && <div className="mt-10">{children}</div>}

          <div className="mt-14 rounded-2xl border border-white/10 bg-[#0d0d14] p-6 sm:p-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-300">Hostlixo Cloud at a glance</p>
            <h2 className="orbitron-font mb-6 text-2xl font-bold">An India-based cloud platform built in Mumbai</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="font-bold text-white">Mumbai headquarters</p><p className="mt-2 text-sm leading-6 text-gray-400">India-based operations with additional regions in Singapore, Germany and the USA.</p></div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="font-bold text-white">Protected connectivity</p><p className="mt-2 text-sm leading-6 text-gray-400">Network filtering and platform monitoring for hosted services.</p></div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="font-bold text-white">Clear INR billing</p><p className="mt-2 text-sm leading-6 text-gray-400">Plan prices displayed in rupees with defined monthly resources.</p></div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="https://control.hostlixo.com" className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-5 py-3 text-sm font-bold hover:bg-gray-800">
              Open Cloud Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/games" className="rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-gray-200 hover:border-white/50">
              Explore Cloud Services
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
