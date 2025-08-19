"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
      <Card className="w-full max-w-md text-center glass-card">
        <CardContent className="pt-8 pb-6">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Your order was placed successfully. We will process it shortly and send you updates.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full">Continue Shopping</Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full bg-transparent">
                View Cart
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
