import { redirect } from "next/navigation"

const supportedGames = new Set(["minecraft", "hytale", "palworld"])

export default async function GamePlansPage({ searchParams }: { searchParams: Promise<{ game?: string }> }) {
  const { game } = await searchParams
  redirect(`/games/${game && supportedGames.has(game) ? game : "minecraft"}`)
}
