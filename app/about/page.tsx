import AboutClient from "./AboutClient"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({
  title: "About Hostlixo India | Mumbai Hosting Company",
  description: "Meet Hostlixo, an India-based hosting company headquartered in Mumbai, and learn about our mission, team and cloud infrastructure.",
  path: "/about",
  keywords: ["about Hostlixo", "Hostlixo India", "Mumbai hosting company", "Indian cloud hosting provider", "Hostlixo leadership team"],
})

export default function AboutPage() {
  return (
    <>
      <AboutClient />
    </>
  )
}
