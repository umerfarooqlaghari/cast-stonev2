/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import styles from './productImageGallery.module.css';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Use placeholder if no images provided
  const galleryImages = images.length > 0 
    ? images 
    : ['/images/placeholder-product.jpg'];

  const currentImage = galleryImages[selectedImageIndex];

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };

  const handleMainImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
    setIsZoomed(false);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  };

  return (
    <div className={styles.imageGallery}>
      {/* Main Image Display */}
      <div className={styles.mainImageContainer}>
        <img
          src={currentImage}
          alt={`${productName} - Image ${selectedImageIndex + 1}`}
          className={`${styles.mainImage} ${isZoomed ? styles.zoomed : ''}`}
          onClick={handleMainImageClick}
        />
        
        {/* Navigation Arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        {galleryImages.length > 1 && (
          <div className={styles.imageCounter}>
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        )}

        {/* Zoom Indicator */}
        <div className={styles.zoomIndicator}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="11" y1="8" x2="11" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Click to zoom
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {galleryImages.length > 1 && (
        <div className={styles.thumbnailContainer}>
          <div className={styles.thumbnailGrid}>
            {galleryImages.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${
                  index === selectedImageIndex ? styles.activeThumbnail : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Overlay */}
      {isZoomed && (
        <div className={styles.zoomOverlay} onClick={() => setIsZoomed(false)}>
          <div className={styles.zoomedImageContainer}>
            <img
              src={currentImage}
              alt={`${productName} - Zoomed view`}
              className={styles.zoomedImage}
            />
            <button
              className={styles.closeZoomButton}
              onClick={() => setIsZoomed(false)}
              aria-label="Close zoom view"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
