import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, base64 } = body

    if (!fileName || !base64) {
      return NextResponse.json({ error: 'Missing fileName or base64 data' }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const DATA_DIR = path.join(process.cwd(), 'data')
    const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
    const BANNER_DIR = path.join(UPLOADS_DIR, 'banner')

    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
    if (!fs.existsSync(BANNER_DIR)) fs.mkdirSync(BANNER_DIR, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const safeBase = `banner-${timestamp}`
    const ext = path.extname(fileName) || '.jpg'
    const finalName = safeBase + ext
    const filePath = path.join(BANNER_DIR, finalName)

    // Remove data URL prefix if present
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '')
    
    // Write file
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'))

    // Return the relative path
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/')
    
    return NextResponse.json({ 
      success: true, 
      imagePath: relativePath,
      fileName: finalName
    })
  } catch (error) {
    console.error('Banner upload error:', error)
    return NextResponse.json({ error: 'Failed to upload banner image' }, { status: 500 })
  }
}
