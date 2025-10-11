'use client';

import React from 'react';
import { Product } from '@/services/types/entities';
import MagazineProductCard from '../MagazineProductCard/MagazineProductCard';
import { MagazineGrid } from '@/components/ui';
import styles from './magazineProductGrid.module.css';

interface MagazineProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showAddToCart?: boolean;
  emptyMessage?: string;
  columns?: 1 | 2 | 3 | 4;
  cardTheme?: 'navy' | undefined;
  productVariantCounts?: Map<number, number>;
}

const MagazineProductGrid: React.FC<MagazineProductGridProps> = ({
  products,
  isLoading = false,
  showAddToCart = true,
  emptyMessage = 'No products found.',
  columns = 3,
  cardTheme,
  productVariantCounts,
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <MagazineGrid columns={columns} gap="large">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={styles.loadingCard}>
              <div className={styles.loadingImage}></div>
              <div className={styles.loadingContent}>
                <div className={styles.loadingBadge}></div>
                <div className={styles.loadingTitle}></div>
                <div className={styles.loadingDescription}></div>
                <div className={styles.loadingPrice}></div>
                <div className={styles.loadingButton}></div>
              </div>
            </div>
          ))}
        </MagazineGrid>
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
    <MagazineGrid columns={columns} gap="large" className={styles.productGrid}>
      {products.map((product, index) => {
        const variantCount = productVariantCounts?.get(product.id) || 0;
        const hasVariants = variantCount > 0;

        return (
          <MagazineProductCard
            key={product.id}
            product={product}
            showAddToCart={showAddToCart}
            variant={index === 0 ? "featured" : "default"}
            theme={cardTheme}
            hasVariants={hasVariants}
          />
        );
      })}
    </MagazineGrid>
  );
};

export default MagazineProductGrid;
