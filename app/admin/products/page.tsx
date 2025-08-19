"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Edit, Trash2, Eye, Search, Filter, X, Upload, Link, Image as ImageIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { getSizesForCategory, getDisplayNameForCategory, getAllCategories } from "@/lib/size-config"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminHeader } from "@/components/admin-header"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image_url?: string
  category?: string
  in_stock: boolean
  stock_quantity?: number
  discount_percentage?: number
  is_featured?: boolean
  sizes?: string[]
  created_at: string
  updated_at?: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showEditProduct, setShowEditProduct] = useState(false)
  const [showViewProduct, setShowViewProduct] = useState(false)
  const [addingProduct, setAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [imageUploadMode, setImageUploadMode] = useState<'url' | 'upload'>('url')
  const [editImageUploadMode, setEditImageUploadMode] = useState<'url' | 'upload'>('url')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock_quantity: "",
    image_url: "",
    discount_percentage: "",
    in_stock: true,
    is_featured: false,
    sizes: [] as string[]
  })

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' })
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name, base64 })
        })
        
        if (response.ok) {
          const result = await response.json()
          setNewProduct(prev => ({ ...prev, image_url: result.imagePath }))
        } else {
          alert('Failed to upload image')
        }
        setUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image')
      setUploadingImage(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    setAddingProduct(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity) || 0,
          discount_percentage: newProduct.discount_percentage ? parseFloat(newProduct.discount_percentage) : 0,
          sizes: newProduct.sizes || [],
          created_at: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const addedProduct = await response.json()
        setProducts([...products, addedProduct])
        setShowAddProduct(false)
        setNewProduct({
          name: "",
          description: "",
          price: "",
          category: "",
          stock_quantity: "",
          image_url: "",
          discount_percentage: "",
          in_stock: true,
          is_featured: false,
          sizes: []
        })
      } else {
        alert("Failed to add product")
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert("Error adding product")
    } finally {
      setAddingProduct(false)
    }
  }

  const resetForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      stock_quantity: "",
      image_url: "",
      discount_percentage: "",
      in_stock: true,
      is_featured: false,
      sizes: []
    })
    setImageUploadMode('url')
    setEditImageUploadMode('url')
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowViewProduct(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setNewProduct({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      image_url: product.image_url || "",
      discount_percentage: product.discount_percentage?.toString() || "",
      in_stock: product.in_stock,
      is_featured: product.is_featured ?? false,
      sizes: product.sizes || []
    })
    // Set edit image upload mode based on whether the image is a local path or URL
    setEditImageUploadMode(product.image_url?.startsWith('data/') ? 'upload' : 'url')
    setShowEditProduct(true)
  }

  const handleUpdateProduct = async () => {
    if (!selectedProduct || !newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    setEditingProduct(true)
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock_quantity: parseInt(newProduct.stock_quantity) || 0,
          discount_percentage: newProduct.discount_percentage ? parseFloat(newProduct.discount_percentage) : 0,
          sizes: newProduct.sizes || [],
          updated_at: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p))
        setShowEditProduct(false)
        setSelectedProduct(null)
        resetForm()
        alert("Product updated successfully!")
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert("Failed to update product. Please try again.")
    } finally {
      setEditingProduct(false)
    }
  }

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProduct(true)
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== product.id))
        alert("Product deleted successfully!")
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert("Failed to delete product. Please try again.")
    } finally {
      setDeletingProduct(false)
    }
  }

    if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader 
          title="Products" 
          subtitle="Manage Products"
          showBackButton={true}
          backUrl="/admin"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader 
        title="Products" 
        subtitle="Manage Products"
        showBackButton={true}
        backUrl="/admin"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 {/* Stats Cards */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-2">
                 <Package className="h-5 w-5 text-primary" />
                 <div>
                   <p className="text-sm text-muted-foreground">Total Products</p>
                   <p className="text-2xl font-bold">{products.length}</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-2">
                 <Package className="h-5 w-5 text-green-600" />
                 <div>
                   <p className="text-sm text-muted-foreground">In Stock</p>
                   <p className="text-2xl font-bold">{products.filter(p => p.in_stock).length}</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-2">
                 <Package className="h-5 w-5 text-red-600" />
                 <div>
                   <p className="text-sm text-muted-foreground">Out of Stock</p>
                   <p className="text-2xl font-bold">{products.filter(p => !p.in_stock).length}</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-2">
                 <Package className="h-5 w-5 text-yellow-600" />
                 <div>
                   <p className="text-sm text-muted-foreground">Featured</p>
                   <p className="text-2xl font-bold">{products.filter(p => p.is_featured).length}</p>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>

         {/* Search and Filters */}
         <div className="flex flex-col sm:flex-row gap-4 mb-6">
           <div className="flex-1">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search products..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
             </div>
           </div>
           <div className="flex gap-2">
             <select
               value={selectedCategory}
               onChange={(e) => setSelectedCategory(e.target.value)}
               className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
             >
               <option value="">All Categories</option>
               {categories.map(category => (
                 <option key={category} value={category}>{category}</option>
               ))}
             </select>
             <Button variant="outline">
               <Filter className="h-4 w-4 mr-2" />
               Filter
             </Button>
           </div>
         </div>

         <div className="flex items-center justify-between mb-6">
           <div>
             <h2 className="text-2xl font-bold">Product Management</h2>
             <p className="text-muted-foreground">
               Showing {filteredProducts.length} of {products.length} products
             </p>
           </div>
           <Button 
             className="flex items-center gap-2"
             onClick={() => setShowAddProduct(true)}
           >
             <Plus className="h-4 w-4" />
             Add Product
           </Button>
         </div>

                  <div className="grid gap-6">
           {filteredProducts.length > 0 ? (
             filteredProducts.map((product) => (
               <Card key={product.id} className="hover:shadow-md transition-shadow">
                 <CardContent className="p-6">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="p-2 bg-primary/10 rounded-lg">
                         <Package className="h-6 w-6 text-primary" />
                       </div>
                       <div>
                         <h3 className="font-semibold">{product.name}</h3>
                         <p className="text-sm text-muted-foreground">
                           {product.category} • ৳{product.price.toLocaleString()}
                         </p>
                         <div className="flex items-center gap-2 mt-1">
                           <Badge variant="outline">{product.stock_quantity || 0} in stock</Badge>
                           <Badge variant={product.in_stock ? "default" : "destructive"}>
                             {product.in_stock ? "In Stock" : "Out of Stock"}
                           </Badge>
                           {product.is_featured && (
                             <Badge variant="secondary">Featured</Badge>
                           )}
                         </div>
                         {product.sizes && product.sizes.length > 0 && (
                           <div className="flex flex-wrap gap-1 mt-2">
                             {product.sizes.slice(0, 3).map((size) => (
                               <Badge key={size} variant="outline" className="text-xs">
                                 {size}
                               </Badge>
                             ))}
                             {product.sizes.length > 3 && (
                               <Badge variant="outline" className="text-xs">
                                 +{product.sizes.length - 3} more
                               </Badge>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => handleViewProduct(product)}
                         title="View Product"
                       >
                         <Eye className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="outline" 
                         size="sm"
                         onClick={() => handleEditProduct(product)}
                         title="Edit Product"
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         className="text-red-600 hover:text-red-700"
                         onClick={() => handleDeleteProduct(product)}
                         disabled={deletingProduct}
                         title="Delete Product"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))
           ) : (
             <div className="text-center py-12">
               <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
               <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
               <p className="text-muted-foreground mb-4">
                 {searchTerm || selectedCategory 
                   ? "Try adjusting your search or filter criteria"
                   : "Get started by adding your first product"
                 }
               </p>
               <Button 
                 className="flex items-center gap-2"
                 onClick={() => setShowAddProduct(true)}
               >
                 <Plus className="h-4 w-4" />
                 Add Product
               </Button>
             </div>
           )}
         </div>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Select Category</option>
                {getAllCategories().map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (BDT) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input
                id="stock_quantity"
                type="number"
                placeholder="0"
                value={newProduct.stock_quantity}
                onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Product Image
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
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                />
              )}

              {/* File Upload Mode */}
              {imageUploadMode === 'upload' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {newProduct.image_url ? (
                      <div className="relative">
                        <img 
                          src={newProduct.image_url} 
                          alt="Preview" 
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => setNewProduct({...newProduct, image_url: ""})}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
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
                      Uploading image...
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Percentage</Label>
              <Input
                id="discount"
                type="number"
                placeholder="0"
                value={newProduct.discount_percentage || ""}
                onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description..."
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="in_stock"
                checked={newProduct.in_stock}
                onCheckedChange={(checked) => setNewProduct({...newProduct, in_stock: checked})}
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_featured"
                checked={newProduct.is_featured}
                onCheckedChange={(checked) => setNewProduct({...newProduct, is_featured: checked})}
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>

          {/* Size Selection */}
          {newProduct.category && (
            <div className="space-y-2">
              <Label>{getDisplayNameForCategory(newProduct.category)}</Label>
              <div className="grid grid-cols-3 gap-2">
                {getSizesForCategory(newProduct.category).map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={newProduct.sizes.includes(size)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewProduct({
                            ...newProduct,
                            sizes: [...newProduct.sizes, size]
                          })
                        } else {
                          setNewProduct({
                            ...newProduct,
                            sizes: newProduct.sizes.filter(s => s !== size)
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`size-${size}`} className="text-sm">{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddProduct(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProduct}
              disabled={addingProduct}
              className="flex items-center gap-2"
            >
              {addingProduct ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Product
                </>
              )}
            </Button>
                   </DialogFooter>
       </DialogContent>
     </Dialog>

     {/* Edit Product Modal */}
     <Dialog open={showEditProduct} onOpenChange={setShowEditProduct}>
       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Edit className="h-5 w-5" />
             Edit Product
           </DialogTitle>
           <DialogDescription>
             Update the product details below.
           </DialogDescription>
         </DialogHeader>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="edit-name">Product Name *</Label>
             <Input
               id="edit-name"
               placeholder="Enter product name"
               value={newProduct.name}
               onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
             />
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="edit-category">Category *</Label>
             <select
               id="edit-category"
               value={newProduct.category}
               onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
               className="w-full p-2 border border-border rounded-md bg-background text-foreground"
             >
               <option value="">Select Category</option>
               {getAllCategories().map((category) => (
                 <option key={category} value={category}>{category}</option>
               ))}
             </select>
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="edit-price">Price (BDT) *</Label>
             <Input
               id="edit-price"
               type="number"
               placeholder="0.00"
               value={newProduct.price}
               onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
             />
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="edit-stock_quantity">Stock Quantity</Label>
             <Input
               id="edit-stock_quantity"
               type="number"
               placeholder="0"
               value={newProduct.stock_quantity}
               onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
             />
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="edit-image_url" className="flex items-center gap-2">
               <ImageIcon className="h-4 w-4" />
               Product Image
             </Label>
             
             {/* Image Upload Mode Toggle */}
             <div className="flex gap-2 mb-3">
               <Button
                 type="button"
                 variant={editImageUploadMode === 'url' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setEditImageUploadMode('url')}
                 className="flex items-center gap-2"
               >
                 <Link className="h-4 w-4" />
                 URL
               </Button>
               <Button
                 type="button"
                 variant={editImageUploadMode === 'upload' ? 'default' : 'outline'}
                 size="sm"
                 onClick={() => setEditImageUploadMode('upload')}
                 className="flex items-center gap-2"
               >
                 <Upload className="h-4 w-4" />
                 Upload
               </Button>
             </div>

             {/* URL Input Mode */}
             {editImageUploadMode === 'url' && (
               <Input
                 id="edit-image_url"
                 placeholder="https://example.com/image.jpg"
                 value={newProduct.image_url}
                 onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
               />
             )}

             {/* File Upload Mode */}
             {editImageUploadMode === 'upload' && (
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                   {newProduct.image_url ? (
                     <div className="relative">
                       <img 
                         src={newProduct.image_url} 
                         alt="Preview" 
                         className="w-16 h-16 object-cover rounded border"
                       />
                       <Button
                         type="button"
                         variant="destructive"
                         size="sm"
                         className="absolute -top-2 -right-2 h-6 w-6 p-0"
                         onClick={() => setNewProduct({...newProduct, image_url: ""})}
                       >
                         <X className="h-3 w-3" />
                       </Button>
                     </div>
                   ) : (
                     <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                       <ImageIcon className="h-6 w-6 text-muted-foreground" />
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
                     Uploading image...
                   </div>
                 )}
               </div>
             )}
           </div>
           
           <div className="space-y-2">
             <Label htmlFor="edit-discount_percentage">Discount Percentage</Label>
             <Input
               id="edit-discount_percentage"
               type="number"
               placeholder="0"
               value={newProduct.discount_percentage}
               onChange={(e) => setNewProduct({...newProduct, discount_percentage: e.target.value})}
             />
           </div>
         </div>
         
         <div className="space-y-2">
           <Label htmlFor="edit-description">Description</Label>
           <Textarea
             id="edit-description"
             placeholder="Enter product description..."
             value={newProduct.description}
             onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
             rows={3}
           />
         </div>
         
         <div className="flex items-center justify-between space-x-4">
           <div className="flex items-center space-x-2">
             <Switch
               id="edit-in_stock"
               checked={newProduct.in_stock}
               onCheckedChange={(checked) => setNewProduct({...newProduct, in_stock: checked})}
             />
             <Label htmlFor="edit-in_stock">In Stock</Label>
           </div>
           
           <div className="flex items-center space-x-2">
             <Switch
               id="edit-is_featured"
               checked={newProduct.is_featured}
               onCheckedChange={(checked) => setNewProduct({...newProduct, is_featured: checked})}
             />
             <Label htmlFor="edit-is_featured">Featured Product</Label>
           </div>
         </div>

         {/* Size Selection for Edit */}
         {newProduct.category && (
           <div className="space-y-2">
             <Label>{getDisplayNameForCategory(newProduct.category)}</Label>
             <div className="grid grid-cols-3 gap-2">
               {getSizesForCategory(newProduct.category).map((size) => (
                 <div key={size} className="flex items-center space-x-2">
                   <Checkbox
                     id={`edit-size-${size}`}
                     checked={newProduct.sizes.includes(size)}
                     onCheckedChange={(checked) => {
                       if (checked) {
                         setNewProduct({
                           ...newProduct,
                           sizes: [...newProduct.sizes, size]
                         })
                       } else {
                         setNewProduct({
                           ...newProduct,
                           sizes: newProduct.sizes.filter(s => s !== size)
                         })
                       }
                     }}
                   />
                   <Label htmlFor={`edit-size-${size}`} className="text-sm">{size}</Label>
                 </div>
               ))}
             </div>
           </div>
         )}
         
         <DialogFooter>
           <Button variant="outline" onClick={() => setShowEditProduct(false)}>
             Cancel
           </Button>
           <Button 
             onClick={handleUpdateProduct}
             disabled={editingProduct}
           >
             {editingProduct ? "Updating..." : "Update Product"}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>

     {/* View Product Modal */}
     <Dialog open={showViewProduct} onOpenChange={setShowViewProduct}>
       <DialogContent className="max-w-2xl">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Eye className="h-5 w-5" />
             Product Details
           </DialogTitle>
         </DialogHeader>
         
         {selectedProduct && (
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Product Name</Label>
                 <p className="text-lg font-semibold">{selectedProduct.name}</p>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                 <p className="text-lg">{selectedProduct.category || "N/A"}</p>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                 <p className="text-lg font-semibold text-primary">৳{selectedProduct.price.toLocaleString()}</p>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Stock Quantity</Label>
                 <p className="text-lg">{selectedProduct.stock_quantity || 0}</p>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Discount</Label>
                 <p className="text-lg">{selectedProduct.discount_percentage ? `${selectedProduct.discount_percentage}%` : "No discount"}</p>
               </div>
               
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                 <div className="flex items-center gap-2">
                   <Badge variant={selectedProduct.in_stock ? "default" : "destructive"}>
                     {selectedProduct.in_stock ? "In Stock" : "Out of Stock"}
                   </Badge>
                   {selectedProduct.is_featured && (
                     <Badge variant="secondary">Featured</Badge>
                   )}
                 </div>
               </div>

               {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">
                     {getDisplayNameForCategory(selectedProduct.category || "")}
                   </Label>
                   <div className="flex flex-wrap gap-1">
                     {selectedProduct.sizes.map((size) => (
                       <Badge key={size} variant="outline" className="text-xs">
                         {size}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}
             </div>
             
             {selectedProduct.description && (
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                 <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
               </div>
             )}
             
             {selectedProduct.image_url && (
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Image URL</Label>
                 <p className="text-sm text-muted-foreground break-all">{selectedProduct.image_url}</p>
               </div>
             )}
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                 <p className="text-sm text-muted-foreground">
                   {new Date(selectedProduct.created_at).toLocaleDateString()}
                 </p>
               </div>
               
               {selectedProduct?.updated_at && (
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                   <p className="text-sm text-muted-foreground">
                     {new Date(selectedProduct.updated_at).toLocaleDateString()}
                   </p>
                 </div>
               )}
             </div>
           </div>
         )}
         
         <DialogFooter>
           <Button variant="outline" onClick={() => setShowViewProduct(false)}>
             Close
           </Button>
           {selectedProduct && (
             <Button 
               variant="outline"
               onClick={() => {
                 setShowViewProduct(false)
                 handleEditProduct(selectedProduct)
               }}
             >
               <Edit className="h-4 w-4 mr-2" />
               Edit Product
             </Button>
           )}
         </DialogFooter>
       </DialogContent>
     </Dialog>
   </div>
 )
}
