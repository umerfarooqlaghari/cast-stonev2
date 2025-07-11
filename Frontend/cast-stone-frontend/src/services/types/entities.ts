// Collection Types
export interface Collection {
  id: number;
  name: string;
  description?: string;
  level: number;
  parentCollectionId?: number;
  childCollectionIds?: number[];
  tags: string[];
  images: string[];
  productIds?: number[];
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  productCount: number;
  parentCollection?: Collection;
  childCollections: Collection[];
  products: Product[];
}

export interface CollectionHierarchy {
  id: number;
  name: string;
  description?: string;
  level: number;
  tags: string[];
  published: boolean;
  children: CollectionHierarchy[];
  productCount: number;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  level: number;
  parentCollectionId?: number;
  childCollectionIds?: number[];
  tags: string[];
  images: string[];
  productIds?: number[];
  published: boolean;
  createdBy: string;
}

export interface UpdateCollectionRequest {
  name: string;
  description?: string;
  level: number;
  parentCollectionId?: number;
  childCollectionIds?: number[];
  tags: string[];
  images: string[];
  productIds?: number[];
  published: boolean;
  updatedBy: string;
}

export interface CollectionFilterRequest {
  name?: string;
  level?: number;
  parentCollectionId?: number;
  published?: boolean;
  createdBy?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  tag?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  collection?: Collection;
}

export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  stock: number;
  mainImage?: string;
  collectionName: string;
  inStock: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
}

export interface UpdateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
}

export interface ProductFilterRequest {
  name?: string;
  collectionId?: number;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  inStock?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  tag?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Order Types
export interface Order {
  id: number;
  userId?: number;
  email: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  totalAmount: number;
  statusId: number;
  paymentMethod?: string;
  createdAt: string;
  user?: User;
  status: Status;
  orderItems: OrderItem[];
}

export interface OrderSummary {
  statusId: number;
  id: number;
  email: string;
  totalAmount: number;
  statusName: string;
  createdAt: string;
  itemCount: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchaseTime: number;
  orderId: number;
  product?: Product;
}

export interface CreateOrderRequest {
  userId?: number;
  email: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  paymentMethod?: string;
  orderItems: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface UpdateOrderStatusRequest {
  statusId: number;
}

export interface OrderFilterRequest {
  userId?: number;
  email?: string;
  statusId?: number;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  country?: string;
  city?: string;
  createdAfter?: string;
  createdBefore?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// User Types
export interface User {
  id: number;
  role: string;
  email: string;
  phoneNumber?: string;
  name?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  createdAt: string;
  active: boolean;
}

export interface CreateUserRequest {
  role: string;
  email: string;
  phoneNumber?: string;
  password: string;
  name?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  active: boolean;
}

export interface UpdateUserRequest {
  role: string;
  phoneNumber?: string;
  name?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  active: boolean;
}

export interface UserFilterRequest {
  email?: string;
  role?: string;
  active?: boolean;
  country?: string;
  city?: string;
  name?: string;
  createdAfter?: string;
  createdBefore?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Status Types
export interface Status {
  id: number;
  statusName: string;
}

// Cart Types
export interface Cart {
  id: number;
  userId?: number;
  sessionId?: string;
  createdAt: string;
  updatedAt: string;
  cartItems: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  itemTotal: number;
}

export interface CartSummary {
  id: number;
  totalItems: number;
  totalAmount: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  userId?: number;
  sessionId?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Contact Form Types
export enum InquiryType {
  ProductInquiry = 1,
  RequestDesignConsultation = 2,
  CustomOrders = 3,
  TradePartnerships = 4,
  InstallationSupport = 5,
  ShippingAndLeadTimes = 6,
  RequestCatalogPriceList = 7,
  MediaPressInquiry = 8,
  GeneralQuestions = 9
}

export interface ContactFormSubmission {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  state: string;
  inquiry: InquiryType;
  inquiryDisplayName: string;
  message: string;
  createdAt: string;
}

export interface CreateContactFormSubmissionRequest {
  name: string;
  email: string;
  phoneNumber: string;
  company?: string;
  state: string;
  inquiry: InquiryType;
  message: string;
}
