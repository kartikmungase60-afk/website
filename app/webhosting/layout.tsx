import { createPageMetadata } from "../seo"
import ServiceSchema from "../components/ServiceSchema"

export const metadata = createPageMetadata({ title: "Web Hosting India | Fast NVMe Website Hosting", description: "Host websites, stores and apps with Hostlixo web hosting in India, including SSD or NVMe storage, SSL support, backups, INR pricing and protected infrastructure.", path: "/webhosting", keywords: ["web hosting India", "NVMe web hosting India", "website hosting India", "Mumbai web hosting", "Hostlixo web hosting", "fast web hosting India"] })
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema name="Hostlixo India Web Hosting" description="India-based web hosting for websites, stores and applications with NVMe storage and SSL support." path="/webhosting" serviceType="Website hosting" />{children}</>
}
