import fs from 'fs'
import path from 'path'

type DeliveryArea = {
  id: string
  name: string
  cost: number
  isActive: boolean
}

type DeliverySettings = {
  areas: DeliveryArea[]
  defaultCost: number
  updated_at?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DELIVERY_PATH = path.join(DATA_DIR, 'delivery.json')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readDeliverySettings(): DeliverySettings {
  try {
    ensureDirs()
    if (!fs.existsSync(DELIVERY_PATH)) {
      const defaults: DeliverySettings = {
        areas: [
          {
            id: 'thakurgaon',
            name: 'ঠাকুরগাঁও',
            cost: 60,
            isActive: true
          },
          {
            id: 'dinajpur',
            name: 'দিনাজপুর',
            cost: 60,
            isActive: true
          }
        ],
        defaultCost: 120,
        updated_at: new Date().toISOString()
      }
      fs.writeFileSync(DELIVERY_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(DELIVERY_PATH, 'utf-8')
    const json = JSON.parse(raw)
    return {
      areas: json.areas || [
        {
          id: 'thakurgaon',
          name: 'ঠাকুরগাঁও',
          cost: 60,
          isActive: true
        },
        {
          id: 'dinajpur',
          name: 'দিনাজপুর',
          cost: 60,
          isActive: true
        }
      ],
      defaultCost: json.defaultCost || 120,
      updated_at: json.updated_at
    }
  } catch (e) {
    return {
      areas: [
        {
          id: 'thakurgaon',
          name: 'ঠাকুরগাঁও',
          cost: 60,
          isActive: true
        },
        {
          id: 'dinajpur',
          name: 'দিনাজপুর',
          cost: 60,
          isActive: true
        }
      ],
      defaultCost: 120
    }
  }
}

function writeDeliverySettings(settings: DeliverySettings) {
  ensureDirs()
  const payload: DeliverySettings = {
    ...readDeliverySettings(),
    ...settings,
    updated_at: new Date().toISOString(),
  }
  fs.writeFileSync(DELIVERY_PATH, JSON.stringify(payload, null, 2), 'utf-8')
  return payload
}

export const DeliveryFileStore = {
  get(): DeliverySettings {
    return readDeliverySettings()
  },

  update(partial: Partial<DeliverySettings>): DeliverySettings {
    return writeDeliverySettings(partial)
  },

  addArea(area: Omit<DeliveryArea, 'id'>): DeliverySettings {
    const settings = readDeliverySettings()
    const newArea: DeliveryArea = {
      ...area,
      id: Date.now().toString()
    }
    settings.areas.push(newArea)
    return writeDeliverySettings(settings)
  },

  updateArea(id: string, updates: Partial<DeliveryArea>): DeliverySettings {
    const settings = readDeliverySettings()
    const areaIndex = settings.areas.findIndex(area => area.id === id)
    if (areaIndex !== -1) {
      settings.areas[areaIndex] = { ...settings.areas[areaIndex], ...updates }
    }
    return writeDeliverySettings(settings)
  },

  deleteArea(id: string): DeliverySettings {
    const settings = readDeliverySettings()
    settings.areas = settings.areas.filter(area => area.id !== id)
    return writeDeliverySettings(settings)
  },

  getDeliveryCost(areaName: string): number {
    const settings = readDeliverySettings()
    const area = settings.areas.find(
      area => area.isActive && area.name.toLowerCase().includes(areaName.toLowerCase())
    )
    return area ? area.cost : settings.defaultCost
  }
}
