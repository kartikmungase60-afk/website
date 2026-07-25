import IndiaHostingLanding from "../components/IndiaHostingLanding"
import { createPageMetadata } from "../seo"
export const metadata = createPageMetadata({ title: "VPS Hosting India with NVMe Storage", description: "VPS hosting India with Mumbai availability, AMD Ryzen compute, DDR5 memory, NVMe storage, root access and transparent INR pricing.", path: "/vps-hosting-india", keywords: ["VPS Hosting India", "Cheap VPS Hosting", "Mumbai VPS", "AMD Ryzen VPS India", "NVMe VPS India"] })
export default function Page() { return <IndiaHostingLanding type="vps" /> }
