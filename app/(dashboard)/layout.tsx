import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Toaster } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
        <Toaster richColors position="top-right" />
      </div>
    </div>
  )
}
