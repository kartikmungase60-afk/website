import { createPageMetadata } from "../seo"
import ServiceSchema from "../components/ServiceSchema"

export const metadata = createPageMetadata({ title: "Dedicated Server Hosting India | Ryzen VDS Mumbai", description: "Deploy high-capacity AMD Ryzen virtual dedicated servers from an India-based cloud platform with NVMe storage and protected networking.", path: "/dedicated", keywords: ["dedicated server India", "Ryzen VDS India", "Mumbai dedicated hosting", "virtual dedicated server India", "NVMe server India"] })
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema name="Hostlixo India Dedicated Servers" description="High-capacity virtual dedicated servers from an India-based cloud platform with AMD Ryzen compute, NVMe storage and protected connectivity." path="/dedicated" serviceType="Virtual dedicated server hosting" />{children}</>
}
