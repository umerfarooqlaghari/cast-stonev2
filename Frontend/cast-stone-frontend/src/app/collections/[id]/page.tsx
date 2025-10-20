/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Product, Collection } from '@/services/types/entities';
import { MagazineProductGrid } from '@/components/products';
import { FullScreenBanner, MasonryCollage, ArchitecturalSixGrid } from '@/components/collections';
import ZigzagContentSection, { ZigzagContentItem } from '@/components/collections/ZigzagContentSection/ZigzagContentSection';
import StaticCompletedProjects, { StaticCompletedProject } from '@/components/collections/StaticCompletedProjects/StaticCompletedProjects';
import ElegantDescriptionSection from '@/components/collections/ElegantDescriptionSection/ElegantDescriptionSection';
import YouMayAlsoLike from '@/components/collections/YouMayAlsoLike';
import { isArchitecturalDesignHierarchySync } from '@/utils/collectionUtils';
import { useCollection, useCollectionChildren, useCollectionsByLevel } from '@/hooks/useCollections';
import { useProductsByCollection } from '@/hooks/useProducts';
import styles from './collectionPage.module.css';
import { motion, cubicBezier } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import StaticContentSection from './StaticContentSection';
import { createPortal } from 'react-dom';

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

  // Use React Query hooks for cached data
  const { data: collection, isLoading: isLoadingCollection, error: collectionError } = useCollection(collectionId);
  const { data: childCollections = [] } = useCollectionChildren(collectionId);
  const { data: products = [] } = useProductsByCollection(collectionId);
  const { data: siblingCollections = [] } = useCollectionsByLevel(collection?.level || 0);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const isLoading = isLoadingCollection;
  const error = collectionError ? 'Failed to load collection' : null;

  // Hover and motion preferences
  const [section3Hovered, setSection3Hovered] = useState(false);
  const [section4Hovered, setSection4Hovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    priceRange: { min: 0, max: 10000 },
    inStockOnly: false,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  // Modal state for full-size collage image
  // track mounting for portal safety
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const [activeModalSrc, setActiveModalSrc] = useState<string | null>(null);
  const [modalOpenReason, setModalOpenReason] = useState<'hover' | 'click' | null>(null);

  const openFromHover = (src: string) => { setActiveModalSrc(src); setModalOpenReason('hover'); };
  const openFromClick = (src: string) => { setActiveModalSrc(src); setModalOpenReason('click'); };
  const closeModal = () => { setActiveModalSrc(null); setModalOpenReason(null); };

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

  // Shared transition for flip interactions
  const flipTransition = { duration: 0.7, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) } as const;


  // Check if this collection is in the Architectural Design hierarchy
  const isArchitecturalDesign = collection ? isArchitecturalDesignHierarchySync(collection) : false;


  // Detect reduced motion preference and small screens
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqSmall = window.matchMedia('(max-width: 900px)');

    const updateReduced = () => setPrefersReducedMotion(mqReduced.matches);
    const updateSmall = () => setIsSmallScreen(mqSmall.matches);

    updateReduced();
    updateSmall();

    mqReduced.addEventListener?.('change', updateReduced);
    mqSmall.addEventListener?.('change', updateSmall);

    return () => {
      mqReduced.removeEventListener?.('change', updateReduced);
      mqSmall.removeEventListener?.('change', updateSmall);
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!activeModalSrc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeModalSrc]);

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

  // Set initial price range based on actual products
  useEffect(() => {
    if (products.length > 0 && collection?.level === 3) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setFilters(prev => ({
        ...prev,
        priceRange: { min: minPrice, max: maxPrice }
      }));
    }
  }, [products, collection]);

  const applyFilters = useCallback(() => {
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
  }, [products, filters.search, filters.priceRange.min, filters.priceRange.max, filters.inStockOnly, filters.sortBy, filters.sortDirection]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

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
              <div className={`${styles.twoCol} ${styles.twoColAreasRight}`}>
                {/* Content */}
                <div className={`${styles.section3ContentCol} ${styles.colContent}`}>
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
                    <Link href={`/products?collectionId=${collectionId}`} className={styles.section3GhostCta}>
                      Choose your style
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div className={`${styles.section3ImageCol} ${styles.colImage}`}>
                  <div className={styles.section3ImageWrap}>
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
              <div className={`${styles.twoCol} ${styles.twoColAreasLeft}`}>
                {/* Image */}
                <div className={`${styles.section3ImageCol} ${styles.colImage}`}>
                  <div className={styles.section3ImageWrap}>
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
                <div className={`${styles.section3ContentCol} ${styles.colContent}`}>
                  <span className={styles.section3Badge}>About {collection.name}</span>
                  <h3 className={styles.section3Title}>{collection.section4Header || collection.name}</h3>
                  {collection.section4Content && (
                    <p className={styles.section3Description}>{collection.section4Content}</p>
                  )}
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
                {(() => {
                  const imgs = collection.collageImageSection as string[];
                  const rows: string[][] = [];
                  let i = 0;
                  let rowIdx = 0;
                  while (i < imgs.length) {
                    const desired = rowIdx % 2 === 0 ? 2 : 3; // 2-3-2-3 pattern
                    const remaining = imgs.length - i;
                    const take = remaining < desired ? remaining : desired; // edge cases: 1 or 2 left
                    rows.push(imgs.slice(i, i + take));
                    i += take;
                    rowIdx++;
                  }
                  return rows.map((row, rIdx) => {
                    const colsClass = row.length === 1 ? styles.cols1 : row.length === 2 ? styles.cols2 : styles.cols3;
                    return (
                      <div key={`row-${rIdx}`} className={`${styles.collageRow} ${colsClass}`}>
                        {row.map((src, idx) => (
                          <div
                            key={`${rIdx}-${idx}`}
                            className={styles.collageItem}
                            role="img" aria-label={`${collection.name} collage ${rIdx + 1}-${idx + 1}`}>
                            <div className={styles.imageWrap}>
                              <Image src={src} alt={`${collection.name} collage ${rIdx + 1}-${idx + 1}`} fill className={styles.sectionImage} sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw" />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </section>
        )}



        {/* Collage full-size modal overlay (Level 3) via portal to escape any stacking contexts */}

        {/* Section: You May Also Like - For Level 3 collections */}
        {siblingCollections.length > 0 && (
          <YouMayAlsoLike
            collections={siblingCollections}
            currentCollectionId={collectionId}
            title="You May Also Like"
          />
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

            {/* Section: You May Also Like - New Component (All levels) */}
            {siblingCollections.length > 0 && (
              <YouMayAlsoLike
                collections={siblingCollections}
                currentCollectionId={collectionId}
                title="You May Also Like"
              />
            )}
          </>
        )}

        {/* Section: Static Content (from collection fields) - Level 2 and 3 */}
        {(collection.level === 2 || collection.level === 3) && (
          <StaticContentSection
            header={collection.staticContentHeader}
            paragraph1={collection.staticContentParagraph1}
            paragraph2={collection.staticContentParagraph2}
            paragraph3={collection.staticContentParagraph3}
            backgroundImage={
              collection.staticContentBackgroundImage ||
              (collection.images && collection.images.length > 1
                ? collection.images[1]
                : collection.images && collection.images.length > 0
                  ? collection.images[0]
                  : undefined)
            }
          />
        )}

        {/* Section: You May Also Like - For all levels in Architectural Design */}
        {/* {siblingCollections.length > 0 && (
          <YouMayAlsoLike
            collections={siblingCollections}
            currentCollectionId={collectionId}
            title="You May Also Like"
          />
        )} */}

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

      {/* Section: Static Content (from collection fields) - Level 2 and 3 */}
      {(collection.level === 2 || collection.level === 3) && (
        <StaticContentSection
          header={collection.staticContentHeader}
          paragraph1={collection.staticContentParagraph1}
          paragraph2={collection.staticContentParagraph2}
          paragraph3={collection.staticContentParagraph3}
          backgroundImage={
            collection.staticContentBackgroundImage ||
            (collection.images && collection.images.length > 1
              ? collection.images[1]
              : collection.images && collection.images.length > 0
                ? collection.images[0]
                : undefined)
          }
        />
      )}

      {/* Section: You May Also Like - For all levels in standard layout */}
      {siblingCollections.length > 0 && (
        <YouMayAlsoLike
          collections={siblingCollections}
          currentCollectionId={collectionId}
          title="You May Also Like"
        />
      )}

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
