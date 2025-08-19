"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Eye, Calendar, Percent, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Offer {
  id: string
  title: string
  description?: string
  discount_percentage: number
  start_date: string
  end_date: string
  is_active: boolean
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
    is_active: true
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers', { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setOffers(data)
      }
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch offers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddOffer = async () => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer created successfully"
        })
        setShowAddDialog(false)
        resetForm()
        fetchOffers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create offer",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create offer",
        variant: "destructive"
      })
    }
  }

  const handleUpdateOffer = async () => {
    if (!selectedOffer) return

    try {
      const response = await fetch('/api/offers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOffer.id, ...formData })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer updated successfully"
        })
        setShowEditDialog(false)
        resetForm()
        fetchOffers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update offer",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive"
      })
    }
  }

  const handleDeleteOffer = async (id: string) => {
    try {
      console.log('Deleting offer with ID:', id)
      const response = await fetch(`/api/offers?id=${id}`, {
        method: 'DELETE'
      })

      console.log('Delete response status:', response.status)
      const responseData = await response.json()
      console.log('Delete response data:', responseData)

      if (response.ok) {
        toast({
          title: "Success",
          description: "Offer deleted successfully"
        })
        fetchOffers()
      } else {
        toast({
          title: "Error",
          description: responseData.error || "Failed to delete offer",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive"
      })
    }
  }

  const openDeleteDialog = (offer: Offer) => {
    setOfferToDelete(offer)
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (offerToDelete) {
      handleDeleteOffer(offerToDelete.id)
      setShowDeleteDialog(false)
      setOfferToDelete(null)
    }
  }

  const handleResetAllOffers = async () => {
    try {
      const response = await fetch('/api/offers/reset', {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "All offers have been deleted"
        })
        fetchOffers()
      } else {
        toast({
          title: "Error",
          description: "Failed to reset offers",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset offers",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount_percentage: 0,
      start_date: "",
      end_date: "",
      is_active: true
    })
    setSelectedOffer(null)
  }

  const openEditDialog = (offer: Offer) => {
    setSelectedOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description || "",
      discount_percentage: offer.discount_percentage,
      start_date: offer.start_date.split('T')[0],
      end_date: offer.end_date.split('T')[0],
      is_active: offer.is_active
    })
    setShowEditDialog(true)
  }

  const openViewDialog = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowViewDialog(true)
  }

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  const isActive = (offer: Offer) => {
    const now = new Date()
    const start = new Date(offer.start_date)
    const end = new Date(offer.end_date)
    return offer.is_active && now >= start && now <= end
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader title="Offers" subtitle="Manage limited-time offers" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading offers...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader title="Offers" subtitle="Manage limited-time offers" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Offers Management</h1>
            <p className="text-muted-foreground mt-2">Create and manage limited-time offers for your customers</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleResetAllOffers}
              className="bg-red-600 hover:bg-red-700"
            >
              Reset All Offers
            </Button>
            
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Offer</DialogTitle>
                  <DialogDescription>
                    Create a new limited-time offer for your customers
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Offer Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Summer Sale 50% Off"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe the offer details..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount Percentage *</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                      placeholder="25"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddOffer}>Create Offer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {offers.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No offers yet</h3>
                <p className="text-muted-foreground mb-4">Create your first limited-time offer to attract customers</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Offer
                </Button>
              </CardContent>
            </Card>
          ) : (
            offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {offer.title}
                        <div className="flex gap-2">
                          {isActive(offer) && (
                            <Badge variant="default" className="bg-green-500">
                              Active
                            </Badge>
                          )}
                          {isExpired(offer.end_date) && (
                            <Badge variant="destructive">
                              Expired
                            </Badge>
                          )}
                          {!offer.is_active && (
                            <Badge variant="secondary">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      {offer.description && (
                        <CardDescription className="mt-2">
                          {offer.description}
                        </CardDescription>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openViewDialog(offer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(offer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(offer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{offer.discount_percentage}% off</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(offer.start_date).toLocaleDateString()} - {new Date(offer.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={isActive(offer) ? "default" : "secondary"}>
                        {isActive(offer) ? "Active" : isExpired(offer.end_date) ? "Expired" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>
              Update the offer details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Offer Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Summer Sale 50% Off"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the offer details..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-discount">Discount Percentage *</Label>
              <Input
                id="edit-discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                placeholder="25"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-start-date">Start Date *</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-end-date">End Date *</Label>
                <Input
                  id="edit-end-date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit-is-active">Active</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOffer}>Update Offer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Offer Details</DialogTitle>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                <p className="text-lg font-semibold">{selectedOffer.title}</p>
              </div>
              
              {selectedOffer.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm">{selectedOffer.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Discount</Label>
                  <p className="text-lg font-semibold text-green-600">{selectedOffer.discount_percentage}% off</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant={isActive(selectedOffer) ? "default" : "secondary"}>
                    {isActive(selectedOffer) ? "Active" : isExpired(selectedOffer.end_date) ? "Expired" : "Inactive"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                  <p className="text-sm">{new Date(selectedOffer.start_date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                  <p className="text-sm">{new Date(selectedOffer.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{offerToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
