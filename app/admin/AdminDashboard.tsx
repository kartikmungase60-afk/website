"use client"

import { formatDistanceToNow } from "date-fns"
import AdminLoginForm from "./AdminLoginForm"
import DatabasePlansTab from "./DatabasePlansTab"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Boxes,
  CircleDollarSign,
  Copy,
  Crop,
  DatabaseBackup,
  FlipHorizontal,
  FlipVertical,
  FileJson,
  FileText,
  Globe2,
  Home,
  ImageIcon,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Save,
  Search,
  Server,
  Settings,
  Shield,
  SlidersHorizontal,
  Trash2,
  Upload,
  Users,
  Wand2,
  X,
} from "lucide-react"

type JsonObject = Record<string, unknown>

type EditableSection = {
  id: string
  label: string
  description: string
  file: string
  data: unknown
}

type AdminUser = {
  id: string
  name: string
  email: string
  role: "admin" | "editor"
  createdAt: string
  twoFactorEnabled?: boolean
}

type Backup = {
  id: string
  createdAt: string
  path: string
}

type PlanPath =
  | { kind: "plans"; group: string }
  | { kind: "game"; gameIndex: number; group: string }

type PlanGroup = {
  key: string
  label: string
  path: PlanPath
  plans: JsonObject[]
}

type ViewId = "overview" | "content" | "plans" | "homepage" | "toggles" | "tickets" | "site" | "navigation" | "assets" | "users" | "backups" | "json" | "logs"

type ContentField = {
  id: string
  path: Array<string | number>
  label: string
  value: string | number | boolean
  kind: "text" | "number" | "boolean" | "image" | "link"
}

type ImageEditorState = {
  brightness: number
  contrast: number
  saturation: number
  grayscale: number
  blur: number
  rotate: number
  flipX: boolean
  flipY: boolean
  outputWidth: string
  outputHeight: string
  format: "image/png" | "image/jpeg" | "image/webp"
  fileName: string
}

const planSectionIds = ["games", "vps", "dedicated", "discord", "webhosting"]

const planFields = [
  "id",
  "name",
  "badge",
  "price",
  "period",
  "cpu",
  "cpuDetail",
  "ram",
  "ramDetail",
  "storage",
  "storageDetail",
  "bandwidth",
  "bandwidthDetail",
  "uptime",
  "image",
  "icon",
  "banner",
  "thumbnail",
  "description",
  "startingAt",
  "orderLink",
  "href",
  "cta",
  "outOfStock",
]

const imageFields = new Set(["image", "icon", "banner", "thumbnail", "flag", "logo", "src"])

const views: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "All Content", icon: Wand2 },
  { id: "plans", label: "Plans", icon: Server },
  { id: "homepage", label: "Homepage", icon: Home },
  { id: "toggles", label: "Section Toggles", icon: SlidersHorizontal },
  { id: "tickets", label: "Support Tickets", icon: Boxes },
  { id: "site", label: "Site Identity", icon: Settings },
  { id: "navigation", label: "Navigation", icon: Menu },
  { id: "assets", label: "Images", icon: ImageIcon },
  { id: "users", label: "Users", icon: Users },
  { id: "backups", label: "Backups", icon: DatabaseBackup },
  { id: "logs", label: "Server Logs", icon: FileText },
  { id: "json", label: "Advanced JSON", icon: FileJson },
]

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(options?.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(typeof data?.error === "string" ? data.error : "Request failed.")
  }
  return data as T
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function asText(value: unknown) {
  if (value === undefined || value === null) return ""
  return String(value)
}

function formatJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}

function ensureObject(parent: JsonObject, key: string) {
  if (isObject(parent[key])) return parent[key] as JsonObject
  const next: JsonObject = {}
  parent[key] = next
  return next
}

function ensureArray(parent: JsonObject, key: string) {
  if (Array.isArray(parent[key])) return parent[key] as unknown[]
  const next: unknown[] = []
  parent[key] = next
  return next
}

function coerce(previous: unknown, value: string) {
  if (typeof previous === "number") {
    const next = Number(value)
    return Number.isFinite(next) ? next : previous
  }
  if (typeof previous === "boolean") return value === "true"
  return value
}

function linesToArray(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean)
}

function csvToArray(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean)
}

function fieldKind(path: Array<string | number>, value: unknown): ContentField["kind"] {
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "number") return "number"
  const last = String(path[path.length - 1] || "").toLowerCase()
  const text = asText(value)
  if (imageFields.has(last) || /\.(png|jpe?g|webp|svg|gif|ico)(\?.*)?$/i.test(text)) return "image"
  if (last.includes("href") || last.includes("link") || /^https?:\/\//i.test(text) || text.startsWith("/")) return "link"
  return "text"
}

function contentFieldLabel(path: Array<string | number>) {
  return path.map((item) => typeof item === "number" ? `#${item + 1}` : item.replace(/([a-z])([A-Z])/g, "$1 $2")).join(" / ")
}

function collectContentFields(value: unknown, path: Array<string | number> = []): ContentField[] {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [{
      id: path.join("."),
      path,
      label: contentFieldLabel(path),
      value,
      kind: fieldKind(path, value),
    }]
  }

  if (Array.isArray(value)) {
    if (value.every((item) => ["string", "number", "boolean"].includes(typeof item))) {
      return [{
        id: path.join("."),
        path,
        label: contentFieldLabel(path),
        value: value.map(String).join("\n"),
        kind: "text",
      }]
    }
    return value.flatMap((item, index) => collectContentFields(item, [...path, index]))
  }

  if (isObject(value)) {
    return Object.entries(value).flatMap(([key, child]) => collectContentFields(child, [...path, key]))
  }

  return []
}

function setValueAtPath(target: JsonObject, path: Array<string | number>, rawValue: string | boolean, previous: unknown) {
  let cursor: unknown = target
  for (let index = 0; index < path.length - 1; index += 1) {
    if (!isObject(cursor) && !Array.isArray(cursor)) return
    cursor = (cursor as Record<string | number, unknown>)[path[index]]
  }

  if (!isObject(cursor) && !Array.isArray(cursor)) return
  const key = path[path.length - 1]
  const nextValue = Array.isArray(previous)
    ? linesToArray(String(rawValue))
    : typeof rawValue === "boolean"
      ? rawValue
      : coerce(previous, String(rawValue))
  ;(cursor as Record<string | number, unknown>)[key] = nextValue
}

function getValueAtPath(target: unknown, path: Array<string | number>) {
  return path.reduce<unknown>((cursor, key) => {
    if (!isObject(cursor) && !Array.isArray(cursor)) return undefined
    return (cursor as Record<string | number, unknown>)[key]
  }, target)
}

function planGroupsFor(section?: EditableSection): PlanGroup[] {
  if (!section || !isObject(section.data)) return []

  if (section.id === "games" && Array.isArray(section.data.games)) {
    return section.data.games.flatMap((game, gameIndex) => {
      if (!isObject(game) || !isObject(game.plans)) return []
      const gameName = asText(game.name) || `Game ${gameIndex + 1}`
      return Object.entries(game.plans).flatMap(([group, plans]) => {
        if (!Array.isArray(plans)) return []
        return [{
          key: `${gameIndex}:${group}`,
          label: `${gameName} / ${group}`,
          path: { kind: "game" as const, gameIndex, group },
          plans: plans.filter(isObject),
        }]
      })
    })
  }

  if (!isObject(section.data.plans)) return []
  return Object.entries(section.data.plans).flatMap(([group, plans]) => {
    if (!Array.isArray(plans)) return []
    return [{
      key: group,
      label: group,
      path: { kind: "plans" as const, group },
      plans: plans.filter(isObject),
    }]
  })
}

function planArray(data: JsonObject, path: PlanPath) {
  if (path.kind === "plans") {
    const plans = data.plans
    if (!isObject(plans) || !Array.isArray(plans[path.group])) return null
    return plans[path.group] as unknown[]
  }

  const games = data.games
  if (!Array.isArray(games)) return null
  const game = games[path.gameIndex]
  if (!isObject(game) || !isObject(game.plans) || !Array.isArray(game.plans[path.group])) return null
  return game.plans[path.group] as unknown[]
}

function newPlanFrom(template?: JsonObject) {
  const source = template || { id: "", name: "", price: "0", period: "/mo", orderLink: "https://control.hostlixo.com" }
  const plan: JsonObject = {}
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) plan[key] = []
    else if (typeof value === "number") plan[key] = 0
    else if (typeof value === "boolean") plan[key] = false
    else if (isObject(value)) plan[key] = {}
    else plan[key] = ""
  }
  plan.id = `new-plan-${Date.now()}`
  plan.name = "New Plan"
  if (!("price" in plan)) plan.price = "0"
  if (!("period" in plan)) plan.period = "/mo"
  return plan
}

function countPlans(sections: EditableSection[]) {
  return sections.filter((section) => planSectionIds.includes(section.id)).reduce((total, section) => {
    return total + planGroupsFor(section).reduce((inner, group) => inner + group.plans.length, 0)
  }, 0)
}

function fieldClass(extra = "") {
  return `w-full rounded-md border border-white/10 bg-[#0d0f14] px-3 py-2 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-white/40 focus:ring-2 focus:ring-white/10 ${extra}`
}

function buttonClass(extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-gray-200 transition hover:border-white/30 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60 ${extra}`
}

function primaryButtonClass(extra = "") {
  return `inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-black text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 ${extra}`
}

function Panel({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
}: {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#11131a] shadow-[0_18px_70px_rgba(0,0,0,.28)]">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
              <Icon className="h-5 w-5 text-gray-200" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-black text-white">{title}</h2>
            {subtitle && <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className={fieldClass()} />
    </label>
  )
}

function TextAreaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} className={fieldClass("resize-y")} />
    </label>
  )
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass()}>
        {children}
      </select>
    </label>
  )
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-2">
        <div className="h-10 w-12 overflow-hidden rounded-md border border-white/10 bg-[#090b10]">
          {value.startsWith("/") && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>
        <input value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass()} />
      </div>
    </label>
  )
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex h-full min-h-[62px] items-center justify-between gap-3 rounded-md border border-white/10 bg-[#0d0f14] px-3 py-2">
      <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">{label}</span>
      <input type="checkbox" checked={value} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 rounded border-white/20 bg-black text-white" />
    </label>
  )
}

export default function AdminDashboard() {
  const [checkingSession, setCheckingSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<ViewId>("overview")
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginToken, setLoginToken] = useState("")
  const [requires2FA, setRequires2FA] = useState(false)
  const [requires2FASetup, setRequires2FASetup] = useState(false)
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ secret: string; qr: string } | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [sections, setSections] = useState<EditableSection[]>([])
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [assets, setAssets] = useState<string[]>([])
  const [backups, setBackups] = useState<Backup[]>([])
  const [status, setStatus] = useState("")
  const [selectedPlanSectionId, setSelectedPlanSectionId] = useState("vps")
  const [selectedPlanGroupKey, setSelectedPlanGroupKey] = useState("")
  const [selectedJsonSectionId, setSelectedJsonSectionId] = useState("homepage")
  const [jsonDraft, setJsonDraft] = useState("")
  const [assetSearch, setAssetSearch] = useState("")
  const [selectedContentSectionId, setSelectedContentSectionId] = useState("homepage")
  const [contentSearch, setContentSearch] = useState("")
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "editor" as "admin" | "editor" })
  const [passwordDrafts, setPasswordDrafts] = useState<Record<string, string>>({})

  const selectedPlanSection = sections.find((section) => section.id === selectedPlanSectionId)
  const planGroups = useMemo(() => planGroupsFor(selectedPlanSection), [selectedPlanSection])
  const currentPlanGroup = planGroups.find((group) => group.key === selectedPlanGroupKey) ?? planGroups[0]
  const selectedJsonSection = sections.find((section) => section.id === selectedJsonSectionId)
  const selectedContentSection = sections.find((section) => section.id === selectedContentSectionId) ?? sections[0]
  const homepageSection = sections.find((section) => section.id === "homepage")
  const heroSection = sections.find((section) => section.id === "hero")
  const navigationSection = sections.find((section) => section.id === "navigation")
  const filteredAssets = assets.filter((asset) => asset.toLowerCase().includes(assetSearch.toLowerCase()))

  async function loadAll() {
    setLoading(true)
    setStatus("")
    try {
      const [contentData, usersData, assetsData, backupsData] = await Promise.all([
        requestJson<{ sections: EditableSection[] }>("/api/admin/content"),
        requestJson<{ users: AdminUser[] }>("/api/admin/users"),
        requestJson<{ assets: string[] }>("/api/admin/assets"),
        requestJson<{ backups: Backup[] }>("/api/admin/backups"),
      ])
      setSections(contentData.sections)
      setAdminUsers(usersData.users)
      setAssets(assetsData.assets)
      setBackups(backupsData.backups)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load admin data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    requestJson<{ user: AdminUser }>("/api/admin/session")
      .then((data) => {
        setUser(data.user)
        return loadAll()
      })
      .catch(() => undefined)
      .finally(() => setCheckingSession(false))
  }, [])

  useEffect(() => {
    if (planGroups.length && !planGroups.some((group) => group.key === selectedPlanGroupKey)) {
      setSelectedPlanGroupKey(planGroups[0].key)
    }
  }, [planGroups, selectedPlanGroupKey])

  useEffect(() => {
    if (selectedJsonSection) setJsonDraft(formatJson(selectedJsonSection.data))
  }, [selectedJsonSectionId, selectedJsonSection])

  function updateSectionData(sectionId: string, data: unknown) {
    setSections((current) => current.map((section) => section.id === sectionId ? { ...section, data } : section))
  }

  function mutateSection(sectionId: string, mutator: (data: JsonObject) => void) {
    const section = sections.find((item) => item.id === sectionId)
    if (!section || !isObject(section.data)) return
    const next = clone(section.data)
    mutator(next)
    updateSectionData(sectionId, next)
  }

  async function saveSection(sectionId: string, data: unknown) {
    setLoading(true)
    setStatus("")
    try {
      const result = await requestJson<{ section: EditableSection }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({ sectionId, data }),
      })
      setSections((current) => current.map((section) => section.id === sectionId ? result.section : section))
      setStatus("Saved changes.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save changes.")
    } finally {
      setLoading(false)
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setStatus("")
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, token: loginToken }),
      })
      const data = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        if (data.requires2FA) {
          setRequires2FA(true)
          setStatus("Two-Factor Authentication code is required.")
        } else {
          setStatus(data.error || "Login failed.")
        }
        setLoading(false)
        return
      }

      setUser(data.user)
      setLoginPassword("")
      setLoginToken("")
      setRequires2FA(false)
      
      if (!data.user.twoFactorEnabled) {
        setRequires2FASetup(true)
        start2FASetup()
      } else {
        await loadAll()
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.")
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await requestJson("/api/admin/logout", { method: "POST" }).catch(() => undefined)
    setUser(null)
    setSections([])
    setAdminUsers([])
    setAssets([])
    setBackups([])
  }

  function mutatePlan(path: PlanPath, planIndex: number, mutator: (plan: JsonObject) => void) {
    if (!selectedPlanSection || !isObject(selectedPlanSection.data)) return
    const next = clone(selectedPlanSection.data)
    const plans = planArray(next, path)
    const plan = plans?.[planIndex]
    if (!plans || !isObject(plan)) return
    mutator(plan)
    updateSectionData(selectedPlanSection.id, next)
  }

  function addPlan(path: PlanPath) {
    if (!selectedPlanSection || !isObject(selectedPlanSection.data)) return
    const next = clone(selectedPlanSection.data)
    const plans = planArray(next, path)
    if (!plans) return
    plans.push(newPlanFrom(plans.find(isObject)))
    updateSectionData(selectedPlanSection.id, next)
  }

  function deletePlan(path: PlanPath, planIndex: number) {
    if (!selectedPlanSection || !isObject(selectedPlanSection.data)) return
    if (!window.confirm("Delete this plan?")) return
    const next = clone(selectedPlanSection.data)
    const plans = planArray(next, path)
    if (!plans) return
    plans.splice(planIndex, 1)
    updateSectionData(selectedPlanSection.id, next)
  }

  async function saveJsonDraft() {
    if (!selectedJsonSection) return
    try {
      const parsed = JSON.parse(jsonDraft)
      updateSectionData(selectedJsonSection.id, parsed)
      await saveSection(selectedJsonSection.id, parsed)
    } catch {
      setStatus("The JSON has a syntax error.")
    }
  }

  async function uploadAsset(file?: File) {
    if (!file) return
    setLoading(true)
    setStatus("")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const data = await requestJson<{ path: string; assets: string[] }>("/api/admin/assets", { method: "POST", body: formData })
      setAssets(data.assets)
      setStatus(`Uploaded ${data.path}`)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed.")
    } finally {
      setLoading(false)
    }
  }

  async function saveEditedAsset(dataUrl: string, fileName: string) {
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ path: string; assets: string[] }>("/api/admin/assets", {
        method: "PUT",
        body: JSON.stringify({ dataUrl, fileName }),
      })
      setAssets(data.assets)
      setStatus(`Saved edited image ${data.path}`)
      return data.path
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save edited image.")
      return ""
    } finally {
      setLoading(false)
    }
  }

  async function deleteAsset(path: string) {
    if (!window.confirm("Delete this uploaded image?")) return
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ assets: string[] }>(`/api/admin/assets?path=${encodeURIComponent(path)}`, { method: "DELETE" })
      setAssets(data.assets)
      setStatus("Image deleted.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete image.")
    } finally {
      setLoading(false)
    }
  }

  async function copyPath(path: string) {
    await navigator.clipboard?.writeText(path).catch(() => undefined)
    setStatus(`Copied ${path}`)
  }

  async function createBackup() {
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ backups: Backup[] }>("/api/admin/backups", { method: "POST" })
      setBackups(data.backups)
      setStatus("Backup created.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create backup.")
    } finally {
      setLoading(false)
    }
  }

  async function createUser(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ users: AdminUser[] }>("/api/admin/users", { method: "POST", body: JSON.stringify(newUser) })
      setAdminUsers(data.users)
      setNewUser({ name: "", email: "", password: "", role: "editor" })
      setStatus("User created.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not create user.")
    } finally {
      setLoading(false)
    }
  }

  async function saveUser(target: AdminUser) {
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ users: AdminUser[] }>("/api/admin/users", {
        method: "PATCH",
        body: JSON.stringify({ ...target, password: passwordDrafts[target.id] || "" }),
      })
      setAdminUsers(data.users)
      setPasswordDrafts((current) => ({ ...current, [target.id]: "" }))
      setStatus("User saved.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save user.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Delete this user?")) return
    setLoading(true)
    setStatus("")
    try {
      const data = await requestJson<{ users: AdminUser[] }>(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" })
      setAdminUsers(data.users)
      setStatus("User deleted.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to load site configurations.")
    } finally {
      setLoading(false)
    }
  }

  async function start2FASetup() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/2fa")
      const data = await res.json()
      if (data.secret && data.qrCodeDataUrl) {
        setTwoFactorSetup({ secret: data.secret, qr: data.qrCodeDataUrl })
      }
    } finally {
      setLoading(false)
    }
  }

  async function verify2FASetup() {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: twoFactorSetup?.secret, token: twoFactorCode })
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Invalid token.")
        return
      }
      setTwoFactorSetup(null)
      setTwoFactorCode("")
      setRequires2FASetup(false)
      setUser((current) => current ? { ...current, twoFactorEnabled: true } : current)
      alert("2FA Enabled Successfully!")
      await loadAll()
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07080c] px-4 text-white">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#11131a] px-5 py-4 text-sm text-gray-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          Opening admin
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <AdminLoginForm
        login={login}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        loginToken={loginToken}
        setLoginToken={setLoginToken}
        requires2FA={requires2FA}
        status={status}
        loading={loading}
      />
    )
  }

  if (requires2FASetup || (user && !user.twoFactorEnabled)) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07080c] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11131a] p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20">
            <Shield className="h-6 w-6 text-indigo-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Mandatory 2FA Setup</h2>
          <p className="mb-6 text-sm text-gray-400">
            For security reasons, two-factor authentication is required for all admin accounts. 
            Please set it up now to access the dashboard.
          </p>
          
          {loading && !twoFactorSetup ? (
            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>
          ) : twoFactorSetup ? (
            <div className="text-center">
              <p className="mb-3 text-sm text-gray-300">1. Scan this code with your authenticator app</p>
              <div className="mx-auto mb-4 inline-block rounded bg-white p-2">
                <img src={twoFactorSetup.qr} alt="2FA QR Code" className="h-40 w-40" />
              </div>
              <p className="mb-3 text-sm text-gray-300">2. Enter the 6-digit code</p>
              <div className="mx-auto flex max-w-[200px] flex-col gap-3">
                <input 
                  type="text" 
                  value={twoFactorCode} 
                  onChange={(e) => setTwoFactorCode(e.target.value)} 
                  placeholder="000000" 
                  maxLength={6}
                  className="w-full rounded-lg border border-white/10 bg-[#0d0f14] px-4 py-3 text-center text-xl font-bold tracking-[0.2em] text-white outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30"
                />
                <button 
                  type="button" 
                  onClick={verify2FASetup} 
                  disabled={loading || twoFactorCode.length !== 6} 
                  className={primaryButtonClass("w-full")}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Enable"}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={start2FASetup} className={primaryButtonClass()}>Begin Setup</button>
          )}
          
          <button type="button" onClick={logout} className="mt-6 text-xs text-gray-500 hover:text-white">Cancel & Logout</button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      {/* Background grid removed for cleaner professional look */}

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col border-r border-white/10 bg-[#0c0e13]/95 p-4 backdrop-blur-xl transition-transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-500">Hostlixo</p>
            <h1 className="mt-1 text-xl font-black">Admin Control</h1>
          </div>
          <button type="button" onClick={() => setSidebarOpen(false)} className={buttonClass("md:hidden")}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <nav className="grid gap-1.5 relative">
            {views.map((item) => {
              const Icon = item.icon
              const active = view === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setView(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`relative flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                    active ? "bg-white text-black shadow-sm" : "text-gray-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-4 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-sm font-black text-white">{user.name}</p>
          <p className="mt-1 truncate text-xs text-gray-500">{user.email}</p>
          <button type="button" onClick={logout} className={buttonClass("mt-3 w-full")}>
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="relative z-10 md:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07080c]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Open admin menu" onClick={() => setSidebarOpen(true)} className={buttonClass("md:hidden")}>
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Control Panel</p>
                <h2 className="text-xl font-black">{views.find((item) => item.id === view)?.label}</h2>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              <button type="button" onClick={loadAll} className={buttonClass()}>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <a href="/" target="_blank" rel="noreferrer" className={buttonClass()}>
                <Globe2 className="h-4 w-4" />
                Preview
              </a>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {status && <div className="mb-5 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200">{status}</div>}

          {view === "overview" && (
            <OverviewView
              sections={sections}
              assets={assets}
              users={adminUsers}
              backups={backups}
              setView={setView}
              createBackup={createBackup}
            />
          )}

          {view === "logs" && <LogsView />}

          {view === "content" && selectedContentSection && (
            <ContentStudioView
              sections={sections}
              selectedSection={selectedContentSection}
              selectedSectionId={selectedContentSectionId}
              setSelectedSectionId={setSelectedContentSectionId}
              search={contentSearch}
              setSearch={setContentSearch}
              mutateSection={mutateSection}
              saveSection={saveSection}
              loading={loading}
            />
          )}

          {view === "plans" && (
            <DatabasePlansTab />
          )}

          {view === "homepage" && homepageSection && (
            <HomepageView section={homepageSection} mutateSection={mutateSection} saveSection={saveSection} loading={loading} />
          )}

          {view === "site" && heroSection && (
            <SiteIdentityView section={heroSection} mutateSection={mutateSection} saveSection={saveSection} loading={loading} />
          )}

          {view === "navigation" && navigationSection && (
            <NavigationView section={navigationSection} mutateSection={mutateSection} saveSection={saveSection} loading={loading} />
          )}

          {view === "assets" && (
            <AssetsView
              assets={filteredAssets}
              allAssets={assets}
              search={assetSearch}
              setSearch={setAssetSearch}
              uploadAsset={uploadAsset}
              saveEditedAsset={saveEditedAsset}
              deleteAsset={deleteAsset}
              copyPath={copyPath}
            />
          )}

          {view === "users" && (
            <UsersView
              currentUser={user!}
              users={adminUsers}
              setUsers={setAdminUsers}
              passwordDrafts={passwordDrafts}
              setPasswordDrafts={setPasswordDrafts}
              newUser={newUser}
              setNewUser={setNewUser}
              createUser={createUser}
              saveUser={saveUser}
              deleteUser={deleteUser}
              loading={loading}
            />
          )}

          {view === "backups" && <BackupsView backups={backups} createBackup={createBackup} loading={loading} />}

          {view === "toggles" && <TogglesView sections={sections} saveSection={saveSection} loading={loading} />}

          {view === "tickets" && <TicketsView sections={sections} />}

          {view === "json" && (
            <JsonView
              sections={sections}
              selectedJsonSectionId={selectedJsonSectionId}
              setSelectedJsonSectionId={setSelectedJsonSectionId}
              jsonDraft={jsonDraft}
              setJsonDraft={setJsonDraft}
              saveJsonDraft={saveJsonDraft}
              loading={loading}
            />
          )}
        </div>
      </div>
    </main>
  )
}

function OverviewView({
  sections,
  assets,
  users,
  backups,
  setView,
  createBackup,
}: {
  sections: EditableSection[]
  assets: string[]
  users: AdminUser[]
  backups: Backup[]
  setView: (view: ViewId) => void
  createBackup: () => void
}) {
  const stats = [
    { label: "Editable Sections", value: sections.length, icon: FileJson },
    { label: "Total Plans", value: countPlans(sections), icon: CircleDollarSign },
    { label: "Image Assets", value: assets.length, icon: ImageIcon },
    { label: "Admin Users", value: users.length, icon: Users },
  ]

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-[#11131a] p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <Icon className="h-5 w-5 text-gray-300" />
              </div>
              <p className="text-3xl font-black">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Command Center" subtitle="Fast paths for the things you change most." icon={LayoutDashboard}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "All Content", desc: "Search and edit every field", view: "content" as const, icon: Wand2 },
              { title: "Edit Plans", desc: "Prices, specs, names, order links", view: "plans" as const, icon: Server },
              { title: "Homepage", desc: "Hero slides and service cards", view: "homepage" as const, icon: Home },
              { title: "Site Identity", desc: "Logo, brand, partner logos", view: "site" as const, icon: Settings },
              { title: "Navigation", desc: "Menus, banner, client button", view: "navigation" as const, icon: Menu },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button key={item.title} type="button" onClick={() => setView(item.view)} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4 text-left transition hover:border-white/30 hover:bg-white/[0.04]">
                  <Icon className="mb-4 h-5 w-5 text-gray-300" />
                  <p className="font-black text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel
          title="Safety"
          subtitle="Create a snapshot before large edits."
          icon={DatabaseBackup}
          action={<button type="button" onClick={createBackup} className={primaryButtonClass()}><DatabaseBackup className="h-4 w-4" />Create Backup</button>}
        >
          <div className="grid gap-3">
            {backups.slice(0, 4).map((backup) => (
              <div key={backup.id} className="rounded-lg border border-white/10 bg-[#0d0f14] px-3 py-2">
                <p className="text-sm font-bold text-white">{backup.id}</p>
                <p className="mt-1 text-xs text-gray-500">{backup.path}</p>
              </div>
            ))}
            {backups.length === 0 && <p className="text-sm text-gray-500">No backups yet.</p>}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ContentStudioView({
  sections,
  selectedSection,
  selectedSectionId,
  setSelectedSectionId,
  search,
  setSearch,
  mutateSection,
  saveSection,
  loading,
}: {
  sections: EditableSection[]
  selectedSection: EditableSection
  selectedSectionId: string
  setSelectedSectionId: (id: string) => void
  search: string
  setSearch: (value: string) => void
  mutateSection: (sectionId: string, mutator: (data: JsonObject) => void) => void
  saveSection: (sectionId: string, data: unknown) => Promise<void>
  loading: boolean
}) {
  const fields = useMemo(() => collectContentFields(selectedSection.data), [selectedSection])
  const query = search.toLowerCase()
  const visibleFields = fields.filter((field) => {
    const haystack = `${field.label} ${field.kind} ${asText(field.value)}`.toLowerCase()
    return !query || haystack.includes(query)
  })
  const kindCounts = fields.reduce<Record<string, number>>((counts, field) => {
    counts[field.kind] = (counts[field.kind] || 0) + 1
    return counts
  }, {})

  function updateField(field: ContentField, value: string | boolean) {
    mutateSection(selectedSection.id, (data) => {
      const previous = getValueAtPath(data, field.path)
      setValueAtPath(data, field.path, value, previous)
    })
  }

  return (
    <div className="grid gap-5">
      <Panel
        title="All Content Studio"
        subtitle="Search and edit normal fields from every editable config file. Use this when you want to change a random title, link, toggle, price, or image path fast."
        icon={Wand2}
        action={<button type="button" disabled={loading} onClick={() => saveSection(selectedSection.id, selectedSection.data)} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Section</button>}
      >
        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="grid content-start gap-3">
            <SelectField label="Editable Section" value={selectedSectionId} onChange={setSelectedSectionId}>
              {sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
            </SelectField>
            <TextField label="Search Fields" value={search} onChange={setSearch} placeholder="title, image, price, link" />
            <div className="grid grid-cols-2 gap-2">
              {[
                ["Text", kindCounts.text || 0],
                ["Links", kindCounts.link || 0],
                ["Images", kindCounts.image || 0],
                ["Numbers", kindCounts.number || 0],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-[#0d0f14] p-3">
                  <p className="text-lg font-black text-white">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            {visibleFields.map((field) => (
              <div key={field.id} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 lg:grid-cols-[240px_minmax(0,1fr)]">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {field.kind === "image" ? <ImageIcon className="h-3 w-3" /> : field.kind === "link" ? <Globe2 className="h-3 w-3" /> : field.kind === "boolean" ? <Shield className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                    {field.kind}
                  </div>
                  <p className="break-words text-sm font-black text-white">{field.label}</p>
                  <p className="mt-1 break-all text-xs text-gray-600">{field.path.join(".")}</p>
                </div>
                {field.kind === "boolean" ? (
                  <ToggleField label="Value" value={Boolean(field.value)} onChange={(value) => updateField(field, value)} />
                ) : field.kind === "image" ? (
                  <ImageField label="Value" value={asText(field.value)} onChange={(value) => updateField(field, value)} />
                ) : String(field.value).includes("\n") ? (
                  <TextAreaField label="Value" value={asText(field.value)} onChange={(value) => updateField(field, value)} rows={4} />
                ) : (
                  <TextField label="Value" type={field.kind === "number" ? "number" : "text"} value={asText(field.value)} onChange={(value) => updateField(field, value)} />
                )}
              </div>
            ))}
            {visibleFields.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-[#0d0f14] p-6 text-sm text-gray-500">No fields matched your search.</div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  )
}

function PlansView(props: {
  section: EditableSection
  sections: EditableSection[]
  selectedPlanSectionId: string
  setSelectedPlanSectionId: (id: string) => void
  currentPlanGroup?: PlanGroup
  planGroups: PlanGroup[]
  selectedPlanGroupKey: string
  setSelectedPlanGroupKey: (id: string) => void
  mutateSection: (sectionId: string, mutator: (data: JsonObject) => void) => void
  mutatePlan: (path: PlanPath, planIndex: number, mutator: (plan: JsonObject) => void) => void
  addPlan: (path: PlanPath) => void
  deletePlan: (path: PlanPath, planIndex: number) => void
  saveSection: (sectionId: string, data: unknown) => Promise<void>
  loading: boolean
}) {
  const { section, mutateSection } = props
  if (!isObject(section.data)) return null
  const data = section.data
  const header = isObject(data.header) ? data.header : {}
  const badge = isObject(header.badge) ? header.badge : {}
  const planTypes = Array.isArray(data.planTypes) ? data.planTypes.filter(isObject) : []
  const locations = Array.isArray(data.locations) ? data.locations.filter(isObject) : []

  function updateHeader(path: "badge" | "title" | "description", value: string) {
    mutateSection(section.id, (next) => {
      const nextHeader = ensureObject(next, "header")
      if (path === "badge") ensureObject(nextHeader, "badge").text = value
      else nextHeader[path] = value
    })
  }

  function updatePlanType(index: number, field: string, value: string) {
    mutateSection(section.id, (next) => {
      const list = ensureArray(next, "planTypes")
      const item = list[index]
      if (isObject(item)) item[field] = value
    })
  }

  function addPlanType() {
    mutateSection(section.id, (next) => ensureArray(next, "planTypes").push({ id: `type-${Date.now()}`, name: "New Type", displayName: "New Type", image: "/assets/branding/image-placeholder.svg" }))
  }

  function deletePlanType(index: number) {
    mutateSection(section.id, (next) => {
      const list = Array.isArray(next.planTypes) ? next.planTypes : []
      list.splice(index, 1)
    })
  }

  function updateLocation(index: number, field: string, value: string | boolean) {
    mutateSection(section.id, (next) => {
      const list = ensureArray(next, "locations")
      const item = list[index]
      if (!isObject(item)) return
      if (field === "availablePlanTypes" || field === "availableCpus") item[field] = csvToArray(value as string)
      else item[field] = value
    })
  }

  function addLocation() {
    mutateSection(section.id, (next) => ensureArray(next, "locations").push({ id: `location-${Date.now()}`, name: "New Location", displayName: "New Location", flag: "/flags/india.webp" }))
  }

  function deleteLocation(index: number) {
    mutateSection(section.id, (next) => {
      const list = Array.isArray(next.locations) ? next.locations : []
      list.splice(index, 1)
    })
  }

  return (
    <div className="grid gap-5">
      <Panel
        title="Plan Control"
        subtitle="Edit service copy, locations, plan types, plan specs, images, and checkout links."
        icon={Server}
        action={<button type="button" disabled={props.loading} onClick={() => props.saveSection(section.id, section.data)} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Plans</button>}
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <SelectField label="Service" value={props.selectedPlanSectionId} onChange={props.setSelectedPlanSectionId}>
            {props.sections.filter((item) => planSectionIds.includes(item.id)).map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </SelectField>
          <SelectField label="Plan group" value={props.currentPlanGroup?.key || ""} onChange={props.setSelectedPlanGroupKey}>
            {props.planGroups.map((group) => <option key={group.key} value={group.key}>{group.label}</option>)}
          </SelectField>
        </div>
      </Panel>

      <Panel title="Service Header" subtitle="Top text used on the selected product page." icon={Pencil}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Badge" value={asText(badge.text)} onChange={(value) => updateHeader("badge", value)} />
          <TextField label="Title" value={asText(header.title)} onChange={(value) => updateHeader("title", value)} />
          <TextAreaField label="Description" value={asText(header.description)} onChange={(value) => updateHeader("description", value)} rows={3} />
        </div>
      </Panel>

      <Panel
        title="Plan Types"
        subtitle="CPU families, budget/premium labels, and their images."
        icon={Boxes}
        action={<button type="button" onClick={addPlanType} className={buttonClass()}><Plus className="h-4 w-4" />Add Type</button>}
      >
        <div className="grid gap-3">
          {planTypes.map((type, index) => (
            <div key={`${asText(type.id)}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-[1fr_1fr_1fr_2fr_auto]">
              <TextField label="ID" value={asText(type.id)} onChange={(value) => updatePlanType(index, "id", value)} />
              <TextField label="Name" value={asText(type.name)} onChange={(value) => updatePlanType(index, "name", value)} />
              <TextField label="Display" value={asText(type.displayName)} onChange={(value) => updatePlanType(index, "displayName", value)} />
              <ImageField label="Image" value={asText(type.image)} onChange={(value) => updatePlanType(index, "image", value)} />
              <button type="button" onClick={() => deletePlanType(index)} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Locations"
        subtitle="Regions and flags. Use comma-separated IDs for available plan types or CPUs."
        icon={MapPin}
        action={<button type="button" onClick={addLocation} className={buttonClass()}><Plus className="h-4 w-4" />Add Location</button>}
      >
        <div className="grid gap-3">
          {locations.map((location, index) => (
            <div key={`${asText(location.id)}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_2fr_2fr_auto_auto]">
              <TextField label="ID" value={asText(location.id)} onChange={(value) => updateLocation(index, "id", value)} />
              <TextField label="Name" value={asText(location.name)} onChange={(value) => updateLocation(index, "name", value)} />
              <TextField label="Display" value={asText(location.displayName)} onChange={(value) => updateLocation(index, "displayName", value)} />
              <ImageField label="Flag" value={asText(location.flag)} onChange={(value) => updateLocation(index, "flag", value)} />
              <TextField
                label="Available IDs"
                value={Array.isArray(location.availablePlanTypes) ? location.availablePlanTypes.join(", ") : Array.isArray(location.availableCpus) ? location.availableCpus.join(", ") : asText(location.cpu)}
                onChange={(value) => updateLocation(index, Array.isArray(location.availableCpus) ? "availableCpus" : Array.isArray(location.availablePlanTypes) ? "availablePlanTypes" : "cpu", value)}
              />
              <ToggleField label="Out of Stock" value={!!location.outOfStock} onChange={(value) => updateLocation(index, "outOfStock", value)} />
              <button type="button" onClick={() => deleteLocation(index)} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>

      {props.currentPlanGroup && (
        <Panel
          title={`Plans: ${props.currentPlanGroup.label}`}
          subtitle="Each row controls one customer-facing package card."
          icon={CircleDollarSign}
          action={<button type="button" onClick={() => props.currentPlanGroup && props.addPlan(props.currentPlanGroup.path)} className={buttonClass()}><Plus className="h-4 w-4" />Add Plan</button>}
        >
          <div className="grid gap-4">
            {props.currentPlanGroup.plans.map((plan, index) => {
              const fields = Array.from(new Set([...planFields, ...Object.keys(plan).filter((field) => ["string", "number", "boolean"].includes(typeof plan[field]))]))
              return (
                <div key={`${asText(plan.id)}-${index}`} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-white">{asText(plan.name) || `Plan ${index + 1}`}</p>
                      <p className="mt-1 text-xs text-gray-500">{asText(plan.id)}</p>
                    </div>
                    <button type="button" onClick={() => props.currentPlanGroup && props.deletePlan(props.currentPlanGroup.path, index)} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" />Delete</button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {fields.map((field) => {
                      const value = asText(plan[field])
                      const change = (next: unknown) => props.currentPlanGroup && props.mutatePlan(props.currentPlanGroup.path, index, (item) => { 
                        if (field === "outOfStock" || typeof item[field] === "boolean") {
                           item[field] = next === true || next === "true"
                        } else {
                           item[field] = coerce(item[field], String(next))
                        }
                      })
                      if (typeof plan[field] === "boolean" || field === "outOfStock") {
                        return <ToggleField key={field} label={field} value={Boolean(plan[field])} onChange={change} />
                      }
                      return imageFields.has(field)
                        ? <ImageField key={field} label={field} value={value} onChange={change} />
                        : <TextField key={field} label={field} value={value} onChange={change} />
                    })}
                    {Array.isArray(plan.features) && (
                      <div className="md:col-span-2 xl:col-span-4">
                        <TextAreaField label="Features" value={plan.features.map(String).join("\n")} onChange={(value) => props.currentPlanGroup && props.mutatePlan(props.currentPlanGroup.path, index, (item) => { item.features = linesToArray(value) })} rows={5} />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      )}
    </div>
  )
}

function HomepageView({ section, mutateSection, saveSection, loading }: { section: EditableSection; mutateSection: (sectionId: string, mutator: (data: JsonObject) => void) => void; saveSection: (sectionId: string, data: unknown) => Promise<void>; loading: boolean }) {
  if (!isObject(section.data)) return null
  const heroSlides = Array.isArray(section.data.heroSlides) ? section.data.heroSlides.filter(isObject) : []
  const pricing = isObject(section.data.pricing) ? section.data.pricing : {}
  const cards = Array.isArray(pricing.plans) ? pricing.plans.filter(isObject) : []

  const updatePricing = (field: string, value: string) => mutateSection(section.id, (data) => { ensureObject(data, "pricing")[field] = value })
  const updateSlide = (index: number, field: string, value: string) => mutateSection(section.id, (data) => {
    const list = ensureArray(data, "heroSlides")
    const item = list[index]
    if (isObject(item)) item[field] = coerce(item[field], value)
  })
  const updateCard = (index: number, field: string, value: string) => mutateSection(section.id, (data) => {
    const pricingData = ensureObject(data, "pricing")
    const list = ensureArray(pricingData, "plans")
    const item = list[index]
    if (isObject(item)) item[field] = coerce(item[field], value)
  })

  return (
    <div className="grid gap-5">
      <Panel title="Homepage Header" subtitle="Controls the product card section intro." icon={Home} action={<button type="button" disabled={loading} onClick={() => saveSection(section.id, section.data)} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Homepage</button>}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Eyebrow" value={asText(pricing.eyebrow)} onChange={(value) => updatePricing("eyebrow", value)} />
          <TextField label="Explore Text" value={asText(pricing.exploreText)} onChange={(value) => updatePricing("exploreText", value)} />
          <TextField label="Title" value={asText(pricing.title)} onChange={(value) => updatePricing("title", value)} />
          <TextField label="Explore Link" value={asText(pricing.exploreHref)} onChange={(value) => updatePricing("exploreHref", value)} />
          <div className="md:col-span-2">
            <TextAreaField label="Description" value={asText(pricing.description)} onChange={(value) => updatePricing("description", value)} />
          </div>
        </div>
      </Panel>

      <Panel title="Hero Slides" subtitle="Rotating first-screen offer blocks." icon={Pencil} action={<button type="button" onClick={() => mutateSection(section.id, (data) => ensureArray(data, "heroSlides").push({ id: `slide-${Date.now()}`, eyebrow: "New service", title: "New slide", description: "Describe this offer.", price: 0, href: "/", image: "/assets/branding/image-placeholder.svg", thumbnail: "/assets/branding/image-placeholder.svg", benefits: ["Fast setup"] }))} className={buttonClass()}><Plus className="h-4 w-4" />Add Slide</button>}>
        <div className="grid gap-4">
          {heroSlides.map((slide, index) => (
            <div key={`${asText(slide.id)}-${index}`} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-black">{asText(slide.title)}</p>
                <button type="button" onClick={() => mutateSection(section.id, (data) => { const list = Array.isArray(data.heroSlides) ? data.heroSlides : []; list.splice(index, 1) })} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {["id", "eyebrow", "title", "price", "href"].map((field) => <TextField key={field} label={field} value={asText(slide[field])} onChange={(value) => updateSlide(index, field, value)} />)}
                <ImageField label="image" value={asText(slide.image)} onChange={(value) => updateSlide(index, "image", value)} />
                <ImageField label="thumbnail" value={asText(slide.thumbnail)} onChange={(value) => updateSlide(index, "thumbnail", value)} />
                <div className="md:col-span-2 xl:col-span-4">
                  <TextAreaField label="Description" value={asText(slide.description)} onChange={(value) => updateSlide(index, "description", value)} />
                </div>
                <div className="md:col-span-2 xl:col-span-4">
                  <TextAreaField label="Benefits" value={Array.isArray(slide.benefits) ? slide.benefits.map(String).join("\n") : ""} onChange={(value) => mutateSection(section.id, (data) => { const list = ensureArray(data, "heroSlides"); const item = list[index]; if (isObject(item)) item.benefits = linesToArray(value) })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Homepage Cards" subtitle="The service cards shown below the hero." icon={Boxes} action={<button type="button" onClick={() => mutateSection(section.id, (data) => { const pricingData = ensureObject(data, "pricing"); ensureArray(pricingData, "plans").push({ badge: "NEW", title: "New Product", subtitle: "Short subtitle", image: "/assets/branding/image-placeholder.svg", price: 0, features: ["Feature"], cta: "VIEW PLANS", href: "/" }) })} className={buttonClass()}><Plus className="h-4 w-4" />Add Card</button>}>
        <div className="grid gap-4">
          {cards.map((card, index) => (
            <div key={`${asText(card.title)}-${index}`} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-black">{asText(card.title)}</p>
                <button type="button" onClick={() => mutateSection(section.id, (data) => { const pricingData = isObject(data.pricing) ? data.pricing : {}; const list = Array.isArray(pricingData.plans) ? pricingData.plans : []; list.splice(index, 1) })} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {["badge", "title", "subtitle", "price", "cta", "href"].map((field) => <TextField key={field} label={field} value={asText(card[field])} onChange={(value) => updateCard(index, field, value)} />)}
                <ImageField label="image" value={asText(card.image)} onChange={(value) => updateCard(index, "image", value)} />
                <div className="md:col-span-2 xl:col-span-4">
                  <TextAreaField label="Features" value={Array.isArray(card.features) ? card.features.map(String).join("\n") : ""} onChange={(value) => mutateSection(section.id, (data) => { const pricingData = ensureObject(data, "pricing"); const list = ensureArray(pricingData, "plans"); const item = list[index]; if (isObject(item)) item.features = linesToArray(value) })} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function SiteIdentityView({ section, mutateSection, saveSection, loading }: { section: EditableSection; mutateSection: (sectionId: string, mutator: (data: JsonObject) => void) => void; saveSection: (sectionId: string, data: unknown) => Promise<void>; loading: boolean }) {
  if (!isObject(section.data)) return null
  const navbar = isObject(section.data.navbar) ? section.data.navbar : {}
  const hero = isObject(section.data.hero) ? section.data.hero : {}
  const title = isObject(hero.title) ? hero.title : {}
  const games = Array.isArray(hero.games) ? hero.games.filter(isObject) : []
  const partners = Array.isArray(hero.partners) ? hero.partners.filter(isObject) : []

  const updateNavbar = (field: string, value: string) => mutateSection(section.id, (data) => { ensureObject(data, "navbar")[field] = value })
  const updateHero = (field: string, value: string) => mutateSection(section.id, (data) => { ensureObject(data, "hero")[field] = field === "cycleInterval" ? Number(value) || 0 : value })
  const updateTitle = (field: string, value: string) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); ensureObject(heroData, "title")[field] = value })

  return (
    <div className="grid gap-5">
      <Panel title="Brand and Hero Identity" subtitle="Logo, brand text, and homepage animated game settings." icon={Settings} action={<button type="button" disabled={loading} onClick={() => saveSection(section.id, section.data)} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Identity</button>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <ImageField label="Logo" value={asText(navbar.logo)} onChange={(value) => updateNavbar("logo", value)} />
          <TextField label="Brand Name" value={asText(navbar.brandName)} onChange={(value) => updateNavbar("brandName", value)} />
          <TextField label="Brand Accent" value={asText(navbar.brandAccent)} onChange={(value) => updateNavbar("brandAccent", value)} />
          <TextField label="Hero Prefix" value={asText(title.prefix)} onChange={(value) => updateTitle("prefix", value)} />
          <TextField label="Hero Suffix" value={asText(title.suffix)} onChange={(value) => updateTitle("suffix", value)} />
          <TextField label="Cycle Interval" value={asText(hero.cycleInterval)} onChange={(value) => updateHero("cycleInterval", value)} />
          <div className="md:col-span-2 xl:col-span-3">
            <TextAreaField label="Hero Description" value={asText(hero.description)} onChange={(value) => updateHero("description", value)} />
          </div>
        </div>
      </Panel>

      <Panel title="Hero Games" subtitle="Games shown in the old hero dropdown and animation config." icon={Boxes} action={<button type="button" onClick={() => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); ensureArray(heroData, "games").push({ id: `game-${Date.now()}`, name: "new", displayName: "New Game", color: "#ffffff", banner: "/assets/branding/image-placeholder.svg", icon: "/assets/branding/image-placeholder.svg", showInDropdown: true }) })} className={buttonClass()}><Plus className="h-4 w-4" />Add Game</button>}>
        <div className="grid gap-3">
          {games.map((game, index) => (
            <div key={`${asText(game.id)}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_2fr_2fr_auto]">
              {["id", "name", "displayName"].map((field) => <TextField key={field} label={field} value={asText(game[field])} onChange={(value) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = ensureArray(heroData, "games"); const item = list[index]; if (isObject(item)) item[field] = value })} />)}
              <ImageField label="banner" value={asText(game.banner)} onChange={(value) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = ensureArray(heroData, "games"); const item = list[index]; if (isObject(item)) item.banner = value })} />
              <ImageField label="icon" value={asText(game.icon)} onChange={(value) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = ensureArray(heroData, "games"); const item = list[index]; if (isObject(item)) item.icon = value })} />
              <button type="button" onClick={() => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = Array.isArray(heroData.games) ? heroData.games : []; list.splice(index, 1) })} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Partner Logos" subtitle="Companies/logos shown in the homepage hero partner row." icon={ImageIcon} action={<button type="button" onClick={() => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); ensureArray(heroData, "partners").push({ name: "Partner", src: "/assets/branding/image-placeholder.svg", loading: "lazy" }) })} className={buttonClass()}><Plus className="h-4 w-4" />Add Partner</button>}>
        <div className="grid gap-3">
          {partners.map((partner, index) => (
            <div key={`${asText(partner.name)}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-[1fr_2fr_auto]">
              <TextField label="Name" value={asText(partner.name)} onChange={(value) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = ensureArray(heroData, "partners"); const item = list[index]; if (isObject(item)) item.name = value })} />
              <ImageField label="Logo Path" value={asText(partner.src)} onChange={(value) => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = ensureArray(heroData, "partners"); const item = list[index]; if (isObject(item)) item.src = value })} />
              <button type="button" onClick={() => mutateSection(section.id, (data) => { const heroData = ensureObject(data, "hero"); const list = Array.isArray(heroData.partners) ? heroData.partners : []; list.splice(index, 1) })} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function NavigationView({ section, mutateSection, saveSection, loading }: { section: EditableSection; mutateSection: (sectionId: string, mutator: (data: JsonObject) => void) => void; saveSection: (sectionId: string, data: unknown) => Promise<void>; loading: boolean }) {
  if (!isObject(section.data)) return null
  const navItems = Array.isArray(section.data.mainNavigation) ? section.data.mainNavigation.filter(isObject) : []
  const socialLinks = Array.isArray(section.data.socialLinks) ? section.data.socialLinks.filter(isObject) : []
  const clientSpace = isObject(section.data.clientSpace) ? section.data.clientSpace : {}
  const banner = isObject(section.data.banner) ? section.data.banner : {}

  const updateNav = (index: number, field: string, value: string | boolean) => mutateSection(section.id, (data) => { const list = ensureArray(data, "mainNavigation"); const item = list[index]; if (isObject(item)) item[field] = value })
  const updateDropdown = (navIndex: number, itemIndex: number, field: string, value: string) => mutateSection(section.id, (data) => {
    const navList = ensureArray(data, "mainNavigation")
    const nav = navList[navIndex]
    if (!isObject(nav)) return
    const dropdown = ensureArray(nav, "dropdownItems")
    const item = dropdown[itemIndex]
    if (isObject(item)) item[field] = value
  })

  return (
    <div className="grid gap-5">
      <Panel title="Navigation" subtitle="Top menu items, dropdown content, promo banner, client button, and social links." icon={Menu} action={<button type="button" disabled={loading} onClick={() => saveSection(section.id, section.data)} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Navigation</button>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TextField label="Client Button" value={asText(clientSpace.name)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "clientSpace").name = value })} />
          <TextField label="Client Link" value={asText(clientSpace.href)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "clientSpace").href = value })} />
          <TextField label="Client Icon" value={asText(clientSpace.icon)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "clientSpace").icon = value })} />
          <ToggleField label="Show Banner" value={Boolean(banner.show)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "banner").show = value })} />
          <div className="md:col-span-2">
            <TextField label="Banner Text" value={asText(banner.text)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "banner").text = value })} />
          </div>
          <TextField label="Coupon Code" value={asText(banner.couponCode)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "banner").couponCode = value })} />
          <TextField label="Banner Class" value={asText(banner.backgroundColor)} onChange={(value) => mutateSection(section.id, (data) => { ensureObject(data, "banner").backgroundColor = value })} />
        </div>
      </Panel>

      <Panel title="Main Menu" subtitle="Create, delete, and edit dropdown menu content." icon={Boxes} action={<button type="button" onClick={() => mutateSection(section.id, (data) => ensureArray(data, "mainNavigation").push({ name: "New Link", href: "/", icon: "Home", hasDropdown: false, dropdownType: "important", dropdownItems: [] }))} className={buttonClass()}><Plus className="h-4 w-4" />Add Menu</button>}>
        <div className="grid gap-4">
          {navItems.map((item, navIndex) => {
            const dropdownItems = Array.isArray(item.dropdownItems) ? item.dropdownItems.filter(isObject) : []
            return (
              <div key={`${asText(item.name)}-${navIndex}`} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="font-black">{asText(item.name) || `Menu ${navIndex + 1}`}</p>
                  <button type="button" onClick={() => mutateSection(section.id, (data) => { const list = Array.isArray(data.mainNavigation) ? data.mainNavigation : []; list.splice(navIndex, 1) })} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" />Delete</button>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <TextField label="Name" value={asText(item.name)} onChange={(value) => updateNav(navIndex, "name", value)} />
                  <TextField label="Href" value={asText(item.href)} onChange={(value) => updateNav(navIndex, "href", value)} />
                  <TextField label="Icon" value={asText(item.icon)} onChange={(value) => updateNav(navIndex, "icon", value)} />
                  <TextField label="Dropdown Type" value={asText(item.dropdownType)} onChange={(value) => updateNav(navIndex, "dropdownType", value)} />
                  <ToggleField label="Dropdown" value={Boolean(item.hasDropdown)} onChange={(value) => updateNav(navIndex, "hasDropdown", value)} />
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-black text-gray-300">Dropdown Items</p>
                    <button type="button" onClick={() => mutateSection(section.id, (data) => { const list = ensureArray(data, "mainNavigation"); const nav = list[navIndex]; if (isObject(nav)) ensureArray(nav, "dropdownItems").push({ name: "New Dropdown", description: "Short description", href: "/", icon: "Home" }) })} className={buttonClass()}><Plus className="h-4 w-4" />Add</button>
                  </div>
                  <div className="grid gap-3">
                    {dropdownItems.map((dropdown, itemIndex) => (
                      <div key={`${asText(dropdown.name)}-${itemIndex}`} className="grid gap-3 rounded-lg border border-white/10 bg-[#090b10] p-3 md:grid-cols-[1fr_1.4fr_1fr_1fr_auto]">
                        <TextField label="Name" value={asText(dropdown.name)} onChange={(value) => updateDropdown(navIndex, itemIndex, "name", value)} />
                        <TextField label="Description" value={asText(dropdown.description)} onChange={(value) => updateDropdown(navIndex, itemIndex, "description", value)} />
                        <TextField label="Href" value={asText(dropdown.href)} onChange={(value) => updateDropdown(navIndex, itemIndex, "href", value)} />
                        <TextField label="Icon" value={asText(dropdown.icon)} onChange={(value) => updateDropdown(navIndex, itemIndex, "icon", value)} />
                        <button type="button" onClick={() => mutateSection(section.id, (data) => { const list = ensureArray(data, "mainNavigation"); const nav = list[navIndex]; if (isObject(nav) && Array.isArray(nav.dropdownItems)) nav.dropdownItems.splice(itemIndex, 1) })} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Social Links" subtitle="Footer/header social actions." icon={Globe2} action={<button type="button" onClick={() => mutateSection(section.id, (data) => ensureArray(data, "socialLinks").push({ name: "New Social", href: "https://", icon: "link" }))} className={buttonClass()}><Plus className="h-4 w-4" />Add Social</button>}>
        <div className="grid gap-3">
          {socialLinks.map((social, index) => (
            <div key={`${asText(social.name)}-${index}`} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-[1fr_2fr_1fr_auto]">
              <TextField label="Name" value={asText(social.name)} onChange={(value) => mutateSection(section.id, (data) => { const list = ensureArray(data, "socialLinks"); const item = list[index]; if (isObject(item)) item.name = value })} />
              <TextField label="Href" value={asText(social.href)} onChange={(value) => mutateSection(section.id, (data) => { const list = ensureArray(data, "socialLinks"); const item = list[index]; if (isObject(item)) item.href = value })} />
              <TextField label="Icon" value={asText(social.icon)} onChange={(value) => mutateSection(section.id, (data) => { const list = ensureArray(data, "socialLinks"); const item = list[index]; if (isObject(item)) item.icon = value })} />
              <button type="button" onClick={() => mutateSection(section.id, (data) => { const list = Array.isArray(data.socialLinks) ? data.socialLinks : []; list.splice(index, 1) })} className={buttonClass("self-end text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function defaultEditorState(): ImageEditorState {
  return {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    blur: 0,
    rotate: 0,
    flipX: false,
    flipY: false,
    outputWidth: "",
    outputHeight: "",
    format: "image/png",
    fileName: "edited-image",
  }
}

function SliderField({ label, value, min, max, step = 1, suffix = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-gray-500">
        {label}
        <span className="text-gray-300">{value}{suffix}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full accent-white" />
    </label>
  )
}

function AssetsView({
  assets,
  allAssets,
  search,
  setSearch,
  uploadAsset,
  saveEditedAsset,
  deleteAsset,
  copyPath,
}: {
  assets: string[]
  allAssets: string[]
  search: string
  setSearch: (value: string) => void
  uploadAsset: (file?: File) => void
  saveEditedAsset: (dataUrl: string, fileName: string) => Promise<string>
  deleteAsset: (path: string) => void
  copyPath: (path: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const editorContainerRef = useRef<HTMLDivElement | null>(null)
  const [selectedAsset, setSelectedAsset] = useState("")
  const [sourceSize, setSourceSize] = useState({ width: 0, height: 0 })
  const [editor, setEditor] = useState<ImageEditorState>(defaultEditorState)
  const [editorMessage, setEditorMessage] = useState("")
  const [scanning, setScanning] = useState(false)

  async function cleanUnusedImages() {
    setScanning(true)
    try {
      const res = await fetch("/api/admin/assets/cleanup")
      const data = await res.json()
      if (data.unusedImages) {
        if (data.unusedImages.length === 0) {
          alert("All images are currently in use!")
          return
        }
        if (confirm(`Found ${data.unusedImages.length} unused images.\nAre you sure you want to delete them?\n\nFiles:\n${data.unusedImages.slice(0, 10).join("\n")}${data.unusedImages.length > 10 ? "\n..." : ""}`)) {
          await fetch("/api/admin/assets/cleanup", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paths: data.unusedImages })
          })
          window.location.reload()
        }
      }
    } finally {
      setScanning(false)
    }
  }

  useEffect(() => {
    if (!selectedAsset && allAssets.length > 0) setSelectedAsset(allAssets[0])
  }, [allAssets, selectedAsset])

  useEffect(() => {
    if (!selectedAsset) return
    const image = new Image()
    image.onload = () => {
      setSourceSize({ width: image.naturalWidth, height: image.naturalHeight })
      setEditor((current) => ({
        ...current,
        outputWidth: current.outputWidth || String(image.naturalWidth),
        outputHeight: current.outputHeight || String(image.naturalHeight),
        fileName: current.fileName === "edited-image" ? selectedAsset.split("/").pop()?.replace(/\.[^.]+$/, "") || "edited-image" : current.fileName,
      }))
    }
    image.src = selectedAsset
  }, [selectedAsset])

  useEffect(() => {
    if (!selectedAsset || !canvasRef.current) return
    const canvas = canvasRef.current
    const image = new Image()
    image.onload = () => {
      const width = Math.max(1, Number(editor.outputWidth) || image.naturalWidth)
      const height = Math.max(1, Number(editor.outputHeight) || image.naturalHeight)
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext("2d")
      if (!context) return
      context.clearRect(0, 0, width, height)
      if (editor.format === "image/jpeg") {
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, width, height)
      }
      context.save()
      context.translate(width / 2, height / 2)
      context.rotate((editor.rotate * Math.PI) / 180)
      context.scale(editor.flipX ? -1 : 1, editor.flipY ? -1 : 1)
      context.filter = `brightness(${editor.brightness}%) contrast(${editor.contrast}%) saturate(${editor.saturation}%) grayscale(${editor.grayscale}%) blur(${editor.blur}px)`
      context.drawImage(image, -width / 2, -height / 2, width, height)
      context.restore()
    }
    image.src = selectedAsset
  }, [selectedAsset, editor])

  async function saveEditedImage() {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.toDataURL(editor.format, editor.format === "image/jpeg" ? 0.92 : 0.95)
    const path = await saveEditedAsset(dataUrl, editor.fileName)
    if (path) {
      setSelectedAsset(path)
      setEditorMessage(`Saved new image: ${path}`)
    }
  }

  function updateEditor<K extends keyof ImageEditorState>(key: K, value: ImageEditorState[K]) {
    setEditor((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="grid gap-5" ref={editorContainerRef}>
      <Panel
        title="Media Studio"
        subtitle="Upload, preview, edit, resize, rotate, flip, filter, save a new edited image, and copy the final path."
        icon={ImageIcon}
        action={
          <div className="flex gap-2">
            <button type="button" onClick={cleanUnusedImages} disabled={scanning} className={buttonClass()}>
              {scanning ? "Scanning..." : "Clean Unused"}
            </button>
            <label className={primaryButtonClass("cursor-pointer")}><Upload className="h-4 w-4" />Upload Image<input type="file" accept="image/*" onChange={(event) => uploadAsset(event.target.files?.[0])} className="hidden" /></label>
          </div>
        }
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-xl border border-white/10 bg-[#090b10] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-black text-white">{selectedAsset || "Select an image"}</p>
                <p className="mt-1 text-xs text-gray-500">{sourceSize.width > 0 ? `${sourceSize.width} x ${sourceSize.height}px source` : "Image editor canvas"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => copyPath(selectedAsset)} disabled={!selectedAsset} className={buttonClass()}><Copy className="h-4 w-4" />Copy</button>
                <button type="button" onClick={saveEditedImage} disabled={!selectedAsset} className={primaryButtonClass()}><Save className="h-4 w-4" />Save Edited</button>
              </div>
            </div>
            <div className="grid min-h-[360px] place-items-center overflow-auto rounded-lg border border-white/10 bg-black/35 p-4">
              {selectedAsset ? <canvas ref={canvasRef} className="max-h-[620px] max-w-full rounded-md shadow-2xl" /> : <p className="text-sm text-gray-500">Choose an image from the library below.</p>}
            </div>
            {editorMessage && <p className="mt-3 text-sm text-gray-300">{editorMessage}</p>}
          </div>

          <div className="grid content-start gap-4">
            <SelectField label="Source Image" value={selectedAsset} onChange={setSelectedAsset}>
              {allAssets.map((asset) => <option key={asset} value={asset}>{asset}</option>)}
            </SelectField>
            <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4">
              <div className="flex items-center gap-2 text-sm font-black text-white"><SlidersHorizontal className="h-4 w-4" /> Adjustments</div>
              <SliderField label="Brightness" value={editor.brightness} min={20} max={180} suffix="%" onChange={(value) => updateEditor("brightness", value)} />
              <SliderField label="Contrast" value={editor.contrast} min={20} max={180} suffix="%" onChange={(value) => updateEditor("contrast", value)} />
              <SliderField label="Saturation" value={editor.saturation} min={0} max={220} suffix="%" onChange={(value) => updateEditor("saturation", value)} />
              <SliderField label="Grayscale" value={editor.grayscale} min={0} max={100} suffix="%" onChange={(value) => updateEditor("grayscale", value)} />
              <SliderField label="Blur" value={editor.blur} min={0} max={12} step={0.5} suffix="px" onChange={(value) => updateEditor("blur", value)} />
            </div>
            <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4">
              <div className="flex items-center gap-2 text-sm font-black text-white"><Crop className="h-4 w-4" /> Transform</div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="Width" value={editor.outputWidth} onChange={(value) => updateEditor("outputWidth", value)} type="number" />
                <TextField label="Height" value={editor.outputHeight} onChange={(value) => updateEditor("outputHeight", value)} type="number" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => updateEditor("rotate", (editor.rotate - 90) % 360)} className={buttonClass()}><RotateCcw className="h-4 w-4" />Rotate L</button>
                <button type="button" onClick={() => updateEditor("rotate", (editor.rotate + 90) % 360)} className={buttonClass()}><RotateCw className="h-4 w-4" />Rotate R</button>
                <button type="button" onClick={() => updateEditor("flipX", !editor.flipX)} className={buttonClass(editor.flipX ? "border-white/50 bg-white/10" : "")}><FlipHorizontal className="h-4 w-4" />Flip X</button>
                <button type="button" onClick={() => updateEditor("flipY", !editor.flipY)} className={buttonClass(editor.flipY ? "border-white/50 bg-white/10" : "")}><FlipVertical className="h-4 w-4" />Flip Y</button>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4">
              <TextField label="Output Name" value={editor.fileName} onChange={(value) => updateEditor("fileName", value)} />
              <SelectField label="Format" value={editor.format} onChange={(value) => updateEditor("format", value as ImageEditorState["format"])}>
                <option value="image/png">PNG</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/webp">WebP</option>
              </SelectField>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setEditor(defaultEditorState())} className={buttonClass()}><RefreshCw className="h-4 w-4" />Reset</button>
                <button type="button" onClick={() => selectedAsset && deleteAsset(selectedAsset)} disabled={!selectedAsset} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" />Delete</button>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Image Library" subtitle="Search assets, choose an image for editing, or copy the path into a site field." icon={Search}>
        <div className="mb-5">
          <TextField label="Search Images" value={search} onChange={setSearch} placeholder="/assets/homepage" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {assets.map((asset) => (
            <button key={asset} type="button" onClick={() => {
              setSelectedAsset(asset);
              setTimeout(() => editorContainerRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            }} className={`overflow-hidden rounded-xl border bg-[#0d0f14] text-left transition hover:border-white/40 ${selectedAsset === asset ? "border-white/70" : "border-white/10"}`}>
              <div className="h-32 bg-black/30">
                <img src={asset} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="grid gap-2 p-3">
                <p className="break-all text-xs text-gray-300">{asset}</p>
                <span className={buttonClass("pointer-events-none w-full")}><Pencil className="h-4 w-4" />Edit Image</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function UsersView(props: {
  currentUser: AdminUser
  users: AdminUser[]
  setUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>
  passwordDrafts: Record<string, string>
  setPasswordDrafts: React.Dispatch<React.SetStateAction<Record<string, string>>>
  newUser: { name: string; email: string; password: string; role: "admin" | "editor" }
  setNewUser: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; role: "admin" | "editor" }>>
  createUser: (event: FormEvent) => void
  saveUser: (user: AdminUser) => void
  deleteUser: (id: string) => void
  loading: boolean
}) {
  return (
    <Panel title="Admin Users" subtitle="Create, edit, and delete local admin accounts. 2FA is mandatory." icon={Users}>
      <form onSubmit={props.createUser} className="mb-5 grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 md:grid-cols-5">
        <TextField label="Name" value={props.newUser.name} onChange={(value) => props.setNewUser((current) => ({ ...current, name: value }))} />
        <TextField label="Email" value={props.newUser.email} onChange={(value) => props.setNewUser((current) => ({ ...current, email: value }))} type="email" />
        <TextField label="Password" value={props.newUser.password} onChange={(value) => props.setNewUser((current) => ({ ...current, password: value }))} type="password" />
        <SelectField label="Role" value={props.newUser.role} onChange={(value) => props.setNewUser((current) => ({ ...current, role: value as "admin" | "editor" }))}>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </SelectField>
        <button type="submit" disabled={props.loading} className={primaryButtonClass("self-end")}><Plus className="h-4 w-4" />Create</button>
      </form>

      <div className="grid gap-3">
        {props.users.map((adminUser) => {
          const SUPER_ADMIN = "kartikmungase290@gmail.com";
          const isSuperAdmin = props.currentUser.email === SUPER_ADMIN;
          const targetIsSuperAdmin = adminUser.email === SUPER_ADMIN;
          const isMe = adminUser.id === props.currentUser.id;
          const canEdit = isSuperAdmin || !targetIsSuperAdmin;

          return (
            <div key={adminUser.id} className="grid gap-3 rounded-xl border border-white/10 bg-[#0d0f14] p-4 xl:grid-cols-[1fr_1fr_150px_1fr_auto]">
              {canEdit ? (
                <>
                  <TextField label={isMe ? "Name (You)" : "Name"} value={adminUser.name} onChange={(value) => props.setUsers((current) => current.map((item) => item.id === adminUser.id ? { ...item, name: value } : item))} />
                  <TextField label="Email" value={adminUser.email} onChange={(value) => props.setUsers((current) => current.map((item) => item.id === adminUser.id ? { ...item, email: value } : item))} type="email" />
                  <SelectField label="Role" value={adminUser.role} onChange={(value) => props.setUsers((current) => current.map((item) => item.id === adminUser.id ? { ...item, role: value as "admin" | "editor" } : item))}>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </SelectField>
                  <TextField label="New Password" value={props.passwordDrafts[adminUser.id] || ""} onChange={(value) => props.setPasswordDrafts((current) => ({ ...current, [adminUser.id]: value }))} type="password" />
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2 h-full items-end pb-[2px]">
                      <button type="button" onClick={() => props.saveUser(adminUser)} className={buttonClass()}><Save className="h-4 w-4" />Save</button>
                      {!targetIsSuperAdmin && (
                        <button type="button" onClick={() => props.deleteUser(adminUser.id)} className={buttonClass("text-red-100 hover:border-red-400/40")}><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center"><span className="text-xs font-bold uppercase text-gray-500">Name</span><span className="text-sm text-white">{adminUser.name}</span></div>
                  <div className="flex flex-col justify-center"><span className="text-xs font-bold uppercase text-gray-500">Email</span><span className="text-sm text-gray-400">{adminUser.email}</span></div>
                  <div className="flex flex-col justify-center"><span className="text-xs font-bold uppercase text-gray-500">Role</span><span className="text-sm text-gray-400">{adminUser.role}</span></div>
                  <div className="flex flex-col justify-center"><span className="text-xs font-bold uppercase text-gray-500">2FA</span><span className="text-sm text-gray-400">{adminUser.twoFactorEnabled ? "Enabled" : "Disabled"}</span></div>
                  <div className="flex items-center text-xs text-gray-600">Restricted</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  )
}

function BackupsView({ backups, createBackup, loading }: { backups: Backup[]; createBackup: () => void; loading: boolean }) {
  return (
    <Panel title="Backups" subtitle="Snapshots are stored inside the project under app/config/backups." icon={DatabaseBackup} action={<button type="button" disabled={loading} onClick={createBackup} className={primaryButtonClass()}><DatabaseBackup className="h-4 w-4" />Create Backup</button>}>
      <div className="grid gap-3">
        {backups.map((backup) => (
          <div key={backup.id} className="rounded-xl border border-white/10 bg-[#0d0f14] p-4">
            <p className="font-black">{backup.id}</p>
            <p className="mt-1 text-sm text-gray-500">{backup.path}</p>
            <p className="mt-1 text-xs text-gray-600">{new Date(backup.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {backups.length === 0 && <p className="text-sm text-gray-500">No backups created yet.</p>}
      </div>
    </Panel>
  )
}

function JsonView(props: {
  sections: EditableSection[]
  selectedJsonSectionId: string
  setSelectedJsonSectionId: (id: string) => void
  jsonDraft: string
  setJsonDraft: (value: string) => void
  saveJsonDraft: () => void
  loading: boolean
}) {
  return (
    <Panel title="Advanced JSON" subtitle="For exact control over any editable config file." icon={FileJson} action={<button type="button" disabled={props.loading} onClick={props.saveJsonDraft} className={primaryButtonClass()}><Save className="h-4 w-4" />Save JSON</button>}>
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="grid content-start gap-2">
          {props.sections.map((section) => (
            <button key={section.id} type="button" onClick={() => props.setSelectedJsonSectionId(section.id)} className={`rounded-lg border px-3 py-3 text-left transition ${props.selectedJsonSectionId === section.id ? "border-white bg-white text-black" : "border-white/10 bg-[#0d0f14] text-gray-300 hover:border-white/30"}`}>
              <span className="block text-sm font-black">{section.label}</span>
              <span className="mt-1 block text-xs opacity-70">{section.file}</span>
            </button>
          ))}
        </div>
        <textarea value={props.jsonDraft} onChange={(event) => props.setJsonDraft(event.target.value)} spellCheck={false} className={fieldClass("min-h-[650px] resize-y font-mono text-xs leading-5")} />
      </div>
    </Panel>
  )
}

function TogglesView({ sections, saveSection, loading }: { sections: EditableSection[], saveSection: (id: string, data: unknown) => void, loading: boolean }) {
  const configSection = sections.find(s => s.id === "sections-config")
  if (!configSection || !isObject(configSection.data)) return null

  return (
    <Panel title="Section Toggles" subtitle="Enable or disable sections on the homepage." icon={SlidersHorizontal}>
      <div className="grid gap-3 max-w-2xl">
        {Object.entries(configSection.data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0d0f14] p-4">
            <div>
              <p className="font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-xs text-gray-500">Render {key} on the site</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="sr-only peer" checked={!!value} onChange={(e) => {
                const newData = { ...(configSection.data as any), [key]: e.target.checked }
                saveSection("sections-config", newData)
              }} disabled={loading} />
              <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-red-800"></div>
            </label>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function LogsView() {
  const [logs, setLogs] = useState("Loading server.log...")

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch("/api/admin/logs", { cache: "no-store" })
        const data = await response.json()
        if (data.logs) {
          setLogs(data.logs)
        } else {
          setLogs(data.error || "No logs available.")
        }
      } catch (error) {
        setLogs("Failed to fetch logs.")
      }
    }
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black">Server Logs</h3>
          <p className="mt-1 text-sm text-gray-500">Live feed from server.log (updates every 5s)</p>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0d0f14] p-4 text-xs font-mono text-gray-300 overflow-x-auto h-[60vh] overflow-y-auto whitespace-pre-wrap">
        {logs}
      </div>
    </div>
  )
}

function TicketsView({ sections }: { sections: EditableSection[] }) {
  const messagesSection = sections.find(s => s.id === "messages")
  const data = messagesSection?.data as { messages?: any[] } | undefined
  const messages = Array.isArray(data?.messages) ? data.messages : []

  return (
    <Panel title="Support Tickets" subtitle="Messages received from the contact form." icon={Boxes}>
      <div className="grid gap-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No support tickets received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 text-xs uppercase text-gray-300">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {messages.slice().reverse().map((msg: any) => (
                  <tr key={msg.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(msg.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-white">{msg.name}</td>
                    <td className="px-4 py-3">{msg.email}</td>
                    <td className="px-4 py-3 max-w-md truncate" title={msg.message}>{msg.message}</td>
                    <td className="px-4 py-3">
                      {msg.attachmentUrl ? (
                        <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20">
                          <ImageIcon className="h-3 w-3" /> View
                        </a>
                      ) : (
                        <span className="text-gray-600">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Panel>
  )
}
