'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './heroSection.module.css';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  videoSrc?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Timeless Elegance in Cast Stone",
  subtitle = "Discover our exquisite collection of handcrafted cast stone interiors, fireplaces, and decorative elements that transform spaces into works of art.",
  videoSrc = "/videos/hero-background.mp4" // Default video path
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays automatically and loops
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <section className={styles.hero}>
      {/* Video Background */}
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          className={styles.backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg" // Fallback image
        >
          <source src={videoSrc} type="video/mp4" />
          <source src="/videos/hero-background.webm" type="video/webm" />
          {/* Fallback for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>

        {/* Video Overlay */}
        <div className={styles.videoOverlay}></div>
      </div>

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
