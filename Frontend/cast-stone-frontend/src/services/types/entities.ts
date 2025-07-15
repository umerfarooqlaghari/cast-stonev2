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
  images?: string[]; 
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

// Product Specifications Types
export interface ProductSpecifications {
  id: number;
  material?: string;
  dimensions?: string;
  base_Dimensions?: string;
  photographed_In?: string;
  pieces?: string;
  totalWeight?: string;
  weightWithWater?: string;
  waterVolume?: string;
  productId: number;
}

export interface CreateProductSpecificationsRequest {
  material?: string;
  dimensions?: string;
  totalWeight?: string;
  weightWithWater?: string;
  waterVolume?: string;
  productId: number;
  base_Dimensions?: string;
  photographed_In?: string;
  pieces?: string;
}

export interface UpdateProductSpecificationsRequest {
  material?: string;
  dimensions?: string;
  totalWeight?: string;
  weightWithWater?: string;
  waterVolume?: string;
  base_Dimensions?: string;
  photographed_In?: string;
  pieces?: string;

}

// Product Details Types
export interface ProductDetails {
  id: number;
  upc?: string;
  indoorUseOnly?: string;
  assemblyRequired?: string;
  easeOfAssembly?: string;
  assistanceRequired?: string;
  splashLevel?: string;
  soundLevel?: string;
  soundType?: string;
  replacementPumpKit?: string;
  electricalCordLength?: string;
  pumpSize?: string;
  shipMethod?: string;
  drainage_Info?: string;
  inside_Top?: string;
  inside_Bottom?: string;
  inside_Height?: string;
  catalogPage?: string;
  factory_Code?: string;
  productId: number;
}

export interface CreateProductDetailsRequest {
  upc?: string;
  indoorUseOnly?: string;
  assemblyRequired?: string;
  easeOfAssembly?: string;
  assistanceRequired?: string;
  splashLevel?: string;
  soundLevel?: string;
  soundType?: string;
  replacementPumpKit?: string;
  electricalCordLength?: string;
  pumpSize?: string;
  shipMethod?: string;
  drainage_Info?: string;
  inside_Top?: string;
  inside_Bottom?: string;
  inside_Height?: string;
  catalogPage?: string;
  factory_Code?: string;
  productId: number;
}

export interface UpdateProductDetailsRequest {
  upc?: string;
  indoorUseOnly?: string;
  assemblyRequired?: string;
  easeOfAssembly?: string;
  assistanceRequired?: string;
  splashLevel?: string;
  soundLevel?: string;
  soundType?: string;
  replacementPumpKit?: string;
  electricalCordLength?: string;
  pumpSize?: string;
  shipMethod?: string;
  catalogPage?: string;
  Factory_Code?: string;
  Drainage_Info?: string;
  Inside_Top?: string;
  Inside_Bottom?: string;
  Inside_Height?: string;
}

// Downloadable Content Types
export interface DownloadableContent {
  id: number;
  care?: string;
  productInstructions?: string;
  cad?: string;
  productId: number;
}

export interface CreateDownloadableContentRequest {
  care?: string;
  productInstructions?: string;
  cad?: string;
  productId: number;
}

export interface UpdateDownloadableContentRequest {
  care?: string;
  productInstructions?: string;
  cad?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  productCode?: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  collection?: Collection;
  productSpecifications?: ProductSpecifications;
  productDetails?: ProductDetails;
  downloadableContent?: DownloadableContent;
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
  productCode?: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
  productSpecifications?: CreateProductSpecificationsRequest;
  productDetails?: CreateProductDetailsRequest;
  downloadableContent?: CreateDownloadableContentRequest;
}

export interface UpdateProductRequest {
  name: string;
  productCode?: string;
  description?: string;
  price: number;
  stock: number;
  collectionId: number;
  images: string[];
  tags: string[];
  productSpecifications?: UpdateProductSpecificationsRequest;
  productDetails?: UpdateProductDetailsRequest;
  downloadableContent?: UpdateDownloadableContentRequest;
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
