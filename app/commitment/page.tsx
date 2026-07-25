import InfoPage from "../components/InfoPage"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({ title: "Our Commitment as an Indian Hosting Company", description: "Read Hostlixo India's commitment to clear INR billing, responsible operations, protected infrastructure and useful support.", path: "/commitment", keywords: ["Hostlixo India commitment", "Indian hosting support", "transparent INR cloud pricing"] })

export default function CommitmentPage() {
  return <InfoPage eyebrow="Our Commitment" title="Clear cloud hosting without unnecessary complexity" description="Hostlixo Cloud focuses on the operating fundamentals customers depend on: defined resources, stable infrastructure, secure access, understandable billing and communication that respects your time." highlights={["Monthly plan prices displayed in Indian rupees", "Platform monitoring and planned maintenance communication", "DDoS-filtered connectivity and account security controls", "Practical support for account, deployment and service questions"]} />
}
