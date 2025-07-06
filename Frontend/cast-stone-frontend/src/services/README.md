# Cast Stone API Services

A comprehensive TypeScript service layer for the Cast Stone eCommerce frontend application. This service layer provides a clean, type-safe interface to interact with the Cast Stone API.

## 🏗️ Architecture

The service layer follows a modular architecture with clear separation of concerns:

```
services/
├── config/           # Configuration and base classes
├── types/            # TypeScript type definitions
├── api/              # API service implementations
│   ├── collections/  # Collection-related services
│   ├── products/     # Product-related services
│   ├── orders/       # Order-related services
│   ├── users/        # User-related services
│   └── seed/         # Data seeding services
├── examples/         # Usage examples
└── index.ts          # Main export file
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { apiService } from '@/services';

// Get all collections
const collections = await apiService.collections.get.getAll();

// Create a new product
const product = await apiService.products.post.create({
  name: 'Marble Slab',
  price: 99.99,
  stock: 10,
  collectionId: 1
});

// Get filtered orders
const orders = await apiService.orders.get.getFiltered({
  statusId: 1,
  pageNumber: 1,
  pageSize: 10
});
```

### Individual Service Usage

```typescript
import { collectionService, productService } from '@/services';

// Use specific services
const collections = await collectionService.get.getAll();
const products = await productService.get.getByCollection(1);
```

## 📋 Available Services

### Collections Service

```typescript
// GET operations
collectionService.get.getAll()
collectionService.get.getById(id)
collectionService.get.getFiltered(filters)
collectionService.get.getHierarchy()
collectionService.get.getPublished()

// POST operations
collectionService.post.create(data)
collectionService.post.createRootCollection(name, description, ...)
collectionService.post.createSubCollection(name, description, level, parentId, ...)

// UPDATE operations
collectionService.update.update(id, data)
collectionService.update.updateBasicInfo(id, name, description, updatedBy)
collectionService.update.updateTags(id, tags, updatedBy)
collectionService.update.updatePublishStatus(id, published, updatedBy)

// DELETE operations
collectionService.delete.delete(id)
collectionService.delete.safeDelete(id)
collectionService.delete.canDelete(id)
```

### Products Service

```typescript
// GET operations
productService.get.getAll()
productService.get.getById(id)
productService.get.getFiltered(filters)
productService.get.getByCollection(collectionId)
productService.get.getFeatured(count)
productService.get.getInStock()

// POST operations
productService.post.create(data)
productService.post.createSimple(name, description, price, stock, collectionId)
productService.post.duplicate(originalId, newName, modifications)

// UPDATE operations
productService.update.update(id, data)
productService.update.updateStock(id, newStock)
productService.update.updatePrice(id, newPrice)
productService.update.updateBasicInfo(id, name, description)

// DELETE operations
productService.delete.delete(id)
productService.delete.safeDelete(id)
productService.delete.archive(id)
```

### Orders Service

```typescript
// GET operations
orderService.get.getAll()
orderService.get.getById(id)
orderService.get.getFiltered(filters)
orderService.get.getByUser(userId)
orderService.get.getPending()
orderService.get.getTotalRevenue()

// POST operations
orderService.post.create(data)
orderService.post.createCustomerOrder(userId, email, items, shipping, payment)
orderService.post.createGuestOrder(email, items, shipping, payment)
orderService.post.createQuickOrder(productId, quantity, customerInfo, payment)

// UPDATE operations
orderService.update.updateStatus(id, statusId)
orderService.update.cancel(id)
orderService.update.confirm(id)
orderService.update.markAsShipped(id)

// DELETE operations
orderService.delete.delete(id)
orderService.delete.safeDelete(id)
orderService.delete.archive(id)
```

### Users Service

```typescript
// GET operations
userService.get.getAll()
userService.get.getById(id)
userService.get.getFiltered(filters)
userService.get.getByEmail(email)
userService.get.getByRole(role)
userService.get.getActive()

// POST operations
userService.post.create(data)
userService.post.createCustomer(email, password, name, phone, address)
userService.post.createAdmin(email, password, name, phone)
userService.post.register(email, password, name, phone)

// UPDATE operations
userService.update.update(id, data)
userService.update.activate(id)
userService.update.deactivate(id)
userService.update.updateProfile(id, name, phone, address)
userService.update.updateRole(id, newRole)

// DELETE operations
userService.delete.delete(id)
userService.delete.safeDelete(id)
userService.delete.archive(id)
```

### Seed Service

```typescript
// Seeding operations
seedService.seedAll()
seedService.seedStatuses()
seedService.seedAdminUser()
seedService.seedCollections()
seedService.seedProducts()
seedService.initializeDatabase()
```

## 🔧 Configuration

### Environment Variables

Set the API base URL in your environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5090/api
```

### Custom Configuration

```typescript
import { BaseApiUrl } from '@/services';

// The base URL is automatically configured from environment variables
console.log('API Base URL:', BaseApiUrl);
```

## 🎯 Advanced Features

### Filtering and Pagination

All services support advanced filtering with pagination:

```typescript
const result = await productService.get.getFiltered({
  name: 'marble',
  minPrice: 50,
  maxPrice: 200,
  inStock: true,
  collectionId: 1,
  pageNumber: 1,
  pageSize: 20,
  sortBy: 'price',
  sortDirection: 'asc'
});

console.log('Products:', result.data);
console.log('Total Pages:', result.totalPages);
console.log('Has Next Page:', result.hasNextPage);
```

### Error Handling

All services include comprehensive error handling:

```typescript
try {
  const product = await productService.get.getById(999);
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Errors:', error.errors);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Batch Operations

Many services support batch operations:

```typescript
// Create multiple products
const products = await productService.post.createBatch([
  { name: 'Product 1', price: 99.99, stock: 10, collectionId: 1 },
  { name: 'Product 2', price: 149.99, stock: 5, collectionId: 1 }
]);

// Update multiple order statuses
const result = await orderService.update.bulkUpdateStatus([1, 2, 3], 2);
console.log('Updated:', result.updatedCount);
```

### Utility Functions

The service layer includes helpful utilities:

```typescript
import { ServiceUtils } from '@/services';

// Format currency
const formatted = ServiceUtils.formatCurrency(99.99); // "$99.99"

// Validate email
const isValid = ServiceUtils.isValidEmail('user@example.com'); // true

// Clean object for API calls
const cleanFilters = ServiceUtils.cleanObject({
  name: 'test',
  price: undefined,
  active: true
}); // { name: 'test', active: true }

// Debounce function
const debouncedSearch = ServiceUtils.debounce(searchFunction, 300);
```

## 🔒 Type Safety

All services are fully typed with TypeScript:

```typescript
import type { 
  Product, 
  CreateProductRequest, 
  ProductFilterRequest,
  PaginatedResponse 
} from '@/services';

// Type-safe API calls
const filters: ProductFilterRequest = {
  minPrice: 50,
  maxPrice: 200,
  pageSize: 10
};

const result: PaginatedResponse<Product> = await productService.get.getFiltered(filters);
```

## 📚 Examples

See the `examples/usage.ts` file for comprehensive usage examples of all services.

## 🛠️ Development

### Adding New Services

1. Create service files in the appropriate `api/` subdirectory
2. Follow the existing pattern: `get.ts`, `post.ts`, `update.ts`, `delete.ts`
3. Extend the `BaseService` class
4. Add proper TypeScript types
5. Export from the service index file

### Testing Services

```typescript
// Example test
import { productService } from '@/services';

describe('Product Service', () => {
  it('should fetch products', async () => {
    const products = await productService.get.getAll();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });
});
```

## 🚀 Best Practices

1. **Always use try-catch blocks** for error handling
2. **Use TypeScript types** for all API calls
3. **Leverage filtering and pagination** for large datasets
4. **Use batch operations** when working with multiple items
5. **Clean filter objects** before API calls using `ServiceUtils.cleanObject()`
6. **Use debouncing** for search functionality
7. **Check service responses** for success status

## 📄 License

This service layer is part of the Cast Stone eCommerce application.
