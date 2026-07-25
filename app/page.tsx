import dynamic from "next/dynamic"

import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WelcomeOfferPopup from "./components/WelcomeOfferPopup"

const WhyHostlixo = dynamic(() => import("./components/WhyHostlixo"))
const InfrastructureHardwareSection = dynamic(() => import("./components/InfrastructureHardwareSection"))
const HomepageTrustComparison = dynamic(() => import("./components/HomepageTrustComparison"))
const TrustSignalsSection = dynamic(() => import("./components/TrustSignalsSection"))
const VerifiedFeedbackSection = dynamic(() => import("./components/VerifiedFeedbackSection"))
const LocationsSection = dynamic(() => import("./components/LocationsSection"))
const PanelShowcase = dynamic(() => import("./components/PanelShowcase"))
const FAQSection = dynamic(() => import("./components/FAQSection"))
const MissionSolutionsSection = dynamic(() => import("./components/MissionSolutionsSection"))


import sectionsConfig from "./config/sections-config.json"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <Navbar />
      {sectionsConfig.WelcomeOfferPopup && <WelcomeOfferPopup />}
      {sectionsConfig.HeroSection && <HeroSection />}
      {sectionsConfig.FeaturesSection && <FeaturesSection />}
      {sectionsConfig.WhyHostlixo && <WhyHostlixo />}
      {sectionsConfig.InfrastructureHardwareSection && <InfrastructureHardwareSection />}
      {sectionsConfig.HomepageTrustComparison && <HomepageTrustComparison />}
      {sectionsConfig.TrustSignalsSection && <TrustSignalsSection />}
      {sectionsConfig.VerifiedFeedbackSection && <VerifiedFeedbackSection />}
      {sectionsConfig.LocationsSection && <LocationsSection />}
      {sectionsConfig.PanelShowcase && <PanelShowcase />}
      {sectionsConfig.FAQSection && <FAQSection />}
      {sectionsConfig.MissionSolutionsSection && <MissionSolutionsSection />}
      <Footer />
    </div>
  )
}
