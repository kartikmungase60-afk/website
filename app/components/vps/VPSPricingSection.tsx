import CompactPricingCatalog from "../CompactPricingCatalog"
import { getServiceData, transformDbDataForCatalog } from "../../lib/db-data"

export default async function VPSPricingSection() {
  const dbData = await getServiceData("vps-hosting")
  const { planTypes, plans, locations } = transformDbDataForCatalog(dbData)
  
  return <CompactPricingCatalog kind="VPS" title="High-Performance" accent="#60a5fa" description="High performance virtual private servers with guaranteed resources." hero="/assets/services/vps/vps-hosting-hero.webp" planTypes={planTypes} plans={plans} locations={locations} />
}
