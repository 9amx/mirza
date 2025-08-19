// Shared data types and interfaces
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  in_stock: boolean
  created_at: string
  updated_at?: string
  stock_quantity?: number
  discount_percentage?: number
  is_featured?: boolean
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'moderator'
  created_at: string
  last_login?: string
  is_active: boolean
}

export interface Order {
  id: string
  user_id: string
  products: Array<{
    product_id: string
    quantity: number
    price: number
  }>
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed'
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

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  product_count: number
  is_active: boolean
}

export interface Offer {
  id: string
  title: string
  description?: string
  discount_percentage: number
  start_date: string
  end_date: string
  is_active: boolean
  applicable_products?: string[]
  minimum_purchase?: number
}

// Mock data for development
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Traditional Silk Saree",
    description: "Elegant silk saree with traditional Bengali design",
    price: 2500,
    image_url: "/traditional-saree.png",
    category: "Saree",
    in_stock: true,
    created_at: "2024-01-15T10:00:00Z",
    stock_quantity: 15,
    discount_percentage: 20,
    is_featured: true
  },
  {
    id: "2",
    name: "Modern Burqa",
    description: "Contemporary design burqa with comfortable fit",
    price: 1800,
    image_url: "/modern-burqa.png",
    category: "Burqa",
    in_stock: true,
    created_at: "2024-01-16T11:00:00Z",
    stock_quantity: 25,
    discount_percentage: 15,
    is_featured: false
  },
  {
    id: "3",
    name: "Cotton Panjabi",
    description: "Comfortable cotton panjabi for formal occasions",
    price: 1200,
    image_url: "/cotton-panjabi.png",
    category: "Panjabi",
    in_stock: true,
    created_at: "2024-01-17T12:00:00Z",
    stock_quantity: 30,
    discount_percentage: 10,
    is_featured: true
  },
  {
    id: "4",
    name: "Formal Shirt",
    description: "Professional formal shirt for office wear",
    price: 800,
    image_url: "/formal-shirt.png",
    category: "Shirt",
    in_stock: true,
    created_at: "2024-01-18T13:00:00Z",
    stock_quantity: 40,
    discount_percentage: 25,
    is_featured: false
  },
  {
    id: "5",
    name: "Casual T-Shirt",
    description: "Comfortable casual t-shirt for everyday wear",
    price: 400,
    image_url: "/casual-t-shirt.png",
    category: "T-Shirt",
    in_stock: true,
    created_at: "2024-01-19T14:00:00Z",
    stock_quantity: 50,
    discount_percentage: 30,
    is_featured: true
  },
  {
    id: "6",
    name: "Denim Pants",
    description: "Classic denim pants with modern fit",
    price: 1500,
    image_url: "/denim-pants.png",
    category: "Pant",
    in_stock: true,
    created_at: "2024-01-20T15:00:00Z",
    stock_quantity: 35,
    discount_percentage: 20,
    is_featured: false
  },
  {
    id: "7",
    name: "Elegant Silk Saree",
    description: "Premium silk saree with golden border",
    price: 3500,
    image_url: "/elegant-silk-saree.png",
    category: "Saree",
    in_stock: true,
    created_at: "2024-01-21T10:00:00Z",
    stock_quantity: 10,
    discount_percentage: 25,
    is_featured: true
  },
  {
    id: "8",
    name: "Designer Burqa",
    description: "Luxury designer burqa with embroidery",
    price: 2800,
    image_url: "/designer-burqa.png",
    category: "Burqa",
    in_stock: true,
    created_at: "2024-01-22T11:00:00Z",
    stock_quantity: 15,
    discount_percentage: 20,
    is_featured: true
  },
  {
    id: "9",
    name: "Classic Panjabi",
    description: "Traditional panjabi for special occasions",
    price: 2000,
    image_url: "/classic-panjabi.png",
    category: "Panjabi",
    in_stock: true,
    created_at: "2024-01-23T12:00:00Z",
    stock_quantity: 20,
    discount_percentage: 15,
    is_featured: false
  },
  {
    id: "10",
    name: "Business Shirt",
    description: "Professional business shirt for corporate wear",
    price: 1200,
    image_url: "/business-shirt.png",
    category: "Shirt",
    in_stock: true,
    created_at: "2024-01-24T13:00:00Z",
    stock_quantity: 30,
    discount_percentage: 30,
    is_featured: true
  },
  {
    id: "11",
    name: "Sports T-Shirt",
    description: "Comfortable sports t-shirt for active lifestyle",
    price: 600,
    image_url: "/sports-t-shirt.png",
    category: "T-Shirt",
    in_stock: true,
    created_at: "2024-01-25T14:00:00Z",
    stock_quantity: 45,
    discount_percentage: 35,
    is_featured: false
  },
  {
    id: "12",
    name: "Formal Pants",
    description: "Elegant formal pants for office wear",
    price: 1800,
    image_url: "/formal-pants.png",
    category: "Pant",
    in_stock: true,
    created_at: "2024-01-26T15:00:00Z",
    stock_quantity: 25,
    discount_percentage: 25,
    is_featured: true
  },
  {
    id: "13",
    name: "Wedding Saree",
    description: "Exquisite wedding saree with heavy work",
    price: 5000,
    image_url: "/wedding-saree.png",
    category: "Saree",
    in_stock: true,
    created_at: "2024-01-27T10:00:00Z",
    stock_quantity: 8,
    discount_percentage: 10,
    is_featured: true
  },
  {
    id: "14",
    name: "Casual Burqa",
    description: "Comfortable casual burqa for daily wear",
    price: 1200,
    image_url: "/casual-burqa.png",
    category: "Burqa",
    in_stock: true,
    created_at: "2024-01-28T11:00:00Z",
    stock_quantity: 35,
    discount_percentage: 40,
    is_featured: false
  },
  {
    id: "15",
    name: "Party Panjabi",
    description: "Stylish party panjabi for celebrations",
    price: 2500,
    image_url: "/party-panjabi.png",
    category: "Panjabi",
    in_stock: true,
    created_at: "2024-01-29T12:00:00Z",
    stock_quantity: 18,
    discount_percentage: 20,
    is_featured: true
  }
]

export const mockUsers: User[] = [
  {
    id: "1",
    name: "আহমেদ রহমান",
    email: "ahmed@example.com",
    phone: "+880 1712345678",
    avatar: "/users/1.png",
    role: "customer",
    created_at: "2024-01-01T10:00:00Z",
    last_login: "2024-01-20T15:30:00Z",
    is_active: true
  },
  {
    id: "2",
    name: "ফাতেমা খাতুন",
    email: "fatema@example.com",
    phone: "+880 1812345678",
    avatar: "/users/2.png",
    role: "customer",
    created_at: "2024-01-02T11:00:00Z",
    last_login: "2024-01-19T14:20:00Z",
    is_active: true
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@Mirza Garments.com",
    phone: "+880 1912345678",
    avatar: "/users/3.png",
    role: "admin",
    created_at: "2024-01-01T09:00:00Z",
    last_login: "2024-01-20T16:00:00Z",
    is_active: true
  },
  {
    id: "4",
    name: "মোহাম্মদ আলী",
    email: "mohammad@example.com",
    phone: "+880 1612345678",
    avatar: "/users/4.png",
    role: "customer",
    created_at: "2024-01-05T12:00:00Z",
    last_login: "2024-01-21T10:15:00Z",
    is_active: true
  },
  {
    id: "5",
    name: "আয়েশা সুলতানা",
    email: "ayesha@example.com",
    phone: "+880 1512345678",
    avatar: "/users/5.png",
    role: "customer",
    created_at: "2024-01-08T14:30:00Z",
    last_login: "2024-01-22T09:45:00Z",
    is_active: true
  },
  {
    id: "6",
    name: "রহমান মিয়া",
    email: "rahman@example.com",
    phone: "+880 1412345678",
    avatar: "/users/6.png",
    role: "customer",
    created_at: "2024-01-10T16:20:00Z",
    last_login: "2024-01-23T11:30:00Z",
    is_active: false
  },
  {
    id: "7",
    name: "নাজমা খাতুন",
    email: "nazma@example.com",
    phone: "+880 1312345678",
    avatar: "/users/7.png",
    role: "customer",
    created_at: "2024-01-12T08:45:00Z",
    last_login: "2024-01-24T13:20:00Z",
    is_active: true
  },
  {
    id: "8",
    name: "ইমরান হোসেন",
    email: "imran@example.com",
    phone: "+880 1212345678",
    avatar: "/users/8.png",
    role: "customer",
    created_at: "2024-01-15T11:10:00Z",
    last_login: "2024-01-25T15:55:00Z",
    is_active: true
  }
]

export const mockOrders: Order[] = [
  {
    id: "1",
    user_id: "1",
    products: [
      { product_id: "1", quantity: 1, price: 2500 },
      { product_id: "3", quantity: 2, price: 1200 }
    ],
    total_amount: 4900,
    status: "delivered",
    payment_status: "paid",
    shipping_address: {
      street: "123 Main Street",
      city: "Dhaka",
      state: "Dhaka",
      postal_code: "1200",
      country: "Bangladesh"
    },
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-18T14:00:00Z"
  },
  {
    id: "2",
    user_id: "2",
    products: [
      { product_id: "2", quantity: 1, price: 1800 },
      { product_id: "5", quantity: 3, price: 400 }
    ],
    total_amount: 3000,
    status: "processing",
    payment_status: "paid",
    shipping_address: {
      street: "456 Oak Avenue",
      city: "Chittagong",
      state: "Chittagong",
      postal_code: "4000",
      country: "Bangladesh"
    },
    created_at: "2024-01-18T12:00:00Z"
  },
  {
    id: "3",
    user_id: "1",
    products: [
      { product_id: "4", quantity: 1, price: 800 },
      { product_id: "6", quantity: 2, price: 1500 }
    ],
    total_amount: 3800,
    status: "shipped",
    payment_status: "paid",
    shipping_address: {
      street: "789 Pine Road",
      city: "Sylhet",
      state: "Sylhet",
      postal_code: "3100",
      country: "Bangladesh"
    },
    created_at: "2024-01-20T09:00:00Z"
  },
  {
    id: "4",
    user_id: "2",
    products: [
      { product_id: "7", quantity: 1, price: 3500 },
      { product_id: "8", quantity: 1, price: 2200 }
    ],
    total_amount: 5700,
    status: "pending",
    payment_status: "pending",
    shipping_address: {
      street: "321 Elm Street",
      city: "Rajshahi",
      state: "Rajshahi",
      postal_code: "6000",
      country: "Bangladesh"
    },
    created_at: "2024-01-22T14:30:00Z"
  },
  {
    id: "5",
    user_id: "3",
    products: [
      { product_id: "9", quantity: 1, price: 4200 },
      { product_id: "10", quantity: 1, price: 2800 }
    ],
    total_amount: 7000,
    status: "delivered",
    payment_status: "paid",
    shipping_address: {
      street: "654 Maple Drive",
      city: "Khulna",
      state: "Khulna",
      postal_code: "9000",
      country: "Bangladesh"
    },
    created_at: "2024-01-19T16:45:00Z"
  },
  {
    id: "6",
    user_id: "1",
    products: [
      { product_id: "11", quantity: 2, price: 600 },
      { product_id: "12", quantity: 1, price: 1800 }
    ],
    total_amount: 3000,
    status: "processing",
    payment_status: "paid",
    shipping_address: {
      street: "987 Cedar Lane",
      city: "Barisal",
      state: "Barisal",
      postal_code: "8200",
      country: "Bangladesh"
    },
    created_at: "2024-01-21T11:20:00Z"
  },
  {
    id: "7",
    user_id: "2",
    products: [
      { product_id: "13", quantity: 1, price: 5000 },
      { product_id: "14", quantity: 1, price: 1200 }
    ],
    total_amount: 6200,
    status: "shipped",
    payment_status: "paid",
    shipping_address: {
      street: "147 Birch Avenue",
      city: "Rangpur",
      state: "Rangpur",
      postal_code: "5400",
      country: "Bangladesh"
    },
    created_at: "2024-01-23T13:15:00Z"
  },
  {
    id: "8",
    user_id: "3",
    products: [
      { product_id: "15", quantity: 1, price: 2500 },
      { product_id: "1", quantity: 1, price: 2500 }
    ],
    total_amount: 5000,
    status: "pending",
    payment_status: "pending",
    shipping_address: {
      street: "258 Spruce Street",
      city: "Comilla",
      state: "Comilla",
      postal_code: "3500",
      country: "Bangladesh"
    },
    created_at: "2024-01-24T10:30:00Z"
  }
]

export const mockCategories: Category[] = [
  {
    id: "1",
    name: "Saree",
    description: "Traditional Bengali sarees",
    icon: "🥻",
    color: "from-pink-100 to-pink-50",
    product_count: 12,
    is_active: true
  },
  {
    id: "2",
    name: "Burqa",
    description: "Modern and traditional burqas",
    icon: "🧕",
    color: "from-purple-100 to-purple-50",
    product_count: 8,
    is_active: true
  },
  {
    id: "3",
    name: "Panjabi",
    description: "Traditional panjabis",
    icon: "👔",
    color: "from-blue-100 to-blue-50",
    product_count: 15,
    is_active: true
  },
  {
    id: "4",
    name: "Shirt",
    description: "Formal and casual shirts",
    icon: "👔",
    color: "from-green-100 to-green-50",
    product_count: 20,
    is_active: true
  },
  {
    id: "5",
    name: "T-Shirt",
    description: "Comfortable t-shirts",
    icon: "👕",
    color: "from-orange-100 to-orange-50",
    product_count: 25,
    is_active: true
  },
  {
    id: "6",
    name: "Pant",
    description: "Formal and casual pants",
    icon: "👖",
    color: "from-indigo-100 to-indigo-50",
    product_count: 18,
    is_active: true
  }
]

export const mockOffers: Offer[] = [
  {
    id: "1",
    title: "New Year Special",
    description: "Get 20% off on all products",
    discount_percentage: 20,
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-01-31T23:59:59Z",
    is_active: true,
    minimum_purchase: 1000
  },
  {
    id: "2",
    title: "Saree Collection Sale",
    description: "Special discount on saree collection",
    discount_percentage: 25,
    start_date: "2024-01-15T00:00:00Z",
    end_date: "2024-02-15T23:59:59Z",
    is_active: true,
    applicable_products: ["1", "2", "3"],
    minimum_purchase: 2000
  }
]

// Data management functions
export class DataManager {
  private static instance: DataManager
  private products: Product[] = mockProducts
  private users: User[] = mockUsers
  private orders: Order[] = mockOrders
  private categories: Category[] = mockCategories
  private offers: Offer[] = mockOffers

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager()
    }
    return DataManager.instance
  }

  // Product methods
  getProducts(): Product[] {
    return this.products
  }

  getProduct(id: string): Product | undefined {
    return this.products.find(p => p.id === id)
  }

  addProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    this.products.push(newProduct)
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return null
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    return this.products[index]
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) return false
    
    this.products.splice(index, 1)
    return true
  }

  // User methods
  getUsers(): User[] {
    return this.users
  }

  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id)
  }

  addUser(user: Omit<User, 'id' | 'created_at'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    this.users.push(newUser)
    return newUser
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id)
    if (index === -1) return null
    
    this.users[index] = {
      ...this.users[index],
      ...updates
    }
    return this.users[index]
  }

  // Order methods
  getOrders(): Order[] {
    return this.orders
  }

  getOrder(id: string): Order | undefined {
    return this.orders.find(o => o.id === id)
  }

  addOrder(order: Omit<Order, 'id' | 'created_at'>): Order {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    }
    this.orders.push(newOrder)
    return newOrder
  }

  updateOrderStatus(id: string, status: Order['status']): Order | null {
    const index = this.orders.findIndex(o => o.id === id)
    if (index === -1) return null
    
    this.orders[index] = {
      ...this.orders[index],
      status,
      updated_at: new Date().toISOString()
    }
    return this.orders[index]
  }

  // Category methods
  getCategories(): Category[] {
    return this.categories
  }

  // Offer methods
  getOffers(): Offer[] {
    return this.offers
  }

  // Analytics methods
  getDashboardStats() {
    const totalRevenue = this.orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, order) => sum + order.total_amount, 0)

    const totalOrders = this.orders.length
    const totalProducts = this.products.length
    const totalUsers = this.users.length

    const recentOrders = this.orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    const popularProducts = this.products
      .sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
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

export const dataManager = DataManager.getInstance()
