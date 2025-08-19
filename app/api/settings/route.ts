import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const settings = await DatabaseService.getSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    
    const updated = await DatabaseService.updateSettings({
      store_name: body.storeName,
      contact_phone: body.whatsappNumber,
      // Add other fields as needed
    })
    
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
    
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}


