import { createClient } from '@supabase/supabase-js'
import { dataManager } from './shared-data'
import { ProductFileStore } from './product-file-store'
import { OrderFileStore } from './order-file-store'
import { UserFileStore } from './user-file-store'

// Check if Supabase environment variables are configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if database is configured
export const isDatabaseConfigured = !!supabase

// Database types
export interface DatabaseProduct {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
  stock_quantity: number
  discount_percentage: number
  is_featured: boolean
  sizes?: string[]
  created_at: string
  updated_at?: string
}

export interface DatabaseUser {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'moderator'
  is_active: boolean
  created_at: string
  last_login?: string
}

export interface DatabaseOrder {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'out_for_delivery' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
  products?: Array<{ product_id: string; quantity: number; price: number }>
  shipping_address: {
    street: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  created_at: string
  updated_at?: string
}

export interface DatabaseOrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
}

// Database operations
export class DatabaseService {
  // Product operations
  static async getProducts(): Promise<DatabaseProduct[]> {
    // If database is not configured, use mock data
    if (!isDatabaseConfigured) {
      console.log('Database not configured, using file store')
      return ProductFileStore.getAll()
    }

    try {
      const { data, error } = await supabase!
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching products:', error)
        return dataManager.getProducts() // Fallback to mock data
      }
      
      return data || []
    } catch (error) {
      console.error('Database connection error, using mock data:', error)
      return dataManager.getProducts() // Fallback to mock data
    }
  }

  static async getProduct(id: string): Promise<DatabaseProduct | null> {
    // If database is not configured, use mock data
    if (!isDatabaseConfigured) {
      return ProductFileStore.getAll().find(p => p.id === id) || null
    }

    try {
      const { data, error } = await supabase!
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching product:', error)
        return dataManager.getProducts().find(p => p.id === id) || null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error, using mock data:', error)
      return dataManager.getProducts().find(p => p.id === id) || null
    }
  }

  static async createProduct(product: Omit<DatabaseProduct, 'id' | 'created_at'>): Promise<DatabaseProduct | null> {
    // If database is not configured, use mock data
    if (!isDatabaseConfigured) {
      return ProductFileStore.create(product)
    }

    try {
      const { data, error } = await supabase!
        .from('products')
        .insert([product])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating product:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  static async updateProduct(id: string, updates: Partial<DatabaseProduct>): Promise<DatabaseProduct | null> {
    // If database is not configured, use mock data
    if (!isDatabaseConfigured) {
      return ProductFileStore.update(id, updates)
    }

    try {
      const { data, error } = await supabase!
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating product:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  static async deleteProduct(id: string): Promise<boolean> {
    // If database is not configured, use mock data
    if (!isDatabaseConfigured) {
      return ProductFileStore.delete(id)
    }

    try {
      const { error } = await supabase!
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting product:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Database connection error:', error)
      return false
    }
  }

  // User operations
  static async getUsers(): Promise<DatabaseUser[]> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return UserFileStore.getAll()
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        return UserFileStore.getAll() // Fallback to file store
      }
      
      return data || []
    } catch (error) {
      console.error('Database connection error, using file store:', error)
      return UserFileStore.getAll() // Fallback to file store
    }
  }

  static async getUser(id: string): Promise<DatabaseUser | null> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return UserFileStore.findById(id)
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching user:', error)
        return UserFileStore.findById(id)
      }
      
      return data
    } catch (error) {
      console.error('Database connection error, using file store:', error)
      return UserFileStore.findById(id)
    }
  }

  static async createUser(user: Omit<DatabaseUser, 'id' | 'created_at'>): Promise<DatabaseUser | null> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return UserFileStore.create(user)
    }

    try {
      const { data, error } = await supabase!
        .from('users')
        .insert([user])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  // Order operations
  static async getOrders(): Promise<DatabaseOrder[]> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return OrderFileStore.getAll()
    }

    try {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching orders:', error)
        return OrderFileStore.getAll() // Fallback to file store
      }
      
      return data || []
    } catch (error) {
      console.error('Database connection error, using file store:', error)
      return OrderFileStore.getAll() // Fallback to file store
    }
  }

  static async getOrder(id: string): Promise<DatabaseOrder | null> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return OrderFileStore.findById(id)
    }

    try {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('Error fetching order:', error)
        return OrderFileStore.findById(id)
      }
      
      return data
    } catch (error) {
      console.error('Database connection error, using file store:', error)
      return OrderFileStore.findById(id)
    }
  }

  static async createOrder(order: Omit<DatabaseOrder, 'id' | 'created_at'>): Promise<DatabaseOrder | null> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return OrderFileStore.create(order)
    }

    try {
      const { data, error } = await supabase!
        .from('orders')
        .insert([order])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating order:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  static async updateOrderStatus(id: string, status: DatabaseOrder['status']): Promise<DatabaseOrder | null> {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return OrderFileStore.update(id, { status })
    }

    try {
      const { data, error } = await supabase!
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating order status:', error)
        return null
      }
      
      return data
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  // Settings operations
  static async getSettings() {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return { storeName: 'Mirza Garments', faviconPath: '', whatsappNumber: '' }
    }

    try {
      const { data, error } = await supabase!
        .from('settings')
        .select('*')
        .eq('id', 'default')
        .single()
      
      if (error) {
        console.error('Error fetching settings:', error)
        return { storeName: 'Mirza Garments', faviconPath: '', whatsappNumber: '' }
      }
      
      return {
        storeName: data.store_name || 'Mirza Garments',
        faviconPath: '',
        whatsappNumber: data.contact_phone || ''
      }
    } catch (error) {
      console.error('Database connection error, using default settings:', error)
      return { storeName: 'Mirza Garments', faviconPath: '', whatsappNumber: '' }
    }
  }

  static async updateSettings(updates: Partial<{ store_name: string; contact_phone: string }>) {
    // If database is not configured, use file store
    if (!isDatabaseConfigured) {
      return { storeName: 'Mirza Garments', faviconPath: '', whatsappNumber: '' }
    }

    try {
      const { data, error } = await supabase!
        .from('settings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', 'default')
        .select()
        .single()
      
      if (error) {
        console.error('Error updating settings:', error)
        return null
      }
      
      return {
        storeName: data.store_name || 'Mirza Garments',
        faviconPath: '',
        whatsappNumber: data.contact_phone || ''
      }
    } catch (error) {
      console.error('Database connection error:', error)
      return null
    }
  }

  // Analytics operations
  static async getDashboardStats() {
    const [products, orders, users] = await Promise.all([
      this.getProducts(),
      this.getOrders(),
      this.getUsers()
    ])

    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((sum, order) => sum + order.total_amount, 0)

    const totalOrders = orders.length
    const totalProducts = products.length
    const totalUsers = users.length

    const recentOrders = orders.slice(0, 5)

    const popularProducts = products
      .filter(p => p.is_featured)
      .slice(0, 5)

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      popularProducts
    }
  }
}
