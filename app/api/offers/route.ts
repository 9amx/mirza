import { NextRequest, NextResponse } from 'next/server'
import { dataManager } from '@/lib/shared-data'
import { OfferFileStore, OfferRecord } from '@/lib/offer-file-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    
    console.log('GET /api/offers called')
    
    // Get offers from file store
    let offers: OfferRecord[] = OfferFileStore.getAll()
    console.log('Initial offers from file store:', offers.length)
    
    // If no offers exist, just return empty array (no auto-creation)
    if (!offers || offers.length === 0) {
      console.log('No offers found in file store')
      offers = []
    }
    
    // Filter by active status
    if (active === 'true') {
      offers = offers.filter(o => o.is_active)
    }
    
    console.log('Returning offers:', offers.length)
    return NextResponse.json(offers)
  } catch (error) {
    console.error('GET /api/offers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, discount_percentage, start_date, end_date, is_active } = body || {}
    if (!title || typeof discount_percentage !== 'number' || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const record = OfferFileStore.create({
      title,
      description,
      discount_percentage,
      start_date: start_date || new Date().toISOString(),
      end_date,
      is_active: !!is_active,
    })
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body || {}
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const updated = OfferFileStore.update(id, updates)
    if (!updated) return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    console.log('DELETE request for offer ID:', id)
    
    if (!id) {
      console.log('Missing ID in DELETE request')
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    
    const ok = OfferFileStore.delete(id)
    console.log('Delete result:', ok)
    
    if (ok) {
      return NextResponse.json({ success: true, message: 'Offer deleted successfully' })
    } else {
      return NextResponse.json({ success: false, error: 'Offer not found or could not be deleted' }, { status: 404 })
    }
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete offer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
