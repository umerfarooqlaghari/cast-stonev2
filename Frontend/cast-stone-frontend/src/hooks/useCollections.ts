import { useQuery } from '@tanstack/react-query';
import { collectionService } from '@/services';
import {  CollectionFilterRequest } from '@/services/types/entities';

// Query keys for collections
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  list: (filters?: CollectionFilterRequest) => [...collectionKeys.lists(), filters] as const,
  details: () => [...collectionKeys.all, 'detail'] as const,
  detail: (id: number) => [...collectionKeys.details(), id] as const,
  byLevel: (level: number) => [...collectionKeys.all, 'level', level] as const,
  children: (parentId: number) => [...collectionKeys.all, 'children', parentId] as const,
  hierarchy: () => [...collectionKeys.all, 'hierarchy'] as const,
  published: () => [...collectionKeys.all, 'published'] as const,
  search: (query: string) => [...collectionKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch all collections
 */
export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => collectionService.get.getAll(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch a single collection by ID
 */
export function useCollection(id: number) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => collectionService.get.getById(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!id, // Only run if id is provided
  });
}

/**
 * Hook to fetch collections by level
 */
export function useCollectionsByLevel(level: number) {
  return useQuery({
    queryKey: collectionKeys.byLevel(level),
    queryFn: () => collectionService.get.getByLevel(level),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: level > 0,
  });
}

/**
 * Hook to fetch child collections
 */
export function useCollectionChildren(parentId: number) {
  return useQuery({
    queryKey: collectionKeys.children(parentId),
    queryFn: () => collectionService.get.getChildren(parentId),
    staleTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!parentId,
  });
}

/**
 * Hook to fetch collection hierarchy
 */
export function useCollectionHierarchy() {
  return useQuery({
    queryKey: collectionKeys.hierarchy(),
    queryFn: () => collectionService.get.getHierarchy(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch published collections
 */
export function usePublishedCollections() {
  return useQuery({
    queryKey: collectionKeys.published(),
    queryFn: () => collectionService.get.getPublished(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to search collections
 */
export function useCollectionSearch(query: string) {
  return useQuery({
    queryKey: collectionKeys.search(query),
    queryFn: () => collectionService.get.search(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: query.length > 0, // Only search if query is not empty
  });
}

/**
 * Hook to fetch filtered collections with pagination
 */
export function useFilteredCollections(filters: CollectionFilterRequest) {
  return useQuery({
    queryKey: collectionKeys.list(filters),
    queryFn: () => collectionService.get.getFiltered(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch root collections (level 1)
 */
export function useRootCollections() {
  return useQuery({
    queryKey: collectionKeys.byLevel(1),
    queryFn: () => collectionService.get.getRootCollections(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

