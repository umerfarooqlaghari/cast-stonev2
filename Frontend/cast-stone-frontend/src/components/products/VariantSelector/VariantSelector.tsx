'use client';

import React from 'react';
import { ProductVariant } from '@/services/types/entities';
import styles from './variantSelector.module.css';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: number | null;
  onVariantChange: (variantId: number | null) => void;
  required?: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({ 
  variants, 
  selectedVariantId, 
  onVariantChange,
  required = false
}) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  const selectedVariant = variants.find(v => v.id === selectedVariantId);

  return (
    <div className={styles.variantSelector}>
      <div className={styles.selectorHeader}>
        <h3 className={styles.selectorTitle}>
          Select Variant {required && <span className={styles.required}>*</span>}
        </h3>
        {selectedVariant && (
          <span className={styles.selectedVariant}>{selectedVariant.variantName || `Variant ${selectedVariant.id}`}</span>
        )}
      </div>
      
      <div className={styles.variantGrid}>
        {variants.map((variant) => (
          <button
            key={variant.id}
            className={`${styles.variantOption} ${
              selectedVariantId === variant.id ? styles.selected : ''
            }`}
            onClick={() => onVariantChange(variant.id)}
            title={variant.variantDescription || variant.variantName || `Variant ${variant.id}`}
            aria-label={`Select ${variant.variantName || `Variant ${variant.id}`}`}
          >
            {variant.variantImages && variant.variantImages.length > 0 && (
              <div className={styles.variantImageWrapper}>
                <img 
                  src={variant.variantImages[0]} 
                  alt={variant.variantName || `Variant ${variant.id}`}
                  className={styles.variantImage}
                />
              </div>
            )}
            <div className={styles.variantInfo}>
              <span className={styles.variantName}>
                {variant.variantName || `Variant ${variant.id}`}
              </span>
              {variant.variantIdentity && (
                <span className={styles.variantIdentity}>{variant.variantIdentity}</span>
              )}
              <span className={styles.variantPrice}>
                ${variant.variantPrice.toFixed(2)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {required && !selectedVariantId && (
        <p className={styles.requiredMessage}>
          Please select a variant before adding to cart
        </p>
      )}
    </div>
  );
};

export default VariantSelector;

