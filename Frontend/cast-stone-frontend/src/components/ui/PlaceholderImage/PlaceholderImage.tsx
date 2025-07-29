'use client';

import React from 'react';
import styles from './placeholderImage.module.css';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  type?: 'product' | 'collection' | 'general';
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 400,
  height = 300,
  text,
  className = '',
  type = 'general'
}) => {
  const getDefaultText = () => {
    switch (type) {
      case 'product':
        return 'Product Image';
      case 'collection':
        return 'Collection Image';
      default:
        return 'Image';
    }
  };

  const displayText = text || getDefaultText();

  return (
    <div 
      className={`${styles.placeholder} ${styles[type]} ${className}`}
      style={{ width, height }}
    >
      <div className={styles.content}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="9" cy="9" r="2"/>
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
        </svg>
        <span className={styles.text}>{displayText}</span>
      </div>
    </div>
  );
};

export default PlaceholderImage;
