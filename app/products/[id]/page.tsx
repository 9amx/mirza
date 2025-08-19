"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, Headphones, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { dataManager } from "@/lib/shared-data"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  in_stock: boolean
  created_at: string
  stock_quantity?: number
  discount_percentage?: number
  is_featured?: boolean
  sizes?: string[]
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, updateItemQuantityVariant, updateQuantity } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [showCheckoutChoice, setShowCheckoutChoice] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("")

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const productData = await response.json()
          setProduct(productData)
          setSelectedImage(productData.image_url || "/placeholder.svg")
        } else {
          // Fallback to local data
          const products = dataManager.getProducts()
          const foundProduct = products.find(p => p.id === params.id)
          if (foundProduct) {
            setProduct(foundProduct)
            setSelectedImage(foundProduct.image_url || "/placeholder.svg")
          }
        }
      } catch (error) {
        console.error('Error loading product:', error)
        // Fallback to local data
        const products = dataManager.getProducts()
        const foundProduct = products.find(p => p.id === params.id)
        if (foundProduct) {
          setProduct(foundProduct)
          setSelectedImage(foundProduct.image_url || "/placeholder.svg")
        }
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      const discountPercentage = product.discount_percentage || 0
      const discountedPrice = product.price * (1 - discountPercentage / 100)
      addItem({
        id: product.id,
        name: product.name,
        price: discountedPrice,
        image: product.image_url || "/placeholder.svg",
        size: selectedSize || undefined,
      })
      if (updateItemQuantityVariant) {
        updateItemQuantityVariant(product.id, quantity, selectedSize)
      } else if (updateQuantity) {
        updateQuantity(product.id, quantity)
      }
      toast({ title: "কার্টে যোগ হয়েছে", description: `${product.name} (${quantity}) আপনার কার্টে যোগ করা হয়েছে` })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      const discountPercentage = product.discount_percentage || 0
      const discountedPrice = product.price * (1 - discountPercentage / 100)
      addItem({
        id: product.id,
        name: product.name,
        price: discountedPrice,
        image: product.image_url || "/placeholder.svg",
        size: selectedSize || undefined,
      })
      if (updateItemQuantityVariant) {
        updateItemQuantityVariant(product.id, quantity, selectedSize)
      } else if (updateQuantity) {
        updateQuantity(product.id, quantity)
      }
      setShowCheckoutChoice(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">পণ্য পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-6">আপনি যে পণ্যটি খুঁজছেন তা পাওয়া যায়নি।</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            হোমে ফিরে যান
          </Button>
        </div>
      </div>
    )
  }

  const discountPercentage = product.discount_percentage || 0
  const originalPrice = product.price
  const discountedPrice = originalPrice * (1 - discountPercentage / 100)
  const discountAmount = originalPrice - discountedPrice

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              ফিরে যান
            </Button>
            <div className="font-bold text-xl text-foreground font-[family-name:var(--font-playfair-display)]">
              <span className="text-primary">Mirza</span>
              <span className="text-accent">Garments</span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted/20">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {product.image_url && (
              <div className="flex gap-2">
                <div
                  className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                  onClick={() => setSelectedImage(product.image_url!)}
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            {product.category && (
              <Badge className="btn-primary text-accent-foreground border-0">
                {product.category}
              </Badge>
            )}

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-[family-name:var(--font-playfair-display)]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-muted-foreground">৪.৮ (১২ৄ রিভিউ)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  ৳{discountedPrice.toFixed(0)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ৳{originalPrice.toFixed(0)}
                </span>
                <Badge className="bg-green-100 text-green-800">
                  {product.discount_percentage || 20}% ছাড়
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                আপনি ৳{discountAmount.toFixed(0)} সাশ্রয় করছেন
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">বিবরণ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {product.in_stock 
                  ? `স্টকে আছে (${product.stock_quantity || 'অনেক'} টি)`
                  : 'স্টকে নেই'
                }
              </span>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">আকার নির্বাচন করুন</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="min-w-[60px]"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">পরিমাণ</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.in_stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={!product.in_stock}
                className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                এখনই কিনুন
              </Button>
              <Button
                onClick={handleAddToCart}
                disabled={!product.in_stock}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                কার্টে যোগ করুন
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border">
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
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 font-[family-name:var(--font-playfair-display)]">
            সম্পর্কিত পণ্য
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* You can add related products here */}
          </div>
        </div>
      </div>

      {/* Checkout choice dialog for non-logged users */}
      <Dialog open={showCheckoutChoice} onOpenChange={setShowCheckoutChoice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>চেকআউট করার আগে</DialogTitle>
            <DialogDescription>আপনি লগইন করে কিনবেন নাকি গেস্ট হিসেবে চালিয়ে যাবেন?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => { setShowCheckoutChoice(false); router.push('/checkout?guest=true&direct=true') }}>গেস্ট হিসেবে</Button>
            <Button onClick={() => { setShowCheckoutChoice(false); router.push('/signin?redirect=/checkout?guest=false&direct=true') }}>লগইন করে কিনুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
