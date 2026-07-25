import CompactPricingCatalog from "../CompactPricingCatalog"
import { getServiceData, transformDbDataForCatalog } from "../../lib/db-data"

export default async function WebHostingPricingSection() {
  const dbData = await getServiceData("web-hosting")
  const { planTypes, plans, locations } = transformDbDataForCatalog(dbData)

  return <CompactPricingCatalog kind="Web Hosting" title="Fast & Reliable" accent="#38bdf8" description="Everything you need to host your website, powered by cPanel." hero="/assets/services/web/web-hosting-hero.webp" planTypes={planTypes} plans={plans} />
}
