"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Plus,
  Settings,
  BarChart3,
  PieChart
} from "lucide-react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  recentOrders: any[]
  popularProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    recentOrders: [],
    popularProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Use database service for better performance
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/orders', { cache: 'no-store' }),
          fetch('/api/users', { cache: 'no-store' })
        ])
        
        const products = await productsRes.json()
        const orders = await ordersRes.json()
        const users = await usersRes.json()
        
        // Calculate real statistics
        // Only count revenue from delivered orders
        const totalRevenue = orders
          .filter((o: any) => o.status === 'delivered')
          .reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0)
        const totalOrders = orders.length
        const totalProducts = products.length
        const totalUsers = users.length

        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((order: any) => ({
            id: order.id,
            customer_name: users.find((u: any) => u.id === order.user_id)?.name || 'Unknown Customer',
            status: order.status || 'Pending',
            total: order.total_amount || 0,
            date: order.created_at
          }))

        // Get popular products (featured products)
        const popularProducts = products
          .filter((product: any) => product.is_featured)
          .slice(0, 5)
          .map((product: any) => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            stock_quantity: product.stock_quantity,
            sales: Math.floor(Math.random() * 100) + 20 // Random sales for demo
          }))

        setStats({
          totalRevenue,
          totalOrders,
          totalProducts,
          totalUsers,
          recentOrders,
          popularProducts
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

    return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Panel" 
        subtitle="Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+20.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> new products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Products</h3>
                    <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Orders</h3>
                    <p className="text-sm text-muted-foreground">Track and manage orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage customers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm text-muted-foreground">View detailed reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                                     {stats.recentOrders.map((order: any, index: number) => (
                     <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                       <div>
                         <p className="font-medium">{order.id}</p>
                         <p className="text-sm text-muted-foreground">
                           {order.customer_name} • {order.status}
                         </p>
                         <p className="text-xs text-muted-foreground">
                           {new Date(order.date).toLocaleDateString('en-US', {
                             year: 'numeric',
                             month: 'short',
                             day: 'numeric'
                           })}
                         </p>
                       </div>
                                               <Badge variant="outline">৳{(order.total || 0).toLocaleString()}</Badge>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent orders</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.popularProducts.length > 0 ? (
                <div className="space-y-4">
                                     {stats.popularProducts.map((product: any, index: number) => (
                     <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                       <img
                         src={product.image_url || "/placeholder.svg"}
                         alt={product.name}
                         className="w-10 h-10 object-cover rounded-md"
                       />
                       <div className="flex-1">
                         <p className="font-medium">{product.name}</p>
                         <p className="text-sm text-muted-foreground">
                           {product.category} • ৳{product.price.toLocaleString()}
                         </p>
                         <p className="text-xs text-muted-foreground">
                           {product.sales} sales
                         </p>
                       </div>
                       <Badge variant="secondary">{product.stock_quantity} in stock</Badge>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
