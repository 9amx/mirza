# Mirza Garments E-commerce Platform

A modern e-commerce platform with a beautiful web interface and comprehensive admin panel.

## 🚀 Features

### Web Application
- **Modern UI/UX**: Beautiful, responsive design with Bengali language support
- **Product Catalog**: Browse products by category with search functionality
- **Shopping Cart**: Add products to cart and checkout
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Real-time Updates**: Live data synchronization with admin panel

### Admin Panel
- **Dashboard**: Comprehensive analytics and statistics
- **Product Management**: Add, edit, delete, and manage products
- **User Management**: Manage customer accounts and admin users
- **Order Management**: Track and update order status
- **Analytics**: Sales reports, popular products, and revenue tracking

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Context, Custom Hooks
- **Data Management**: Shared data layer with API routes
- **Development**: Turbopack, ESLint, Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mirza Garments-ecommerce
   ```

2. **Install dependencies for both applications**
   ```bash
   # Install main application dependencies
   npm install
   
   # Install admin panel dependencies
   cd admin
   npm install
   cd ..
   ```

## 🚀 Running the Applications

### Option 1: Run Both Applications Together
```bash
# Run both web app and admin panel simultaneously
npm run dev:all
```

### Option 2: Run Applications Separately

**Main Web Application (Port 3000)**
```bash
npm run dev
```
Access at: http://localhost:3000

**Admin Panel (Port 3001)**
```bash
npm run dev:admin
```
Access at: http://localhost:3001

## 🔗 Application Connection

The web application and admin panel are connected through:

1. **Shared Data Layer**: Both applications use the same data management system
2. **API Routes**: RESTful API endpoints for data operations
3. **Real-time Updates**: Changes in admin panel reflect immediately in the web app
4. **Admin Link**: Floating admin button on the web app for quick access

### API Endpoints

- `GET /api/products` - Fetch all products
- `POST /api/products` - Create new product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/users` - Fetch all users
- `GET /api/orders` - Fetch all orders
- `GET /api/dashboard` - Fetch dashboard statistics

## 📁 Project Structure

```
Mirza Garments-ecommerce/
├── app/                    # Main web application
│   ├── api/               # API routes
│   ├── cart/              # Cart pages
│   ├── checkout/          # Checkout pages
│   └── page.tsx           # Homepage
├── admin/                 # Admin panel
│   ├── src/
│   │   ├── app/           # Admin pages
│   │   ├── components/    # Admin components
│   │   └── lib/           # Admin utilities
│   └── package.json
├── components/            # Shared components
├── lib/                   # Shared utilities
│   ├── shared-data.ts     # Data management
│   └── cart-context.tsx   # Cart state
├── public/                # Static assets
└── package.json
```

## 🎨 Customization

### Adding New Products
1. Use the admin panel to add products
2. Or directly modify `lib/shared-data.ts`
3. Products will appear immediately on the web app

### Styling
- Main app uses Tailwind CSS with custom Bengali typography
- Admin panel uses a modern dashboard design
- Both support dark/light theme switching

### Data Management
- Currently uses mock data for development
- Easy to switch to real database (PostgreSQL, MongoDB, etc.)
- All data operations go through the shared `DataManager` class

## 🔧 Development

### Available Scripts

```bash
# Main application
npm run dev          # Start web app
npm run build        # Build web app
npm run start        # Start production web app

# Admin panel
npm run dev:admin    # Start admin panel
npm run build:admin  # Build admin panel
npm run start:admin  # Start production admin panel

# Both applications
npm run dev:all      # Start both apps
npm run build:all    # Build both apps
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001

# Database (for future use)
DATABASE_URL=your-database-url

# Authentication (for future use)
JWT_SECRET=your-secret-key
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Deploy both applications as separate projects
3. Configure environment variables
4. Set up custom domains

### Other Platforms
- **Netlify**: Deploy static build
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both applications
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Mirza Garments** - Premium Fashion & Lifestyle Platform
