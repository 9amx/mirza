const products = [
  {
    name: "Premium Cotton T-Shirt",
    description: "Comfortable premium cotton t-shirt perfect for daily wear. Available in multiple colors.",
    price: 899,
    category: "T-Shirts",
    stock_quantity: 50,
    image_url: "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt",
    discount_percentage: 15,
    in_stock: true,
    is_featured: false,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    name: "Denim Jeans Classic",
    description: "High-quality denim jeans with a classic fit. Durable and stylish for everyday wear.",
    price: 2499,
    category: "Pants",
    stock_quantity: 30,
    image_url: "/placeholder.svg?height=400&width=400&text=Denim+Jeans",
    discount_percentage: 20,
    in_stock: true,
    is_featured: true,
    sizes: ["28", "30", "32", "34", "36", "38"]
  },
  {
    name: "Silk Saree Traditional",
    description: "Beautiful traditional silk saree with intricate designs. Perfect for special occasions.",
    price: 4999,
    category: "Sarees",
    stock_quantity: 15,
    image_url: "/placeholder.svg?height=400&width=400&text=Silk+Saree",
    discount_percentage: 10,
    in_stock: true,
    is_featured: true,
    sizes: ["Free Size"]
  },
  {
    name: "Leather Jacket Black",
    description: "Premium leather jacket in black. Stylish and warm for winter weather.",
    price: 8999,
    category: "Jackets",
    stock_quantity: 12,
    image_url: "/placeholder.svg?height=400&width=400&text=Leather+Jacket",
    discount_percentage: 25,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Running Shoes Sport",
    description: "Comfortable running shoes with excellent cushioning. Perfect for daily workouts.",
    price: 3499,
    category: "Shoes",
    stock_quantity: 40,
    image_url: "/placeholder.svg?height=400&width=400&text=Running+Shoes",
    discount_percentage: 30,
    in_stock: true,
    is_featured: true,
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    name: "Cotton Kurta Men",
    description: "Traditional cotton kurta for men. Comfortable and perfect for casual wear.",
    price: 1599,
    category: "Kurtas",
    stock_quantity: 35,
    image_url: "/placeholder.svg?height=400&width=400&text=Cotton+Kurta",
    discount_percentage: 5,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Designer Handbag",
    description: "Elegant designer handbag made from high-quality materials. Perfect for any occasion.",
    price: 5499,
    category: "Bags",
    stock_quantity: 20,
    image_url: "/placeholder.svg?height=400&width=400&text=Designer+Handbag",
    discount_percentage: 40,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Wool Sweater",
    description: "Warm wool sweater perfect for winter. Available in multiple sizes and colors.",
    price: 2799,
    category: "Sweaters",
    stock_quantity: 25,
    image_url: "/placeholder.svg?height=400&width=400&text=Wool+Sweater",
    discount_percentage: 18,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Casual Sneakers",
    description: "Trendy casual sneakers for everyday wear. Comfortable and stylish design.",
    price: 2299,
    category: "Shoes",
    stock_quantity: 45,
    image_url: "/placeholder.svg?height=400&width=400&text=Casual+Sneakers",
    discount_percentage: 22,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Formal Shirt White",
    description: "Classic white formal shirt perfect for office wear. Made from premium cotton.",
    price: 1899,
    category: "Shirts",
    stock_quantity: 60,
    image_url: "/placeholder.svg?height=400&width=400&text=Formal+Shirt",
    discount_percentage: 12,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Maxi Dress Floral",
    description: "Beautiful floral maxi dress perfect for summer. Comfortable and elegant design.",
    price: 3299,
    category: "Dresses",
    stock_quantity: 18,
    image_url: "/placeholder.svg?height=400&width=400&text=Maxi+Dress",
    discount_percentage: 35,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Chino Pants",
    description: "Comfortable chino pants suitable for both casual and semi-formal occasions.",
    price: 1999,
    category: "Pants",
    stock_quantity: 32,
    image_url: "/placeholder.svg?height=400&width=400&text=Chino+Pants",
    discount_percentage: 8,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Winter Coat",
    description: "Warm winter coat with excellent insulation. Perfect for cold weather.",
    price: 6999,
    category: "Coats",
    stock_quantity: 10,
    image_url: "/placeholder.svg?height=400&width=400&text=Winter+Coat",
    discount_percentage: 28,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Sports Watch",
    description: "Digital sports watch with multiple features. Water-resistant and durable.",
    price: 4599,
    category: "Watches",
    stock_quantity: 15,
    image_url: "/placeholder.svg?height=400&width=400&text=Sports+Watch",
    discount_percentage: 45,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt made from breathable fabric. Perfect for casual outings.",
    price: 1299,
    category: "Shirts",
    stock_quantity: 55,
    image_url: "/placeholder.svg?height=400&width=400&text=Polo+Shirt",
    discount_percentage: 16,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Evening Gown",
    description: "Elegant evening gown perfect for formal events. Beautiful design and comfortable fit.",
    price: 7999,
    category: "Dresses",
    stock_quantity: 8,
    image_url: "/placeholder.svg?height=400&width=400&text=Evening+Gown",
    discount_percentage: 50,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Canvas Backpack",
    description: "Durable canvas backpack perfect for school or travel. Multiple compartments.",
    price: 1799,
    category: "Bags",
    stock_quantity: 38,
    image_url: "/placeholder.svg?height=400&width=400&text=Canvas+Backpack",
    discount_percentage: 14,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Hoodie Pullover",
    description: "Comfortable hoodie pullover perfect for casual wear. Soft and warm material.",
    price: 2199,
    category: "Hoodies",
    stock_quantity: 42,
    image_url: "/placeholder.svg?height=400&width=400&text=Hoodie+Pullover",
    discount_percentage: 24,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Summer Shorts",
    description: "Lightweight summer shorts perfect for hot weather. Comfortable and breathable.",
    price: 999,
    category: "Shorts",
    stock_quantity: 48,
    image_url: "/placeholder.svg?height=400&width=400&text=Summer+Shorts",
    discount_percentage: 20,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Blazer Formal",
    description: "Professional blazer perfect for business meetings. High-quality tailoring.",
    price: 5999,
    category: "Blazers",
    stock_quantity: 14,
    image_url: "/placeholder.svg?height=400&width=400&text=Formal+Blazer",
    discount_percentage: 33,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Ankle Boots",
    description: "Stylish ankle boots perfect for any season. Comfortable and durable construction.",
    price: 4299,
    category: "Shoes",
    stock_quantity: 22,
    image_url: "/placeholder.svg?height=400&width=400&text=Ankle+Boots",
    discount_percentage: 38,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Cardigan Sweater",
    description: "Cozy cardigan sweater perfect for layering. Available in multiple colors.",
    price: 2599,
    category: "Cardigans",
    stock_quantity: 28,
    image_url: "/placeholder.svg?height=400&width=400&text=Cardigan+Sweater",
    discount_percentage: 19,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Sunglasses Designer",
    description: "Fashionable designer sunglasses with UV protection. Perfect for sunny days.",
    price: 3999,
    category: "Accessories",
    stock_quantity: 25,
    image_url: "/placeholder.svg?height=400&width=400&text=Designer+Sunglasses",
    discount_percentage: 42,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Tracksuit Set",
    description: "Complete tracksuit set perfect for workouts or casual wear. Comfortable fabric.",
    price: 3799,
    category: "Sportswear",
    stock_quantity: 20,
    image_url: "/placeholder.svg?height=400&width=400&text=Tracksuit+Set",
    discount_percentage: 26,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Silk Scarf",
    description: "Luxurious silk scarf with beautiful patterns. Perfect accessory for any outfit.",
    price: 1499,
    category: "Accessories",
    stock_quantity: 35,
    image_url: "/placeholder.svg?height=400&width=400&text=Silk+Scarf",
    discount_percentage: 17,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Wedding Suit",
    description: "Elegant wedding suit with perfect tailoring. Complete set for special occasions.",
    price: 12999,
    category: "Suits",
    stock_quantity: 6,
    image_url: "/placeholder.svg?height=400&width=400&text=Wedding+Suit",
    discount_percentage: 15,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Yoga Pants",
    description: "Flexible yoga pants perfect for workouts. Breathable and comfortable material.",
    price: 1699,
    category: "Sportswear",
    stock_quantity: 40,
    image_url: "/placeholder.svg?height=400&width=400&text=Yoga+Pants",
    discount_percentage: 23,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Belt Leather",
    description: "Premium leather belt with classic buckle. Perfect for formal and casual wear.",
    price: 1299,
    category: "Accessories",
    stock_quantity: 45,
    image_url: "/placeholder.svg?height=400&width=400&text=Leather+Belt",
    discount_percentage: 11,
    in_stock: true,
    is_featured: false
  },
  {
    name: "Party Dress",
    description: "Stunning party dress perfect for celebrations. Eye-catching design and comfortable fit.",
    price: 4499,
    category: "Dresses",
    stock_quantity: 16,
    image_url: "/placeholder.svg?height=400&width=400&text=Party+Dress",
    discount_percentage: 32,
    in_stock: true,
    is_featured: true
  },
  {
    name: "Winter Gloves",
    description: "Warm winter gloves with excellent grip. Perfect for cold weather activities.",
    price: 799,
    category: "Accessories",
    stock_quantity: 50,
    image_url: "/placeholder.svg?height=400&width=400&text=Winter+Gloves",
    discount_percentage: 27,
    in_stock: true,
    is_featured: false
  }
];

async function addProducts() {
  const baseUrl = 'http://localhost:3003'; // Using the current port
  
  console.log('Starting to add products...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    try {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        successCount++;
        console.log(`✅ Added: ${product.name} (${successCount}/${products.length})`);
      } else {
        failCount++;
        console.log(`❌ Failed to add: ${product.name} - ${response.status}`);
      }
    } catch (error) {
      failCount++;
      console.log(`❌ Error adding ${product.name}:`, error.message);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n🎉 Finished adding products!');
  console.log(`✅ Successfully added: ${successCount} products`);
  console.log(`❌ Failed to add: ${failCount} products`);
  console.log(`📊 Total products processed: ${products.length}`);
}

// Run the script
addProducts().catch(console.error);
