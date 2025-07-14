'use client';

import React from 'react';
import styles from './retailLocator.module.css';

export default function RetailLocatorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Retail Locator</h1>
        <p className={styles.subtitle}>
          Find authorized Cast Stone retailers and showrooms near you
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.comingSoon}>
          <div className={styles.icon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2>Store Locator Coming Soon</h2>
          <p>
            We&apos;re building an interactive map to help you find authorized Cast Stone retailers,
            showrooms, and installation partners in your area. This will include detailed
            information about each location, contact details, and available services.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h4>Interactive Map</h4>
              <p>Easy-to-use map interface with location search</p>
            </div>
            <div className={styles.feature}>
              <h4>Retailer Details</h4>
              <p>Contact information, hours, and available products</p>
            </div>
            <div className={styles.feature}>
              <h4>Installation Partners</h4>
              <p>Find certified installation professionals near you</p>
            </div>
          </div>
          <div className={styles.contactInfo}>
            <h3>Need Help Now?</h3>
            <p>Contact us directly for retailer recommendations in your area:</p>
            <div className={styles.contactDetails}>
              <div className={styles.contactItem}>
                <strong>Phone:</strong> 1-800-CAST-STONE
              </div>
              <div className={styles.contactItem}>
                <strong>Email:</strong> retailers@caststone.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
