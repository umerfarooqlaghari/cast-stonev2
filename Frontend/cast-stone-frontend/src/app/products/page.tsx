/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
export const dynamic = "force-dynamic";
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService, productVariantService } from '@/services';
import { MagazineProductGrid } from '@/components/products';
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
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Apply collectionId from query params when available (via Suspense-bound binder)
  // The binder runs the side-effect client-side when search params are ready.




  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, collectionsData] = await Promise.all([
        productService.get.getAll(),
        collectionService.get.getAll(),
      ]);
      setProducts(productsData);
      setCollections(collectionsData);

      // Fetch variant counts for all products
      const variantCountsMap = new Map<number, number>();
      await Promise.all(
        productsData.map(async (product) => {
          try {
            const variants = await productVariantService.get.getByProductId(product.id);
            variantCountsMap.set(product.id, variants.length);
          } catch (error) {
            // If error fetching variants, assume no variants
            variantCountsMap.set(product.id, 0);
          }
        })
      );
      setProductVariantCounts(variantCountsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className={styles.content}>
        {/* Filters Sidebar */}
        <div className={`${styles.filtersSidebar} ${showFilters ? styles.showFilters : ''}`}>
          <div className={styles.filtersHeader}>
            <h3>Filters</h3>
            <button onClick={clearFilters} className={styles.clearFilters}>
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className={styles.filterGroup}>
            <label>Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className={styles.searchInput}
            />
          </div>



          {/* Price Range */}
          <div className={styles.filterGroup}>
            <label>Price Range</label>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, filters.priceRange.max)}
                className={styles.priceInput}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange(filters.priceRange.min, parseInt(e.target.value) || 10000)}
                className={styles.priceInput}
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
              />
              In Stock Only
            </label>
          </div>

          {/* Sort Options */}
          <div className={styles.filterGroup}>
            <label>Sort By</label>


            <select
              value={`${filters.sortBy}-${filters.sortDirection}`}
              onChange={(e) => {
                const [sortBy, sortDirection] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortDirection', sortDirection);
              }}
              className={styles.filterSelect}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="newest-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {/* Top Carousel Row: show 2 products at a time, looped */}
          

          {/* Products Grid below: 3 columns */}
          <div className={styles.productsGridBelow}>
            <MagazineProductGrid
              products={filteredProducts}
              isLoading={isLoading}
              emptyMessage="No products match your current filters. Try adjusting your search criteria."
              columns={3}
              productVariantCounts={productVariantCounts}
            />
          </div>
        </div>
      </div>
    </div>
    </section>
    </div>
  );
}
