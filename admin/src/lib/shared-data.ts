// Re-export shared data from the main application
export * from '../../../lib/shared-data'

// Admin-specific data management
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export class AdminDataService {
  static async fetchProducts(params?: { category?: string; search?: string; featured?: boolean }) {
    const url = new URL(`${API_BASE_URL}/products`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch products')
    return response.json()
  }

  static async createProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    if (!response.ok) throw new Error('Failed to create product')
    return response.json()
  }

  static async updateProduct(id: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    })
    if (!response.ok) throw new Error('Failed to update product')
    return response.json()
  }

  static async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete product')
    return response.json()
  }

  static async fetchUsers(params?: { role?: string; search?: string }) {
    const url = new URL(`${API_BASE_URL}/users`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch users')
    return response.json()
  }

  static async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) throw new Error('Failed to create user')
    return response.json()
  }

  static async fetchOrders(params?: { status?: string; userId?: string }) {
    const url = new URL(`${API_BASE_URL}/orders`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      })
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Failed to fetch orders')
    return response.json()
  }

  static async createOrder(orderData: any) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    if (!response.ok) throw new Error('Failed to create order')
    return response.json()
  }

  static async fetchDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/dashboard`)
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    return response.json()
  }
}
