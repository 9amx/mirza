"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { auth } from "@/lib/firebase"

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Check if user is signed in
        const user = auth.currentUser
        
        if (!user) {
          setVerificationStatus('error')
          setErrorMessage("No user found. Please sign in first.")
          return
        }

        // Reload user to get latest verification status
        await user.reload()
        
        // Check if email is now verified
        if (user.emailVerified) {
          setVerificationStatus('success')
        } else {
          setVerificationStatus('error')
          setErrorMessage("Email verification failed. Please try again or contact support.")
        }
      } catch (error) {
        setVerificationStatus('error')
        setErrorMessage("An error occurred during verification. Please try again.")
      }
    }

    handleEmailVerification()
  }, [])

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        await user.sendEmailVerification()
        setVerificationStatus('success')
      }
    } catch (error) {
      setErrorMessage("Failed to resend verification email. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl font-[family-name:var(--font-playfair-display)]">
            <span className="text-primary">Mirza</span>
            <span className="text-accent">Garments</span>
          </h1>
        </div>

        <Card className="shadow-xl border-border/50">
          <CardContent className="pt-8 pb-6">
            <div className="text-center">
              {verificationStatus === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                  <h2 className="text-2xl font-bold mb-4">Verifying Email</h2>
                  <p className="text-muted-foreground">
                    Please wait while we verify your email address...
                  </p>
                </>
              )}

              {verificationStatus === 'success' && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Email Verified!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your email has been successfully verified. You can now sign in to your account.
                  </p>
                  <div className="space-y-3">
                    <Link href="/signin">
                      <Button className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full bg-transparent">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {verificationStatus === 'error' && (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Verification Failed</h2>
                  <p className="text-muted-foreground mb-6">
                    {errorMessage}
                  </p>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleResendVerification}
                      className="w-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Resend Verification Email
                    </Button>
                    <Link href="/signin">
                      <Button variant="outline" className="w-full bg-transparent">
                        Go to Sign In
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full bg-transparent">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
