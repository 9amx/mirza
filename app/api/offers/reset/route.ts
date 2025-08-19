import { NextRequest, NextResponse } from 'next/server'
import { OfferFileStore } from '@/lib/offer-file-store'
import fs from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data')
    const OFFERS_PATH = path.join(DATA_DIR, 'offers.json')
    
    console.log('Resetting all offers...')
    
    // Delete the offers file completely
    if (fs.existsSync(OFFERS_PATH)) {
      fs.unlinkSync(OFFERS_PATH)
      console.log('Offers file deleted')
    }
    
    // Recreate empty offers file
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    fs.writeFileSync(OFFERS_PATH, JSON.stringify([], null, 2), 'utf-8')
    console.log('Empty offers file created')
    
    return NextResponse.json({ 
      success: true, 
      message: 'All offers deleted successfully' 
    })
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset offers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
