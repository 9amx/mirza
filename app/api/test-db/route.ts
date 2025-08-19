import { NextResponse } from 'next/server'
import { isDatabaseConfigured, supabase } from '@/lib/database'

export async function GET() {
  try {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!isDatabaseConfigured) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'Database not configured',
        hasUrl,
        hasKey,
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing'
        }
      })
    }

    // Test database connection
    const { data, error } = await supabase!
      .from('settings')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        status: 'connection_error',
        message: 'Database connection failed',
        error: error.message,
        hasUrl,
        hasKey
      })
    }

    return NextResponse.json({
      status: 'connected',
      message: 'Database connected successfully',
      data: data,
      hasUrl,
      hasKey
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error',
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
  }
}
