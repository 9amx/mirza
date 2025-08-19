"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Package } from "lucide-react"

export default function OrdersClientPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-work-sans)]">My Orders</h1>
          <p className="text-muted-foreground mt-2 font-[family-name:var(--font-open-sans)]">
            Track your purchases and order history
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-[family-name:var(--font-work-sans)]">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2 font-[family-name:var(--font-work-sans)]">
                No orders yet
              </h3>
              <p className="text-muted-foreground mb-6 font-[family-name:var(--font-open-sans)]">
                Start shopping to see your orders here
              </p>
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
