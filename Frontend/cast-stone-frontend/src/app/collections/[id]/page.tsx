/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService } from '@/services';
import { MagazineProductGrid } from '@/components/products';
import { MagazineSection, MagazineGrid, MagazineCard } from '@/components/ui';
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
  const [childCollections, setChildCollections] = useState<Collection[]>([]);
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

      // Get collection data first
      const collectionData = await collectionService.get.getById(collectionId);
      setCollection(collectionData);

      // Based on collection level, fetch appropriate data
      if (collectionData.level === 3) {
        // Level 3: Show products
        const productsData = await productService.get.getByCollection(collectionId);
        setProducts(productsData);
        setChildCollections([]);

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
      } else {
        // Level 1 or 2: Show child collections
        const childCollectionsData = await collectionService.get.getChildren(collectionId);
        setChildCollections(childCollectionsData);
        setProducts([]);
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
      {/* Hero Section */}
      <MagazineSection
        title={collection.name}
        subtitle={collection.level === 1 ? "Main Collection" : collection.level === 2 ? "Category" : "Subcategory"}
        description={collection.description || "Discover this beautiful collection of handcrafted cast stone pieces, carefully curated to bring elegance and sophistication to your space."}
        imageSrc={collection.images && collection.images.length > 0
          ? collection.images[0]
          : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"}
        imageAlt={collection.name}
        imagePosition="left"
        badge={collection.level === 3 ? `${filteredProducts.length} Products` : `${childCollections.length} ${collection.level === 1 ? 'Categories' : 'Subcategories'}`}
        className={styles.heroSection}
      />

      <div className={styles.container}>
        {/* Conditional Content Based on Collection Level */}
        {collection.level === 3 ? (
          /* Level 3: Show Products */
          <section className={styles.productsSection}>
            <div className={styles.productsContainer}>
              {/* Section Header with Search and Filters */}
              <div className={styles.sectionHeader}>
                <div className={styles.headerContent}>
                  <h2 className={styles.sectionTitle}>Products in this Collection</h2>
                  <p className={styles.sectionSubtitle}>
                    Explore all the beautiful pieces in the {collection.name} collection
                  </p>
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

                <div className={styles.resultsCount}>
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </div>
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
              <div className={styles.productsGrid}>
                <MagazineProductGrid
                  products={filteredProducts}
                  isLoading={isLoading}
                  showAddToCart={true}
                  showViewDetails={true}
                  columns={3}
                  emptyMessage={
                    filters.search || filters.inStockOnly ||
                    filters.priceRange.min > 0 || filters.priceRange.max < 10000
                      ? "No products match your current filters. Try adjusting your search criteria."
                      : "This collection doesn&apos;t have any products yet."
                  }
                />
              </div>
            </div>
          </section>
        ) : (
          /* Level 1 & 2: Show Child Collections */
          <section className={styles.collectionsSection}>
            <div className={styles.collectionsContainer}>
              <div className={styles.sectionHeader}>
                <div className={styles.headerContent}>
                  <h2 className={styles.sectionTitle}>
                    {collection.level === 1 ? 'Categories' : 'Subcategories'} in {collection.name}
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    Explore the {collection.level === 1 ? 'categories' : 'subcategories'} within this collection
                  </p>
                </div>
              </div>

              {childCollections.length > 0 ? (
                <MagazineGrid columns={3} gap="large" className={styles.collectionsGrid}>
                  {childCollections.map((childCollection, index) => (
                    <MagazineCard
                      key={childCollection.id}
                      title={childCollection.name}
                      description={childCollection.description || `Explore this beautiful ${collection.level === 1 ? 'category' : 'subcategory'} of cast stone pieces`}
                      imageSrc={childCollection.images && childCollection.images.length > 0
                        ? childCollection.images[0]
                        : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop&crop=center"}
                      imageAlt={childCollection.name}
                      href={`/collections/${childCollection.id}`}
                      variant={index === 0 ? "featured" : "default"}
                      className={styles.collectionCard}
                    />
                  ))}
                </MagazineGrid>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="9" cy="9" r="2"/>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                  </div>
                  <h3>No {collection.level === 1 ? 'Categories' : 'Subcategories'} Available</h3>
                  <p>This collection doesn&apos;t have any {collection.level === 1 ? 'categories' : 'subcategories'} yet.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
