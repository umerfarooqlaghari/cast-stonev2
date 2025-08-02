'use client';

import React from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './fullScreenBanner.module.css';

interface FullScreenBannerProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  className?: string;
}

const FullScreenBanner: React.FC<FullScreenBannerProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  badge,
  className = ''
}) => {
  // Get optimized image URL for full-screen display
  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'hero');
  const fallbackImageSrc = getFallbackImageUrl('images/CollectionBackground3.jpg');

  return (
    <section className={`${styles.fullScreenBanner} ${className}`}>
      {/* Full Screen Image */}
      <div className={styles.imageContainer}>
        <Image
          src={optimizedImageSrc}
          alt={imageAlt}
          fill
          className={styles.bannerImage}
          sizes="100vw"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImageSrc;
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className={styles.overlay} />
        
        {/* Content overlay */}
        <div className={styles.contentOverlay}>
          <div className={styles.content}>
            {badge && (
              <div className={styles.badge}>
                {badge}
              </div>
            )}
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.bannerDescription}>{description}</p> {/* <-- Moved here */}
          </div>
        </div>
      </div>
      
      {/* Description Section */}
      {/* <div className={styles.descriptionSection}>
        <div className={styles.descriptionContainer}>
          <p className={styles.description}>{description}</p>
        </div>
      </div> */}
    </section>
  );
};

export default FullScreenBanner;
