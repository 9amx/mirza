"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  ArrowLeft,
  Calendar,
  Download,
  Filter
} from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  revenue: {
    total: number
    change: number
    monthly: number[]
  }
  orders: {
    total: number
    change: number
    monthly: number[]
  }
  users: {
    total: number
    change: number
    monthly: number[]
  }
  products: {
    total: number
    change: number
    categories: { name: string; count: number }[]
  }
  topProducts: { name: string; sales: number; revenue: number }[]
  recentActivity: { type: string; description: string; time: string }[]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    revenue: { total: 0, change: 0, monthly: [0, 0, 0, 0, 0] },
    orders: { total: 0, change: 0, monthly: [0, 0, 0, 0, 0] },
    users: { total: 0, change: 0, monthly: [0, 0, 0, 0, 0] },
    products: { total: 0, change: 0, categories: [] },
    topProducts: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [productsRes, ordersRes, usersRes, dashboardRes] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/orders', { cache: 'no-store' }),
          fetch('/api/users', { cache: 'no-store' }),
          fetch('/api/dashboard', { cache: 'no-store' })
        ])

        const [products, orders, users, dashboard] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          usersRes.json(),
          dashboardRes.json()
        ])

        // Delivered orders for revenue and top-products
        const deliveredOrders = orders.filter((o: any) => o.status === 'delivered')

        // Revenue total (already computed on backend too)
        const revenueTotal = typeof dashboard.totalRevenue === 'number'
          ? dashboard.totalRevenue
          : deliveredOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0)

        // Build last 5 months buckets
        const buildMonthly = (items: any[], amountFn: (x: any) => number) => {
          const now = new Date()
          const series = [] as number[]
          for (let i = 4; i >= 0; i--) {
            const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
            const sum = items
              .filter((x) => {
                const d = new Date(x.created_at)
                return d >= start && d < end
              })
              .reduce((acc, x) => acc + amountFn(x), 0)
            series.push(sum)
          }
          return series
        }

        const revenueMonthly = buildMonthly(deliveredOrders, (o) => o.total_amount || 0)
        const ordersMonthly = buildMonthly(orders, (_) => 1)
        const usersMonthly = buildMonthly(users, (_) => 1)

        // Categories from products
        const categoryMap = new Map<string, number>()
        for (const p of products) {
          if (!p.category) continue
          categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1)
        }
        const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        // Top products by delivered revenue
        const productRevenueMap = new Map<string, { name: string; revenue: number; sales: number }>()
        const productIdToProduct = new Map<string, any>(products.map((p: any) => [p.id, p]))
        for (const o of deliveredOrders) {
          for (const item of o.products || []) {
            const pid = item.product_id
            const qty = item.quantity || 1
            const price = item.price || 0
            const rev = price * qty
            const prod = productIdToProduct.get(pid)
            const name = prod?.name || pid
            const curr = productRevenueMap.get(pid) || { name, revenue: 0, sales: 0 }
            curr.revenue += rev
            curr.sales += qty
            productRevenueMap.set(pid, curr)
          }
        }
        const topProducts = Array.from(productRevenueMap.values())
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        // Recent activity (simple mix of last orders and users)
        const recentOrders = orders
          .slice()
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
          .map((o: any) => ({
            type: 'order',
            description: `Order #${o.id} ${o.status || 'created'}`,
            time: new Date(o.created_at).toLocaleString()
          }))

        const recentUsers = users
          .slice()
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 2)
          .map((u: any) => ({
            type: 'user',
            description: `New user ${u.name || u.email} registered`,
            time: new Date(u.created_at).toLocaleString()
          }))

        setData({
          revenue: { total: revenueTotal, change: 0, monthly: revenueMonthly },
          orders: { total: orders.length, change: 0, monthly: ordersMonthly },
          users: { total: users.length, change: 0, monthly: usersMonthly },
          products: { total: products.length, change: 0, categories },
          topProducts,
          recentActivity: [...recentOrders, ...recentUsers]
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analytics লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="font-bold text-xl text-foreground">
                <span className="text-primary">Analytics</span>
                <span className="text-accent">& Reports</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{data.revenue.total.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${getChangeColor(data.revenue.change)}`}>
                {getChangeIcon(data.revenue.change)}
                <span className="ml-1">{Math.abs(data.revenue.change)}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.orders.total.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${getChangeColor(data.orders.change)}`}>
                {getChangeIcon(data.orders.change)}
                <span className="ml-1">{Math.abs(data.orders.change)}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.users.total.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${getChangeColor(data.users.change)}`}>
                {getChangeIcon(data.users.change)}
                <span className="ml-1">{Math.abs(data.users.change)}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.products.total.toLocaleString()}</div>
              <div className={`flex items-center text-xs ${getChangeColor(data.products.change)}`}>
                {getChangeIcon(data.products.change)}
                <span className="ml-1">{Math.abs(data.products.change)}% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {data.revenue.monthly.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary/20 rounded-t"
                      style={{ 
                        height: `${(value / Math.max(...data.revenue.monthly)) * 200}px` 
                      }}
                    ></div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Product Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.products.categories.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] 
                        }}
                      ></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ 
                            width: `${(category.count / Math.max(...data.products.categories.map(c => c.count))) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-muted-foreground">{category.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">৳{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'user' ? 'bg-green-500' :
                      activity.type === 'product' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Reports */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">৳{data.revenue.total.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{data.orders.total.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{data.users.total.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
