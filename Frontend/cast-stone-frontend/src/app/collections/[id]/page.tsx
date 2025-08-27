/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { productService, collectionService } from '@/services';
import { MagazineProductGrid } from '@/components/products';
import { FullScreenBanner, MasonryCollage, ArchitecturalSixGrid } from '@/components/collections';
import ZigzagContentSection, { ZigzagContentItem } from '@/components/collections/ZigzagContentSection/ZigzagContentSection';
import StaticCompletedProjects, { StaticCompletedProject } from '@/components/collections/StaticCompletedProjects/StaticCompletedProjects';
import ElegantDescriptionSection from '@/components/collections/ElegantDescriptionSection/ElegantDescriptionSection';
import { isArchitecturalDesignHierarchySync } from '@/utils/collectionUtils';
import styles from './collectionPage.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import StaticContentSection from './StaticContentSection';

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
  const [rootRecommendations, setRootRecommendations] = useState<Collection[]>([]); // children of ID 1 for recommendations
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

  // Dynamic section images for level 3 collections (kept as fallback only)
  const [section3ImgSrc, setSection3ImgSrc] = useState<string>('');
  const [section4ImgSrc, setSection4ImgSrc] = useState<string>('');


  // Refs for horizontal scroller
  const recsScrollRef = useRef<HTMLDivElement | null>(null);

  // Framer Motion variants for staggered card animations
  const gridMotion = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardMotion = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Check if this collection is in the Architectural Design hierarchy
  const isArchitecturalDesign = collection ? isArchitecturalDesignHierarchySync(collection) : false;


  // Precompute dynamic image paths for level-3 sections
  useEffect(() => {
    if (!Number.isNaN(collectionId)) {
      setSection3ImgSrc(`/images/Collection${collectionId}.jpg`);
      setSection4ImgSrc(`/images/Collection4Section${collectionId}.jpg`);
    }
  }, [collectionId]);

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
        // Debug: verify child collections for ID=2
        if (collectionId >= 2 && collectionId <= 7) {
          console.debug('Fetched child collections for ID=2:', childCollectionsData);
        }
        setChildCollections(childCollectionsData);
        setProducts([]);

        // Additional data needed when viewing collection ID 2
        if (collectionId >= 2 && collectionId <= 7) {
          try {
            const rootChildren = await collectionService.get.getChildren(1);
            setRootRecommendations(rootChildren);
          } catch (e) {
            console.warn('Failed to load recommendations (children of ID 1):', e);
          }
        }
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

  // For level 3 collections (products), show specialized sections
  if (collection.level === 3) {
    const bannerImage = collection.images && collection.images.length > 0
      ? collection.images[0]
      : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center';

    return (
      <div className={styles.newCollectionPage}>
        {/* Section 1: Full-Screen Banner */}
        <FullScreenBanner
          title={collection.name}
          description={collection.description || ''}
          imageSrc={bannerImage}
          imageAlt={collection.name}
          badge={`${filteredProducts.length} Products`}
        />

        {/* Section 2: Elegant Description Section (from collection fields) */}
        <ElegantDescriptionSection
          title={collection.elegantHeader || collection.name}
          description={collection.elegantDescription || collection.description || ''}
        />

        {/* Section 3: Feature Hero (Image RIGHT, Content LEFT) */}
        <section className={styles.dynamicSection}>
          <div className={styles.container}>
            <div className={styles.section3Hero}>
              <div className={styles.twoCol}>
                {/* Content */}
                <div className={styles.section3ContentCol}>
                  <span className={styles.section3Badge}>About {collection.name}</span>
                  <h3 className={styles.section3Title}>{collection.section3Header || collection.name}</h3>
                  {collection.section3Content && (
                    <p className={styles.section3Description}>{collection.section3Content}</p>
                  )}

                  {/* Stats row */}
                  <div className={styles.section3Stats}>
                    <div className={styles.section3StatCard}>
                      <strong>{filteredProducts.length}+</strong>
                      <span>Styles</span>
                    </div>
                    <div className={styles.section3StatCard}>
                      <strong>Premium</strong>
                      <span>Craftsmanship</span>
                    </div>
                    <div className={styles.section3StatCard}>
                      <strong>Custom</strong>
                      <span>Options</span>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className={styles.section3Ctas}>
                    <Link href="/contact" className={styles.section3PrimaryCta}>
                      Get in touch
                      <span aria-hidden> →</span>
                    </Link>
                    <Link href="#products" className={styles.section3GhostCta}>
                      Choose your style
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className={styles.section3ImageCol}>
                  <div className={styles.section3ImageWrap}>
                    <span aria-hidden className={styles.section3ImageOutline}></span>
                    <Image
                      src={collection.section3Image || section3ImgSrc || `/images/Collection${collectionId}.jpg`}
                      alt={`${collection.name} showcase`}
                      fill
                      className={styles.section3Image}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => setSection3ImgSrc('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop&crop=center')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Feature Hero (Image LEFT, Content RIGHT) */}
        <section className={styles.dynamicSection}>
          <div className={styles.container}>
            <div className={styles.section3Hero}>
              <div className={styles.twoCol}>
                {/* Image */}
                <div className={styles.section3ImageCol}>
                  <div className={styles.section3ImageWrap}>
                    <span aria-hidden className={styles.section3ImageOutline}></span>
                    <Image
                      src={collection.section4Image || section4ImgSrc || `/images/CollectionSection4${collectionId}.jpg`}
                      alt={`${collection.name} additional showcase`}
                      fill
                      className={styles.section3Image}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() => setSection4ImgSrc('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop&crop=center')}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={styles.section3ContentCol}>
                  <span className={styles.section3Badge}>About {collection.name}</span>
                  <h3 className={styles.section3Title}>{collection.section4Header || collection.name}</h3>
                  {collection.section4Content && (
                    <p className={styles.section3Description}>{collection.section4Content}</p>
                  )}

                  {/* Section 4: text + image only (no stat cards or CTAs) */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Collage images for Level 3 (if provided) */}
        {Array.isArray(collection.collageImageSection) && collection.collageImageSection.length > 0 && (
          <section className={styles.dynamicSection}>
            <div className={styles.container}>
              <div className={styles.collageGrid}>
                {collection.collageImageSection.map((src, idx) => (
                  <div key={idx} className={styles.collageItem}>
                    <div className={styles.imageWrap}>
                      <Image src={src} alt={`${collection.name} collage ${idx+1}`} fill className={styles.sectionImage} sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}


        {/* Products Section (with anchor) */}

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
          description={collection.description || ''}
          imageSrc={collection.images && collection.images.length > 0
            ? collection.images[0]
            : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"}
          imageAlt={collection.name}
          badge={`${childCollections.length} ${collection.level === 1 ? 'Categories' : 'Subcategories'}`}
        />

        {/* Section 2: NEW - Elegant Description Section */}
        <ElegantDescriptionSection
          title={collection.elegantHeader || collection.name}
          description={collection.elegantDescription || collection.description || ''}
        />

 {/* Section 3: Child Collections - Custom 6-grid only for collection ID 1 */}
        {collection.id === 1 && (
          <ArchitecturalSixGrid collections={childCollections} />
        )
        }

        {/* Section X: ID=2 exclusive sections */}
        {(collection.id === 2 || collection.id === 3 || collection.id === 4 || collection.id === 5 || collection.id === 6 || collection.id === 7) && (
          <>
            {/* Section 1: Sub-category Grid (right aligned) */}
            <section className={styles.id2Subcategories}>
              <div className={styles.container}>
                <div className={styles.id2TwoColumn}>
                  <div className={styles.id2Sidebar}>
                    <h3 className={styles.sidebarHeading}>Category</h3>
                    <nav className={styles.categoryNav} aria-label="Subcategories">
                      <ul className={styles.categoryList}>
                        {childCollections.map((c) => (
                          <li key={c.id} className={styles.categoryItem}>
                            <Link href={`/collections/${c.id}`} className={styles.categoryLink}>{c.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                  <motion.div
                    className={styles.id2Grid}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={gridMotion}
                  >
                    {childCollections.map((c) => {
                      const imageSrc = Array.isArray(c.images) && c.images.length > 0
                        ? c.images[0]
                        : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center";
                      return (
                        <motion.div key={c.id} variants={cardMotion} className={styles.id2Card}>
                          <Link href={`/collections/${c.id}`} className={styles.imageCard}>
                            <div className={styles.cardImageWrap}>
                              <Image src={imageSrc} alt={c.name} fill className={styles.cardImage} sizes="(max-width: 768px) 100vw, 50vw" />
                              <div className={styles.cardOverlay}>
                                <h3 className={styles.cardTitle}>{c.name}</h3>
                                 <p className={styles.cardDescription}>
                                   {c.description || "Explore our collection of premium cast stone designs."}
                                     </p>

                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Section: Static Content (from collection fields) */}
            <StaticContentSection
              header={collection.staticContentHeader}
              paragraph1={collection.staticContentParagraph1}
              paragraph2={collection.staticContentParagraph2}
              paragraph3={collection.staticContentParagraph3}
            />

            {/* Section 2: Recommendations (children of ID 1) */}
            {rootRecommendations.length > 0 && (
              <section className={styles.recommendationsSection}>
                <div className={styles.container}>
                  <div className={styles.recsHeader}>
                    <h2 className={styles.recsTitle}>You may also like</h2>
                    <div className={styles.recsNav}>
                      <button type="button" className={styles.recsButton} onClick={() => recsScrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })} aria-label="Scroll left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button type="button" className={styles.recsButton} onClick={() => recsScrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })} aria-label="Scroll right">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className={styles.recsScroller} ref={recsScrollRef}>
                    {rootRecommendations.map((r) => {
                      const imageSrc = Array.isArray(r.images) && r.images.length > 0
                        ? r.images[0]
                        : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop&crop=center";
                      return (
                        <motion.div key={r.id} className={styles.recsItem} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={cardMotion}>
                          <Link href={`/collections/${r.id}`} className={styles.imageCard}>
                            <div className={styles.cardImageWrap}>
                              <Image src={imageSrc} alt={r.name} fill className={styles.cardImage} sizes="(max-width: 768px) 100vw, 33vw" />
                              <div className={styles.cardOverlay}>
                                <h3 className={styles.cardTitle}>{r.name}</h3>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Section 4: Zigzag Content Section - only on collection ID 1 */}
        {collection.id === 1 && (
          <ZigzagContentSection
            items={zigzagContentData}
            maxItems={5}
          />
        )}


      </div>
    );
  }

  // For non-Architectural Design collections, use the standard layout
  return (
    <div className={styles.newCollectionPage}>
      {/* Section 1: Full-Screen Banner */}
      <FullScreenBanner
        title={collection.name}
        description={collection.description || ''}
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
