import { createPageMetadata } from "../seo"
import ServiceSchema from "../components/ServiceSchema"

export const metadata = createPageMetadata({ title: "Game Server Hosting India | Mumbai Game Servers", description: "Host Minecraft, Hytale and Palworld servers from Mumbai, India with NVMe storage, DDoS-filtered connectivity, INR pricing and dashboard control.", path: "/games", keywords: ["game server hosting India", "Mumbai game server", "Minecraft hosting India", "Palworld hosting India", "Hostlixo game hosting"] })
export default function Layout({ children }: { children: React.ReactNode }) {
  return <><ServiceSchema name="Hostlixo India Game Server Hosting" description="India-based game server hosting from Mumbai for Minecraft, Hytale, Palworld and online communities." path="/games" serviceType="Game server hosting" />{children}</>
}
