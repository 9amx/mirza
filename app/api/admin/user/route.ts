import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminSession = request.cookies.get('admin_session')
    const adminUser = request.cookies.get('admin_user')

    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!adminUser) {
      return NextResponse.json(
        { error: 'User info not found' },
        { status: 404 }
      )
    }

    try {
      const userData = JSON.parse(adminUser.value)
      return NextResponse.json({ user: userData })
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error getting admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
