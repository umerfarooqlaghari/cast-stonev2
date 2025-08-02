'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/services/types/entities';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';
import styles from './CollectionCollage.module.css';

interface CollectionsCollageProps {
  collections: Collection[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const CollectionsCollage: React.FC<CollectionsCollageProps> = ({
  collections,
  title = "Explore Collections",
  subtitle = "Discover our curated selection of cast stone collections",
  className = ''
}) => {
  if (!collections || collections.length === 0) {
    return (
      <section className={`${styles.collectionsCollage} ${className}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <h3>No Collections Available</h3>
            <p>This collection doesn&apos;t have any subcollections yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.collectionsCollage} ${className}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        
        <div className={`${styles.collageGrid} ${styles[`grid${collections.length}`]}`}>
          {collections.map((collection, index) => {
            const imageSrc = collection.images && collection.images.length > 0
              ? collection.images[0]
              : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center";

            const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'card');

            // Dynamic sizing based on collection count and position
            const getCardSize = (totalCount: number, currentIndex: number) => {
              if (totalCount === 1) return 'single';  
              if (totalCount === 2) return 'half';
              if (totalCount === 3) {
                return currentIndex === 0 ? 'large' : 'medium';
              }
              if (totalCount === 4) {
                return currentIndex === 0 ? 'large' : 'small';
              }
              if (totalCount === 5) {
                if (currentIndex === 0) return 'large';
                if (currentIndex === 1 || currentIndex === 2) return 'medium';
                return 'small';
              }
              if (totalCount === 6) {
                if (currentIndex === 0 || currentIndex === 1) return 'medium';
                return 'small';
              }
              // For 7+ collections, use a more distributed approach
              if (currentIndex === 0) return 'large';
              if (currentIndex === 1 || currentIndex === 2) return 'medium';
              return 'small';
            };

            const cardSize = getCardSize(collections.length, index);
            const cardClass = `${styles.collectionCard} ${styles[cardSize]}`;

            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.id}`}
                className={cardClass}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={optimizedImageSrc}
                    alt={collection.name}
                    fill
                    className={styles.collectionImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    
                  />
                  
                  {/* Overlay */}
                  <div className={styles.overlay} />
                  
                  {/* Content */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.collectionName}>{collection.name}</h3>
                    {collection.description && (
                      <p className={styles.collectionDescription}>
                        {collection.description}
                      </p>
                    )}
                    
                    <div className={styles.exploreButton}>
                      <span>Explore Collection</span>
                      <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CollectionsCollage;
