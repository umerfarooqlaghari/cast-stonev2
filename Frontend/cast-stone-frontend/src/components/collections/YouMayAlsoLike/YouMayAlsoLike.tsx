'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';
import { Collection } from '@/services/types/entities';
import styles from './YouMayAlsoLike.module.css';

interface YouMayAlsoLikeProps {
  collections: Collection[];
  currentCollectionId: number;
  title?: string;
  className?: string;
}

const YouMayAlsoLike: React.FC<YouMayAlsoLikeProps> = ({
  collections,
  currentCollectionId,
  title = "You May Also Like",
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Filter out the current collection and get related collections
  const relatedCollections = collections.filter(collection => collection.id !== currentCollectionId);
  
  if (relatedCollections.length === 0) {
    return null;
  }

  // Show 3 collections at a time in stats cards, navigate one by one
  const itemsPerPage = 3;

  // Ensure we always show 3 collections, adjusting the window as needed
  const maxStartIndex = Math.max(0, relatedCollections.length - itemsPerPage);
  const windowStartIndex = Math.min(currentIndex, maxStartIndex);
  const currentCollections = relatedCollections.slice(windowStartIndex, windowStartIndex + itemsPerPage);

  // Get the currently active collection (the one at currentIndex)
  const activeCollection = relatedCollections[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1)); // Move one collection at a time
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(relatedCollections.length - 1, prev + 1)); // Move one collection at a time
  };

  return (
    <section className={`${styles.youMayAlsoLike} ${className}`}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <div className={styles.header}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.description}>
                {activeCollection?.description ||
                  "Our extensive line of stone veneer and quoins invites you to explore a world of endless possibilities in elevating the beauty and character of your structures. From classical elegance to contemporary sophistication, these meticulously crafted elements are your tools to shape architectural visions into enduring works of art."
                }
              </p>
            </div>

            {/* Stats Cards for Collection Names */}
            <div className={styles.statsContainer}>
              {currentCollections.map((collection, index) => {
                const collectionGlobalIndex = windowStartIndex + index;
                const isActive = collectionGlobalIndex === currentIndex;
                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.id}`}
                    className={`${styles.statCard} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.statLabel}>Collection</div>
                    <div className={styles.statValue}>{collection.name}</div>
                  </Link>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <Link href="/contact" className={styles.primaryButton}>
                Get in touch
                <span aria-hidden>→</span>
              </Link>
              <Link href={`/collections/${activeCollection?.id}`} className={styles.secondaryButton}>
                Choose your style
              </Link>
            </div>
          </div>

          {/* Right Content - Image Carousel */}
          <div className={styles.rightContent}>
            <div className={styles.carouselContainer}>
              {/* Navigation Buttons */}
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                aria-label="Previous collections"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              {/* Collections Grid */}
              <div className={styles.collectionsGrid}>
                {activeCollection && (() => {
                  const imageSrc = activeCollection.images && activeCollection.images.length > 0
                    ? activeCollection.images[0]
                    : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop&crop=center";

                  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'card');

                  return (
                    <div className={styles.collectionCard}>
                      <div className={styles.cardImageContainer}>
                        <Image
                          src={optimizedImageSrc}
                          alt={activeCollection.name}
                          fill
                          className={styles.cardImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                disabled={currentIndex >= relatedCollections.length - 1}
                aria-label="Next collections"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
