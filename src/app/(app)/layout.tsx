import { Sidebar } from "~/components/Sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar />
      <main className="w-full overflow-y-auto overflow-x-hidden bg-background bg-slate-100 p-2">
        {children}
      </main>
    </div>
  )
}
