import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import GameHostingLanding from "../../components/games/GameHostingLanding"
import { getServiceData } from "../../lib/db-data"

export const dynamic = "force-dynamic"

export default async function HytaleHostingPage() { 
  const dbData = await getServiceData("game-hosting")
  return (
    <>
      <Navbar />
      <GameHostingLanding game="hytale" dbData={dbData} />
      <Footer />
    </>
  ) 
}
