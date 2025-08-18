import { Collection } from '@/services/types/entities';
import { collectionService } from '@/services';

/**
 * Checks if a collection belongs to the Architectural Design hierarchy
 * A collection is in the Architectural Design hierarchy if:
 * - Collection ID equals 1 (Architectural Design)
 * - Parent collection ID equals 1 
 * - Grandparent collection ID equals 1
 */
export async function isArchitecturalDesignHierarchy(collection: Collection): Promise<boolean> {
  // Direct check: if this is the Architectural Design collection itself
  if (collection.id === 1) {
    return true;
  }

  // Check if parent is Architectural Design (level 2 collections under Architectural Design)
  if (collection.parentCollectionId === 1) {
    return true;
  }

  // Check if grandparent is Architectural Design (level 3 collections)
  if (collection.parentCollectionId && collection.level === 3) {
    try {
      const parentCollection = await collectionService.get.getById(collection.parentCollectionId);
      if (parentCollection.parentCollectionId === 1) {
        return true;
      }
    } catch (error) {
      console.error('Error fetching parent collection:', error);
      return false;
    }
  }

  return false;
}

/**
 * Synchronous version that checks based on available data without API calls
 * Use this when you have the full collection hierarchy data available
 */
export function isArchitecturalDesignHierarchySync(collection: Collection): boolean {
  // Direct check: if this is the Architectural Design collection itself
  if (collection.id === 1) {
    return true;
  }

  // Check if parent is Architectural Design (level 2 collections under Architectural Design)
  if (collection.parentCollectionId === 1) {
    return true;
  }

  // Check if grandparent is Architectural Design using parentCollection navigation property
  if (collection.parentCollection && collection.parentCollection.parentCollectionId === 1) {
    return true;
  }

  return false;
}

/**
 * Gets the root collection ID for any collection in the hierarchy
 */
export async function getRootCollectionId(collection: Collection): Promise<number> {
  if (collection.level === 1) {
    return collection.id;
  }

  if (collection.level === 2 && collection.parentCollectionId) {
    return collection.parentCollectionId;
  }

  if (collection.level === 3 && collection.parentCollectionId) {
    try {
      const parentCollection = await collectionService.get.getById(collection.parentCollectionId);
      if (parentCollection.parentCollectionId) {
        return parentCollection.parentCollectionId;
      }
    } catch (error) {
      console.error('Error fetching parent collection:', error);
    }
  }

  return collection.id; // fallback
}

/**
 * Synchronous version of getRootCollectionId
 */
export function getRootCollectionIdSync(collection: Collection): number {
  if (collection.level === 1) {
    return collection.id;
  }

  if (collection.level === 2 && collection.parentCollectionId) {
    return collection.parentCollectionId;
  }

  if (collection.level === 3 && collection.parentCollection && collection.parentCollection.parentCollectionId) {
    return collection.parentCollection.parentCollectionId;
  }

  return collection.id; // fallback
}
