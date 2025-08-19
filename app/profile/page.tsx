import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile Settings - ModernStore",
  description: "Manage your account settings and personal information",
}

export default async function ProfilePage() {
  redirect("/auth/signin")
}
