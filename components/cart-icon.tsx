"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative bg-transparent">
        <ShoppingCart className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}
