import { createPageMetadata } from "../seo"
import ServiceSchema from "../components/ServiceSchema"

export const metadata = createPageMetadata({ title: "Discord Bot Hosting | Node.js, Python & Java Bot Hosting", description: "Run Discord bot hosting with Node.js, Python and Java runtimes, automatic restart, logs, databases, file access, monthly pricing and protected Hostlixo infrastructure.", path: "/discord", keywords: ["Discord bot hosting", "bot hosting India", "Node.js bot hosting", "Python bot hosting", "Java bot hosting", "Hostlixo bot hosting"] })
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema name="Hostlixo Cloud Discord Bot Hosting" description="Discord bot hosting for Node.js, Python and Java with automatic restart, file access, databases and protected infrastructure." path="/discord" serviceType="Discord bot and application hosting" />{children}</>
}
