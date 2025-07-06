'use client';

import React, { useState } from 'react';
import { CartItem as CartItemType } from '@/services/types/entities';
import { useCart } from '@/contexts/CartContext';
import styles from './cartItem.module.css';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateCartItem, removeFromCart, state } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || !item.product) return;
    
    if (newQuantity > item.product.stock) {
      alert(`Only ${item.product.stock} items available in stock`);
      return;
    }

    try {
      setIsUpdating(true);
      await updateCartItem(item.productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await removeFromCart(item.productId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!item.product) {
    return null;
  }

  const mainImage = item.product.images && item.product.images.length > 0 
    ? item.product.images[0] 
    : '/images/placeholder-product.jpg';

  const itemTotal = item.quantity * item.product.price;

  return (
    <div className={styles.cartItem}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <img
          src={mainImage}
          alt={item.product.name}
          className={styles.productImage}
        />
      </div>

      {/* Product Details */}
      <div className={styles.productDetails}>
        <h3 className={styles.productName}>{item.product.name}</h3>
        
        {item.product.description && (
          <p className={styles.productDescription}>
            {item.product.description.length > 150 
              ? `${item.product.description.substring(0, 150)}...` 
              : item.product.description}
          </p>
        )}

        <div className={styles.productMeta}>
          <span className={styles.unitPrice}>
            {formatPrice(item.product.price)} each
          </span>
          {item.product.collection && (
            <span className={styles.collection}>
              {item.product.collection.name}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={styles.stockStatus}>
          {item.product.stock > 0 ? (
            <span className={styles.inStock}>
              {item.product.stock > 10 ? 'In Stock' : `Only ${item.product.stock} left`}
            </span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className={styles.quantitySection}>
        <label className={styles.quantityLabel}>Quantity</label>
        <div className={styles.quantityControls}>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating || state.isLoading}
            className={styles.quantityBtn}
          >
            -
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            type="button"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock || isUpdating || state.isLoading}
            className={styles.quantityBtn}
          >
            +
          </button>
        </div>
        {isUpdating && (
          <span className={styles.updating}>Updating...</span>
        )}
      </div>

      {/* Price Section */}
      <div className={styles.priceSection}>
        <div className={styles.itemTotal}>
          {formatPrice(itemTotal)}
        </div>
        <div className={styles.priceBreakdown}>
          {item.quantity} × {formatPrice(item.product.price)}
        </div>
      </div>

      {/* Remove Button */}
      <div className={styles.removeSection}>
        <button
          onClick={handleRemove}
          disabled={isRemoving || state.isLoading}
          className={styles.removeBtn}
          title="Remove from cart"
        >
          {isRemoving ? (
            <span className={styles.removing}>...</span>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
