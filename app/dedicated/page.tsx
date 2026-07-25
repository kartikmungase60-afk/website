import Navbar from "../components/Navbar"
import VDSPricingSection from "../components/dedicated/VDSPricingSection"
import HostingComparisonSection from "../components/HostingComparisonSection"
import OSSelectionSection from "../components/vps/OSSelectionSection"
import FeaturesSection from "../components/FeaturesSection"
import FAQSection from "../components/FAQSection"
import Footer from "../components/Footer"

export const dynamic = "force-dynamic"

export default function DedicatedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />
      <VDSPricingSection />
      <HostingComparisonSection product="Dedicated Server" />
      <OSSelectionSection />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
