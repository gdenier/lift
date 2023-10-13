import { ClerkProvider } from "@clerk/nextjs"
import "../styles/globals.css"
import { Inter } from "next/font/google"
import Head from "next/head"
import { TailwindResponsiveIndicator } from "~/components/TailwindResponsiveIndicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Lift",
  description: "The sport app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
