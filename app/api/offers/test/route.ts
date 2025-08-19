import { NextRequest, NextResponse } from 'next/server'
import { OfferFileStore } from '@/lib/offer-file-store'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const DATA_DIR = path.join(process.cwd(), 'data')
    const OFFERS_PATH = path.join(DATA_DIR, 'offers.json')
    
    console.log('Data directory exists:', fs.existsSync(DATA_DIR))
    console.log('Offers file exists:', fs.existsSync(OFFERS_PATH))
    
    if (fs.existsSync(OFFERS_PATH)) {
      const content = fs.readFileSync(OFFERS_PATH, 'utf-8')
      console.log('File content:', content)
    }
    
    const offers = OfferFileStore.getAll()
    console.log('Offers from store:', offers)
    
    return NextResponse.json({
      dataDirExists: fs.existsSync(DATA_DIR),
      offersFileExists: fs.existsSync(OFFERS_PATH),
      offersCount: offers.length,
      offers: offers
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
