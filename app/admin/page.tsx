import type { Metadata } from "next"
import AdminDashboard from "./AdminDashboard"

export const metadata: Metadata = {
  title: "Admin | Hostlixo Cloud",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminDashboard />
}
