'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './ctaSection.module.css';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  buttonOnClick?: () => void;
  backgroundImage: string;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  buttonText,
  buttonHref,
  buttonOnClick,
  backgroundImage,
  className = ''
}) => {
  const optimizedImageSrc = getOptimizedImageUrl(backgroundImage, 'hero');
  const fallbackImageSrc = getFallbackImageUrl('hero');

  const ButtonComponent = buttonHref ? Link : 'button';
  const buttonProps = buttonHref 
    ? { href: buttonHref }
    : { onClick: buttonOnClick };

  return (
    <section className={`${styles.ctaSection} ${className}`}>
      {/* Background Image */}
      <div className={styles.backgroundContainer}>
        <Image
          src={optimizedImageSrc}
          alt="Contact us background"
          fill
          className={styles.backgroundImage}
          sizes="100vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = fallbackImageSrc;
          }}
        />
        
        {/* Overlay */}
        <div className={styles.overlay} />
      </div>
      
      {/* Content */}
      <div className={styles.content}>
        <div className={styles.container}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
          
          <ButtonComponent
            {...buttonProps}
            className={styles.ctaButton}
          >
            <span>{buttonText}</span>
            <svg className={styles.buttonIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </ButtonComponent>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
