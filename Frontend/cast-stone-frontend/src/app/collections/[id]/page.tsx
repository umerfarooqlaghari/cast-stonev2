/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { FullScreenBanner, MasonryCollage, ArchitecturalSixGrid } from '@/components/collections';
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

  // Zigzag content now supports up to 3+ subsections per item. Empty contents are hidden.
  const zigzagContentData: ZigzagContentItem[] = [
    {
      id: '1',
      title: 'Serving All Homeowners',
      imageSrc: '/images/content1.jpg',
      imageAlt: 'Serving All Homeowners',
      sections: [
        {
          subtitle: 'Serving All Homeowners',
          content:
            "Have architectural inspiration and ready to design your home? We can help. Simply send us pictures or conceptual drawings and we will work with you to achieve your goals."
        },
        {
          subtitle: 'Builders, Architects, Designers, Or Developers',
          content:
            "Our dedicated team will work hand in hand to ensure we work according to your specification, technical drawings and meet your project goals all while ensuring we meet all standard building requirements."
        },
        {
          subtitle: '100% Customer Satisfaction',
          content:
            "We are resolutely dedicated to delivering superior workmanship, quality materials, rigorous quality control, and a personalized approach to exceed customer expectations."
        }
      ]
    },
    {
      id: '2',
      title: 'Why Choose Us',
      imageSrc: '/images/content2.jpg',
      imageAlt: 'Why Choose Us',
      sections: [
        {
          subtitle: 'Diverse Divisions',
          content:
            "Three distinct divisions let customers access custom architectural designs, European garden ornaments, and imported pottery, all under one roof."
        },
        {
          subtitle: 'Quality Control',
          content:
            "Every product undergoes rigorous checks to guarantee it meets or exceeds exacting standards."
        },
        {
          subtitle: 'End-to-End Services',
          content:
            "From design consultation to production and delivery, we provide end‑to‑end solutions for a seamless experience."
        }
      ]
    },
    {
      id: '3',
      title: 'Production Processes',
      imageSrc: '/images/content3.jpg',
      imageAlt: 'Production Processes',
      sections: [
        {
          subtitle: 'Precise Manufacturing',
          content:
            "State‑of‑the‑art facilities equipped with the latest technology ensure precision and accuracy in every piece we create."
        },
        {
          subtitle: 'Quality Control',
          content:
            "Each product is meticulously inspected to ensure it not only meets but exceeds customer expectations."
        },
        {
          subtitle: 'Customization',
          content:
            "We work closely with clients to create tailored solutions of the highest quality, aligned with each client’s design."
        }
      ]
    },
    {
      id: '4',
      title: 'Our Pledge To Serve You',
      imageSrc: '/images/content4.jpg',
      imageAlt: 'Our Pledge To Serve You',
      sections: [
        {
          subtitle: 'Personalized Attention',
          content:
            "We view every interaction as an opportunity to exceed expectations and take pride in the personalized attention we provide."
        },
        {
          subtitle: 'Client‑Centered Collaboration',
          content:
            "We prioritize clear communication and open collaboration, fostering trust and partnership with our clients throughout every project."
        },
        {
          subtitle: 'A Trusted Partner',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        }
      ]
    },
    {
      id: '5',
      title: 'Additionally, we provide you with:',
      imageSrc: '/images/content5.jpg',
      imageAlt: 'What we Provide',
      sections: [
        {
          subtitle: 'Exclusive Design Consultation',
          content:
            "We view every interaction as an opportunity to exceed expectations and take pride in the personalized attention we provide."
        },
        {
          subtitle: 'Extended Warranty',
          content:
            "We prioritize clear communication and open collaboration, fostering trust and partnership with our clients throughout every project."
        },
        {
          subtitle: 'Bulk Purchase Discounts',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        },
                {
          subtitle: 'Virtual 3D Renderings',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        },
                {
          subtitle: 'Frequent Buyer Rewards',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        },
                {
          subtitle: 'Project Management Support',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        },
                {
          subtitle: 'Flexible Payment Plans',
          content:
            "We are dedicated to making our clients’ visions a reality through unwavering dedication and superior customer service."
        }
      ]
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
          title="Standard & bespoke designs tailored to you"
          description={collection.description || "Specializing in manufacturing Bespoke architectural cast stone designs for 32 years. We believe the architecture should be a reflection of individuality and personal taste. Our dedicated team members and highly skilled designers and craftsmen work closely with clients to turn their architectural dreams into reality. From intricate facades to majestic columns and exquisite stone details, we pride ourselves on creating one-of-a-kind pieces that transform structures into timeless works of art."}
        />

        {/* Section 3: Child Collections - Custom 6-grid only for collection ID 1 */}
        {collection.id === 1 ? (
          <ArchitecturalSixGrid collections={childCollections} />
        ) : (
          <MasonryCollage
            collections={childCollections}
            title={`${collection.level === 1 ? 'Categories' : 'Subcategories'} in ${collection.name}`}
            subtitle={`Explore the ${collection.level === 1 ? 'categories' : 'subcategories'} within this collection`}
          />
        )}

        {/* Section 4: Zigzag Content Section */}
        <ZigzagContentSection
          items={zigzagContentData}
          maxItems={5}
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
