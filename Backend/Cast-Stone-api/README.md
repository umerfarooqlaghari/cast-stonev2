# Cast Stone API - eCommerce Backend

A comprehensive .NET 8 Web API for the Cast Stone eCommerce platform with clean architecture, PostgreSQL database, and Entity Framework Core.

## 🏗️ Architecture

The API follows clean architecture principles with clear separation of concerns:

- **Controllers**: Handle HTTP requests and routing logic
- **Services**: Contain business logic and orchestration
- **Repositories**: Handle database operations and data access
- **Domain Models**: Entity classes representing the database schema
- **DTOs**: Data Transfer Objects for API requests and responses
- **AutoMapper**: Handles mapping between domain models and DTOs

## 📊 Database Schema

### Core Entities

1. **Users** - Customer and admin user management
2. **Collections** - Hierarchical product categorization (3 levels)
3. **Products** - Product catalog with inventory management
4. **Orders** - Order processing and management
5. **OrderItems** - Individual items within orders
6. **Status** - Comprehensive status management for orders, payments, inventory, and activities

### Hierarchical Collections

The collection system supports 3-level hierarchy:
- **Level 1**: Root categories (e.g., "Natural Stone", "Engineered Stone")
- **Level 2**: Sub-categories (e.g., "Marble", "Granite", "Quartz")
- **Level 3**: Specific types (e.g., "Carrara Marble", "Black Granite")

## 🚀 API Endpoints

### Collections (`/api/collections`)
- `GET /` - Get all collections
- `GET /{id}` - Get collection by ID
- `POST /` - Create new collection
- `PUT /{id}` - Update collection
- `DELETE /{id}` - Delete collection
- `GET /level/{level}` - Get collections by level
- `GET /hierarchy` - Get complete hierarchy
- `GET /published` - Get published collections
- `GET /search?name={name}` - Search collections
- `GET /{id}/children` - Get child collections

### Products (`/api/products`)
- `GET /` - Get all products
- `GET /{id}` - Get product by ID
- `POST /` - Create new product
- `PUT /{id}` - Update product
- `DELETE /{id}` - Delete product
- `GET /collection/{collectionId}` - Get products by collection
- `GET /in-stock` - Get products in stock
- `GET /featured` - Get featured products
- `GET /latest` - Get latest products
- `GET /search?name={name}` - Search products
- `GET /price-range?minPrice={min}&maxPrice={max}` - Filter by price
- `PATCH /{id}/stock` - Update product stock

### Orders (`/api/orders`)
- `GET /` - Get all orders (summary)
- `GET /{id}` - Get order by ID
- `POST /` - Create new order
- `PATCH /{id}/status` - Update order status
- `PATCH /{id}/cancel` - Cancel order
- `DELETE /{id}` - Delete order
- `GET /user/{userId}` - Get orders by user
- `GET /email/{email}` - Get orders by email
- `GET /status/{statusId}` - Get orders by status
- `GET /pending` - Get pending orders
- `GET /recent` - Get recent orders
- `GET /{id}/details` - Get order with full details
- `GET /revenue/total` - Get total revenue
- `GET /revenue/range` - Get revenue by date range

### Users (`/api/users`)
- `GET /` - Get all users
- `GET /{id}` - Get user by ID
- `POST /` - Create new user
- `PUT /{id}` - Update user
- `DELETE /{id}` - Delete user
- `GET /email/{email}` - Get user by email
- `GET /role/{role}` - Get users by role
- `GET /active` - Get active users
- `GET /recent` - Get recent users
- `PATCH /{id}/deactivate` - Deactivate user
- `PATCH /{id}/activate` - Activate user
- `GET /{id}/orders` - Get user with orders
- `GET /email-exists/{email}` - Check if email exists

### Data Seeding (`/api/seed`)
- `POST /all` - Seed all data
- `POST /statuses` - Seed status data
- `POST /admin-user` - Seed admin user
- `POST /collections` - Seed sample collections
- `POST /products` - Seed sample products

## 📋 Status Types

The system includes comprehensive status management:

### Order Statuses (1-8)
- Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned, Refunded

### Payment Statuses (9-13)
- Payment Pending, Payment Completed, Payment Failed, Payment Refunded, Payment Partially Refunded

### Inventory Statuses (14-19)
- In Stock, Out of Stock, Low Stock, Discontinued, Pre-Order, Back Order

### Activity Statuses (20-25)
- Active, Inactive, Suspended, Archived, Draft, Published

## 👤 Admin User

A default admin user is created with the following credentials:
- **Email**: mumerfarooqlaghari@gmail.com
- **Password**: 132Trent@!
- **Role**: admin
- **Name**: umer farooq
- **Phone**: +92 3009243063
- **Country**: Pakistan
- **City**: karachi
- **Zip Code**: 75330

## 🛠️ Setup Instructions

1. **Prerequisites**
   - .NET 8 SDK
   - PostgreSQL database
   - Railway account (for database hosting)

2. **Database Setup**
   - Update connection string in `appsettings.Development.json`
   - Run migrations: `dotnet ef database update`

3. **Run the API**
   ```bash
   dotnet run
   ```
   The API will be available at `http://localhost:5090`

4. **Seed Data**
   - Option 1: Call the seeding endpoints via Swagger UI
   - Option 2: Use the PowerShell script: `Scripts/RunSeeding.ps1`

## 📦 Dependencies

- **Entity Framework Core** - ORM for database operations
- **Npgsql.EntityFrameworkCore.PostgreSQL** - PostgreSQL provider
- **AutoMapper** - Object-to-object mapping
- **BCrypt.Net-Next** - Password hashing
- **Swashbuckle.AspNetCore** - API documentation

## 🔧 Features

- ✅ Clean Architecture with proper separation of concerns
- ✅ Hierarchical collection structure (3 levels)
- ✅ Comprehensive eCommerce endpoints
- ✅ Automatic stock management during order processing
- ✅ Password hashing with BCrypt
- ✅ AutoMapper for DTO mapping
- ✅ Comprehensive status management
- ✅ Data seeding scripts
- ✅ Swagger documentation
- ✅ CORS configuration for frontend integration
- ✅ Proper error handling and validation
- ✅ Guest order support

## 📝 API Documentation

When running in development mode, Swagger UI is available at the root URL (`http://localhost:5090`) providing interactive API documentation and testing capabilities.

## 🔄 Next Steps

1. Connect to your Railway PostgreSQL database
2. Run database migrations
3. Seed the initial data
4. Test the API endpoints
5. Integrate with your frontend application

The API is now ready for eCommerce operations with full CRUD capabilities for all entities and proper business logic implementation.
