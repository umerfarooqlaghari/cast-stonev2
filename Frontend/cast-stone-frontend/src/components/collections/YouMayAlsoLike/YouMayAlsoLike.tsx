'use client';

import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter out the current collection and get related collections
  const relatedCollections = collections.filter(collection => collection.id !== currentCollectionId);

  if (relatedCollections.length === 0) {
    return null;
  }

  // Show 1 collection on mobile, 3 on desktop
  const itemsPerPage = isMobile ? 1 : 3;

  // Ensure we always show the correct number of collections
  const maxStartIndex = Math.max(0, relatedCollections.length - itemsPerPage);
  const windowStartIndex = Math.min(currentIndex, maxStartIndex);
  const currentCollections = relatedCollections.slice(windowStartIndex, windowStartIndex + itemsPerPage);

  // Calculate indicator position (0, 1, or 2) - rewinds after 3
  const indicatorPosition = currentIndex % 3;

  const handlePrevious = () => {
    setCurrentIndex(prev => {
      if (prev === 0) {
        // Rewind to last collection when going back from first
        return relatedCollections.length - 1;
      }
      return prev - 1;
    });
  };

  const handleNext = () => {
    setCurrentIndex(prev => {
      if (prev >= relatedCollections.length - 1) {
        // Rewind to first collection when going forward from last
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <section className={`${styles.youMayAlsoLike} ${className}`}>
      <div className={styles.container}>
        {/* Centered Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>
            It&apos;s not just balustrading and parapet screening we offer. We provide a whole range of architectural services, from façade stonework to flooring and paving. Take a look at some of our other products below.
          </p>
        </div>

        <div className={styles.mainContent}>
          {/* Carousel Container */}
          <div className={styles.rightContent}>
            <div className={styles.carouselContainer}>
              {/* Navigation Buttons */}
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={handlePrevious}
                aria-label="Previous collections"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              {/* Collections Grid - Show 3 cards */}
              <div className={styles.collectionsGrid}>
                {currentCollections.map((collection) => {
                  const imageSrc = collection.images && collection.images.length > 0
                    ? collection.images[0]
                    : "https://res.cloudinary.com/damyvovze/image/upload/v1758467859/cast-stone-images/IMG_5537.jpg";

                  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'card');

                  return (
                    <Link
                      key={collection.id}
                      href={`/collections/${collection.id}`}
                      className={styles.collectionCard}
                    >
                      <div className={styles.cardImageContainer}>
                        <Image
                          src={optimizedImageSrc}
                          alt={collection.name}
                          fill
                          className={styles.cardImage}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {/* Collection Name Overlay */}
                        <div className={styles.cardOverlay}>
                          <h3 className={styles.cardTitle}>{collection.name}</h3>
                          <span className={styles.cardLink}>
                            Find out more →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={handleNext}
                aria-label="Next collections"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            {/* Carousel Indicators - Only 3 indicators */}
            <div className={styles.carouselIndicators}>
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  className={`${styles.indicator} ${index === indicatorPosition ? styles.active : ''}`}
                  onClick={() => {
                    // Calculate which collection to show based on current position
                    const baseIndex = Math.floor(currentIndex / 3) * 3;
                    setCurrentIndex(baseIndex + index);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
