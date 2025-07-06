'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './catalogBanner.module.css';

interface CatalogBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
}

const CatalogBanner: React.FC<CatalogBannerProps> = ({
  title = "Explore Our Complete Catalog",
  subtitle = "Discover Excellence",
  description = "Browse through our comprehensive collection of handcrafted cast stone elements. From architectural details to decorative accents, find the perfect pieces to elevate your space with timeless elegance.",
  ctaText = "View Full Catalog",
  ctaHref = "/catalog",
  backgroundImage = "/images/catalog-banner-bg.jpg"
}) => {
  return (
    <section className={styles.catalogBanner}>
      <div className={styles.backgroundContainer}>
        <Image
          src={backgroundImage}
          alt="Cast Stone Catalog"
          fill
          className={styles.backgroundImage}
          sizes="100vw"
          priority={false}
        />
        <div className={styles.backgroundOverlay}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <span className={styles.subtitle}>{subtitle}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>500+ Products</span>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3.9 5 4.9 5 5 5H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Quality Assured</span>
              </div>
              
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className={styles.ctaContainer}>
            <Link href={ctaHref} className={styles.ctaButton}>
              <span className={styles.ctaText}>{ctaText}</span>
              <div className={styles.ctaIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.buttonRipple}></div>
            </Link>
            
            <div className={styles.catalogStats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>25+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>1000+</span>
                <span className={styles.statLabel}>Happy Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.decorativeCircle}></div>
        <div className={styles.decorativeLine}></div>
      </div>
    </section>
  );
};

export default CatalogBanner;
