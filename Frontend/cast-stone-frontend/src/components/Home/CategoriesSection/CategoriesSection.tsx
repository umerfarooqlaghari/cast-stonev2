'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collectionGetService } from '../../../services/api/collections';
import { Collection } from '../../../services/types/entities';
import styles from './categoriesSection.module.css';

interface CategoriesSectionProps {
  maxCollections?: number;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  maxCollections = 4
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get published collections
        const publishedData = await collectionGetService.getPublished();
        // Limit to maxCollections
        const limitedCollections = publishedData.
         filter(collection => collection.level === 1)
         .slice(0, maxCollections);
        setCollections(limitedCollections);
      } catch (err) {
        console.error('Failed to fetch collections:', err);
        setError('Failed to load collections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [maxCollections]);

  const getCollectionImage = (collection: Collection): string | null => {
    // Use the first image from the collection's images array (same logic as Collections Carousel)
    if (Array.isArray(collection.images) && collection.images.length > 0) {
      return collection.images[0];
    }
    // Return null if no images available
    return null;
  };

  if (isLoading) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>Our Collections</h2>
            <p className={styles.sectionSubtitle}>
              Explore our diverse range of handcrafted cast stone elements,
              each designed to bring timeless elegance to your space.
            </p>
          </div>
          <div className={styles.loadingGrid}>
            {[...Array(4)].map((_, index) => (
              <div key={index} className={styles.loadingCard}>
                <div className={styles.loadingImage}></div>
                <div className={styles.loadingContent}>
                  <div className={styles.loadingText}></div>
                  <div className={styles.loadingText}></div>
                  <div className={styles.loadingText}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.sectionTitle}>Our Collections</h2>
            <p className={styles.sectionSubtitle}>
              Explore our diverse range of handcrafted cast stone elements,
              each designed to bring timeless elegance to your space.
            </p>
          </div>
          <div className={styles.errorMessage}>
            <p>Unable to load collections. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }



  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Our Collections</h2>
          <p className={styles.sectionSubtitle}>
            Explore our diverse range of handcrafted cast stone elements,
            each designed to bring timeless elegance to your space.
          </p>
        </div>

        <div className={styles.grid}>
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              className={`${styles.categoryCard} ${styles[`card${index + 1}`]}`}
            >
              <Link href={`/collections/${collection.id}`} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                  {getCollectionImage(collection) ? (
                    <Image
                      src={getCollectionImage(collection)!}
                      alt={collection.name}
                      fill
                      className={styles.categoryImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className={styles.noImagePlaceholder}>
                      <span className={styles.noImageText}>No Image</span>
                    </div>
                  )}
                  <div className={styles.imageOverlay}></div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    {/* <div className={styles.stats}>
                      <span className={styles.statsNumber}>{collection.productCount || 0}</span>
                      <span className={styles.statsLabel}>Products</span>
                    </div> */}
                    <h3 className={styles.categoryTitle}>{collection.name}</h3>
                    <p className={styles.categorySubtitle}>
                      {collection.tags && collection.tags.length > 0
                        ? collection.tags[0].toUpperCase()
                        : 'COLLECTION'
                      }
                    </p>
                  </div>

                  <p className={styles.categoryDescription}>
                    {collection.description || 'Explore our curated selection of handcrafted cast stone elements.'}
                  </p>

                  <div className={styles.cardActions}>
                    <button className={styles.actionButton}>
                      <span>Shop Now</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className={styles.secondaryButton}>
                      <span>All Products</span>
                    </button>
                  </div>
                </div>

                <div className={styles.hoverEffect}></div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
