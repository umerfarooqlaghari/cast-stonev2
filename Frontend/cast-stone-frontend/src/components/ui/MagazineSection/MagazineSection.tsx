'use client';

import React from 'react';
import Image from 'next/image';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './magazineSection.module.css';

interface MagazineSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
  ctaButton?: {
    text: string;
    href?: string;
    onClick?: () => void;
  };
  badge?: string;
  subtitle?: string;
}

const MagazineSection: React.FC<MagazineSectionProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imagePosition = 'right',
  children,
  className = '',
  ctaButton,
  badge,
  subtitle
}) => {
  const sectionClass = `${styles.magazineSection} ${styles[imagePosition]} ${className}`;

  // Get optimized image URL for hero display
  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'hero');

  return (
    <section className={sectionClass}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            {badge && (
              <span className={styles.badge}>{badge}</span>
            )}
            <h2 className={styles.title}>{title}</h2>
            {subtitle && (
              <h3 className={styles.subtitle}>{subtitle}</h3>
            )}
            <p className={styles.description}>{description}</p>
            
            {children && (
              <div className={styles.additionalContent}>
                {children}
              </div>
            )}
            
            {ctaButton && (
              <div className={styles.ctaContainer}>
                {ctaButton.href ? (
                  <a href={ctaButton.href} className={styles.ctaButton}>
                    {ctaButton.text}
                    <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                ) : (
                  <button onClick={ctaButton.onClick} className={styles.ctaButton}>
                    {ctaButton.text}
                    <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.imageContent}>
            <div className={styles.imageContainer}>
              <Image
                src={optimizedImageSrc}
                alt={imageAlt}
                width={600}
                height={400}
                className={styles.image}
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImageUrl('general');
                }}
              />
              <div className={styles.imageOverlay}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
