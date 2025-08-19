"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, CheckCircle, XCircle } from "lucide-react"

export function ConnectionStatus() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [adminStatus, setAdminStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')

  useEffect(() => {
    // Check API connection
    const checkApi = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          setApiStatus('connected')
        } else {
          setApiStatus('disconnected')
        }
      } catch (error) {
        setApiStatus('disconnected')
      }
    }

    // Check admin panel connection
    const checkAdmin = async () => {
      try {
        const response = await fetch('http://localhost:3001', { 
          method: 'HEAD',
          mode: 'no-cors'
        })
        setAdminStatus('connected')
      } catch (error) {
        setAdminStatus('disconnected')
      }
    }

    checkApi()
    checkAdmin()

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkApi()
      checkAdmin()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <Wifi className="h-3 w-3 text-yellow-500 animate-pulse" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'disconnected':
        return 'Disconnected'
      default:
        return 'Checking...'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Badge variant="outline" className="text-xs">
        {getStatusIcon(apiStatus)}
        <span className="ml-1">API: {getStatusText(apiStatus)}</span>
      </Badge>
      <Badge variant="outline" className="text-xs">
        {getStatusIcon(adminStatus)}
        <span className="ml-1">Admin: {getStatusText(adminStatus)}</span>
      </Badge>
    </div>
  )
}
