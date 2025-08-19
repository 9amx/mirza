import { NextRequest, NextResponse } from 'next/server'
import { AdminFileStore } from '@/lib/admin-file-store'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    const admin = AdminFileStore.get()

    // Validate admin credentials
    if (email === admin.email && AdminFileStore.verifyPassword(password)) {
      const adminUser = { id: admin.id, name: admin.name, email: admin.email, role: 'admin' }

      const response = NextResponse.json({ 
        success: true, 
        user: adminUser 
      })

      // Set secure cookies
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 hours
      })

      response.cookies.set('admin_user', JSON.stringify(adminUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 // 24 hours
      })

      return response
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  
  // Clear admin cookies
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })

  response.cookies.set('admin_user', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0
  })

  return response
}
