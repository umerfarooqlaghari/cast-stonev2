/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/services/types/entities';
import { useCart } from '@/contexts/CartContext';
import { useWholesaleAuth } from '@/contexts/WholesaleAuthContext';
import { getOptimizedImageUrl, getFallbackImageUrl } from '@/utils/cloudinaryUtils';
import styles from './magazineProductCard.module.css';

interface MagazineProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showViewDetails?: boolean;
  variant?: 'default' | 'featured' | 'compact';
  imagePosition?: 'top' | 'left' | 'right';
}

const MagazineProductCard: React.FC<MagazineProductCardProps> = ({
  product,
  showAddToCart = true,
  showViewDetails = true,
  variant = 'default',
  imagePosition = 'top'
}) => {
  const { addToCart, state } = useCart();
  const { isApprovedWholesaleBuyer } = useWholesaleAuth();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when wholesale status changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [isApprovedWholesaleBuyer]);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Determine which price to display
  const displayPrice = isApprovedWholesaleBuyer && product.wholeSalePrice
    ? product.wholeSalePrice
    : product.price;

  const showWholesaleLabel = isApprovedWholesaleBuyer && product.wholeSalePrice;

  // Get optimized image URL for card display
  const mainImage = product.images && product.images.length > 0
    ? getOptimizedImageUrl(product.images[0], 'card')
    : getFallbackImageUrl('product');

  const isInStock = product.stock > 0;

  const cardClass = `${styles.productCard} ${styles[variant]} ${styles[imagePosition]}`;

  return (
    <div className={cardClass}>
      {/* Product Image */}
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
        {showWholesaleLabel && (
          <div className={styles.wholesaleBadge}>
            Wholesale
          </div>
        )}
        <div className={styles.imageOverlay}></div>
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          {product.collection && (
            <span className={styles.collection}>{product.collection.name}</span>
          )}
          <h3 className={styles.productName}>{product.name}</h3>
        </div>
        
        {product.description && (
          <p className={styles.productDescription}>
            {product.description.length > 120 
              ? `${product.description.substring(0, 120)}...` 
              : product.description}
          </p>
        )}

        <div className={styles.priceContainer}>
          <div className={styles.priceSection}>
            <span className={styles.price}>{formatPrice(displayPrice)}</span>
            {isApprovedWholesaleBuyer && product.wholeSalePrice && (
              <span className={styles.retailPrice}>
                Retail: {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* Stock Info */}
        <div className={styles.stockInfo}>
          {isInStock ? (
            <span className={styles.inStock}>
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {showViewDetails && (
            <Link href={`/products/${product.id}`} className={styles.viewDetailsBtn}>
              View Details
            </Link>
          )}
          
          {showAddToCart && isInStock && (
            <div className={styles.addToCartSection}>
              <div className={styles.quantitySelector}>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.quantityBtn}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantity}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={styles.quantityBtn}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || state.isLoading}
                className={styles.addToCartBtn}
              >
                {isAddingToCart ? (
                  <span className={styles.loading}>Adding...</span>
                ) : (
                  <>
                    <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagazineProductCard;
