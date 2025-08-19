import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

// Always compute fresh stats
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const stats = await DatabaseService.getDashboardStats()
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
