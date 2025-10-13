import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';
import { ProductFilterRequest } from '@/services/types/entities';
// import { PaginatedResponse } from '@/services/config/apiConfig';

// Query keys for products
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilterRequest) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  byCollection: (collectionId: number) => [...productKeys.all, 'collection', collectionId] as const,
  inStock: () => [...productKeys.all, 'in-stock'] as const,
  featured: (count: number) => [...productKeys.all, 'featured', count] as const,
  latest: (count: number) => [...productKeys.all, 'latest', count] as const,
  recommendations: (productId: number, count: number) => [...productKeys.all, 'recommendations', productId, count] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch all products
 */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: () => productService.get.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.get.getById(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Hook to fetch products by collection ID
 */
export function useProductsByCollection(collectionId: number) {
  return useQuery({
    queryKey: productKeys.byCollection(collectionId),
    queryFn: () => productService.get.getByCollection(collectionId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!collectionId,
  });
}

/**
 * Hook to fetch products in stock
 */
export function useProductsInStock() {
  return useQuery({
    queryKey: productKeys.inStock(),
    queryFn: () => productService.get.getInStock(),
    staleTime: 1000 * 60 * 5, // 5 minutes (stock changes more frequently)
  });
}

/**
 * Hook to fetch featured products
 */
export function useFeaturedProducts(count: number = 10) {
  return useQuery({
    queryKey: productKeys.featured(count),
    queryFn: () => productService.get.getFeatured(count),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch latest products
 */
export function useLatestProducts(count: number = 10) {
  return useQuery({
    queryKey: productKeys.latest(count),
    queryFn: () => productService.get.getLatest(count),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch product recommendations
 */
export function useProductRecommendations(productId: number, count: number = 6) {
  return useQuery({
    queryKey: productKeys.recommendations(productId, count),
    queryFn: () => productService.get.getRecommendations(productId, count),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!productId,
  });
}

/**
 * Hook to search products
 */
export function useProductSearch(query: string) {
  return useQuery({
    queryKey: productKeys.search(query),
    queryFn: () => productService.get.search(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: query.length > 0, // Only search if query is not empty
  });
}

/**
 * Hook to fetch filtered products with pagination
 */
export function useFilteredProducts(filters: ProductFilterRequest) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.get.getFiltered(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

