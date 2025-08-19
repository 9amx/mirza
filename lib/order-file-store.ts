import fs from 'fs'
import path from 'path'
import { DatabaseOrder } from './database'

const DATA_DIR = path.join(process.cwd(), 'data')
const ORDERS_PATH = path.join(DATA_DIR, 'orders.json')

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(ORDERS_PATH)) {
      fs.writeFileSync(ORDERS_PATH, JSON.stringify([], null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('Failed to ensure orders data file:', error)
  }
}

function readOrders(): DatabaseOrder[] {
  try {
    ensureDataFile()
    const raw = fs.readFileSync(ORDERS_PATH, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data as DatabaseOrder[] : []
  } catch (error) {
    console.error('Failed to read orders file:', error)
    return []
  }
}

function writeOrders(orders: DatabaseOrder[]): void {
  try {
    ensureDataFile()
    fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write orders file:', error)
  }
}

export const OrderFileStore = {
  getAll(): DatabaseOrder[] {
    return readOrders().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  create(order: Omit<DatabaseOrder, 'id' | 'created_at'>): DatabaseOrder {
    const all = readOrders()
    const now = new Date().toISOString()
    const newOrder: DatabaseOrder = {
      ...order,
      id: Date.now().toString(),
      created_at: now,
    }
    all.push(newOrder)
    writeOrders(all)
    return newOrder
  },

  update(id: string, updates: Partial<DatabaseOrder>): DatabaseOrder | null {
    const all = readOrders()
    const index = all.findIndex(o => o.id === id)
    if (index === -1) return null
    const updated: DatabaseOrder = {
      ...all[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    all[index] = updated
    writeOrders(all)
    return updated
  },

  delete(id: string): boolean {
    const all = readOrders()
    const index = all.findIndex(o => o.id === id)
    if (index === -1) return false
    all.splice(index, 1)
    writeOrders(all)
    return true
  },

  findById(id: string): DatabaseOrder | null {
    const all = readOrders()
    return all.find(o => o.id === id) || null
  }
}
