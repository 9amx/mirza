import { NextRequest, NextResponse } from 'next/server'
import { SettingsFileStore } from '@/lib/settings-file-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const { fileName, base64 } = await req.json()
      if (!fileName || !base64) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
      const data = Buffer.from(base64.split(',').pop() || base64, 'base64')
      const relPath = SettingsFileStore.saveFavicon(fileName, data)
      const updated = SettingsFileStore.update({ faviconPath: '/' + relPath.replace(/^\//, '') })
      return NextResponse.json(updated)
    }

    // Fallback: multipart form-data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const relPath = SettingsFileStore.saveFavicon(file.name, buffer)
    const updated = SettingsFileStore.update({ faviconPath: '/' + relPath.replace(/^\//, '') })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}


