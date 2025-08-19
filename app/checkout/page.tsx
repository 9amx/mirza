import { CheckoutForm } from "@/components/checkout-form"

interface CheckoutPageProps {
  searchParams: { guest?: string; direct?: string }
}

const CheckoutPage = async ({ searchParams }: CheckoutPageProps) => {
  const isGuestCheckout = searchParams.guest === "true"
  const isDirectBuy = searchParams.direct === "true"
  const user = null

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">চেকআউট</h1>
          <p className="text-muted-foreground mt-2">
            {isDirectBuy ? "সরাসরি কেনাকাটা সম্পূর্ণ করুন" : "গেস্ট হিসেবে আপনার অর্ডার সম্পূর্ণ করুন"}
          </p>
        </div>

        <CheckoutForm user={user} isGuestCheckout={isGuestCheckout} isDirectBuy={isDirectBuy} />
      </div>
    </div>
  )
}

export default CheckoutPage
