"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Clock3, Globe2, Rocket, ShieldCheck, Users } from "lucide-react"
import { motion, useScroll, useTransform, Variants } from "framer-motion"
import { useRef } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import dynamic from "next/dynamic"
import { MorphText } from "@/components/ui/morph-text"


const TestimonialsCard = dynamic(() => import("@/components/ui/testimonials-card").then(mod => mod.TestimonialsCard), { ssr: false })
const MaskedAvatars = dynamic(() => import("@/components/ui/masked-avatars").then(mod => mod.MaskedAvatars), { ssr: false })

const story = [
  {
    label: "The foundation",
    title: "Hosting built around clarity",
    icon: Rocket,
    body: "Hostlixo Cloud began with a practical goal: make game servers and cloud infrastructure easier to understand, deploy and manage. Clear resources, protected connectivity and one dashboard remain central to that work.",
  },
  {
    label: "Built in India",
    title: "Mumbai roots, broader reach",
    icon: Globe2,
    body: "Hostlixo is based in Mumbai, Maharashtra. Our India-first platform also presents service options in Singapore, Germany and the United States for communities that need broader regional reach.",
  },
  {
    label: "The next chapter",
    title: "A platform that keeps improving",
    icon: ShieldCheck,
    body: "We continue refining the customer dashboard, service plans, documentation and support experience while expanding the infrastructure options available through Hostlixo Cloud.",
  },
]

const values = [
  { icon: ShieldCheck, title: "Earn trust through clarity", text: "Plans should state the assigned resources, region and limits before a customer orders." },
  { icon: Users, title: "Support the person, not the ticket", text: "Useful support explains what happened, what can be changed and what the next step should be." },
  { icon: Globe2, title: "Build for real audiences", text: "Regional choice, practical route testing and accessible documentation matter more than inflated claims." },
]

export const team = [
  {
    name: "Giyu_Tomioko",
    role: "CEO & Founder",
    image: "/assets/team/founder1.webp",
    description: "Leads Hostlixo Cloud's company vision, product direction and long-term infrastructure strategy.",
    featured: true,
  },
  {
    name: "Redrx_",
    role: "Co-Founder & Advisor",
    image: "/assets/team/founder2.gif",
    description: "Advises on company strategy, service development and the experience delivered to customers.",
  },
  {
    name: "Dark Rocky",
    role: "Co-Founder & Advisor",
    image: "/assets/team/founder3.webp",
    description: "Supports strategic planning, platform direction and decisions around sustainable growth.",
  },
  {
    name: "Developer Core",
    role: "COO",
    image: "/assets/team/founder4.webp",
    description: "Coordinates day-to-day operations and helps keep teams, services and customer priorities aligned.",
  },
  {
    name: "Kartik",
    role: "Developer",
    image: "/assets/team/kartik.jpg",
    description: "Develops and maintains the core infrastructure, ensuring high performance and reliable systems.",
  },
]

const supportTeam = [
  {
    name: "Mine X",
    role: "Support Team",
    image: "/assets/team/mine-x.png",
  },
  {
    name: "Starline playz",
    role: "Support Team",
    image: "/assets/team/starline-playz.webp",
  }
]

const teamSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hostlixo.com/#organization",
  name: "Hostlixo Cloud",
  founder: {
    "@type": "Person",
    name: "Giyu_Tomioko",
    jobTitle: "CEO & Founder",
  },
  employee: team.slice(1).map((member) => ({
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
  })),
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

export default function AboutClient() {
  const containerRef = useRef(null)

  return (
    <>
      <div className="min-h-screen bg-[#000000] text-white selection:bg-white/20 transform-gpu" ref={containerRef}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />
        <Navbar />

        <main className="relative z-10">
          {/* HERO SECTION */}
          <section className="relative overflow-hidden px-4 pb-24 pt-40 sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 -z-10 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mx-auto max-w-5xl text-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 text-xs font-black uppercase tracking-[0.25em] text-gray-300 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                <Users className="h-4 w-4" /> The people behind Hostlixo
              </motion.div>
              
              <div className="orbitron-font text-5xl font-black leading-[1.2] sm:text-6xl lg:text-7xl drop-shadow-2xl flex flex-col items-center justify-center">
                <h1 className="text-center">Built by people who care about</h1>
                <div className="mt-2 text-white pb-4 h-[1.5em] flex items-center justify-center w-full">
                  <MorphText 
                    words={[
                      "reliability",
                      "security",
                      "performance",
                      "clarity"
                    ]}
                    fontSize="clamp(3rem, 7vw, 6rem)"
                    textClassName="text-white"
                  />
                </div>
              </div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mx-auto mt-8 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg"
              >
                Hostlixo Cloud is an India-based hosting company headquartered in Mumbai, providing game servers, VPS, dedicated compute, bot hosting and websites with additional regional options in Singapore, Germany and the USA.
              </motion.p>
            </motion.div>
          </section>

          {/* OUR STORY TIMELINE */}
          <section className="relative px-4 py-24 sm:px-6 lg:px-8 border-t border-white/[0.04] bg-gradient-to-b from-[#0a0a0f] to-transparent" aria-labelledby="story-heading">
            <div className="mx-auto max-w-5xl">
              <SectionHeading eyebrow="Our journey" title="Our Story" id="story-heading" />
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative mt-20 space-y-8 before:absolute before:bottom-12 before:left-[31px] before:top-8 before:w-px before:bg-gradient-to-b before:from-white/20 before:via-white/10 before:to-transparent sm:before:left-[39px]"
              >
                {story.map(({ label, title, icon: Icon, body }, index) => (
                  <motion.article 
                    key={title} 
                    variants={itemVariants}
                    className="group relative grid gap-6 pl-20 sm:grid-cols-[80px_1fr] sm:pl-0"
                  >
                    <div className="absolute left-0 top-0 z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#000000] text-gray-400 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/5 group-hover:text-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] sm:relative sm:h-20 sm:w-20">
                      <Icon className="h-7 w-7 transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className={`relative overflow-hidden rounded-3xl border p-8 transition-colors duration-500 ${index === story.length - 1 ? "border-white/20 bg-white/5" : "border-white/5 bg-[#0a0a0f] group-hover:border-white/15"}`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="relative z-10 inline-flex rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-300">{label}</span>
                      <h2 className="relative z-10 mt-5 text-2xl font-black text-white">{title}</h2>
                      <p className="relative z-10 mt-4 text-base leading-7 text-gray-400">{body}</p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CUSTOMER PROTECTION BANNER */}
          <section className="px-4 py-24 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f] p-10 sm:p-12 max-w-6xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-transparent opacity-30 transition-opacity duration-700 group-hover:opacity-50" />
              <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay transform-gpu" />
              
              <div className="relative z-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                    <Clock3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Customer protection</p>
                    <h2 className="text-3xl font-black text-white tracking-tight">24-hour refund request window</h2>
                    <p className="mt-3 text-base leading-7 text-gray-400 max-w-2xl">Eligible first-time service purchases may request a refund within 24 hours of activation, subject to the exclusions in our Refund Policy.</p>
                  </div>
                </div>
                <Link href="/refund-policy" className="shrink-0 group/btn relative inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-black text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  Read policy <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </section>

          {/* MISSION & VALUES (BENTO) */}
          <section className="border-y border-white/[0.04] bg-[#000000] px-4 py-32 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="mission-heading">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.03),transparent_50%)]" />
            
            <div className="mx-auto max-w-7xl relative z-10">
              <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col justify-center"
                >
                  <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-gray-300 w-fit">Our mission</p>
                  <h2 id="mission-heading" className="mt-6 text-4xl font-black sm:text-5xl tracking-tight leading-[1.1]">Make serious hosting easier to evaluate and operate.</h2>
                  <p className="mt-6 text-base leading-8 text-gray-400">Hostlixo combines clearly defined resources, regional infrastructure and practical support so builders can choose with confidence. We publish what is known, label what varies by plan, and avoid turning unverified numbers into marketing claims.</p>
                  
                  <div className="mt-10 grid grid-cols-3 gap-4">
                    <MissionStat value="4" label="Regions" />
                    <MissionStat value="24/7" label="Monitoring" />
                    <MissionStat value="1" label="Dashboard" />
                  </div>
                </motion.div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {values.map(({ icon: Icon, title, text }, i) => (
                    <motion.article 
                      key={title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0f] p-8 transition-all hover:border-white/15 hover:bg-white/[0.03] ${i === 2 ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 shadow-lg">
                        <Icon className="h-6 w-6 text-gray-300 transition-transform group-hover:scale-110" />
                      </span>
                      <h3 className="relative z-10 mt-6 text-xl font-black text-white">{title}</h3>
                      <p className="relative z-10 mt-3 text-sm leading-7 text-gray-400">{text}</p>
                    </motion.article>
                  ))}
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 sm:p-12 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay transform-gpu" />
                <div className="relative z-10 grid gap-10 sm:grid-cols-3">
                  <Roadmap phase="Now" title="Clearer infrastructure" text="Keep product hardware, network scope and checkout resources consistent." />
                  <Roadmap phase="Next" title="Verified benchmark data" text="Connect repeatable node results when operations can verify and publish them." />
                  <Roadmap phase="Future" title="More regional choice" text="Expand carefully where customer demand and route quality justify it." />
                </div>
              </motion.div>
            </div>
          </section>

          {/* TEAM & SUPPORT SECTION */}
          <section className="relative px-4 py-32 sm:px-6 lg:px-8 overflow-hidden" aria-labelledby="team-heading">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] rounded-full pointer-events-none transform-gpu" />
            
            <div className="relative z-10 mx-auto max-w-7xl">
              <SectionHeading eyebrow="The people behind Hostlixo" title="Meet Our Team" id="team-heading" description="A Mumbai-based team focused on building clear, dependable and accessible hosting for India and customers worldwide." />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-20 flex flex-col items-center w-full"
              >
                <TestimonialsCard 
                  items={team.map(member => ({
                    id: member.name,
                    title: `${member.name} - ${member.role}`,
                    description: member.description,
                    image: member.image
                  }))}
                  className="w-full max-w-5xl !bg-transparent"
                  width={900}
                  autoPlay={false}
                />
                
                <div className="mt-24 pt-16 border-t border-white/10 w-full max-w-4xl text-center flex flex-col items-center justify-center">
                  <h3 className="orbitron-font text-3xl font-black mb-10 tracking-tight">Our Support Team</h3>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-md shadow-2xl w-full transform-gpu">
                    <div className="flex w-full justify-center">
                      <MaskedAvatars 
                        avatars={supportTeam.map(member => ({
                          avatar: member.image,
                          name: member.name
                        }))}
                      />
                    </div>
                    <p className="mt-8 text-sm text-gray-400 max-w-lg mx-auto">Available around the clock to assist you with infrastructure setup, migration, and troubleshooting.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* BOTTOM CTA */}
          <section className="px-4 pb-32 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-10 rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-12 sm:flex-row sm:items-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
              
              <div className="relative z-10 max-w-xl">
                <p className="text-3xl font-black text-white tracking-tight">Build with Hostlixo Cloud</p>
                <p className="mt-4 text-base leading-7 text-gray-300">Explore our high-performance hosting plans or speak with the team through our dedicated support channels.</p>
              </div>
              
              <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
                <Link href="/games" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-black text-black transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Explore hosting
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="https://discord.gg/hostlixo" className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-black/40 backdrop-blur-sm px-8 py-4 text-sm font-black text-white transition-all hover:bg-white/10 hover:border-white/40">
                  Join Discord
                </a>
              </div>
            </motion.div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

function SectionHeading({ eyebrow, title, id, description }: { eyebrow: string; title: string; id: string; description?: string }) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-[2px] w-8 bg-gradient-to-r from-transparent to-white/50 rounded-full" />
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-300">{eyebrow}</p>
        <span className="h-[2px] w-8 bg-gradient-to-l from-transparent to-white/50 rounded-full" />
      </div>
      <h2 id={id} className="orbitron-font text-4xl font-black sm:text-5xl tracking-tight text-white">{title}</h2>
      {description && <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400">{description}</p>}
    </motion.header>
  )
}

function MissionStat({ value, label }: { value: string; label: string }) { 
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center transition-all hover:bg-white/10 hover:border-white/20">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{label}</p>
    </div>
  ) 
}

function Roadmap({ phase, title, text }: { phase: string; title: string; text: string }) { 
  return (
    <article className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-[2px] before:bg-white/20 before:rounded-full">
      <div className="absolute left-[-3px] top-1.5 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-300">{phase}</p>
      <h3 className="mt-3 text-lg font-black text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-gray-400">{text}</p>
    </article>
  ) 
}
