import fs from 'fs'
import path from 'path'
import { DatabaseUser } from './database'

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_PATH = path.join(DATA_DIR, 'users.json')

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }
    if (!fs.existsSync(USERS_PATH)) {
      fs.writeFileSync(USERS_PATH, JSON.stringify([], null, 2), 'utf-8')
    }
  } catch (error) {
    console.error('Failed to ensure users data file:', error)
  }
}

function readUsers(): DatabaseUser[] {
  try {
    ensureDataFile()
    const raw = fs.readFileSync(USERS_PATH, 'utf-8')
    const data = JSON.parse(raw)
    return Array.isArray(data) ? (data as DatabaseUser[]) : []
  } catch (error) {
    console.error('Failed to read users file:', error)
    return []
  }
}

function writeUsers(users: DatabaseUser[]): void {
  try {
    ensureDataFile()
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf-8')
  } catch (error) {
    console.error('Failed to write users file:', error)
  }
}

export const UserFileStore = {
  getAll(): DatabaseUser[] {
    return readUsers().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  create(user: Omit<DatabaseUser, 'id' | 'created_at'>): DatabaseUser {
    const all = readUsers()
    const now = new Date().toISOString()
    const newUser: DatabaseUser = {
      ...user,
      id: Date.now().toString(),
      created_at: now,
    }
    all.push(newUser)
    writeUsers(all)
    return newUser
  },

  update(id: string, updates: Partial<DatabaseUser>): DatabaseUser | null {
    const all = readUsers()
    const index = all.findIndex(u => u.id === id)
    if (index === -1) return null
    const updated: DatabaseUser = {
      ...all[index],
      ...updates,
    }
    all[index] = updated
    writeUsers(all)
    return updated
  },

  delete(id: string): boolean {
    const all = readUsers()
    const index = all.findIndex(u => u.id === id)
    if (index === -1) return false
    all.splice(index, 1)
    writeUsers(all)
    return true
  },

  findById(id: string): DatabaseUser | null {
    const all = readUsers()
    return all.find(u => u.id === id) || null
  }
}
