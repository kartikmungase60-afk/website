import CompactPricingCatalog from "../CompactPricingCatalog"
import { getServiceData, transformDbDataForCatalog } from "../../lib/db-data"

export default async function VDSPricingSection() {
  const dbData = await getServiceData("dedicated")
  const { planTypes, plans, locations } = transformDbDataForCatalog(dbData)

  return <CompactPricingCatalog kind="Dedicated Server" title="High-Performance" accent="#34d399" description="Bare-metal performance for your most demanding workloads." hero="/assets/services/dedicated/dedicated-server-hero.webp" planTypes={planTypes} plans={plans} locations={locations} />
}
