"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image_url?: string
  }
  className?: string
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price * 110, // Apply the same pricing logic as display
      image: product.image_url || "/diverse-products-still-life.png",
    })

    // Add a small delay for better UX
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`btn-primary text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 group hover-lift ${className}`}
    >
      {isAdding ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          যোগ করা হচ্ছে...
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
          কার্টে যোগ করুন
        </div>
      )}
    </Button>
  )
}
