'use client';

import React from 'react';
import Link from 'next/link';
import styles from './success.module.css';

export default function CheckoutSuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        {/* Success Icon */}
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        </div>

        {/* Success Message */}
        <h1 className={styles.title}>Order Placed Successfully!</h1>
        <p className={styles.message}>
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>

        {/* Order Details */}
        <div className={styles.orderDetails}>
          <h2>What's Next?</h2>
          <div className={styles.nextSteps}>
            <div className={styles.step}>
              <div className={styles.stepIcon}>📧</div>
              <div className={styles.stepContent}>
                <h3>Email Confirmation</h3>
                <p>You'll receive an order confirmation email within the next few minutes.</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}>📦</div>
              <div className={styles.stepContent}>
                <h3>Order Processing</h3>
                <p>We'll prepare your items for shipment within 1-2 business days.</p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepIcon}>🚚</div>
              <div className={styles.stepContent}>
                <h3>Shipping & Delivery</h3>
                <p>Your order will be shipped and delivered within 5-7 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Link href="/products" className={styles.continueShoppingBtn}>
            <svg className={styles.shopIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"/>
            </svg>
            Continue Shopping
          </Link>
          
          <Link href="/" className={styles.homeBtn}>
            <svg className={styles.homeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Support Information */}
        <div className={styles.supportInfo}>
          <h3>Need Help?</h3>
          <p>
            If you have any questions about your order, please 
            <Link href="/contact" className={styles.contactLink}> contact our support team</Link> 
            or call us at (555) 123-4567.
          </p>
        </div>
      </div>
    </div>
  );
}
