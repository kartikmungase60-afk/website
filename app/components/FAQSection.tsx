"use client";
import { useState } from "react";
import { Plus, Minus, MessageCircle, Mail } from "lucide-react";
import { FaDiscord } from "react-icons/fa6";
import Link from "next/link";
import Image from "next/image";

const faqs = {
  "Game Hosting": [
    { q: "Is Hostlixo suitable for Minecraft communities in India?", a: "Yes. Our Mumbai game hosting combines responsive compute, NVMe storage, protected connectivity and dashboard tools for SMP, survival, modded and community servers." },
    { q: "Where is Hostlixo based?", a: "Hostlixo is an India-based hosting company headquartered in Mumbai, Maharashtra. Additional service regions are available in Singapore, Germany and the USA." },
    { q: "Can I install plugins and mods?", a: "The cloud dashboard supports plugin, mod and server-software management for compatible games and versions. Availability depends on the software selected for your server." },
    { q: "Is DDoS filtering included?", a: "Network filtering is included with Hostlixo Cloud game hosting to help reduce the impact of malicious traffic." },
    { q: "How do I manage my game server?", a: "Use the browser dashboard to start, stop and restart services, view console output, manage files, edit settings and control player access." },
    { q: "How can I contact support?", a: "Open a support ticket from the cloud dashboard or contact the team by email. Community assistance is also available through Discord." },
  ],
  "VPS Servers": [
    { q: "Can I deploy a VPS in Mumbai?", a: "Yes. Mumbai is Hostlixo's primary India location. Availability for each processor range and plan is shown during ordering." },
    { q: "Which operating systems can I deploy?", a: "Hostlixo Cloud offers common Linux distributions and supported Windows Server images. Available images are shown during deployment and reinstallation." },
    { q: "Do VPS plans include root access?", a: "Yes. Linux VPS plans include root access, while supported Windows deployments include administrator access." },
    { q: "Which processors power the VPS platform?", a: "Our listed VPS ranges use AMD Ryzen processors with NVMe storage. Review each plan for its assigned cores, memory and transfer allowance." },
    { q: "Are there setup fees?", a: "Standard self-service VPS plans do not list a separate setup fee. Any optional managed work is quoted before it begins." },
    { q: "Can I move to a larger VPS?", a: "Contact support through the dashboard to review upgrade options and the safest migration path for your workload." },
  ],
  "Web Hosting": [
    { q: "Is SSL available for hosted websites?", a: "Supported web-hosting plans can use automated SSL certificates so visitors can connect over HTTPS." },
    { q: "How do I manage websites and files?", a: "Your hosting dashboard provides the account, file, database and domain tools available with the selected plan." },
    { q: "Can I host more than one website?", a: "The number of websites and domains depends on the selected plan. Compare plan resources before ordering." },
    { q: "Are backups included?", a: "Backup availability and retention depend on the plan. Keep an independent copy of business-critical website data." },
    { q: "What uptime does Hostlixo Cloud target?", a: "The platform targets 99.9% service uptime, excluding planned maintenance and circumstances described in the service terms." },
  ],
  "Bot Hosting": [
    { q: "Which programming languages are supported?", a: "Bot-hosting plans support common runtimes such as Node.js, Python and Java when the required version is available on the platform." },
    { q: "Will my bot restart automatically if it crashes?", a: "Yes, auto-restart is enabled by default on all bot hosting plans." },
    { q: "Is there DDoS protection for bots?", a: "Yes, all bot hosting plans include DDoS protection." },
    { q: "Can I access my bot files directly?", a: "Yes, you get full file manager access and SFTP access." },
    { q: "How fast is bot deployment?", a: "Eligible bot services are provisioned automatically after successful payment, subject to payment verification and platform availability." },
  ],
};

const tabs = Object.keys(faqs);

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: Object.values(faqs).flat().map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <section id="faq" className="relative scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.04] bg-[#030303] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-red-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-[500px] w-[500px] translate-y-1/2 rounded-full bg-rose-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 transform-gpu shadow-lg"
          >
            Support Center
          </div>
          <h2
            data-aos="fade-up"
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-xl"
          >
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">Questions</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 w-full">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setOpenIndex(0); }}
              className={`relative px-6 py-3 rounded-2xl text-sm font-black tracking-wide transition duration-300 overflow-hidden shadow-lg ${activeTab === tab ? 'text-white border border-white/20 scale-105' : 'bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
              {activeTab === tab && (
                <div
                  className="absolute inset-0 bg-red-500/20 pointer-events-none"
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs[activeTab as keyof typeof faqs].map((faq, i) => (
              <div key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className={`relative overflow-hidden rounded-2xl border transition duration-300 shadow-xl transform-gpu ${openIndex === i ? 'border-red-500/30 bg-[#150a0a]' : 'border-white/5 bg-[#0a0a0e] hover:border-white/15 hover:bg-[#111115]'}`}
              >
                <button
                  className="w-full flex items-center justify-between px-6 sm:px-8 py-5 text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className={`font-black text-sm sm:text-base tracking-wide transition-colors ${openIndex === i ? 'text-white' : 'text-gray-300'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-6 transition duration-300 border ${openIndex === i ? 'bg-red-500/20 border-red-500/30 rotate-180' : 'bg-white/5 border-white/10'}`}>
                    {openIndex === i ? <Minus className="w-4 h-4 text-red-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-6 sm:px-8 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Help Card */}
          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#111115] to-[#0a0a0e] p-8 h-fit shadow-[0_0_50px_rgba(0,0,0,0.5)] transform-gpu group"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-gray-800 to-gray-600 border border-white/20 rounded-2xl flex items-center justify-center shadow-lg shadow-black/50">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl tracking-tight mb-2 drop-shadow-md">Still confused?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-[250px] mx-auto">Ask our team about regions, resources or migration.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <a href="https://discord.gg/97CrJNkJ2T" target="_blank" rel="noopener noreferrer"
                  className="group/btn relative overflow-hidden flex flex-col items-center justify-center gap-3 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border border-[#5865F2]/20 hover:border-[#5865F2]/50 rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(88,101,242,0.3)] hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="w-12 h-12 bg-[#5865F2] rounded-xl flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-300 relative z-10">
                    <FaDiscord className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-white font-bold text-sm">Discord</div>
                    <div className="text-[#5865F2] text-xs font-medium mt-0.5">Join Community</div>
                  </div>
                </a>

                <a href="mailto:support@hostlixo.com"
                  className="group/btn relative overflow-hidden flex flex-col items-center justify-center gap-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 rounded-2xl p-5 transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-300 relative z-10">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center relative z-10">
                    <div className="text-white font-bold text-sm">Email</div>
                    <div className="text-gray-400 text-xs font-medium mt-0.5">Open a Ticket</div>
                  </div>
                </a>
              </div>

              <Link href="/contact"
                className="group relative flex items-center justify-center gap-2 bg-white text-black w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.02] shadow-[0_5px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] overflow-hidden">
                <span className="relative z-10">Contact Support</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
