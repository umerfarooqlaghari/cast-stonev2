'use client';

import React, { useState, useEffect } from 'react';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService } from '@/services';
import { ProductGrid } from '@/components/products';
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
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    collectionId: '',
    priceRange: { min: 0, max: 10000 },
    inStockOnly: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters when products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, collectionsData] = await Promise.all([
        productService.get.getAll(),
        collectionService.get.getAll(),
      ]);
      setProducts(productsData);
      setCollections(collectionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Collection filter
    if (filters.collectionId) {
      filtered = filtered.filter(product => product.collectionId === filters.collectionId);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Our Products</h1>
          <p className={styles.subtitle}>
            Discover our exquisite collection of handcrafted cast stone pieces
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}
          >
            <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            Filters
          </button>
          
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

          {/* Collection Filter */}
          <div className={styles.filterGroup}>
            <label>Collection</label>
            <select
              value={filters.collectionId}
              onChange={(e) => handleFilterChange('collectionId', e.target.value ? parseInt(e.target.value) : '')}
              className={styles.filterSelect}
            >
              <option value="">All Collections</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
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
        <div className={styles.productsSection}>
          <ProductGrid
            products={filteredProducts}
            isLoading={isLoading}
            emptyMessage="No products match your current filters. Try adjusting your search criteria."
          />
        </div>
      </div>
    </div>
  );
}
