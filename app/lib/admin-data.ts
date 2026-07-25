import { mkdir, readFile, readdir, writeFile } from "fs/promises"
import path from "path"

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

export type EditableSection = {
  id: string
  label: string
  description: string
  file: string
  data: JsonValue
}

type EditableSectionDefinition = Omit<EditableSection, "data">

const rootDir = process.cwd()

export const editableSections: EditableSectionDefinition[] = [
  {
    id: "homepage",
    label: "Homepage",
    description: "Hero slides and homepage product cards.",
    file: "app/config/sections/homepage.json",
  },
  {
    id: "hero",
    label: "Header and Navbar",
    description: "Navbar logo, brand name, hero games, and partner logos.",
    file: "app/config/sections/hero.json",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Top navigation and menu links.",
    file: "app/config/sections/navigation.json",
  },
  {
    id: "games",
    label: "Game Plans",
    description: "Games, locations, plan types, and game hosting prices.",
    file: "app/config/sections/games.json",
  },
  {
    id: "vps",
    label: "VPS Plans",
    description: "VPS locations, CPU types, and all VPS plans.",
    file: "app/config/sections/vps.json",
  },
  {
    id: "dedicated",
    label: "Dedicated Plans",
    description: "Dedicated/VDS locations, CPU types, and plans.",
    file: "app/config/sections/dedicated.json",
  },
  {
    id: "discord",
    label: "Discord Plans",
    description: "Discord bot hosting plan types and plans.",
    file: "app/config/sections/discord.json",
  },
  {
    id: "sections-config",
    label: "Section Toggles",
    description: "Toggle homepage sections ON or OFF.",
    file: "app/config/sections-config.json",
  },
  {
    id: "messages",
    label: "Support Tickets",
    description: "Incoming support tickets from the contact form.",
    file: "app/config/messages.json",
  },
  {
    id: "webhosting",
    label: "Web Hosting Plans",
    description: "Web hosting plan types and plans.",
    file: "app/config/sections/webhosting.json",
  },
  {
    id: "pricing",
    label: "Legacy Pricing",
    description: "Older pricing section data kept with the project.",
    file: "app/config/sections/pricing.json",
  },
  {
    id: "ui",
    label: "UI Settings",
    description: "Layout and interface settings.",
    file: "app/config/sections/ui.json",
  },
  {
    id: "showcase",
    label: "Showcase",
    description: "Panel showcase images and text.",
    file: "app/config/sections/showcase.json",
  },
  {
    id: "legal",
    label: "Legal Pages",
    description: "Privacy policy and terms page content.",
    file: "app/config/sections/legal.json",
  },
]

function resolveInsideProject(relativeFile: string) {
  const resolved = path.resolve(rootDir, relativeFile)
  if (!resolved.startsWith(rootDir)) {
    throw new Error("File is outside the project.")
  }
  return resolved
}

export async function readEditableSections(): Promise<EditableSection[]> {
  return Promise.all(
    editableSections.map(async (section) => {
      const raw = await readFile(resolveInsideProject(section.file), "utf8")
      return { ...section, data: JSON.parse(raw) as JsonValue }
    }),
  )
}

export async function readEditableSection(sectionId: string): Promise<EditableSection> {
  const section = editableSections.find((item) => item.id === sectionId)
  if (!section) throw new Error("Unknown section.")
  const raw = await readFile(resolveInsideProject(section.file), "utf8")
  return { ...section, data: JSON.parse(raw) as JsonValue }
}

export async function writeEditableSection(sectionId: string, data: JsonValue) {
  const section = editableSections.find((item) => item.id === sectionId)
  if (!section) throw new Error("Unknown section.")
  const filePath = resolveInsideProject(section.file)
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
  return readEditableSection(sectionId)
}

export async function listPublicImages() {
  const publicDir = path.join(rootDir, "public")
  const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".ico"])
  const results: string[] = []

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    for (const entry of entries) {
      const absolute = path.join(currentDir, entry.name)
      if (entry.isDirectory()) {
        await walk(absolute)
        continue
      }

      if (imageExtensions.has(path.extname(entry.name).toLowerCase())) {
        results.push(`/${path.relative(publicDir, absolute).replaceAll("\\", "/")}`)
      }
    }
  }

  await walk(publicDir)
  return results.sort((a, b) => a.localeCompare(b))
}

export async function ensureUploadDirectory() {
  const uploadDir = path.join(rootDir, "public", "uploads", "admin")
  await mkdir(uploadDir, { recursive: true })
  return uploadDir
}
