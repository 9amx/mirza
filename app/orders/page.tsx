import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "My Orders - ModernStore",
  description: "View your order history and track purchases",
}

export default async function OrdersPage() {
  redirect("/auth/signin")
}
