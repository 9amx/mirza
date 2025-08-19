import fs from 'fs'
import path from 'path'

type SiteSettings = {
  storeName: string
  faviconPath?: string
  whatsappNumber?: string
  updated_at?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function readSettings(): SiteSettings {
  try {
    ensureDirs()
    if (!fs.existsSync(SETTINGS_PATH)) {
      const defaults: SiteSettings = { storeName: 'Mirza Garments', whatsappNumber: '+880 1712345678', updated_at: new Date().toISOString() }
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
    const json = JSON.parse(raw)
    return {
      storeName: json.storeName || 'Mirza Garments',
      faviconPath: json.faviconPath,
      whatsappNumber: json.whatsappNumber || '+880 1712345678',
      updated_at: json.updated_at,
    }
  } catch (e) {
    return { storeName: 'Mirza Garments', whatsappNumber: '+880 1712345678' }
  }
}

function writeSettings(settings: SiteSettings) {
  ensureDirs()
  const payload: SiteSettings = {
    ...readSettings(),
    ...settings,
    updated_at: new Date().toISOString(),
  }
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(payload, null, 2), 'utf-8')
  return payload
}

export const SettingsFileStore = {
  get(): SiteSettings {
    return readSettings()
  },

  update(partial: Partial<SiteSettings>): SiteSettings {
    return writeSettings(partial)
  },

  saveFavicon(fileName: string, data: Buffer): string {
    ensureDirs()
    const safeBase = 'favicon-' + Date.now()
    const ext = path.extname(fileName) || '.ico'
    const finalName = safeBase + ext
    const dest = path.join(UPLOADS_DIR, finalName)
    fs.writeFileSync(dest, data)
    return path.relative(process.cwd(), dest).replace(/\\/g, '/')
  }
}


