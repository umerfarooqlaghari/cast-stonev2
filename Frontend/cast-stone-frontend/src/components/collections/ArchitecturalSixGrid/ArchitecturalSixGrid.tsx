'use client';

import React from 'react';
import Link from 'next/link';
import { Collection } from '@/services/types/entities';
import styles from './ArchitecturalSixGrid.module.css';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';

interface Props {
  collections: Collection[]; // expect 6 items
}

const ArchitecturalSixGrid: React.FC<Props> = ({ collections }) => {
  // Defensive: only take first 6
  const cols = (collections || []).slice(0, 6);

  const imageFor = (c: Collection) => {
    const src = c.images && c.images.length > 0
      ? c.images[0]
      : 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop&crop=center&q=90';
    return getOptimizedImageUrl(src, 'full');
  };

  return (
    <section>
      <div className={styles.grid}>
        {/* Big left tile (collection 0) */}
        {cols[0] && (
          <Link href={`/collections/${cols[0].id}`} className={`${styles.tile} ${styles.big} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[0])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[0].name}</div>
          </Link>
        )}

        {/* Mid-top (1) */}
        {cols[1] && (
          <Link href={`/collections/${cols[1].id}`} className={`${styles.tile} ${styles.midTop} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[1])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[1].name}</div>
          </Link>
        )}

        {/* Right tall (2) */}
        {cols[2] && (
          <Link href={`/collections/${cols[2].id}`} className={`${styles.tile} ${styles.rightTall} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[2])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[2].name}</div>
          </Link>
        )}

        {/* Mid-bottom (3) */}
        {cols[3] && (
          <Link href={`/collections/${cols[3].id}`} className={`${styles.tile} ${styles.midBottom} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[3])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[3].name}</div>
          </Link>
        )}

        {/* Small tiles (4,5) */}
        {cols[4] && (
          <Link href={`/collections/${cols[4].id}`} className={`${styles.tile} ${styles.small1} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[4])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[4].name}</div>
          </Link>
        )}

        {cols[5] && (
          <Link href={`/collections/${cols[5].id}`} className={`${styles.tile} ${styles.small2} ${styles.link}`}>
            <div className={styles.imageBg} style={{ backgroundImage: `url(${imageFor(cols[5])})` }} />
            <div className={styles.overlay} />
            <div className={styles.title}>{cols[5].name}</div>
          </Link>
        )}

        {/* CTA tile */}
        <Link href="/contact" className={`${styles.tile} ${styles.cta} ${styles.link}`}>
          <div className={styles.ctaTile}>
            <div className={styles.ctaHeading}>Enquire about your next project</div>
            <div className={styles.ctaButton}>Speak to an expert →</div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default ArchitecturalSixGrid;
