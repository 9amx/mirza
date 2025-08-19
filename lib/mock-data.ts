export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  in_stock: boolean
  created_at: string
}

export interface Offer {
  id: string
  title: string
  description: string
  discount_percentage: number
  end_date: string
  is_active: boolean
}

export const mockProducts: Product[] = [
  {
    id: "4",
    name: "এলিগ্যান্ট সিল্ক শাড়ি",
    description: "হাতে বোনা সিল্ক শাড়ি জটিল এমব্রয়ডারি সহ",
    price: 12000,
    image_url: "/elegant-silk-saree.png",
    category: "Saree",
    in_stock: true,
    created_at: "2024-01-18T10:00:00Z",
  },
  {
    id: "5",
    name: "আধুনিক বোরকা",
    description: "আরামদায়ক এবং স্টাইলিশ আধুনিক বোরকা প্রিমিয়াম ফ্যাব্রিক সহ",
    price: 4500,
    image_url: "/modern-burqa.png",
    category: "Burqa",
    in_stock: true,
    created_at: "2024-01-19T10:00:00Z",
  },
  {
    id: "6",
    name: "কটন পাঞ্জাবি",
    description: "পুরুষদের জন্য ঐতিহ্যবাহী কটন পাঞ্জাবি, উৎসবের জন্য উপযুক্ত",
    price: 2800,
    image_url: "/cotton-panjabi.png",
    category: "Panjabi",
    in_stock: true,
    created_at: "2024-01-20T10:00:00Z",
  },
  {
    id: "7",
    name: "ফর্মাল শার্ট",
    description: "অফিস এবং ব্যবসার জন্য প্রিমিয়াম মানের ফর্মাল শার্ট",
    price: 3500,
    image_url: "/formal-shirt.png",
    category: "Shirt",
    in_stock: true,
    created_at: "2024-01-21T10:00:00Z",
  },
  {
    id: "8",
    name: "ক্যাজুয়াল টি-শার্ট",
    description: "আরামদায়ক এবং স্টাইলিশ ক্যাজুয়াল টি-শার্ট",
    price: 1500,
    image_url: "/casual-t-shirt.png",
    category: "T-Shirt",
    in_stock: true,
    created_at: "2024-01-22T10:00:00Z",
  },
  {
    id: "9",
    name: "ডেনিম প্যান্ট",
    description: "উচ্চ মানের ডেনিম প্যান্ট আধুনিক ফিট সহ",
    price: 4200,
    image_url: "/denim-pants.png",
    category: "Pant",
    in_stock: true,
    created_at: "2024-01-23T10:00:00Z",
  },
]

export const mockOffers: Offer[] = [
  {
    id: "1",
    title: "ঈদ বিশেষ ছাড়",
    description: "সব ঐতিহ্যবাহী পোশাকে ২৫% ছাড় পান",
    discount_percentage: 25,
    end_date: "2024-06-30T23:59:59Z",
    is_active: true,
  },
  {
    id: "2",
    title: "নতুন গ্রাহক অফার",
    description: "আপনার প্রথম কেনাকাটায় ১৫% ছাড়",
    discount_percentage: 15,
    end_date: "2024-12-31T23:59:59Z",
    is_active: true,
  },
]
