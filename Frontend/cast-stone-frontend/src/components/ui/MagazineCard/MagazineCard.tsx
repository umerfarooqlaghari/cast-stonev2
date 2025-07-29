'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './magazineCard.module.css';

interface MagazineCardProps {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  price?: string;
  originalPrice?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
  imagePosition?: 'top' | 'left' | 'right';
}

const MagazineCard: React.FC<MagazineCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  href,
  onClick,
  badge,
  price,
  originalPrice,
  children,
  className = '',
  variant = 'default',
  imagePosition = 'top'
}) => {
  const cardClass = `${styles.magazineCard} ${styles[variant]} ${styles[imagePosition]} ${className}`;

  // Get optimized image URL
  const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'card');

  const CardContent = () => (
    <div className={cardClass}>
      <div className={styles.imageContainer}>
        <Image
          src={optimizedImageSrc}
          alt={imageAlt}
          width={400}
          height={300}
          className={styles.image}
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImageUrl('general');
          }}
        />
        {badge && (
          <span className={styles.badge}>{badge}</span>
        )}
        <div className={styles.imageOverlay}></div>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
        
        {(price || originalPrice) && (
          <div className={styles.priceContainer}>
            {price && <span className={styles.price}>{price}</span>}
            {originalPrice && <span className={styles.originalPrice}>{originalPrice}</span>}
          </div>
        )}
        
        {children && (
          <div className={styles.additionalContent}>
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={styles.cardLink}>
        <CardContent />
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={styles.cardButton}>
        <CardContent />
      </button>
    );
  }

  return <CardContent />;
};

export default MagazineCard;
