'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/services/types/entities';
import { collectionService } from '@/services';
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
        <div className={styles.loading}>Loading collections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Collections</h1>
        <p className={styles.subtitle}>
          Explore our curated collections of handcrafted cast stone pieces
        </p>
      </div>

      <div className={styles.collectionsGrid}>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.id}`}
            className={styles.collectionCard}
          >
            <div className={styles.imageContainer}>
              {collection.images && collection.images.length > 0 ? (
                <Image
                  src={collection.images[0]}
                  alt={collection.name}
                  className={styles.collectionImage}
                  width={350}
                  height={250}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.collectionName}>{collection.name}</h3>
              {collection.description && (
                <p className={styles.collectionDescription}>
                  {collection.description}
                </p>
              )}
              <div className={styles.cardFooter}>
                <span className={styles.viewCollection}>View Collection →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {collections.length === 0 && (
        <div className={styles.emptyState}>
          <h3>No collections available</h3>
          <p>Check back soon for new collections.</p>
        </div>
      )}
    </div>
  );
}
