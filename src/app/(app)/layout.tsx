import { MobileNavbar } from "~/components/MobileNavbar"
import { Sidebar } from "~/components/Sidebar"
import { Toaster } from "react-hot-toast"
import { TailwindResponsiveIndicator } from "~/components/TailwindResponsiveIndicator"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden md:flex-row">
      <Sidebar />
      <main className="w-full flex-1 overflow-y-auto overflow-x-hidden bg-muted p-2">
        {children}
      </main>
      <MobileNavbar />
      <Toaster />
      <TailwindResponsiveIndicator />
    </div>
  )
}
