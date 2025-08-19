import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

// Ensure this route is always dynamic and not cached so all users see updates immediately
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    
    let products = await DatabaseService.getProducts()
    
    // Filter by category
    if (category) {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    }
    
    // Filter by search term
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.is_featured)
    }

    // Always return newest first so homepage shows recent admin changes
    products = products.sort((a: any, b: any) => {
      const aTime = new Date(a.created_at || 0).getTime()
      const bTime = new Date(b.created_at || 0).getTime()
      return bTime - aTime
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await DatabaseService.createProduct(body)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
