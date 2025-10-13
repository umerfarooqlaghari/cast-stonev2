'use client';

import React, { useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePublishedCollections } from '@/hooks/useCollections';
import styles from './collectionsCarousel.module.css';

interface CollectionsCarouselProps {
  title?: string;
  subtitle?: string;
}

const CollectionsCarousel: React.FC<CollectionsCarouselProps> = ({
  title = "Featured Collections",
  subtitle = "Explore our curated selection of handcrafted cast stone collections"
}) => {
  // Use React Query hook for cached data
  const { data: publishedCollections = [], isLoading, error: queryError } = usePublishedCollections();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter and limit collections to level 1, max 4 items
  const collections = useMemo(() => {
    return publishedCollections
      .filter(collection => collection.level === 1)
      .slice(0, 4);
  }, [publishedCollections]);

  const error = queryError ? 'Failed to load collections' : null;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return (
      <section className={styles.collectionsSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading collections...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.collectionsSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.errorContainer}>
            <p>Unable to load collections. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.collectionsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>

          <div className={styles.navigation}>
            <button
              className={styles.navButton}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className={styles.navButton}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.carouselContainer}>
          <div
            ref={scrollContainerRef}
            className={styles.carousel}
          >
            {collections.map((collection) => (
              <div key={collection.id} className={styles.collectionCard}>
                <Link href={`/collections/${collection.id}`} className={styles.cardLink}>
                  {Array.isArray(collection.images) && collection.images.length > 0 ? (
                    <div className={styles.imageContainer}>
                      <Image
                        src={collection.images[0]}
                        alt={collection.name}
                        fill
                        className={styles.collectionImage}
                        sizes="(max-width: 768px) 280px, 320px"
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                  ) : (
                    <div className={styles.imageContainer}>
                      <div className={styles.noImagePlaceholder}>
                        <span className={styles.noImageText}>No Image</span>
                      </div>
                      <div className={styles.imageOverlay}></div>
                    </div>
                  )}

                  <div className={styles.cardContent}>
                    {/* <div className={styles.productCount}>
                      {collection.productCount} Products
                    </div> */}
                    <h3 className={styles.collectionName}>{collection.name}</h3>
                    {collection.description && (
                      <p className={styles.collectionDescription}>
                        {collection.description}
                      </p>
                    )}

                    <div className={styles.cardAction}>
                      <span className={styles.actionText}>Explore Collection</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.viewAllContainer}>
          <Link href="/collections" className={styles.viewAllButton}>
            <span>View All Collections</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CollectionsCarousel;
