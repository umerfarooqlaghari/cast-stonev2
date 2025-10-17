/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
export const dynamic = "force-dynamic";
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productVariantService } from '@/services';
import { MagazineProductGrid } from '@/components/products';
import { useProducts } from '@/hooks/useProducts';
import { useCollections } from '@/hooks/useCollections';
import 'swiper/css';
import 'swiper/css/navigation';


import styles from './products.module.css';

interface FilterState {
  search: string;
  collectionId: number | '';
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  sortBy: 'name' | 'price' | 'newest';
  sortDirection: 'asc' | 'desc';
}

export default function ProductsPage() {
  // Use React Query hooks for cached data
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: collections = [], isLoading: isLoadingCollections } = useCollections();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters] = useState(false);
  const [productVariantCounts, setProductVariantCounts] = useState<Map<number, number>>(new Map());

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    collectionId: '',
    priceRange: { min: 0, max: 10000 },
    inStockOnly: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const isLoading = isLoadingProducts || isLoadingCollections;

  // Suspense wrapper to safely read search params during SSR/edge
  const SearchParamsBinder = () => {
    const sp = useSearchParams();
    useEffect(() => {
      if (!sp) return;
      const cid = sp.get('collectionId');
      if (cid) {
        const parsed = parseInt(cid);
        if (!isNaN(parsed)) {
          setFilters(prev => ({ ...prev, collectionId: parsed }));
        }
      }
    }, [sp]);
    return null;
  };

  // Fetch product variants when products are loaded
  useEffect(() => {
    const fetchVariants = async () => {
      if (products.length === 0) return;

      try {
        const allVariants = await productVariantService.get.getAll().catch(() => []);

        // Group variants by productId to create variant counts map
        const variantCountsMap = new Map<number, number>();
        allVariants.forEach((variant) => {
          const currentCount = variantCountsMap.get(variant.productId) || 0;
          variantCountsMap.set(variant.productId, currentCount + 1);
        });
        setProductVariantCounts(variantCountsMap);
      } catch (error) {
        console.error('Error fetching variants:', error);
      }
    };

    fetchVariants();
  }, [products]);

  // Apply collectionId from query params when available (via Suspense-bound binder)
  // The binder runs the side-effect client-side when search params are ready.

  const getDescendantCollectionIds = (rootId: number, all: Collection[]): Set<number> => {
    const childrenByParent = new Map<number, number[]>();
    for (const c of all) {
      if (c.parentCollectionId != null) {
        const arr = childrenByParent.get(c.parentCollectionId) || [];
        arr.push(c.id);
        childrenByParent.set(c.parentCollectionId, arr);
      }
    }
    const result = new Set<number>([rootId]);
    const queue: number[] = [rootId];
    while (queue.length) {
      const current = queue.shift()!;
      const kids = childrenByParent.get(current) || [];
      for (const kid of kids) {
        if (!result.has(kid)) {
          result.add(kid);
          queue.push(kid);
        }
      }
    }
    return result;
  };

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        (product.tags && Array.isArray(product.tags) && product.tags.some(tag =>
          typeof tag === 'string' && tag.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Collection filter (include descendants of selected collection)
    if (filters.collectionId) {
      const allowedIds = getDescendantCollectionIds(filters.collectionId as number, collections);
      filtered = filtered.filter(product => allowedIds.has(product.collectionId));
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
    );

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
      }

      return filters.sortDirection === 'desc' ? -comparison : comparison;
    });

    setFilteredProducts(filtered);
  }, [products, filters, collections]);

  // Apply filters when applyFilters function changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { min, max }
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      collectionId: '',
      priceRange: { min: 0, max: 10000 },
      inStockOnly: false,
      sortBy: 'name',
      sortDirection: 'asc'
    });
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}


      {/* Suspense around search params binder */}
      <Suspense fallback={null}>
        <SearchParamsBinder />
      </Suspense>


      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.productsContainer}>
          {/* Section Header with Filters */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerContent}>
              <h2 className={styles.sectionTitle}>Browse Products</h2>
              <p className={styles.sectionSubtitle}>
                Find the perfect cast stone pieces for your project
              </p>
            </div>

            <div className={styles.headerActions}>

              <div className={styles.resultsCount}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={styles.productsGrid}>
            <MagazineProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              emptyMessage="No products found."
              columns={3}
              productVariantCounts={productVariantCounts}
            />
          </div>
    </div>
    </section>
    </div>
  );
}
