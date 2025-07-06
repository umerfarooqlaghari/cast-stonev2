/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/services/types/entities';
import { useCart } from '@/contexts/CartContext';
import styles from './productCard.module.css';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  showViewDetails?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  showViewDetails = true,
}) => {
  const { addToCart, state } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
      // You could add a toast notification here
    } catch (error) {
      console.error('Error adding to cart:', error);
      // You could add error notification here
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

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/images/placeholder-product.jpg';

  const isInStock = product.stock > 0;

  return (
    <div className={styles.productCard}>
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
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        
        {product.description && (
          <p className={styles.productDescription}>
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description}
          </p>
        )}

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.collection && (
            <span className={styles.collection}>{product.collection.name}</span>
          )}
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

export default ProductCard;
