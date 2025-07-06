'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import styles from './cartSummary.module.css';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  showClearButton?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  showCheckoutButton = true,
  showClearButton = true,
}) => {
  const { state, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!state.cart || state.cart.cartItems.length === 0) {
    return null;
  }

  const subtotal = state.cart.totalAmount;
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className={styles.cartSummary}>
      <h2 className={styles.title}>Order Summary</h2>
      
      <div className={styles.summaryDetails}>
        {/* Items Count */}
        <div className={styles.summaryRow}>
          <span className={styles.label}>Items ({state.cart.totalItems})</span>
          <span className={styles.value}>{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className={styles.summaryRow}>
          <span className={styles.label}>
            Shipping
            {shipping === 0 && <span className={styles.freeShipping}> (Free)</span>}
          </span>
          <span className={styles.value}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>

        {/* Tax */}
        <div className={styles.summaryRow}>
          <span className={styles.label}>Tax</span>
          <span className={styles.value}>{formatPrice(tax)}</span>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Total */}
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{formatPrice(total)}</span>
        </div>
      </div>

      {/* Free Shipping Notice */}
      {shipping > 0 && (
        <div className={styles.shippingNotice}>
          <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
          <span>
            Add {formatPrice(100 - subtotal)} more for free shipping
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        {showCheckoutButton && (
          <Link href="/checkout" className={styles.checkoutBtn}>
            <svg className={styles.checkoutIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 12l2 2 4-4"/>
            </svg>
            Proceed to Checkout
          </Link>
        )}

        {showClearButton && (
          <button
            onClick={handleClearCart}
            disabled={state.isLoading}
            className={styles.clearBtn}
          >
            <svg className={styles.clearIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            Clear Cart
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className={styles.securityNotice}>
        <svg className={styles.securityIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        <span>Secure Checkout</span>
      </div>
    </div>
  );
};

export default CartSummary;
