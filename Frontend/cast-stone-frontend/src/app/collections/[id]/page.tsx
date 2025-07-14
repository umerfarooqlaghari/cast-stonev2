/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService } from '@/services';
import { ProductGrid } from '@/components/products';
import styles from './collectionPage.module.css';

interface FilterState {
  search: string;
  priceRange: {
    min: number;
    max: number;
  };
  inStockOnly: boolean;
  sortBy: 'name' | 'price' | 'newest';
  sortDirection: 'asc' | 'desc';
}

export default function CollectionPage() {
  const params = useParams();
  const collectionId = parseInt(params.id as string);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: { min: 0, max: 10000 },
    inStockOnly: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  useEffect(() => {
    if (collectionId) {
      fetchData();
    }
  }, [collectionId]);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [collectionData, productsData] = await Promise.all([
        collectionService.get.getById(collectionId),
        productService.get.getByCollection(collectionId)
      ]);

      setCollection(collectionData);
      setProducts(productsData);
      
      // Set initial price range based on actual products
      if (productsData.length > 0) {
        const prices = productsData.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setFilters(prev => ({
          ...prev,
          priceRange: { min: minPrice, max: maxPrice }
        }));
      }
    } catch (err) {
      console.error('Error fetching collection data:', err);
      setError('Failed to load collection');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.description?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
      );
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
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      priceRange: { min: 0, max: 10000 },
      inStockOnly: false,
      sortBy: 'name',
      sortDirection: 'asc'
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading collection...</p>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className={styles.errorContainer}>
        <h1>Collection Not Found</h1>
        <p>{error || 'The requested collection could not be found.'}</p>
      </div>
    );
  }

  return (
    <div className={styles.collectionPage}>
      <div className={styles.container}>
        {/* Collection Header */}
        <div className={styles.collectionHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.collectionTitle}>{collection.name}</h1>
            <div className={styles.collectionMeta}>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.filterSection}>
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className={styles.searchField}
              />
            </div>
            
            <button
              className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className={styles.advancedFilters}>
              <div className={styles.filterGrid}>
                {/* Price Range */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Price Range</label>
                  <div className={styles.priceRange}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange({
                        priceRange: { ...filters.priceRange, min: Number(e.target.value) || 0 }
                      })}
                      className={styles.priceInput}
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange({
                        priceRange: { ...filters.priceRange, max: Number(e.target.value) || 10000 }
                      })}
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
                      onChange={(e) => handleFilterChange({ inStockOnly: e.target.checked })}
                      className={styles.checkbox}
                    />
                    In Stock Only
                  </label>
                </div>

                {/* Sort Options */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Sort By</label>
                  <div className={styles.sortControls}>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
                      className={styles.sortSelect}
                    >
                      <option value="name">Name</option>
                      <option value="price">Price</option>
                      <option value="newest">Newest</option>
                    </select>
                    
                    <button
                      className={`${styles.sortDirection} ${filters.sortDirection === 'desc' ? styles.desc : ''}`}
                      onClick={() => handleFilterChange({
                        sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
                      })}
                      title={`Sort ${filters.sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className={styles.filterGroup}>
                  <button onClick={clearFilters} className={styles.clearFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className={styles.productsSection}>
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            showAddToCart={true}
            showViewDetails={true}
            emptyMessage={
              filters.search || filters.inStockOnly || 
              filters.priceRange.min > 0 || filters.priceRange.max < 10000
                ? "No products match your current filters. Try adjusting your search criteria."
                : "This collection doesn't have any products yet."
            }
          />
        </div>
      </div>
    </div>
  );
}
