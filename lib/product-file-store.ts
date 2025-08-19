import fs from 'fs'
import path from 'path'
import { DatabaseProduct } from './database'
import { mockProducts } from './shared-data'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json')

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(PRODUCTS_PATH)) {
      fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(mockProducts, null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('Failed to ensure data file:', error)
  }
}

function readProducts(): DatabaseProduct[] {
  try {
    ensureDataFile()
    const raw = fs.readFileSync(PRODUCTS_PATH, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data as DatabaseProduct[] : []
  } catch (error) {
    console.error('Failed to read products file:', error)
    return []
  }
}

function writeProducts(products: DatabaseProduct[]): void {
  try {
    ensureDataFile()
    fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write products file:', error)
  }
}

export const ProductFileStore = {
  getAll(): DatabaseProduct[] {
    return readProducts().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  create(product: Omit<DatabaseProduct, 'id' | 'created_at'>): DatabaseProduct {
    const all = readProducts()
    const now = new Date().toISOString()
    const newProduct: DatabaseProduct = {
      ...product,
      id: Date.now().toString(),
      created_at: now,
    }
    all.push(newProduct)
    writeProducts(all)
    return newProduct
  },

  update(id: string, updates: Partial<DatabaseProduct>): DatabaseProduct | null {
    const all = readProducts()
    const index = all.findIndex(p => p.id === id)
    if (index === -1) return null
    const updated: DatabaseProduct = {
      ...all[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    all[index] = updated
    writeProducts(all)
    return updated
  },

  delete(id: string): boolean {
    const all = readProducts()
    const index = all.findIndex(p => p.id === id)
    if (index === -1) return false
    all.splice(index, 1)
    writeProducts(all)
    return true
  }
}


