/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService } from '@/services';
import { MagazineProductGrid } from '@/components/products';
// import { MagazineSection, MagazineGrid, MagazineCard } from '@/components/ui';
// import { TestimonialsSection } from '@/components/Home/TestimonialsSection/TestimonialsSection';
import { FullScreenBanner, MasonryCollage } from '@/components/collections';
import ZigzagContentSection, { ZigzagContentItem } from '@/components/collections/ZigzagContentSection/ZigzagContentSection';
import StaticCompletedProjects, { StaticCompletedProject } from '@/components/collections/StaticCompletedProjects/StaticCompletedProjects';
import ElegantDescriptionSection from '@/components/collections/ElegantDescriptionSection/ElegantDescriptionSection';
import { isArchitecturalDesignHierarchySync } from '@/utils/collectionUtils';
import styles from './collectionPage.module.css';
import MagazineSection from '@/components/ui/MagazineSection/MagazineSection';

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

  // Check if this collection is in the Architectural Design hierarchy
  const isArchitecturalDesign = collection ? isArchitecturalDesignHierarchySync(collection) : false;

  // Sample data for Architectural Design hierarchy collections
  const zigzagContentData: ZigzagContentItem[] = [
    {
      id: '1',
      title: 'ARCHITECTURAL EXCELLENCE',
      content: [
        'Our architectural stone collection represents the pinnacle of craftsmanship and design innovation. Each piece is meticulously crafted to meet the highest standards of architectural excellence.',
        'From classical columns to contemporary facades, our collection offers versatile solutions for architects and designers seeking to create timeless structures that stand the test of time.'
      ],
      imageSrc: '/images/CollectionBackground.jpg',
      imageAlt: 'Architectural Excellence'
    },
    {
      id: '2',
      title: 'PRECISION CRAFTSMANSHIP',
      content: [
        'Every element in our architectural collection is created with precision and attention to detail. Our master craftsmen combine traditional techniques with modern technology to achieve unparalleled quality.',
        'The result is a collection of architectural elements that not only meet structural requirements but also elevate the aesthetic appeal of any project.'
      ],
      imageSrc: '/images/CollectionBackground2.jpg',
      imageAlt: 'Precision Craftsmanship'
    },
    {
      id: '3',
      title: 'TIMELESS DESIGN',
      content: [
        'Our architectural stone pieces are designed to transcend trends and create lasting beauty. Drawing inspiration from classical architecture while embracing contemporary sensibilities.',
        'Each piece in our collection contributes to creating spaces that are both functional and inspiring, making every project a testament to enduring design principles.'
      ],
      imageSrc: '/images/CollectionBackground3.jpg',
      imageAlt: 'Timeless Design'
    }
  ];

  const staticCompletedProjectsData: StaticCompletedProject[] = [
    // Projects for Collection ID 1 (Architectural Design)
    {
      id: 'arch-1',
      collectionId: 1,
      title: 'Grand Estate Entrance',
      description: 'Magnificent entrance featuring custom cast stone columns and decorative elements that create a stunning first impression for this luxury residential project.',
      images: ['/images/catalog-banner-bg.jpg', '/images/CollectionBackground.jpg'],
      imageAlts: ['Grand Estate Entrance - Main View', 'Grand Estate Entrance - Detail View'],
      location: 'Beverly Hills, CA',
      completedDate: '2023',
      projectType: 'Residential',
      clientName: 'Private Estate'
    },
    {
      id: 'arch-2',
      collectionId: 1,
      title: 'Corporate Headquarters Facade',
      description: 'Modern corporate building featuring our architectural stone elements that blend contemporary design with classical elegance, creating an impressive business presence.',
      images: ['/images/CollectionBackground2.jpg', '/images/CollectionBackground3.jpg'],
      imageAlts: ['Corporate Headquarters - Facade', 'Corporate Headquarters - Entrance Detail'],
      location: 'Manhattan, NY',
      completedDate: '2023',
      projectType: 'Commercial',
      clientName: 'Fortune 500 Company'
    },
    // Projects for Collection ID 2 (if it exists under Architectural Design)
    {
      id: 'sub-1',
      collectionId: 2,
      title: 'Luxury Hotel Restoration',
      description: 'Historic hotel restoration project showcasing our ability to recreate period-appropriate architectural details while maintaining modern functionality.',
      images: ['/images/CollectionBackground.jpg'],
      imageAlts: ['Luxury Hotel Restoration - Historic Facade'],
      location: 'Charleston, SC',
      completedDate: '2022',
      projectType: 'Restoration',
      clientName: 'Historic Hotels Group'
    },
    // Projects for Collection ID 3 (if it exists under Architectural Design)
    {
      id: 'sub-2',
      collectionId: 3,
      title: 'Private Villa Courtyard',
      description: 'Elegant courtyard design featuring custom fountains and architectural elements that create a serene outdoor space for relaxation and entertainment.',
      images: ['/images/CollectionBackground3.jpg', '/images/catalog-banner-bg.jpg'],
      imageAlts: ['Private Villa Courtyard - Overview', 'Private Villa Courtyard - Fountain Detail'],
      location: 'Malibu, CA',
      completedDate: '2023',
      projectType: 'Residential',
      clientName: 'Private Residence'
    },
    // Additional projects for other collection IDs
    {
      id: 'other-1',
      collectionId: 4,
      title: 'Museum Gallery Enhancement',
      description: 'Contemporary museum project featuring clean lines and modern architectural stone elements that complement the artistic displays.',
      images: ['/images/CollectionBackground2.jpg'],
      imageAlts: ['Museum Gallery - Modern Stone Elements'],
      location: 'Los Angeles, CA',
      completedDate: '2023',
      projectType: 'Cultural',
      clientName: 'Contemporary Art Museum'
    }
  ];

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

  // For level 3 collections (products), keep the existing layout
  if (collection.level === 3) {
    return (
      <div className={styles.collectionPage}>
        {/* Hero Section */}
        <MagazineSection
          title={collection.name}
          subtitle="Product Collection"
          description={collection.description || "Discover this beautiful collection of handcrafted cast stone pieces, carefully curated to bring elegance and sophistication to your space."}
          imageSrc={collection.images && collection.images.length > 0
            ? collection.images[0]
            : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"}
          imageAlt={collection.name}
          imagePosition="left"
          badge={`${filteredProducts.length} Products`}
          className={styles.heroSection}
        />

        <div className={styles.container}>
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
        </div>
      </div>
    );
  }

  // For level 1 & 2 collections, check if it's Architectural Design hierarchy
  if (isArchitecturalDesign) {
    // Special layout for Architectural Design hierarchy collections
    return (
      <div className={styles.newCollectionPage}>
        {/* Section 1: Full-Screen Banner */}
        <FullScreenBanner
          title={collection.name}
          description={collection.description || "Discover this beautiful collection of handcrafted cast stone pieces, carefully curated to bring elegance and sophistication to your space."}
          imageSrc={collection.images && collection.images.length > 0
            ? collection.images[0]
            : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"}
          imageAlt={collection.name}
          badge={`${childCollections.length} ${collection.level === 1 ? 'Categories' : 'Subcategories'}`}
        />

        {/* Section 2: NEW - Elegant Description Section */}
        <ElegantDescriptionSection
          title="About This Collection"
          description={collection.description || "Discover this beautiful collection of handcrafted cast stone pieces, carefully curated to bring elegance and sophistication to your space. Each piece represents the pinnacle of craftsmanship and design innovation."}
        />

        {/* Section 3: Child Collections Masonry */}
        <MasonryCollage
          collections={childCollections}
          title={`${collection.level === 1 ? 'Categories' : 'Subcategories'} in ${collection.name}`}
          subtitle={`Explore the ${collection.level === 1 ? 'categories' : 'subcategories'} within this collection`}
        />

        {/* Section 4: Zigzag Content Section */}
        <ZigzagContentSection
          items={zigzagContentData}
          maxItems={3}
        />

        {/* Section 5: Static Completed Projects */}
        <StaticCompletedProjects
          projects={staticCompletedProjectsData}
          currentCollectionId={collection.id}
          title="Featured Projects"
          subtitle="Explore our stunning architectural stone installations"
        />
      </div>
    );
  }

  // For non-Architectural Design collections, use the standard layout
  return (
    <div className={styles.newCollectionPage}>
      {/* Section 1: Full-Screen Banner */}
      <FullScreenBanner
        title={collection.name}
        description={collection.description || "Discover this beautiful collection of handcrafted cast stone pieces, carefully curated to bring elegance and sophistication to your space."}
        imageSrc={collection.images && collection.images.length > 0
          ? collection.images[0]
          : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"}
        imageAlt={collection.name}
        badge={`${childCollections.length} ${collection.level === 1 ? 'Categories' : 'Subcategories'}`}
      />

      {/* Section 2: Child Collections Masonry */}
      <MasonryCollage
        collections={childCollections}
        title={`${collection.level === 1 ? 'Categories' : 'Subcategories'} in ${collection.name}`}
        subtitle={`Explore the ${collection.level === 1 ? 'categories' : 'subcategories'} within this collection`}
      />

      {/* Section 3: Testimonials Carousel */}

      {/* Section 4: CTA Section */}
      {/* <CTASection
        title="Ready to Transform Your Space?"
        description="Contact our expert team to discuss your cast stone project and discover how we can bring your vision to life with our premium collection."
        buttonText="Contact Us"
        buttonHref="/contact"
        backgroundImage="/images/FallBackImage.jpg"
      /> */}
    </div>
  );
}
