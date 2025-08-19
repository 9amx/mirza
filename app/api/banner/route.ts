import { NextRequest, NextResponse } from 'next/server'
import { BannerFileStore } from '@/lib/banner-file-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const banner = BannerFileStore.get()
  return NextResponse.json(banner)
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const updated = BannerFileStore.update({
      title: body.title,
      subtitle: body.subtitle,
      offerText: body.offerText,
      buttonText: body.buttonText,
      imageUrl: body.imageUrl,
      isActive: body.isActive
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid banner settings' }, { status: 400 })
  }
}
