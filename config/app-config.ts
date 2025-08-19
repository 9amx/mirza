export const AppConfig = {
  // Main web application settings
  web: {
    name: 'Mirza Garments',
    description: 'Premium Fashion & Lifestyle',
    url: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
    port: process.env.PORT || 3000
  },
  
  // Admin panel settings
  admin: {
    name: 'Mirza Garments Admin',
    description: 'Admin Panel for Mirza Garments',
    url: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
    port: process.env.ADMIN_PORT || 3001
  },
  
  // API settings
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retries: 3
  },
  
  // Database settings (for future use)
  database: {
    type: 'mock', // 'mock', 'sqlite', 'postgresql', 'mongodb'
    url: process.env.DATABASE_URL || 'mock://localhost'
  },
  
  // Authentication settings
  auth: {
    enabled: false, // Set to true when implementing authentication
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d'
  },
  
  // Feature flags
  features: {
    realTimeUpdates: false,
    notifications: false,
    analytics: true,
    search: true,
    filters: true
  },
  
  // UI settings
  ui: {
    theme: 'system', // 'light', 'dark', 'system'
    language: 'bn', // 'en', 'bn'
    currency: 'BDT',
    dateFormat: 'DD/MM/YYYY'
  }
}

export default AppConfig
