"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ShoppingCart, 
  Package, 
  Settings,
  BarChart3,
  LogOut,
  User,
  Menu,
  ChevronDown,
  Home,
  Database,
  ArrowLeft,
  Tag,
  Image,
  Truck
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  title: string
  subtitle?: string
  showBackButton?: boolean
  backUrl?: string
}

export function AdminHeader({ title, subtitle, showBackButton = false, backUrl = "/admin" }: AdminHeaderProps) {
  const [adminUser, setAdminUser] = useState<any>(null)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', {
        method: 'DELETE',
      })
      router.push("/admin/login")
    } catch (error) {
      console.error('Logout error:', error)
      document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "admin_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      router.push("/admin/login")
    }
  }

  useEffect(() => {
    const getAdminUser = async () => {
      try {
        const response = await fetch('/api/admin/user')
        if (response.ok) {
          const data = await response.json()
          setAdminUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching admin user:', error)
      }
    }

    getAdminUser()
  }, [])

  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Title and Back button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {showBackButton && (
              <Link href={backUrl}>
                <Button variant="ghost" size="sm" className="p-2 sm:p-2">
                  <ArrowLeft className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </Link>
            )}
            <div className="font-bold text-lg sm:text-xl text-foreground">
              <span className="text-primary">Admin</span>
              <span className="text-accent">{title}</span>
            </div>
            {subtitle && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {subtitle}
              </Badge>
            )}
          </div>

          {/* Right side - User info and menu */}
          <div className="flex items-center gap-1 sm:gap-2">
            {adminUser && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mr-2">
                <User className="h-4 w-4" />
                <span>Welcome, {adminUser.name}</span>
              </div>
            )}
            
            {/* Admin Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 p-2 sm:p-2">
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Menu</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/products" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Manage Products
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/orders" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    View Orders
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Manage Users
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/offers" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Manage Offers
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/banner" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Manage Banner
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/delivery" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Manage Delivery
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Back to Store
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
