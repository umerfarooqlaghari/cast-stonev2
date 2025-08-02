'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './fullScreenBanner.module.css';

interface FullScreenBannerProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  badge?: string;
  className?: string;
  exploreHref?: string;
  sellHref?: string;
}

const FullScreenBanner: React.FC<FullScreenBannerProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  badge,
  className = '',
  exploreHref = '/collections',
  sellHref = '/contact'
}) => {
  // Get optimized image URL for full-screen display
  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'hero');
  const fallbackImageSrc = getFallbackImageUrl();

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

        {/* Dark gradient overlay for text readability */}
        <div className={styles.overlay} />

        {/* Left-aligned text content */}
        <div className={styles.textBlock}>
          {badge && (
            <div className={styles.badge}>
              {badge}
            </div>
          )}
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Floating CTA Box - Bottom Right */}
        <div className={styles.ctaBox}>
          <div className={styles.ctaButtons}>
            <Link href={exploreHref} className={styles.primaryButton}>
              <span>Explore Now</span>
            </Link>
            <Link href={sellHref} className={styles.secondaryButton}>
              <span>Sell Now</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FullScreenBanner;
