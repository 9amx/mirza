export interface SizeConfig {
  category: string
  sizes: string[]
  displayName: string
}

export const SIZE_CONFIGS: SizeConfig[] = [
  {
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "T-Shirt Sizes"
  },
  {
    category: "Shirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Shirt Sizes"
  },
  {
    category: "Polo Shirts",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Polo Shirt Sizes"
  },
  {
    category: "Pants",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    displayName: "Pant Sizes (Waist)"
  },
  {
    category: "Jeans",
    sizes: ["28", "30", "32", "34", "36", "38", "40", "42"],
    displayName: "Jeans Sizes (Waist)"
  },
  {
    category: "Shorts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    displayName: "Shorts Sizes"
  },
  {
    category: "Dresses",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Dress Sizes"
  },
  {
    category: "Sarees",
    sizes: ["Free Size"],
    displayName: "Saree Size"
  },
  {
    category: "Kurtas",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Kurta Sizes"
  },
  {
    category: "Jackets",
    sizes: ["S", "M", "L", "XL", "XXL"],
    displayName: "Jacket Sizes"
  },
  {
    category: "Coats",
    sizes: ["S", "M", "L", "XL", "XXL"],
    displayName: "Coat Sizes"
  },
  {
    category: "Blazers",
    sizes: ["S", "M", "L", "XL", "XXL"],
    displayName: "Blazer Sizes"
  },
  {
    category: "Suits",
    sizes: ["S", "M", "L", "XL", "XXL"],
    displayName: "Suit Sizes"
  },
  {
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    displayName: "Shoe Sizes (UK)"
  },
  {
    category: "Sneakers",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    displayName: "Sneaker Sizes (UK)"
  },
  {
    category: "Boots",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    displayName: "Boot Sizes (UK)"
  },
  {
    category: "Sweaters",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Sweater Sizes"
  },
  {
    category: "Hoodies",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Hoodie Sizes"
  },
  {
    category: "Cardigans",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Cardigan Sizes"
  },
  {
    category: "Sportswear",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    displayName: "Sportswear Sizes"
  },
  {
    category: "Bags",
    sizes: ["One Size"],
    displayName: "Bag Size"
  },
  {
    category: "Accessories",
    sizes: ["One Size"],
    displayName: "Accessory Size"
  },
  {
    category: "Watches",
    sizes: ["One Size"],
    displayName: "Watch Size"
  }
]

export function getSizesForCategory(category: string): string[] {
  const config = SIZE_CONFIGS.find(c => c.category.toLowerCase() === category.toLowerCase())
  return config ? config.sizes : ["One Size"]
}

export function getDisplayNameForCategory(category: string): string {
  const config = SIZE_CONFIGS.find(c => c.category.toLowerCase() === category.toLowerCase())
  return config ? config.displayName : "Size"
}

export function getAllCategories(): string[] {
  return SIZE_CONFIGS.map(c => c.category)
}
