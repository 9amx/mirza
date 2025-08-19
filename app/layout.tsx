import type React from "react"
import type { Metadata } from "next"
import { SettingsFileStore } from "@/lib/settings-file-store"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/contexts/AuthContext"
import { ToastProvider } from "@/components/ui/use-toast.tsx"
import { Toaster } from "@/components/ui/toaster"

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-source-sans-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = ((() => {
  const settings = SettingsFileStore.get()
  const title = settings.storeName ? `${settings.storeName} - Premium Fashion & Lifestyle` : 'Mirza Garments - Premium Fashion & Lifestyle'
  const icons = settings.faviconPath ? { icon: settings.faviconPath } : undefined
  return {
    title,
    description: "Discover premium clothing and lifestyle products with modern design and traditional elegance",
    generator: 'v0.app',
    icons,
  } satisfies Metadata
})())

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body className="antialiased font-serif">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress MetaMask connection errors from browser extensions
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && typeof event.reason === 'object' && 
                    (event.reason.message?.includes('MetaMask') || 
                     event.reason.message?.includes('ethereum') ||
                     event.reason.toString().includes('Failed to connect to MetaMask'))) {
                  console.warn('Suppressed MetaMask-related error from browser extension:', event.reason);
                  event.preventDefault();
                }
              });

              // Also suppress plain 'error' events that bubble up from injected providers
              window.addEventListener('error', function(event) {
                const msg = String(event?.error?.message || event?.message || '')
                if (msg.includes('MetaMask') || msg.includes('ethereum') || msg.includes('Failed to connect to MetaMask')) {
                  console.warn('Suppressed MetaMask-related window error:', msg)
                  event.preventDefault()
                }
              }, true);
            `,
          }}
        />
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
