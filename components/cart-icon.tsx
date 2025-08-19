"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export function CartIcon() {
  const { totalItems } = useCart()

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative bg-transparent h-10 w-10 sm:h-8 sm:w-8">
        <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}
