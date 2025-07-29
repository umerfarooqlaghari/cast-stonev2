'use client';

import React, { useState, useEffect } from 'react';
import { Collection } from '@/services/types/entities';
import { collectionService } from '@/services';
import { MagazineSection, MagazineGrid, MagazineCard } from '@/components/ui';
import styles from './collections.module.css';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const data = await collectionService.get.getPublished();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading collections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <h1>Error Loading Collections</h1>
          <p>{error}</p>
          <button onClick={fetchCollections} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <MagazineSection
        title="Our Collections"
        subtitle="Curated Cast Stone Collections"
        description="Discover our thoughtfully curated collections of cast stone products. Each collection tells a unique story, bringing together pieces that complement each other in style, texture, and purpose."
        imageSrc="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center"
        imageAlt="Beautiful cast stone collection showcase"
        imagePosition="left"
        badge={`${collections.length} Collections`}
        className={styles.heroSection}
      />

      {/* Collections Grid Section */}
      <section className={styles.collectionsSection}>
        <div className={styles.collectionsContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Browse Collections</h2>
            <p className={styles.sectionSubtitle}>
              Each collection represents a carefully curated selection of pieces designed to work harmoniously together
            </p>
          </div>

          {collections.length > 0 ? (
            <MagazineGrid columns={3} gap="large" className={styles.collectionsGrid}>
              {collections.map((collection, index) => (
                <MagazineCard
                  key={collection.id}
                  title={collection.name}
                  description={collection.description || "Explore this beautiful collection of cast stone pieces"}
                  imageSrc={collection.images && collection.images.length > 0
                    ? collection.images[0]
                    : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop&crop=center"}
                  imageAlt={collection.name}
                  href={`/collections/${collection.id}`}
                  variant={index === 0 ? "featured" : "default"}
                  className={styles.collectionCard}
                />
              ))}
            </MagazineGrid>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="9" cy="9" r="2"/>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>
              </div>
              <h3>No Collections Available</h3>
              <p>Check back soon for new collections of beautiful cast stone pieces.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <MagazineSection
        title="Can&apos;t Find What You&apos;re Looking For?"
        description="Browse our complete product catalog to discover individual pieces, or contact us to discuss custom collections tailored to your specific needs."
        imageSrc="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop&crop=center"
        imageAlt="Custom cast stone pieces"
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
