"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"
import { AdminDataService } from "@/lib/shared-data"

interface TestResult {
  name: string
  status: 'success' | 'error' | 'loading'
  message: string
  data?: any
}

export default function TestConnectionPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const newResults: TestResult[] = []

    // Test 1: API Products Endpoint
    newResults.push({ name: 'API Products', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const products = await AdminDataService.fetchProducts()
      newResults[0] = {
        name: 'API Products',
        status: 'success',
        message: `Found ${products.length} products`,
        data: products.slice(0, 3) // Show first 3 products
      }
    } catch (error) {
      newResults[0] = {
        name: 'API Products',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 2: API Users Endpoint
    newResults.push({ name: 'API Users', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const users = await AdminDataService.fetchUsers()
      newResults[1] = {
        name: 'API Users',
        status: 'success',
        message: `Found ${users.length} users`,
        data: users.slice(0, 3) // Show first 3 users
      }
    } catch (error) {
      newResults[1] = {
        name: 'API Users',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 3: API Orders Endpoint
    newResults.push({ name: 'API Orders', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const orders = await AdminDataService.fetchOrders()
      newResults[2] = {
        name: 'API Orders',
        status: 'success',
        message: `Found ${orders.length} orders`,
        data: orders.slice(0, 3) // Show first 3 orders
      }
    } catch (error) {
      newResults[2] = {
        name: 'API Orders',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test 4: Dashboard Stats
    newResults.push({ name: 'Dashboard Stats', status: 'loading', message: 'Testing...' })
    setResults([...newResults])

    try {
      const stats = await AdminDataService.fetchDashboardStats()
      newResults[3] = {
        name: 'Dashboard Stats',
        status: 'success',
        message: `Revenue: ৳${stats.totalRevenue}, Orders: ${stats.totalOrders}`,
        data: stats
      }
    } catch (error) {
      newResults[3] = {
        name: 'Dashboard Stats',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    setResults([...newResults])
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Loading</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Connection Test</h1>
          <p className="text-muted-foreground mb-4">
            Testing the connection between the web application and admin panel
          </p>
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>

        <div className="grid gap-4">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{result.message}</p>
                {result.data && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Sample Data:</h4>
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            <li>Start the main web application: <code className="bg-background px-1 rounded">npm run dev</code></li>
            <li>Start the admin panel: <code className="bg-background px-1 rounded">npm run dev:admin</code></li>
            <li>Check that both applications are running on different ports</li>
            <li>Run the tests above to verify the connection</li>
            <li>Try adding products in the admin panel and see them appear in the web app</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
