"use client"

import { Button } from "@/components/ui/button"
import { Settings, ExternalLink } from "lucide-react"
import { useState } from "react"

export function AdminLink() {
  const [isHovered, setIsHovered] = useState(false)

  const handleAdminClick = () => {
    // Open admin login page in a new tab
    window.open('/admin/login', '_blank')
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background shadow-lg hover:shadow-xl transition-all duration-300 group"
        onClick={handleAdminClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
        Admin
        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
      
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg text-xs text-muted-foreground whitespace-nowrap">
          Access admin panel (login required)
        </div>
      )}
    </div>
  )
}
