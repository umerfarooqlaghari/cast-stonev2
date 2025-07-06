'use client';

import React from 'react';
import { Product } from '@/services/types/entities';
import ProductCard from '../ProductCard/ProductCard';
import styles from './productGrid.module.css';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showAddToCart?: boolean;
  showViewDetails?: boolean;
  emptyMessage?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  showAddToCart = true,
  showViewDetails = true,
  emptyMessage = 'No products found.',
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingContent}>
                <div className={styles.loadingTitle}></div>
                <div className={styles.loadingDescription}></div>
                <div className={styles.loadingPrice}></div>
                <div className={styles.loadingButton}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>No Products Found</h3>
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showAddToCart={showAddToCart}
          showViewDetails={showViewDetails}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
