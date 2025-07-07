'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './heroSection.module.css';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  subtitle = "Discover our exquisite collection of handcrafted cast stone interiors, fireplaces, and decorative elements that transform spaces into works of art."
}) => {
  // Array of hero images
  const heroImages = [
    '/heroSection/BANNER IMAGES/IMG_0930.jpg',
    '/heroSection/BANNER IMAGES/IMG_1194.jpg',
    '/heroSection/BANNER IMAGES/IMG_1206.jpg',
    '/heroSection/BANNER IMAGES/IMG_1263.jpg',
    '/heroSection/BANNER IMAGES/IMG_1686.JPG',
    '/heroSection/BANNER IMAGES/IMG_2231.jpg',
    '/heroSection/BANNER IMAGES/IMG_3920.jpg',
    '/heroSection/BANNER IMAGES/IMG_8272.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Change image every 5 seconds to match the zoom animation duration
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % heroImages.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className={styles.hero}>
      {/* Image Background Carousel */}
      <div className={styles.imageContainer}>
        {heroImages.map((imageSrc, index) => (
          <div
            key={`${imageSrc}-${index}`}
            className={`${styles.imageSlide} ${
              index === currentImageIndex ? styles.active : ''
            }`}
          >
            <Image
              src={imageSrc}
              alt={`Hero background ${index + 1}`}
              fill
              className={styles.backgroundImage}
              sizes="100vw"
              priority={index === 0} // Prioritize loading the first image
              quality={90}
            />
          </div>
        ))}

        {/* Image Overlay */}
        <div className={styles.imageOverlay}></div>
      </div>

      {/* Navigation Arrows */}
      <button
        className={`${styles.navArrow} ${styles.navArrowLeft}`}
        onClick={goToPrevious}
        aria-label="Previous image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className={`${styles.navArrow} ${styles.navArrowRight}`}
        onClick={goToNext}
        aria-label="Next image"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <span className={styles.titleLine1}>Timeless Elegance in</span>
            <span className={styles.titleLine2}>Cast Stone</span>
          </h1>

          <p className={styles.subtitle}>
            {subtitle}
          </p>

          <div className={styles.actions}>
            <Link href="/collections" className={styles.primaryButton}>
              <span className={styles.buttonText}>EXPLORE COLLECTION</span>
              <div className={styles.buttonRipple}></div>
            </Link>

            <Link href="/our-story" className={styles.secondaryButton}>
              <span className={styles.buttonText}>WATCH OUR STORY</span>
              <div className={styles.buttonRipple}></div>
            </Link>
          </div>

          {/* Indicator Dots */}
          <div className={styles.indicators}>
            {heroImages.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicator} ${
                  index === currentImageIndex ? styles.indicatorActive : ''
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
