import fs from 'fs'
import path from 'path'

export interface OfferRecord {
  id: string
  title: string
  description?: string
  discount_percentage: number
  start_date: string
  end_date: string
  is_active: boolean
}

const DATA_DIR = path.join(process.cwd(), 'data')
const OFFERS_PATH = path.join(DATA_DIR, 'offers.json')

function ensureDataFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(OFFERS_PATH)) fs.writeFileSync(OFFERS_PATH, JSON.stringify([], null, 2), 'utf-8')
}

function readOffers(): OfferRecord[] {
  ensureDataFile()
  try {
    return JSON.parse(fs.readFileSync(OFFERS_PATH, 'utf-8')) as OfferRecord[]
  } catch {
    return []
  }
}

function writeOffers(items: OfferRecord[]): void {
  ensureDataFile()
  fs.writeFileSync(OFFERS_PATH, JSON.stringify(items, null, 2), 'utf-8')
}

export const OfferFileStore = {
  getAll(): OfferRecord[] {
    return readOffers().sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
  },
  create(input: Omit<OfferRecord, 'id'>): OfferRecord {
    console.log('Creating new offer:', input.title)
    const all = readOffers()
    const record: OfferRecord = { ...input, id: Date.now().toString() }
    console.log('Generated ID for offer:', record.id)
    all.push(record)
    writeOffers(all)
    console.log('Offer created and saved to file store')
    return record
  },
  update(id: string, updates: Partial<OfferRecord>): OfferRecord | null {
    const all = readOffers()
    const idx = all.findIndex(o => o.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], ...updates }
    writeOffers(all)
    return all[idx]
  },
  delete(id: string): boolean {
    console.log('Attempting to delete offer with ID:', id)
    const all = readOffers()
    console.log('Current offers in file store:', all.map(o => ({ id: o.id, title: o.title })))
    const idx = all.findIndex(o => o.id === id)
    console.log('Found offer at index:', idx)
    if (idx === -1) {
      console.log('Offer not found in file store')
      return false
    }
    console.log('Deleting offer:', all[idx].title)
    all.splice(idx, 1)
    writeOffers(all)
    console.log('Offer deleted successfully')
    return true
  }
}


