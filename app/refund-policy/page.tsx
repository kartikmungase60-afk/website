import Link from "next/link"
import { AlertCircle, CheckCircle2, Clock3, CreditCard, FileCheck2, XCircle } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({
  title: "24-Hour Refund Policy",
  description: "Read the Hostlixo Cloud 24-hour refund request policy, eligibility requirements, exclusions and refund process for hosting services.",
  path: "/refund-policy",
  keywords: ["Hostlixo refund policy", "24 hour hosting refund", "Hostlixo Cloud refund", "hosting refund eligibility"],
})

const eligible = [
  "The request concerns a first-time purchase of an eligible Hostlixo Cloud hosting service.",
  "The request is submitted within 24 hours of the service's initial activation time.",
  "The account is in good standing and has not violated the Acceptable Use Policy.",
  "The service has not consumed excessive network, compute, storage or support resources.",
]

const excluded = [
  "Renewals, recurring charges, upgrades, add-ons or additional resource purchases.",
  "Domain registration, software licenses, setup work or other non-recoverable third-party fees.",
  "Cryptocurrency payments and payment-provider fees that cannot be reversed.",
  "Services suspended or terminated for abuse, prohibited content, fraud or policy violations.",
  "Accounts with an active chargeback, payment dispute or previously approved refund.",
]

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#060609] text-white">
      <Navbar />
      <main className="px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-gray-300"><Clock3 className="h-4 w-4" /> Customer protection</div>
            <h1 className="orbitron-font text-4xl font-black sm:text-5xl">24-Hour Refund Policy</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400">Eligible first-time hosting purchases may be submitted for refund review within 24 hours of initial activation. This page explains the conditions and exclusions.</p>
            <p className="mt-4 text-xs text-gray-600">Last updated: June 2026</p>
          </header>

          <div className="mb-8 rounded-2xl border border-white/30 bg-white/[0.07] p-6 sm:p-8">
            <div className="flex items-start gap-4"><Clock3 className="mt-1 h-7 w-7 flex-none text-gray-300" /><div><h2 className="text-2xl font-black">The 24-hour window</h2><p className="mt-3 text-sm leading-7 text-gray-400">The window begins when the eligible service is first activated, not when the customer first signs in or begins using it. A request must reach an official Hostlixo Cloud support channel before the 24-hour window closes. Submitting a request does not guarantee approval; eligibility is reviewed against this policy.</p></div></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PolicyList title="Eligible requests" icon={CheckCircle2} items={eligible} tone="eligible" />
            <PolicyList title="Not eligible" icon={XCircle} items={excluded} tone="excluded" />
          </div>

          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3"><FileCheck2 className="h-6 w-6 text-gray-300" /><h2 className="text-2xl font-black">How to request a refund</h2></div>
            <ol className="grid gap-4 sm:grid-cols-3">
              <Step number="1" title="Open a ticket" text="Use the Hostlixo Cloud dashboard or contact official support within 24 hours." />
              <Step number="2" title="Identify the service" text="Provide the service ID, purchase date and a concise reason for the request." />
              <Step number="3" title="Wait for review" text="Our team checks eligibility and confirms the decision through the support ticket." />
            </ol>
          </section>

          <section className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><CreditCard className="h-6 w-6 text-gray-300" /><h2 className="mt-4 text-xl font-black">Approved refunds</h2><p className="mt-3 text-sm leading-7 text-gray-400">Approved refunds are returned to the original payment method when possible. Bank, card network and payment-provider processing times vary and are outside Hostlixo Cloud's direct control.</p></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"><AlertCircle className="h-6 w-6 text-gray-300" /><h2 className="mt-4 text-xl font-black">Cancellations after 24 hours</h2><p className="mt-3 text-sm leading-7 text-gray-400">Services may still be cancelled to prevent future renewal, but payments are not refundable after the eligibility window unless required by applicable law or separately approved in writing.</p></div>
          </section>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/20 bg-white/[0.05] p-6 sm:flex-row sm:items-center"><div><p className="font-black">Need help with a refund request?</p><p className="mt-1 text-sm text-gray-400">Open an account ticket from the Hostlixo Cloud dashboard.</p></div><div className="flex gap-3"><a href="https://control.hostlixo.com" className="rounded-xl bg-gray-800 px-5 py-3 text-sm font-black hover:bg-gray-800">Open dashboard</a><Link href="/terms-of-services" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-black text-gray-200 hover:border-white/50">Read terms</Link></div></div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function PolicyList({ title, icon: Icon, items, tone }: { title: string; icon: typeof CheckCircle2; items: string[]; tone: "eligible" | "excluded" }) {
  const positive = tone === "eligible"
  return <section className={`rounded-2xl border p-6 sm:p-7 ${positive ? "border-white/20 bg-white/[0.04]" : "border-white/20 bg-white/[0.04]"}`}><div className="mb-5 flex items-center gap-3"><Icon className={`h-6 w-6 ${positive ? "text-gray-300" : "text-gray-300"}`} /><h2 className="text-xl font-black">{title}</h2></div><ul className="space-y-4">{items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-400"><span className={`mt-2 h-1.5 w-1.5 flex-none rounded-full ${positive ? "bg-gray-800" : "bg-gray-800"}`} />{item}</li>)}</ul></section>
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <li className="list-none rounded-xl border border-white/10 bg-black/20 p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-xs font-black">{number}</span><h3 className="mt-4 font-black">{title}</h3><p className="mt-2 text-xs leading-6 text-gray-500">{text}</p></li>
}
