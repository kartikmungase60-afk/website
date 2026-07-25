import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Download, FileImage } from "lucide-react"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({
  title: "Hostlixo Cloud Logo & Brand Assets",
  description: "View and download the official Hostlixo Cloud SVG and PNG logo assets, with simple replacement instructions for the website.",
  path: "/logo",
  keywords: ["Hostlixo logo", "Hostlixo Cloud logo", "Hostlixo brand assets"],
})

const assets = [
  {
    name: "Primary SVG logo",
    description: "Used in the website navbar, footer and browser icon metadata.",
    path: "/assets/branding/hostlixo-logo.svg",
    format: "SVG",
  },
  {
    name: "Square PNG logo",
    description: "Used by search engines, structured data and app metadata.",
    path: "/assets/branding/hostlixo-logo.png",
    format: "PNG",
  },
]

export default function LogoPage() {
  return (
    <main className="min-h-screen bg-[#08080d] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-gray-300 hover:text-gray-300">
          <ArrowLeft className="h-4 w-4" /> Back to Hostlixo Cloud
        </Link>

        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-gray-300">Brand assets</p>
          <h1 className="orbitron-font text-4xl font-black sm:text-5xl">Hostlixo Cloud logo</h1>
          <p className="mt-5 leading-7 text-gray-400">
            The website now reads its logo files from one dedicated folder. Replace the files below while keeping their exact filenames and every connected logo placement will update.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Logo downloads">
          {assets.map((asset) => (
            <article key={asset.path} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-6 flex min-h-56 items-center justify-center rounded-xl border border-white/10 bg-black/30 p-8">
                <Image src={asset.path} alt={`${asset.name} preview`} width={150} height={150} className="h-36 w-36 object-contain" />
              </div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-lg font-black">{asset.name}</h2>
                <span className="rounded-md bg-white/15 px-2.5 py-1 text-[10px] font-black tracking-widest text-gray-300">{asset.format}</span>
              </div>
              <p className="mb-5 text-sm leading-6 text-gray-400">{asset.description}</p>
              <a href={asset.path} download className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-bold text-white hover:bg-gray-800">
                <Download className="h-4 w-4" /> Download {asset.format}
              </a>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-white/20 bg-white/[0.06] p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <FileImage className="h-6 w-6 text-gray-300" />
            <h2 className="orbitron-font text-xl font-black">How to add your new logo</h2>
          </div>
          <ol className="grid gap-4 text-sm text-gray-300 sm:grid-cols-2">
            <Step number="1" text="Prepare a transparent square SVG and a 512 x 512 PNG." />
            <Step number="2" text="Name them hostlixo-logo.svg and hostlixo-logo.png." />
            <Step number="3" text="Replace both files inside public/logo in the project." />
            <Step number="4" text="Build and deploy the website. All logo references update automatically." />
          </ol>
        </section>
      </div>
    </main>
  )
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <li className="flex list-none items-start gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gray-800 text-xs font-black">{number}</span>
      <span className="pt-1 leading-6">{text}</span>
      <CheckCircle2 className="ml-auto mt-1 h-4 w-4 flex-none text-gray-300" />
    </li>
  )
}
