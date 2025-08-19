import { NextRequest, NextResponse } from 'next/server'
import { SettingsFileStore } from '@/lib/settings-file-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const settings = SettingsFileStore.get()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const updated = SettingsFileStore.update({
      storeName: body.storeName,
      faviconPath: body.faviconPath,
      whatsappNumber: body.whatsappNumber,
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid settings' }, { status: 400 })
  }
}


