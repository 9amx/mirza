import { NextRequest, NextResponse } from 'next/server'
import { DeliveryFileStore } from '@/lib/delivery-file-store'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const deliverySettings = DeliveryFileStore.get()
  return NextResponse.json(deliverySettings)
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (body.action === 'updateSettings') {
      const updated = DeliveryFileStore.update({
        defaultCost: body.defaultCost
      })
      return NextResponse.json(updated)
    }
    
    if (body.action === 'addArea') {
      const updated = DeliveryFileStore.addArea({
        name: body.name,
        cost: body.cost,
        isActive: body.isActive
      })
      return NextResponse.json(updated)
    }
    
    if (body.action === 'updateArea') {
      const updated = DeliveryFileStore.updateArea(body.id, {
        name: body.name,
        cost: body.cost,
        isActive: body.isActive
      })
      return NextResponse.json(updated)
    }
    
    if (body.action === 'deleteArea') {
      const updated = DeliveryFileStore.deleteArea(body.id)
      return NextResponse.json(updated)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid delivery settings' }, { status: 400 })
  }
}
