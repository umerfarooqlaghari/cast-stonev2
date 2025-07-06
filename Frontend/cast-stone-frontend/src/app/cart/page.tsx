'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem/CartItem';
import CartSummary from '@/components/cart/CartSummary/CartSummary';
import styles from './cart.module.css';

export default function CartPage() {
  const { state } = useCart();

  if (state.isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!state.cart || state.cart.cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"/>
            </svg>
          </div>
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <p className={styles.emptyMessage}>
            Looks like you haven&apos;t added any items to your cart yet. 
            Start shopping to fill it up!
          </p>
          <Link href="/products" className={styles.shopNowBtn}>
            <svg className={styles.shopIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"/>
            </svg>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Shopping Cart</h1>
        <p className={styles.subtitle}>
          {state.cart.totalItems} {state.cart.totalItems === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      {/* Error Message */}
      {state.error && (
        <div className={styles.errorMessage}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      {/* Cart Content */}
      <div className={styles.cartContent}>
        {/* Cart Items */}
        <div className={styles.cartItems}>
          <div className={styles.itemsHeader}>
            <h2>Items</h2>
            <Link href="/products" className={styles.continueShoppingLink}>
              Continue Shopping
            </Link>
          </div>
          
          <div className={styles.itemsList}>
            {state.cart.cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className={styles.cartSummaryContainer}>
          <CartSummary />
        </div>
      </div>

      {/* Additional Actions */}
      <div className={styles.additionalActions}>
        <div className={styles.helpSection}>
          <h3>Need Help?</h3>
          <p>
            Have questions about your order? 
            <Link href="/contact" className={styles.contactLink}> Contact us</Link> 
            or call (555) 123-4567
          </p>
        </div>

        <div className={styles.shippingInfo}>
          <h3>Shipping Information</h3>
          <ul>
            <li>Free shipping on orders over $100</li>
            <li>Standard delivery: 5-7 business days</li>
            <li>Express delivery: 2-3 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
