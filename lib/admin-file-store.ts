import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export type AdminAccount = {
  id: string
  name: string
  email: string
  passwordHash: string
  salt: string
  updated_at?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const ADMIN_PATH = path.join(DATA_DIR, 'admin.json')

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function pbkdf2Hash(password: string, salt: string): string {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256')
  return hash.toString('base64')
}

function defaultAdmin(): AdminAccount {
  const salt = crypto.randomBytes(16).toString('base64')
  const passwordHash = pbkdf2Hash('admin123', salt)
  return {
    id: 'admin-1',
    name: 'Admin User',
    email: 'konok@admin.xyz',
    passwordHash,
    salt,
    updated_at: new Date().toISOString(),
  }
}

function readAdmin(): AdminAccount {
  ensureDir()
  if (!fs.existsSync(ADMIN_PATH)) {
    const admin = defaultAdmin()
    fs.writeFileSync(ADMIN_PATH, JSON.stringify(admin, null, 2), 'utf-8')
    return admin
  }
  const raw = fs.readFileSync(ADMIN_PATH, 'utf-8')
  const json = JSON.parse(raw)
  return json as AdminAccount
}

function writeAdmin(partial: Partial<AdminAccount>): AdminAccount {
  const curr = readAdmin()
  const next: AdminAccount = {
    ...curr,
    ...partial,
    updated_at: new Date().toISOString(),
  }
  fs.writeFileSync(ADMIN_PATH, JSON.stringify(next, null, 2), 'utf-8')
  return next
}

export const AdminFileStore = {
  get(): AdminAccount {
    return readAdmin()
  },
  verifyPassword(password: string): boolean {
    const admin = readAdmin()
    const hash = pbkdf2Hash(password, admin.salt)
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(admin.passwordHash))
  },
  updateName(name: string): AdminAccount {
    return writeAdmin({ name })
  },
  updateEmail(email: string): AdminAccount {
    const trimmed = email.trim()
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      throw new Error('Invalid email')
    }
    return writeAdmin({ email: trimmed })
  },
  updatePassword(currentPassword: string, newPassword: string): { ok: boolean; admin?: AdminAccount } {
    const admin = readAdmin()
    const ok = this.verifyPassword(currentPassword)
    if (!ok) return { ok: false }
    const salt = crypto.randomBytes(16).toString('base64')
    const passwordHash = pbkdf2Hash(newPassword, salt)
    const updated = writeAdmin({ salt, passwordHash })
    return { ok: true, admin: updated }
  },
}


