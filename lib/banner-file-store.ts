import fs from 'fs'
import path from 'path'

type BannerSettings = {
  title: string
  subtitle: string
  offerText: string
  buttonText: string
  imageUrl: string
  isActive: boolean
  updated_at?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const BANNER_PATH = path.join(DATA_DIR, 'banner.json')

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

function readBanner(): BannerSettings {
  try {
    ensureDirs()
    if (!fs.existsSync(BANNER_PATH)) {
      const defaults: BannerSettings = {
        title: "আপনার পছন্দের স্টাইল খুঁজুন",
        subtitle: "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।",
        offerText: "৫০% পর্যন্ত ছাড় - সীমিত সময়ের অফার!",
        buttonText: "এখনই কিনুন →",
        imageUrl: "",
        isActive: true,
        updated_at: new Date().toISOString()
      }
      fs.writeFileSync(BANNER_PATH, JSON.stringify(defaults, null, 2), 'utf-8')
      return defaults
    }
    const raw = fs.readFileSync(BANNER_PATH, 'utf-8')
    const json = JSON.parse(raw)
    return {
      title: json.title || "আপনার পছন্দের স্টাইল খুঁজুন",
      subtitle: json.subtitle || "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।",
      offerText: json.offerText || "৫০% পর্যন্ত ছাড় - সীমিত সময়ের অফার!",
      buttonText: json.buttonText || "এখনই কিনুন →",
      imageUrl: json.imageUrl || "",
      isActive: json.isActive !== undefined ? json.isActive : true,
      updated_at: json.updated_at,
    }
  } catch (e) {
    return {
      title: "আপনার পছন্দের স্টাইল খুঁজুন",
      subtitle: "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।",
      offerText: "৫০% পর্যন্ত ছাড় - সীমিত সময়ের অফার!",
      buttonText: "এখনই কিনুন →",
      imageUrl: "",
      isActive: true
    }
  }
}

function writeBanner(banner: BannerSettings) {
  ensureDirs()
  const payload: BannerSettings = {
    ...readBanner(),
    ...banner,
    updated_at: new Date().toISOString(),
  }
  fs.writeFileSync(BANNER_PATH, JSON.stringify(payload, null, 2), 'utf-8')
  return payload
}

export const BannerFileStore = {
  get(): BannerSettings {
    return readBanner()
  },

  update(partial: Partial<BannerSettings>): BannerSettings {
    return writeBanner(partial)
  }
}
