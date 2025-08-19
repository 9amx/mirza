import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

function normalizePhone(input: string | undefined | null): string {
  if (!input) return ''
  // Map Bangla digits to ASCII and strip non-digits
  const banglaToAscii: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  }
  const converted = input
    .split('')
    .map(ch => banglaToAscii[ch] ?? ch)
    .join('')
  return converted.replace(/\D/g, '')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phoneParam = searchParams.get('phone')
    const orders = await DatabaseService.getOrders()
    if (phoneParam) {
      const target = normalizePhone(phoneParam)
      const filtered = orders.filter((o: any) => normalizePhone(o?.customer?.phone) === target)
      return NextResponse.json(filtered)
    }
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const order = await DatabaseService.createOrder(body)
    
    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
