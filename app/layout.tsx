import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { MeshGradient } from "@/components/mesh-gradient"
import { PlaygroundNotification } from "@/components/playground-notification"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "候补名单 - 我们的产品",
  description: "成为第一批体验我们产品的用户，获得独家访问权限和特别优惠。",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`} style={{ opacity: 1 }}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative min-h-screen bg-slate-1">
            <MeshGradient />
            <Header />
            <main className="relative z-10">{children}</main>
            <PlaygroundNotification />
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
