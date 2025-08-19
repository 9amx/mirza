import { NextRequest, NextResponse } from 'next/server'
import { AdminFileStore } from '@/lib/admin-file-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const admin = AdminFileStore.get()
  return NextResponse.json({ id: admin.id, name: admin.name, email: admin.email, updated_at: admin.updated_at })
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, currentPassword, newPassword } = body || {}

    let updated = AdminFileStore.get()
    if (typeof name === 'string' && name.trim()) {
      updated = AdminFileStore.updateName(name.trim())
    }
    if (typeof email === 'string' && email.trim()) {
      try {
        updated = AdminFileStore.updateEmail(email.trim())
      } catch (e) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
      }
    }
    if (typeof newPassword === 'string' && newPassword.length >= 6) {
      const res = AdminFileStore.updatePassword(currentPassword || '', newPassword)
      if (!res.ok) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
      updated = res.admin!
    }

    return NextResponse.json({ id: updated.id, name: updated.name, email: updated.email, updated_at: updated.updated_at })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}


