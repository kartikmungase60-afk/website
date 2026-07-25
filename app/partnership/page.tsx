import InfoPage from "../components/InfoPage"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({ title: "Hostlixo India Hosting Partnerships", description: "Partner with Hostlixo's Mumbai-based team for gaming communities, creators, developers and cloud infrastructure collaborations.", path: "/partnership", keywords: ["Hostlixo India partnership", "Indian game hosting partnership", "Mumbai cloud collaboration"] })

export default function PartnershipPage() {
  return <InfoPage eyebrow="Hostlixo India Partnerships" title="Build dependable online experiences together" description="Our Mumbai-based team works with gaming communities, creators, developers and technology partners across India and beyond." highlights={["Community and creator hosting collaborations", "Resource planning for established projects", "Migration preparation and technical onboarding", "Long-term partnerships with documented expectations"]} />
}
