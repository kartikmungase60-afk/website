import InfoPage from "../components/InfoPage"
import ContactForm from "../components/ContactForm"
import { createPageMetadata } from "../seo"

export const metadata = createPageMetadata({ title: "Contact Hostlixo India | Mumbai Hosting Support", description: "Contact Hostlixo's India-based team for game hosting, VPS, dedicated cloud, web hosting, billing and account assistance.", path: "/contact", keywords: ["contact Hostlixo India", "Hostlixo support", "Mumbai hosting support"] })

export default function ContactPage() {
  return (
    <InfoPage eyebrow="Contact Hostlixo Cloud" title="Get help choosing, launching or managing your service" description="Use the form below for account-specific requests, service tickets, pre-sales guidance, or access issues. You can also upload screenshots or recordings to help our team understand your inquiry." highlights={["Account and billing assistance through the cloud dashboard", "Deployment and migration guidance for supported services", "Pre-sales help comparing plan resources", "General support email: support@hostlixo.com"]}>
      <ContactForm />
    </InfoPage>
  )
}
