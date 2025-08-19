"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Truck, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminHeader } from "@/components/admin-header"
import { useToast } from "@/components/ui/use-toast"

interface DeliveryArea {
  id: string
  name: string
  cost: number
  isActive: boolean
}

interface DeliverySettings {
  areas: DeliveryArea[]
  defaultCost: number
  updated_at?: string
}

export default function AdminDeliveryPage() {
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    areas: [],
    defaultCost: 120
  })
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingArea, setEditingArea] = useState<DeliveryArea | null>(null)
  const [newArea, setNewArea] = useState({
    name: "",
    cost: 60,
    isActive: true
  })
  const [defaultCost, setDefaultCost] = useState(120)
  const { toast } = useToast()

  useEffect(() => {
    loadDeliverySettings()
  }, [])

  const loadDeliverySettings = async () => {
    try {
      const response = await fetch('/api/delivery', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setDeliverySettings(data)
        setDefaultCost(data.defaultCost)
      }
    } catch (error) {
      console.error('Error loading delivery settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDefaultCost = async () => {
    try {
      const response = await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSettings',
          defaultCost: defaultCost
        })
      })
      
      if (response.ok) {
        await loadDeliverySettings()
        toast({
          title: "সফল!",
          description: "ডিফল্ট ডেলিভারি খরচ আপডেট করা হয়েছে।",
        })
      } else {
        toast({
          title: "ত্রুটি!",
          description: "ডিফল্ট ডেলিভারি খরচ আপডেট করতে ব্যর্থ।",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating default cost:', error)
      toast({
        title: "ত্রুটি!",
        description: "ডিফল্ট ডেলিভারি খরচ আপডেট করতে ব্যর্থ।",
        variant: "destructive"
      })
    }
  }

  const handleAddArea = async () => {
    if (!newArea.name.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "এলাকার নাম প্রয়োজন।",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addArea',
          name: newArea.name,
          cost: newArea.cost,
          isActive: newArea.isActive
        })
      })
      
      if (response.ok) {
        await loadDeliverySettings()
        setShowAddDialog(false)
        setNewArea({ name: "", cost: 60, isActive: true })
        toast({
          title: "সফল!",
          description: "নতুন ডেলিভারি এলাকা যোগ করা হয়েছে।",
        })
      } else {
        toast({
          title: "ত্রুটি!",
          description: "ডেলিভারি এলাকা যোগ করতে ব্যর্থ।",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error adding area:', error)
      toast({
        title: "ত্রুটি!",
        description: "ডেলিভারি এলাকা যোগ করতে ব্যর্থ।",
        variant: "destructive"
      })
    }
  }

  const handleEditArea = async () => {
    if (!editingArea || !editingArea.name.trim()) {
      toast({
        title: "ত্রুটি!",
        description: "এলাকার নাম প্রয়োজন।",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateArea',
          id: editingArea.id,
          name: editingArea.name,
          cost: editingArea.cost,
          isActive: editingArea.isActive
        })
      })
      
      if (response.ok) {
        await loadDeliverySettings()
        setShowEditDialog(false)
        setEditingArea(null)
        toast({
          title: "সফল!",
          description: "ডেলিভারি এলাকা আপডেট করা হয়েছে।",
        })
      } else {
        toast({
          title: "ত্রুটি!",
          description: "ডেলিভারি এলাকা আপডেট করতে ব্যর্থ।",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating area:', error)
      toast({
        title: "ত্রুটি!",
        description: "ডেলিভারি এলাকা আপডেট করতে ব্যর্থ।",
        variant: "destructive"
      })
    }
  }

  const handleDeleteArea = async (id: string) => {
    if (!confirm('আপনি কি এই ডেলিভারি এলাকা মুছে ফেলতে চান?')) {
      return
    }

    try {
      const response = await fetch('/api/delivery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteArea',
          id: id
        })
      })
      
      if (response.ok) {
        await loadDeliverySettings()
        toast({
          title: "সফল!",
          description: "ডেলিভারি এলাকা মুছে ফেলা হয়েছে।",
        })
      } else {
        toast({
          title: "ত্রুটি!",
          description: "ডেলিভারি এলাকা মুছতে ব্যর্থ।",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting area:', error)
      toast({
        title: "ত্রুটি!",
        description: "ডেলিভারি এলাকা মুছতে ব্যর্থ।",
        variant: "destructive"
      })
    }
  }

  const openEditDialog = (area: DeliveryArea) => {
    setEditingArea({ ...area })
    setShowEditDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">লোড হচ্ছে...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ডেলিভারি ব্যবস্থাপনা</h1>
            <p className="text-muted-foreground mt-2">ডেলিভারি খরচ এবং এলাকা পরিচালনা করুন</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            নতুন এলাকা যোগ করুন
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Default Delivery Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                ডিফল্ট ডেলিভারি খরচ
              </CardTitle>
              <CardDescription>
                অন্যান্য এলাকার জন্য ডিফল্ট ডেলিভারি খরচ সেট করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="defaultCost">ডিফল্ট খরচ (টাকা)</Label>
                  <Input
                    id="defaultCost"
                    type="number"
                    value={defaultCost}
                    onChange={(e) => setDefaultCost(Number(e.target.value))}
                    placeholder="120"
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSaveDefaultCost} className="mt-6">
                  সংরক্ষণ করুন
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                ডেলিভারি এলাকা
              </CardTitle>
              <CardDescription>
                বিভিন্ন এলাকার জন্য ডেলিভারি খরচ সেট করুন
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deliverySettings.areas.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">কোন ডেলিভারি এলাকা নেই</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliverySettings.areas.map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium">{area.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ৳{area.cost} ডেলিভারি খরচ
                          </p>
                        </div>
                        <Badge variant={area.isActive ? "default" : "secondary"}>
                          {area.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(area)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteArea(area.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Area Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>নতুন ডেলিভারি এলাকা যোগ করুন</DialogTitle>
              <DialogDescription>
                নতুন এলাকার নাম এবং ডেলিভারি খরচ সেট করুন
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="areaName">এলাকার নাম</Label>
                <Input
                  id="areaName"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  placeholder="ঠাকুরগাঁও"
                />
              </div>
              <div>
                <Label htmlFor="areaCost">ডেলিভারি খরচ (টাকা)</Label>
                <Input
                  id="areaCost"
                  type="number"
                  value={newArea.cost}
                  onChange={(e) => setNewArea({ ...newArea, cost: Number(e.target.value) })}
                  placeholder="60"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="areaActive"
                  checked={newArea.isActive}
                  onCheckedChange={(checked) => setNewArea({ ...newArea, isActive: checked })}
                />
                <Label htmlFor="areaActive">সক্রিয়</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={handleAddArea}>যোগ করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Area Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ডেলিভারি এলাকা সম্পাদনা করুন</DialogTitle>
              <DialogDescription>
                এলাকার তথ্য আপডেট করুন
              </DialogDescription>
            </DialogHeader>
            {editingArea && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editAreaName">এলাকার নাম</Label>
                  <Input
                    id="editAreaName"
                    value={editingArea.name}
                    onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                    placeholder="ঠাকুরগাঁও"
                  />
                </div>
                <div>
                  <Label htmlFor="editAreaCost">ডেলিভারি খরচ (টাকা)</Label>
                  <Input
                    id="editAreaCost"
                    type="number"
                    value={editingArea.cost}
                    onChange={(e) => setEditingArea({ ...editingArea, cost: Number(e.target.value) })}
                    placeholder="60"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="editAreaActive"
                    checked={editingArea.isActive}
                    onCheckedChange={(checked) => setEditingArea({ ...editingArea, isActive: checked })}
                  />
                  <Label htmlFor="editAreaActive">সক্রিয়</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                বাতিল
              </Button>
              <Button onClick={handleEditArea}>আপডেট করুন</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
