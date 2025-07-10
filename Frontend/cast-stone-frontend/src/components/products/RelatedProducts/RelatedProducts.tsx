/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/services/types/entities';
import styles from './relatedProducts.module.css';

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Card width + gap
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Card width + gap
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      updateScrollButtons();
      scrollContainer.addEventListener('scroll', updateScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', updateScrollButtons);
    }
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.relatedProducts}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>You May Also Like</h2>
        
        {products.length > 3 && (
          <div className={styles.scrollControls}>
            <button
              className={`${styles.scrollButton} ${!canScrollLeft ? styles.disabled : ''}`}
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
              className={`${styles.scrollButton} ${!canScrollRight ? styles.disabled : ''}`}
              onClick={scrollRight}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 18L15 12L9 6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div 
        className={styles.productsContainer}
        ref={scrollContainerRef}
      >
        <div className={styles.productsGrid}>
          {products.map((product) => {
            const mainImage = product.images && product.images.length > 0 
              ? product.images[0] 
              : '/images/placeholder-product.jpg';
            
            const isInStock = product.stock > 0;

            return (
              <div key={product.id} className={styles.productCard}>
                <Link href={`/products/${product.id}`} className={styles.productLink}>
                  <div className={styles.imageContainer}>
                    <img
                      src={mainImage}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    {!isInStock && (
                      <div className={styles.outOfStockOverlay}>
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.productInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    
                    <div className={styles.productDetails}>
                      <span className={styles.productCode}>
                        P-{product.id.toString().padStart(3, '0')}-AS
                      </span>
                      
                      <div className={styles.availability}>
                        {isInStock ? (
                          <span className={styles.inStock}>
                            Available in 14 Colors And 3 sizes
                          </span>
                        ) : (
                          <span className={styles.outOfStock}>
                            Currently Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.priceContainer}>
                      <span className={styles.price}>{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
