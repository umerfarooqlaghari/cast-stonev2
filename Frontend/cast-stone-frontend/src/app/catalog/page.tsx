'use client';

import React from 'react';
import Link from 'next/link';
import styles from './catalog.module.css';

export default function CatalogPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Product Catalog</h1>
        <p className={styles.subtitle}>
          Browse our complete collection of cast stone products and collections
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.catalogOptions}>
          <Link href="/products" className={styles.catalogCard}>
            <div className={styles.cardIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3>All Products</h3>
            <p>Browse our complete product catalog with advanced filtering and search</p>
            <span className={styles.cardAction}>View Products →</span>
          </Link>

          <Link href="/collections" className={styles.catalogCard}>
            <div className={styles.cardIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3>Collections</h3>
            <p>Explore our curated collections organized by style and application</p>
            <span className={styles.cardAction}>View Collections →</span>
          </Link>
        </div>

        <div className={styles.features}>
          <h2>Catalog Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.feature}>
              <h4>Advanced Search</h4>
              <p>Find products by name, description, or tags with powerful search functionality</p>
            </div>
            <div className={styles.feature}>
              <h4>Filter by Collection</h4>
              <p>Browse products within specific collections to find matching pieces</p>
            </div>
            <div className={styles.feature}>
              <h4>Price Range Filtering</h4>
              <p>Set your budget and find products within your price range</p>
            </div>
            <div className={styles.feature}>
              <h4>Stock Availability</h4>
              <p>See real-time stock levels and filter for in-stock items only</p>
            </div>
            <div className={styles.feature}>
              <h4>Detailed Specifications</h4>
              <p>Access comprehensive product details, dimensions, and technical specifications</p>
            </div>
            <div className={styles.feature}>
              <h4>High-Quality Images</h4>
              <p>View multiple high-resolution images for each product</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
