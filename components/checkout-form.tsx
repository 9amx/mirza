"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Truck, Phone } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface CheckoutFormProps {
  user: any
  isGuestCheckout: boolean
  isDirectBuy: boolean
}

export function CheckoutForm({ user, isGuestCheckout, isDirectBuy }: CheckoutFormProps) {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })
  const [deliveryCost, setDeliveryCost] = useState(120)
  const [deliverySettings, setDeliverySettings] = useState<any>(null)

  const formatPrice = (price: number) => `৳${price.toFixed(0)}`

  // Load delivery settings
  useEffect(() => {
    const loadDeliverySettings = async () => {
      try {
        const response = await fetch('/api/delivery', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setDeliverySettings(data)
        }
      } catch (error) {
        console.error('Error loading delivery settings:', error)
      }
    }
    loadDeliverySettings()
  }, [])

  // Calculate delivery cost based on city
  useEffect(() => {
    if (deliverySettings && formData.city) {
      const cost = deliverySettings.areas.find((area: any) => 
        area.isActive && area.name.toLowerCase().includes(formData.city.toLowerCase())
      )?.cost || deliverySettings.defaultCost
      setDeliveryCost(cost)
    } else if (deliverySettings) {
      setDeliveryCost(deliverySettings.defaultCost)
    }
  }, [formData.city, deliverySettings])

  const finalTotal =
    totalPrice >= 3000
      ? totalPrice * 0.8 // 20% discount
      : totalPrice + deliveryCost // dynamic delivery charge

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderPayload = {
        user_id: user?.id || `guest-${Date.now()}`,
        products: items.map((it) => ({ product_id: it.id, quantity: it.quantity, price: it.price })),
        total_amount: finalTotal,
        delivery_cost: deliveryCost,
        status: 'pending' as const,
        payment_status: 'pending' as const,
        customer: {
          name: formData.name,
          email: formData.email || 'unknown@email.com',
          phone: formData.phone,
        },
        shipping_address: {
          street: formData.address,
          city: formData.city,
          state: '',
          postal_code: formData.postalCode || '',
          country: 'Bangladesh',
        },
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) throw new Error('Failed to place order')

      clearCart()
      toast({ title: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে', description: 'ধন্যবাদ! আপনার অর্ডারটি আমরা পেয়েছি।' })
      router.push('/order-success')
    } catch (err) {
      console.error(err)
      toast({ title: 'অর্ডার ব্যর্থ হয়েছে', description: 'অনুগ্রহ করে আবার চেষ্টা করুন।', variant: 'destructive' as any })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !isDirectBuy) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-foreground mb-2">কার্টে কোন পণ্য নেই</h3>
        <p className="text-muted-foreground mb-6">চেকআউট করার জন্য প্রথমে কার্টে পণ্য যোগ করুন</p>
        <Link href="/">
          <Button className="btn-primary">কেনাকাটা শুরু করুন</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Link href="/cart">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          কার্টে ফিরুন
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                ডেলিভারি তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">পূর্ণ নাম *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="আপনার নাম লিখুন"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">ফোন নম্বর *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="০১৭xxxxxxxx"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="বাড়ি/ফ্ল্যাট নম্বর, রাস্তার নাম, এলাকা"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">শহর *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="ঢাকা"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">পোস্টাল কোড</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="১২০০"
                    />
                  </div>
                </div>

                {/* Delivery Cost Information */}
                {deliverySettings && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">ডেলিভারি খরচ তথ্য</h4>
                    <div className="space-y-2">
                      {deliverySettings.areas.filter((area: any) => area.isActive).map((area: any) => (
                        <div key={area.id} className="flex justify-between text-sm">
                          <span className="text-blue-700">{area.name}</span>
                          <span className="font-medium text-blue-800">৳{area.cost}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-blue-700">অন্যান্য এলাকা</span>
                        <span className="font-medium text-blue-800">৳{deliverySettings.defaultCost}</span>
                      </div>
                    </div>
                    {formData.city && (
                      <div className="mt-3 p-2 bg-blue-100 rounded text-sm text-blue-800">
                        <strong>আপনার এলাকার ডেলিভারি খরচ:</strong> ৳{deliveryCost}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">বিশেষ নির্দেশনা (ঐচ্ছিক)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="কোন বিশেষ নির্দেশনা থাকলে লিখুন"
                    rows={2}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                পেমেন্ট পদ্ধতি
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800">ক্যাশ অন ডেলিভারি</h4>
                    <p className="text-sm text-green-700">পণ্য পৌঁছানোর পর পেমেন্ট করুন</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>অর্ডার সারাংশ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex gap-2 mt-1">
                        {item.size && (
                          <Badge variant="secondary" className="text-xs">
                            সাইজ: {item.size}
                          </Badge>
                        )}
                        {item.color && (
                          <Badge variant="secondary" className="text-xs">
                            রং: {item.color}
                          </Badge>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground">পরিমাণ: {item.quantity}</span>
                        <span className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">সাবটোটাল</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ডেলিভারি</span>
                  <span>
                    {totalPrice >= 3000 ? (
                      <span className="text-green-600">ফ্রি</span>
                    ) : (
                      <span>
                        {formatPrice(deliveryCost)}
                        {formData.city && (
                          <span className="text-xs text-muted-foreground ml-1">
                            ({formData.city})
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </div>
                {totalPrice >= 3000 && (
                  <div className="flex justify-between text-green-600">
                    <span>ছাড় (২০%)</span>
                    <span>-{formatPrice(totalPrice * 0.2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>মোট</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {totalPrice >= 3000 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">🎉 ফ্রি ডেলিভারি এবং ২০% ছাড় প্রয়োগ করা হয়েছে!</p>
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name || !formData.phone || !formData.address || !formData.city}
                className="w-full btn-primary text-accent-foreground"
              >
                {isSubmitting ? "অর্ডার প্রক্রিয়াকরণ..." : "অর্ডার নিশ্চিত করুন"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                অর্ডার নিশ্চিত করলে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
