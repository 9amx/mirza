"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Shield, 
  Database, 
  Bell, 
  Globe, 
  Palette,
  Save,
  Image as ImageIcon,
  MessageCircle
} from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { useToast } from "@/components/ui/use-toast"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '',
    faviconPath: '',
    whatsappNumber: '',
    notifications: true,
    darkMode: false,
    language: 'en',
    currency: 'BDT',
    maintenanceMode: false,
    analytics: true
  })
  const [loading, setLoading] = useState(false)
  const [savingBranding, setSavingBranding] = useState(false)
  const [account, setAccount] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setSettings((prev) => ({
            ...prev,
            storeName: data.storeName || '',
            faviconPath: data.faviconPath || '',
            whatsappNumber: data.whatsappNumber || ''
          }))
        }
        const accRes = await fetch('/api/admin/account', { cache: 'no-store' })
        if (accRes.ok) {
          const acc = await accRes.json()
          setAccount({ name: acc.name || '', email: acc.email || '' })
        }
      } catch (e) {}
    }
    load()
  }, [])

  const handleSaveSettings = async () => {
    setLoading(true)
    // Simulate saving settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    // In a real app, you would save to the database here
  }

  const handleSaveBranding = async () => {
    try {
      setSavingBranding(true)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeName: settings.storeName, faviconPath: settings.faviconPath, whatsappNumber: settings.whatsappNumber })
      })
      if (res.ok) {
        await res.json()
        toast({
          title: "Success",
          description: "Store branding settings saved successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    } finally {
      setSavingBranding(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Settings" 
        subtitle="Settings" 
        showBackButton={true}
        backUrl="/admin"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Store Branding
              </CardTitle>
              <CardDescription>Update store name and favicon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} placeholder="Enter store name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Number
                  </Label>
                  <Input 
                    id="whatsappNumber" 
                    value={settings.whatsappNumber} 
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} 
                    placeholder="+880 1712345678" 
                  />
                  <p className="text-sm text-muted-foreground">This number will be used for WhatsApp contact links</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="flex items-center gap-3">
                    {settings.faviconPath ? (
                      <img src={settings.faviconPath} alt="favicon" className="w-6 h-6 rounded" />
                    ) : (
                      <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/x-icon,image/png,image/svg+xml"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = async () => {
                          const base64 = reader.result as string
                          const res = await fetch('/api/settings/favicon', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ fileName: file.name, base64 })
                          })
                          if (res.ok) {
                            const updated = await res.json()
                            setSettings((prev) => ({ ...prev, faviconPath: updated.faviconPath || prev.faviconPath }))
                          }
                        }
                        reader.readAsDataURL(file)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveBranding} disabled={savingBranding} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {savingBranding ? 'Saving...' : 'Save Branding'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure general admin panel settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={settings.language}
                    onChange={(e) => setSettings({...settings, language: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="en">English</option>
                    <option value="bn">বাংলা (Bengali)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full p-2 border border-border rounded-md bg-background"
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important events
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the admin panel appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for the admin panel
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Advanced system configuration options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the website in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Analytics Tracking</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable analytics and tracking
                  </p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => setSettings({...settings, analytics: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Account
              </CardTitle>
              <CardDescription>Change admin display name and password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Admin Name</Label>
                  <Input id="adminName" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email</Label>
                  <Input id="adminEmail" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={async () => {
                    if (account.name.trim().length === 0) {
                      alert('Name is required')
                      return
                    }
                    if (passwords.newPassword || passwords.confirmPassword || passwords.currentPassword) {
                      if (passwords.newPassword !== passwords.confirmPassword) {
                        alert('New passwords do not match')
                        return
                      }
                      if (passwords.newPassword.length < 6) {
                        alert('New password must be at least 6 characters')
                        return
                      }
                    }
                    const res = await fetch('/api/admin/account', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: account.name,
                        email: account.email,
                        currentPassword: passwords.currentPassword || undefined,
                        newPassword: passwords.newPassword || undefined,
                      })
                    })
                    if (res.ok) {
                      const updated = await res.json()
                      setAccount({ name: updated.name, email: updated.email })
                      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      alert('Admin account updated')
                    } else {
                      const err = await res.json().catch(() => ({}))
                      alert(err?.error || 'Failed to update account')
                    }
                  }}
                >
                  Save Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Information
              </CardTitle>
              <CardDescription>
                Current database status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Database Type</p>
                  <p className="text-2xl font-bold text-primary">Mock Data</p>
                  <p className="text-xs text-muted-foreground">Development Mode</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Total Products</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-xs text-muted-foreground">Active Items</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-xs text-muted-foreground">All Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={loading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
