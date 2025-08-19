"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, Menu, Star, Heart, Truck, Shield, Headphones, ArrowRight, Zap, Gift, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { dataManager } from "@/lib/shared-data"
import { CartIcon } from "@/components/cart-icon"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { logout } from "@/lib/firebase"


interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  in_stock: boolean
  discount_percentage?: number
  sizes?: string[]
  created_at: string
}

interface Offer {
  id: string
  title: string
  description?: string
  discount_percentage: number
  end_date: string
  is_active: boolean
}

const Homepage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [whatsappNumber, setWhatsappNumber] = useState<string>("+880 1700-000000")
  const [currentView, setCurrentView] = useState<"home" | "shop" | "categories" | "offers">("home")
  const [offers, setOffers] = useState<Offer[]>([])
  const [storeName, setStoreName] = useState<string>('Mirza Garments')
  const [banner, setBanner] = useState<any>({
    title: "আপনার পছন্দের স্টাইল খুঁজুন",
    subtitle: "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।",
    offerText: "৫০% পর্যন্ত ছাড় - সীমিত সময়ের অফার!",
    buttonText: "এখনই কিনুন →",
    imageUrl: "",
    isActive: true
  })
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const { addItem } = useCart() // Updated function name from addToCart to addItem
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [showCheckoutChoice, setShowCheckoutChoice] = useState(false)
  const [showTrackDialog, setShowTrackDialog] = useState(false)
  const [trackPhone, setTrackPhone] = useState("")
  const [trackResults, setTrackResults] = useState<any[]>([])
  const [isTracking, setIsTracking] = useState(false)
  const [hasTriedTracking, setHasTriedTracking] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(30)
  const goToCheckout = (direct: boolean) => {
    if (!user) {
      setShowCheckoutChoice(true)
      return
    }
    router.push(`/checkout?guest=${!user}&direct=${direct}`)
  }

  const handleTrackOrders = async () => {
    if (!trackPhone.trim()) return
    setIsTracking(true)
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(trackPhone)}`, { cache: 'no-store' })
      const data = await res.json()
      setTrackResults(Array.isArray(data) ? data : [])
      setHasTriedTracking(true)
    } catch (e) {
      setTrackResults([])
      setHasTriedTracking(true)
    } finally {
      setIsTracking(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, offersResponse, settingsResponse, bannerResponse] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/offers', { cache: 'no-store' }),
          fetch('/api/settings', { cache: 'no-store' }),
          fetch('/api/banner', { cache: 'no-store' })
        ])
        
        if (productsResponse.ok) {
          const products = await productsResponse.json()
          // Show newest products first
          const sorted = [...products].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          setAllProducts(sorted)
          setFilteredProducts(sorted.slice(0, 6))
        }
        
        if (offersResponse.ok) {
          const offers = await offersResponse.json()
          setOffers(offers)
        }

        if (settingsResponse.ok) {
          const settings = await settingsResponse.json()
          if (settings?.storeName) setStoreName(settings.storeName)
          if (settings?.whatsappNumber) setWhatsappNumber(settings.whatsappNumber)
        }
        
        if (bannerResponse.ok) {
          const bannerData = await bannerResponse.json()
          setBanner(bannerData)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to local data
        const products = dataManager.getProducts().sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        const offers = dataManager.getOffers()
        setAllProducts(products)
        setFilteredProducts(products.slice(0, 6))
        setOffers(offers)
        setWhatsappNumber("+880 1712345678") // Default fallback
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getSearchSuggestions = (term: string) => {
    if (!term.trim()) return []
    
    return allProducts
      .filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.description?.toLowerCase().includes(term.toLowerCase()) ||
        product.category?.toLowerCase().includes(term.toLowerCase())
      )
      .slice(0, 5) // Show max 5 suggestions
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setShowSearchSuggestions(term.trim().length > 0)
    setCurrentPage(1) // Reset to first page when searching
    console.log("Search term:", term)
    console.log("All products:", allProducts.length)
    
    if (!term.trim()) {
      // If search is empty, show all products or filtered by category
      if (selectedCategory) {
        const filtered = allProducts.filter(
          (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )
        console.log("Category filtered:", filtered.length)
        setFilteredProducts(filtered)
      } else {
        const productsToShow = currentView === "shop" ? allProducts : allProducts.slice(0, 6)
        console.log("Products to show:", productsToShow.length)
        setFilteredProducts(productsToShow)
      }
    } else {
      // Filter products by search term
      const searchFiltered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.description?.toLowerCase().includes(term.toLowerCase()) ||
          product.category?.toLowerCase().includes(term.toLowerCase()),
      )
      console.log("Search filtered:", searchFiltered.length, searchFiltered.map(p => p.name))

      // If category is selected, further filter by category
      if (selectedCategory) {
        const categoryFiltered = searchFiltered.filter(
          (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )
        console.log("Category + search filtered:", categoryFiltered.length)
        setFilteredProducts(categoryFiltered)
      } else {
        setFilteredProducts(searchFiltered)
      }
    }
  }

  const handleSuggestionClick = (product: Product) => {
    setSearchTerm(product.name)
    setShowSearchSuggestions(false)
    setShowMobileSearch(false)
    // Navigate to product details page
    router.push(`/products/${product.id}`)
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleCategoryClick = (category: string) => {
    setCurrentPage(1) // Reset to first page when changing category
    if (selectedCategory === category) {
      setSelectedCategory(null)
      if (searchTerm.trim()) {
        handleSearch(searchTerm)
      } else {
        setFilteredProducts(allProducts.slice(0, 6))
      }
    } else {
      setSelectedCategory(category)
      if (searchTerm.trim()) {
        const searchFiltered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        const categoryFiltered = searchFiltered.filter(
          (product) => product.category?.toLowerCase() === category.toLowerCase(),
        )
        setFilteredProducts(categoryFiltered)
      } else {
        const filtered = allProducts.filter((product) => product.category?.toLowerCase() === category.toLowerCase())
        setFilteredProducts(filtered)
      }
    }
  }

  // Helper function to calculate discounted price
  const getDiscountedPrice = (product: Product) => {
    const discountPercentage = product.discount_percentage || 0
    return product.price * (1 - discountPercentage / 100)
  }

  const handleNavigation = (view: "home" | "shop" | "categories" | "offers") => {
    setCurrentView(view)
    setCurrentPage(1) // Reset to first page when changing views
    if (view === "shop") {
      if (searchTerm.trim()) {
        handleSearch(searchTerm)
      } else {
        setFilteredProducts(allProducts)
      }
      setSelectedCategory(null)
    } else if (view === "home") {
      if (searchTerm.trim()) {
        handleSearch(searchTerm)
      } else {
        setFilteredProducts(allProducts.slice(0, 6))
      }
      setSelectedCategory(null)
    }
  }

  const categories = [
    { name: "শাড়ি", icon: "🥻", color: "from-pink-100 to-pink-50", category: "Saree" },
    { name: "বোরকা", icon: "🧕", color: "from-purple-100 to-purple-50", category: "Burqa" },
    { name: "পাঞ্জাবি", icon: "👔", color: "from-blue-100 to-blue-50", category: "Panjabi" },
    { name: "শার্ট", icon: "👔", color: "from-green-100 to-green-50", category: "Shirt" },
    { name: "টি-শার্ট", icon: "👕", color: "from-orange-100 to-orange-50", category: "T-Shirt" },
    { name: "প্যান্ট", icon: "👖", color: "from-indigo-100 to-indigo-50", category: "Pant" },
  ]

  const renderOffersView = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair-display)] mb-4">
            বিশেষ অফার
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-source-sans-pro)]">
            সীমিত সময়ের জন্য বিশেষ ছাড় এবং অফার
          </p>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-16">
            <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">কোন অফার উপলব্ধ নেই</h3>
            <p className="text-muted-foreground">নতুন অফার আসলে এখানে দেখা যাবে।</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offers
              .filter((offer) => offer.is_active)
              .map((offer, index) => (
                <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                          {offer.discount_percentage}% ছাড়
                        </Badge>
                        <Gift className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-foreground mb-2">{offer.title}</h3>
                        {offer.description && <p className="text-muted-foreground mb-4">{offer.description}</p>}
                        {offer.end_date && (
                          <p className="text-sm text-muted-foreground">
                            শেষ তারিখ: {new Date(offer.end_date).toLocaleDateString("bn-BD")}
                          </p>
                        )}
                      </div>
                      <Button className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70">
                        অফার দেখুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </section>
  )

  const renderCategoriesView = () => (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair-display)] mb-4">
            সব ক্যাটাগরি
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-source-sans-pro)]">
            আপনার পছন্দের পণ্যের ক্যাটাগরি বেছে নিন
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => {
                handleCategoryClick(category.category)
                setCurrentView("home")
              }}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300`}
                >
                  {category.icon}
                </div>
                <h3 className="font-bold text-lg text-card-foreground font-[family-name:var(--font-playfair-display)]">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {allProducts.filter((p) => p.category?.toLowerCase() === category.category.toLowerCase()).length} টি
                  পণ্য
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <button
                onClick={() => handleNavigation("home")}
                className="font-bold text-xl text-foreground font-[family-name:var(--font-playfair-display)]"
              >
                {storeName.length > 2 ? (
                  <>
                    <span className="text-primary">{storeName.slice(0, -2)}</span>
                    <span className="text-accent">{storeName.slice(-2)}</span>
                  </>
                ) : (
                  <span className="text-primary">{storeName}</span>
                )}
              </button>
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => handleNavigation("shop")}
                  className={`transition-colors font-medium ${currentView === "shop" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  দোকান
                </button>
                <button
                  onClick={() => handleNavigation("categories")}
                  className={`transition-colors font-medium ${currentView === "categories" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  ক্যাটাগরি
                </button>
                <button
                  onClick={() => handleNavigation("offers")}
                  className={`transition-colors font-medium ${currentView === "offers" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  অফার
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex relative">
                <div className="flex items-center bg-input rounded-xl px-4 py-2 max-w-sm border border-border/50 focus-within:border-primary/50 transition-colors animate-fade-in">
                  <Search className="h-4 w-4 text-muted-foreground mr-2" />
                  <input
                    type="text"
                    placeholder="পণ্য খুঁজুন..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(searchTerm.trim().length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    className="bg-transparent border-none outline-none text-sm flex-1"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => handleSearch("")}
                      className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && getSearchSuggestions(searchTerm).length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {getSearchSuggestions(searchTerm).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 last:border-b-0"
                      >
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-foreground truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {product.category} • ৳{getDiscountedPrice(product).toFixed(0)}
                          </p>
                        </div>
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <CartIcon />
              <div className="hidden md:flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {user.email}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link href="/signin">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center bg-input rounded-xl px-4 py-2 flex-1 mr-4 border border-border/50 focus-within:border-primary/50 transition-colors">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-sm flex-1"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMobileSearch(false)}
            >
              ✕
            </Button>
          </div>
          <div className="p-4">
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm ? `"${searchTerm}" এর জন্য ${filteredProducts.length} টি ফলাফল পাওয়া গেছে` : "পণ্য খুঁজুন"}
            </p>
            
            {/* Mobile Search Suggestions */}
            {searchTerm && getSearchSuggestions(searchTerm).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">সাজেশন:</h4>
                {getSearchSuggestions(searchTerm).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      handleSuggestionClick(product)
                      setShowMobileSearch(false)
                    }}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground truncate">
                        {product.name}
                      </h4>
                                                <p className="text-xs text-muted-foreground truncate">
                            {product.category} • ৳{getDiscountedPrice(product).toFixed(0)}
                          </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === "offers" && renderOffersView()}
      {currentView === "categories" && renderCategoriesView()}

      {(currentView === "home" || currentView === "shop") && (
        <>
          {/* Hero Section - only show on home */}
          {currentView === "home" && banner.isActive && (
            <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-32 overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
              <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
              <div
                className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "2s" }}
              ></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 animate-slide-in-left">
                    {banner.offerText && (
                      <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium animate-bounce-in">
                        <Zap className="h-4 w-4" />
                        {banner.offerText}
                      </div>
                    )}

                    <div className="space-y-4">
                      <h1 className="text-4xl lg:text-6xl font-bold text-foreground font-[family-name:var(--font-playfair-display)] leading-tight">
                        {banner.title || "আপনার পছন্দের স্টাইল খুঁজুন"}
                      </h1>
                      <p className="text-lg text-muted-foreground max-w-md font-[family-name:var(--font-source-sans-pro)] leading-relaxed">
                        {banner.subtitle || "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।"}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        onClick={() => handleNavigation("shop")}
                        className="btn-primary hover-lift text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse-glow"
                      >
                        {banner.buttonText || "এখনই কিনুন"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Truck className="h-4 w-4 text-primary" />
                        ফ্রি ডেলিভারি
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4 text-primary" />
                        নিরাপদ পেমেন্ট
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Headphones className="h-4 w-4 text-primary" />
                        ২৪/৭ সাপোর্ট
                      </div>
                    </div>
                  </div>
                  <div className="relative animate-slide-in-right">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl transform rotate-6 animate-pulse-glow"></div>
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt="বৈশিষ্ট্যযুক্ত পণ্য"
                        className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 hover-scale w-full h-96 object-cover"
                      />
                    ) : (
                      <img
                        src="/modern-lifestyle-showcase.png"
                        alt="বৈশিষ্ট্যযুক্ত পণ্য"
                        className="relative rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 hover-scale"
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Categories Section - only show on home */}
          {currentView === "home" && (
            <section className="py-16 bg-muted/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground font-[family-name:var(--font-playfair-display)] mb-4">
                    জনপ্রিয় ক্যাটাগরি
                  </h2>
                  <p className="text-muted-foreground font-[family-name:var(--font-source-sans-pro)]">
                    আপনার পছন্দের পণ্য খুঁজে নিন
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {categories.map((category, index) => (
                    <Card
                      key={index}
                      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover-scale card-3d animate-bounce-in stagger-${index + 1} ${
                        selectedCategory === category.category ? "ring-2 ring-primary shadow-lg animate-pulse-glow" : ""
                      }`}
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 hover-glow`}
                        >
                          {category.icon}
                        </div>
                        <h3 className="font-semibold text-card-foreground font-[family-name:var(--font-playfair-display)] group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedCategory && (
                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(null)
                        setFilteredProducts(allProducts.slice(0, 6))
                      }}
                      className="hover:bg-accent/5 hover:border-accent transition-all bg-transparent"
                    >
                      সব ক্যাটাগরি দেখুন
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Featured Products */}
          <section className="py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair-display)] mb-4">
                  {currentView === "shop"
                    ? "সব পণ্য"
                    : selectedCategory
                      ? `${categories.find((cat) => cat.category === selectedCategory)?.name} পণ্যসমূহ`
                      : "বৈশিষ্ট্যযুক্ত পণ্য"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto font-[family-name:var(--font-source-sans-pro)]">
                  {currentView === "shop"
                    ? "সব পণ্য দেখুন"
                    : selectedCategory
                      ? `${categories.find((cat) => cat.category === selectedCategory)?.name} ক্যাটাগরির সব পণ্য দেখুন`
                      : "গুণমান, স্টাইল এবং মূল্যের সমন্বয়ে হাতে বাছাই করা পণ্য। প্রতিটি পণ্য আমাদের উচ্চ মানদণ্ড পূরণের জন্য যত্নসহকারে নির্বাচিত।"}
                </p>
                {(searchTerm || selectedCategory) && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                    <Search className="h-4 w-4" />
                    <span>
                      {searchTerm && selectedCategory
                        ? `"${searchTerm}" এর জন্য ${filteredProducts.length} টি ফলাফল পাওয়া গেছে ${categories.find((cat) => cat.category === selectedCategory)?.name} ক্যাটাগরিতে`
                        : searchTerm
                        ? `"${searchTerm}" এর জন্য ${filteredProducts.length} টি ফলাফল পাওয়া গেছে`
                        : `${filteredProducts.length} টি পণ্য পাওয়া গেছে`}
                    </span>
                  </div>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                    <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {searchTerm
                      ? `"${searchTerm}" এর জন্য কোন পণ্য পাওয়া যায়নি`
                      : selectedCategory
                        ? `${categories.find((cat) => cat.category === selectedCategory)?.name} ক্যাটাগরিতে কোন পণ্য নেই`
                        : "কোন পণ্য উপলব্ধ নেই"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "অন্য কিছু খুঁজে দেখুন বা ক্যাটাগরি ব্রাউজ করুন।"
                      : selectedCategory
                        ? "অন্য ক্যাটাগরি দেখুন বা পরে আবার চেষ্টা করুন।"
                        : "দোকানে পণ্য যোগ করা হলে এখানে দেখা যাবে।"}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentProducts.map((product, index) => (
                    <Card
                      key={product.id}
                      className={`group cursor-pointer border-border hover-lift hover-glow bg-card hover:bg-card/80 glass-effect animate-fade-in card-3d stagger-${(index % 6) + 1}`}
                      onClick={() => router.push(`/products/${product.id}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={product.image_url || "/placeholder.svg?height=256&width=384&query=product"}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {product.category && (
                            <Badge className="absolute top-3 left-3 btn-primary text-accent-foreground border-0 shadow-lg animate-shimmer">
                              {product.category}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 glass-effect hover:bg-background hover:text-accent backdrop-blur-sm hover-scale"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Badge className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 animate-pulse-glow">
                            ২০% ছাড়
                          </Badge>
                        </div>

                        <div className="p-6 space-y-4">
                          <div>
                            <h3 className="font-semibold text-card-foreground gradient-text mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-sm text-muted-foreground ml-2">৪.৮ (১২ৄ)</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-card-foreground">
                                ৳{getDiscountedPrice(product).toFixed(0)}
                              </span>
                              {product.discount_percentage && product.discount_percentage > 0 && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ৳{product.price.toFixed(0)}
                                </span>
                              )}
                              {typeof product.discount_percentage === "number" && product.discount_percentage > 0 && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {product.discount_percentage}% ছাড়
                                </Badge>
                              )}
                            </div>
                            
                            {/* Size Display */}
                            {product.sizes && product.sizes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.slice(0, 3).map((size) => (
                                  <Badge key={size} variant="outline" className="text-xs">
                                    {size}
                                  </Badge>
                                ))}
                                {product.sizes.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.sizes.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Button
                              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: getDiscountedPrice(product),
                                  image: product.image_url || "/diverse-products-still-life.png",
                                  size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
                                })
                                goToCheckout(false)
                              }}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              কার্টে যোগ করুন
                            </Button>
                            <Button
                              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                              onClick={() => {
                                addItem({
                                  id: product.id,
                                  name: product.name,
                                  price: getDiscountedPrice(product),
                                  image: product.image_url || "/diverse-products-still-life.png",
                                  size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
                                })
                                goToCheckout(true)
                              }}
                            >
                              এখনই কিনুন
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
              )}
              
              {/* Pagination Controls - Only show for shop view with more than 30 products */}
              {currentView === "shop" && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    আগের
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    পরের
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {/* Show current page info */}
              {currentView === "shop" && totalPages > 1 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  পৃষ্ঠা {currentPage} এর {totalPages} - মোট {filteredProducts.length} টি পণ্য
                </div>
              )}
            </div>
          </section>

          {/* Special Offers Section */}
          <section className="py-16 btn-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto animate-slide-up">
                <Gift className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">বিশেষ অফার!</h2>
                <p className="text-xl mb-8 opacity-90">৩০০০ টাকার উপরে কেনাকাটায় ফ্রি ডেলিভারি এবং ২০% ছাড়!</p>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleNavigation("shop")}
                  className="bg-white text-primary hover:bg-white/90 shadow-xl hover-lift"
                >
                  এখনই কিনুন
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Checkout choice dialog for non-logged users */}
      <Dialog open={showCheckoutChoice} onOpenChange={setShowCheckoutChoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>চেকআউট করার আগে</DialogTitle>
            <DialogDescription>আপনি লগইন করে কিনবেন নাকি গেস্ট হিসেবে চালিয়ে যাবেন?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowCheckoutChoice(false); router.push('/checkout?guest=true&direct=false') }}>গেস্ট হিসেবে</Button>
            <Button onClick={() => { setShowCheckoutChoice(false); router.push('/signin?redirect=/checkout?guest=false&direct=false') }}>লগইন করে কিনুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Track Order floating button */}
      <button
        onClick={() => setShowTrackDialog(true)}
        className="fixed bottom-6 right-6 z-40 rounded-full px-4 py-2 shadow-lg bg-primary text-accent-foreground hover:shadow-xl"
      >
        ট্র্যাক অর্ডার
      </button>

      {/* Track Order dialog */}
      <Dialog open={showTrackDialog} onOpenChange={setShowTrackDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>অর্ডার ট্র্যাক করুন</DialogTitle>
            <DialogDescription>আপনার অর্ডার করতে যে মোবাইল নাম্বার ব্যবহার করেছেন সেটি লিখুন</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="০১XXXXXXXXX / 01XXXXXXXXX"
              value={trackPhone}
              onChange={(e) => setTrackPhone(e.target.value)}
            />
            <Button onClick={handleTrackOrders} disabled={isTracking} className="w-full">
              {isTracking ? 'খোঁজা হচ্ছে...' : 'অর্ডার খুঁজুন'}
            </Button>
            {trackResults.length > 0 && (
              <div className="space-y-3 max-h-64 overflow-auto">
                {trackResults.map((o) => (
                  <div key={o.id} className="border rounded-lg p-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Order #{o.id}</div>
                      <span className="text-sm px-2 py-1 rounded bg-muted">{o.status}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(o.created_at).toLocaleString('en-US')}
                    </div>
                    <div className="mt-2 space-y-2">
                      {Array.isArray(o.products) && o.products.map((it: any, idx: number) => (
                        <div key={`${o.id}-${idx}`} className="flex items-center justify-between border rounded p-2">
                          <div className="text-sm">Product #{it.product_id} × {it.quantity}</div>
                          <div className="text-sm font-medium">৳{(it.price * it.quantity).toFixed(0)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {hasTriedTracking && trackResults.length === 0 && !isTracking && (
              <p className="text-sm text-muted-foreground text-center">কোনো অর্ডার পাওয়া যায়নি</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTrackDialog(false)}>বন্ধ করুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-muted to-muted/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-2xl text-muted-foreground font-[family-name:var(--font-playfair-display)]">
                {storeName.length > 2 ? (
                  <>
                    <span className="text-primary">{storeName.slice(0, -2)}</span>
                    <span className="text-accent">{storeName.slice(-2)}</span>
                  </>
                ) : (
                  <span className="text-primary">{storeName}</span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-source-sans-pro)] max-w-md mx-auto">
                আধুনিক জীবনযাত্রার জন্য প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান এবং স্টাইল।
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-muted-foreground font-[family-name:var(--font-playfair-display)]">
                যোগাযোগ করুন
              </h4>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
                    className="text-lg font-semibold text-green-600 hover:text-green-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {whatsappNumber}
                  </a>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">যেকোনো প্রশ্ন বা সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন</p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-source-sans-pro)]">
              © ২০২৪ {storeName}। সকল অধিকার সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
      

    </div>
  )
}

export default Homepage
