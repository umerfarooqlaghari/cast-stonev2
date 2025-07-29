'use client';

import React from 'react';
import { MagazineSection, MagazineGrid, MagazineCard } from '@/components/ui';
import styles from './catalog.module.css';

export default function CatalogPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <MagazineSection
        title="Product Catalog"
        subtitle="2024 Collection"
        description="Discover our exquisite collection of handcrafted cast stone pieces. Each item is meticulously crafted with attention to detail, bringing timeless elegance to your space."
        imageSrc="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop&crop=center"
        imageAlt="Cast stone products showcase"
        imagePosition="right"
        badge="New Arrivals"
        ctaButton={{
          text: "Explore Collection",
          href: "/products"
        }}
        className={styles.heroSection}
      />

      {/* Catalog Navigation */}
      <section className={styles.catalogNavigation}>
        <div className={styles.navigationContainer}>
          <div className={styles.navigationHeader}>
            <h2 className={styles.navigationTitle}>Browse Our Catalog</h2>
            <p className={styles.navigationSubtitle}>
              Choose how you&apos;d like to explore our collection
            </p>
          </div>

          <MagazineGrid columns={2} gap="large" className={styles.navigationGrid}>
            <MagazineCard
              title="All Products"
              description="Browse our complete product catalog with advanced filtering and search capabilities. Find exactly what you're looking for."
              imageSrc="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center"
              imageAlt="All products showcase"
              href="/products"
              variant="featured"
              badge="500+ Items"
            />

            <MagazineCard
              title="Collections"
              description="Explore our curated collections organized by style and application. Discover coordinated pieces that work beautifully together."
              imageSrc="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&crop=center"
              imageAlt="Collections showcase"
              href="/collections"
              variant="featured"
              badge="12 Collections"
            />
          </MagazineGrid>
        </div>
      </section>

      {/* Features Section */}
      <MagazineSection
        title="Advanced Catalog Features"
        description="Our catalog is designed with powerful tools to help you find exactly what you're looking for. From advanced search capabilities to detailed product specifications, we make browsing effortless."
        imageSrc="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop&crop=center"
        imageAlt="Catalog features showcase"
        imagePosition="left"
        className={styles.featuresSection}
      >
        <div className={styles.featuresList}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <div>
              <h4>Advanced Search</h4>
              <p>Find products by name, description, or tags</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
            </div>
            <div>
              <h4>Smart Filtering</h4>
              <p>Filter by collection, price, and availability</p>
            </div>
          </div>

          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <div>
              <h4>High-Quality Images</h4>
              <p>Multiple high-resolution images for each product</p>
            </div>
          </div>
        </div>
      </MagazineSection>

      {/* Call to Action Section */}
      <MagazineSection
        title="Start Exploring"
        description="Ready to discover your perfect cast stone pieces? Browse our complete catalog or explore our curated collections to find inspiration for your next project."
        imageSrc="https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=600&h=400&fit=crop&crop=center"
        imageAlt="Beautiful cast stone installation"
        imagePosition="right"
        ctaButton={{
          text: "Browse All Products",
          href: "/products"
        }}
        className={styles.ctaSection}
      />
    </div>
  );
}
