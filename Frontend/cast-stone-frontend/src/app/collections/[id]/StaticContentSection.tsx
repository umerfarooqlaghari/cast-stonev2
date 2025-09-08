'use client';

import React from 'react';
import Image from 'next/image';
import styles from './collectionPage.module.css';

export interface StaticContentProps {
  header?: string | null;
  paragraph1?: string | null;
  paragraph2?: string | null;
  paragraph3?: string | null;
  backgroundImage?: string | null;
}

const StaticContentSection: React.FC<StaticContentProps> = ({
  header,
  paragraph1,
  paragraph2,
  paragraph3,
  backgroundImage
}) => {
  // Render nothing if no content provided
  if (!header && !paragraph1 && !paragraph2 && !paragraph3) return null;

  // Default background image if none provided
  const defaultBackgroundImage = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=600&fit=crop&crop=center";
  const imageSource = backgroundImage || defaultBackgroundImage;

  return (
    <section className={styles.staticContentSection}>
      {/* Full-scale background image */}
      <div className={styles.staticBackgroundContainer}>
        <Image
          src={imageSource}
          alt="Static content background"
          fill
          className={styles.staticBackgroundImage}
          sizes="100vw"
          priority={false}
        />

        {/* Optional overlay for better text readability */}
        <div className={styles.staticOverlay} />
      </div>

      {/* Content box positioned on top-left */}
      <div className={styles.staticContentBox}>
        <article className={styles.staticTextBlock}>
          {header && <h3 className={styles.staticContentHeader}>{header}</h3>}
          {paragraph1 && <p className={styles.staticContentParagraph}>{paragraph1}</p>}
          {paragraph2 && <p className={styles.staticContentParagraph}>{paragraph2}</p>}
          {paragraph3 && <p className={styles.staticContentParagraph}>{paragraph3}</p>}
        </article>
      </div>
    </section>
  );
};

export default StaticContentSection;
