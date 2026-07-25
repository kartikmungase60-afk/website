import DiscordPricingSection from '../components/discord/DiscordPricingSection';
import FeaturesSection from "../components/FeaturesSection"
import FAQSection from "../components/FAQSection"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar";
import { getServiceData, transformDbDataForCatalog } from '../lib/db-data';

export const dynamic = "force-dynamic"

export default async function DiscordPage() {
  const dbData = await getServiceData("bot-hosting")
  const { planTypes, plans, locations } = transformDbDataForCatalog(dbData)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] transition-colors duration-300">
      <Navbar />
      <DiscordPricingSection planTypes={planTypes} plans={plans} locations={locations} />
      <FeaturesSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
