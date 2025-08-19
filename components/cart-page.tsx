"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"

interface CartPageProps {
  user: any
}

export function CartPage({ user }: CartPageProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, clearCart, updateItemQuantityVariant, removeItemVariant } = useCart()
  const [isClearing, setIsClearing] = useState(false)
  const [showCheckoutChoice, setShowCheckoutChoice] = useState(false)
  const router = useRouter()
  const { user: authUser } = useAuth()

  const handleClearCart = async () => {
    setIsClearing(true)
    clearCart()
    setTimeout(() => setIsClearing(false), 500)
  }

  const formatPrice = (price: number) => `৳${price.toFixed(0)}`

  const handleCheckoutClick = () => {
    if (authUser) {
      router.push('/checkout?guest=false&direct=false')
    } else {
      setShowCheckoutChoice(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                হোমে ফিরুন
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground">আপনার কার্ট</h1>
          </div>

          <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">আপনার কার্ট খালি</h3>
              <p className="text-muted-foreground mb-6">কেনাকাটা শুরু করতে কিছু পণ্য যোগ করুন</p>
              <Link href="/">
                <Button className="btn-primary">কেনাকাটা শুরু করুন</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              কেনাকাটা চালিয়ে যান
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">আপনার কার্ট</h1>
              <p className="text-muted-foreground mt-2">{totalItems} টি পণ্য</p>
            </div>
            <Button
              variant="outline"
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            >
              {isClearing ? "পরিষ্কার করা হচ্ছে..." : "কার্ট পরিষ্কার করুন"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.color}`} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{item.name}</h3>
                      {item.size && (
                        <Badge variant="secondary" className="mr-2 mb-2">
                          সাইজ: {item.size}
                        </Badge>
                      )}
                      {item.color && (
                        <Badge variant="secondary" className="mb-2">
                          রং: {item.color}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => (updateItemQuantityVariant ? updateItemQuantityVariant(item.id, item.quantity - 1, item.size, item.color) : updateQuantity(item.id, item.quantity - 1))}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => (updateItemQuantityVariant ? updateItemQuantityVariant(item.id, item.quantity + 1, item.size, item.color) : updateQuantity(item.id, item.quantity + 1))}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-muted-foreground">{formatPrice(item.price)} প্রতিটি</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => (removeItemVariant ? removeItemVariant(item.id, item.size, item.color) : removeItem(item.id))}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">অর্ডার সারাংশ</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">সাবটোটাল ({totalItems} টি পণ্য)</span>
                    <span className="font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ডেলিভারি চার্জ</span>
                    <span className="font-medium">
                      {totalPrice >= 3000 ? <span className="text-green-600">ফ্রি</span> : formatPrice(60)}
                    </span>
                  </div>
                  {totalPrice >= 3000 && (
                    <div className="flex justify-between text-green-600">
                      <span>ছাড় (২০%)</span>
                      <span>-{formatPrice(totalPrice * 0.2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>মোট</span>
                      <span>
                        {formatPrice(
                          totalPrice >= 3000
                            ? totalPrice * 0.8 // 20% discount
                            : totalPrice + 60, // delivery charge
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {totalPrice >= 3000 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800 font-medium">🎉 আপনি ফ্রি ডেলিভারি এবং ২০% ছাড় পেয়েছেন!</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button onClick={handleCheckoutClick} className="w-full btn-primary text-accent-foreground">চেকআউট করুন</Button>
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      কেনাকাটা চালিয়ে যান
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
            <Button variant="outline" onClick={() => { setShowCheckoutChoice(false); router.push('/checkout?guest=true&direct=false') }}>গেস্ট হিসেবে</Button>
            <Button onClick={() => { setShowCheckoutChoice(false); router.push('/signin?redirect=/checkout?guest=false&direct=false') }}>লগইন করে কিনুন</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
