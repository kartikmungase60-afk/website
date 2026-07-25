import type { MetadataRoute } from "next"

const lastModified = new Date("2026-06-27")

const routes: MetadataRoute.Sitemap = [
  {
    url: "https://hostlixo.com/games/minecraft",
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: "https://hostlixo.com/vps",
    lastModified,
    changeFrequency: "weekly",
    priority: 0.95,
  },
  {
    url: "https://hostlixo.com/discord",
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: "https://hostlixo.com/webhosting",
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes
}
