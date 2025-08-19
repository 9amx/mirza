"use client"

import { useEffect, useState } from "react"
import AppAreaChart from "@/components/AppAreaChart";
import AppBarChart from "@/components/AppBarChart";
import AppPieChart from "@/components/AppPieChart";
import CardList from "@/components/CardList";
import TodoList from "@/components/TodoList";
import { AdminDataService } from "@/lib/shared-data";

const Homepage = () => {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await AdminDataService.fetchDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Fallback to local data
        setStats({
          totalRevenue: 7900,
          totalOrders: 2,
          totalProducts: 6,
          totalUsers: 3,
          recentOrders: [],
          popularProducts: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppBarChart data={stats} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Latest Transactions" data={stats?.recentOrders} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <AppPieChart data={stats} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <TodoList />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg lg:col-span-2 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart data={stats} />
      </div>
      <div className="bg-primary-foreground p-4 rounded-lg">
        <CardList title="Popular Products" data={stats?.popularProducts} />
      </div>
    </div>
  );
};

export default Homepage;
