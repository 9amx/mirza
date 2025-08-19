"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Image as ImageIcon, 
  Save, 
  Upload, 
  Link, 
  X,
  Eye,
  Zap
} from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { useToast } from "@/components/ui/use-toast"

interface BannerSettings {
  title: string
  subtitle: string
  offerText: string
  buttonText: string
  imageUrl: string
  isActive: boolean
  updated_at?: string
}

export default function AdminBannerPage() {
  const [banner, setBanner] = useState<BannerSettings>({
    title: "",
    subtitle: "",
    offerText: "",
    buttonText: "",
    imageUrl: "",
    isActive: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const response = await fetch('/api/banner', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setBanner(data)
          // Set image upload mode based on whether the image is a local path or URL
          setImageUploadMode(data.imageUrl?.startsWith('data/') ? 'upload' : 'url')
        }
      } catch (error) {
        console.error('Error loading banner:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBanner()
  }, [])

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const response = await fetch('/api/upload/banner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64 })
        })
        
        if (response.ok) {
          const result = await response.json()
          setBanner(prev => ({ ...prev, imageUrl: result.imagePath }))
          toast({
            title: "Success",
            description: "Banner image uploaded successfully"
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to upload banner image",
            variant: "destructive"
          })
        }
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Error uploading banner image",
        variant: "destructive"
      })
      setUploadingImage(false)
    }
  }

  const handleSaveBanner = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner)
      })

      if (response.ok) {
        const updated = await response.json()
        setBanner(updated)
        toast({
          title: "Success",
          description: "Banner settings saved successfully"
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save banner settings",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving banner:', error)
      toast({
        title: "Error",
        description: "Failed to save banner settings",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader 
          title="Banner" 
          subtitle="Manage Banner"
          showBackButton={true}
          backUrl="/admin"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading banner settings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Banner" 
        subtitle="Manage Banner"
        showBackButton={true}
        backUrl="/admin"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Banner Settings Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Banner Settings
                </CardTitle>
                <CardDescription>
                  Customize your homepage banner content and appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Banner Status */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Banner Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Show or hide the banner on the homepage
                    </p>
                  </div>
                  <Switch
                    checked={banner.isActive}
                    onCheckedChange={(checked) => setBanner({...banner, isActive: checked})}
                  />
                </div>

                {/* Offer Text */}
                <div className="space-y-2">
                  <Label htmlFor="offerText" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Offer Text
                  </Label>
                  <Input
                    id="offerText"
                    placeholder="৫০% পর্যন্ত ছাড় - সীমিত সময়ের অফার!"
                    value={banner.offerText}
                    onChange={(e) => setBanner({...banner, offerText: e.target.value})}
                  />
                  <p className="text-sm text-muted-foreground">This appears as a badge in the top-left corner</p>
                </div>

                {/* Main Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Main Title</Label>
                  <Input
                    id="title"
                    placeholder="আপনার পছন্দের স্টাইল খুঁজুন"
                    value={banner.title}
                    onChange={(e) => setBanner({...banner, title: e.target.value})}
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    placeholder="আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।"
                    value={banner.subtitle}
                    onChange={(e) => setBanner({...banner, subtitle: e.target.value})}
                    rows={3}
                  />
                </div>

                {/* Button Text */}
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    placeholder="এখনই কিনুন →"
                    value={banner.buttonText}
                    onChange={(e) => setBanner({...banner, buttonText: e.target.value})}
                  />
                </div>

                {/* Banner Image */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Banner Image
                  </Label>
                  
                  {/* Image Upload Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={imageUploadMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageUploadMode('url')}
                      className="flex items-center gap-2"
                    >
                      <Link className="h-4 w-4" />
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={imageUploadMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageUploadMode('upload')}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>

                  {/* URL Input Mode */}
                  {imageUploadMode === 'url' && (
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/banner-image.jpg"
                      value={banner.imageUrl}
                      onChange={(e) => setBanner({...banner, imageUrl: e.target.value})}
                    />
                  )}

                  {/* File Upload Mode */}
                  {imageUploadMode === 'upload' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {banner.imageUrl ? (
                          <div className="relative">
                            <img 
                              src={banner.imageUrl} 
                              alt="Banner Preview" 
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 p-0"
                              onClick={() => setBanner({...banner, imageUrl: ""})}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleImageUpload(file)
                            }
                          }}
                          className="flex-1"
                        />
                      </div>
                      {uploadingImage && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          Uploading banner image...
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <Button 
                  onClick={handleSaveBanner}
                  disabled={saving}
                  className="w-full flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Banner Settings'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Banner Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Banner Preview
                </CardTitle>
                <CardDescription>
                  See how your banner will appear on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {banner.isActive ? (
                  <div className="relative bg-gradient-to-r from-white to-gray-50 rounded-lg overflow-hidden border">
                    {/* Offer Badge */}
                    {banner.offerText && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                          <Zap className="h-3 w-3 mr-1" />
                          {banner.offerText}
                        </Badge>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                      {/* Text Content */}
                      <div className="flex flex-col justify-center space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {banner.title || "আপনার পছন্দের স্টাইল খুঁজুন"}
                        </h1>
                        <p className="text-gray-600 text-sm md:text-base">
                          {banner.subtitle || "আধুনিক জীবনযাত্রার জন্য বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য। প্রতিটি কেনাকাটায় গুণমান, স্টাইল এবং উৎকর্ষতা।"}
                        </p>
                        <Button className="w-fit bg-teal-600 hover:bg-teal-700">
                          {banner.buttonText || "এখনই কিনুন →"}
                        </Button>
                      </div>

                      {/* Image */}
                      <div className="flex items-center justify-center">
                        {banner.imageUrl ? (
                          <img 
                            src={banner.imageUrl} 
                            alt="Banner" 
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                              <p className="text-sm">No banner image</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="h-12 w-12 mx-auto mb-4" />
                    <p>Banner is currently disabled</p>
                    <p className="text-sm">Enable it to see the preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Banner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Banner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {banner.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Updated:</span>
                    <span className="text-sm">
                      {new Date(banner.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
