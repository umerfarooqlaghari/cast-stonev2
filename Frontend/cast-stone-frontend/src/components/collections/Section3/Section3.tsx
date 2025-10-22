'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './section3.module.css';

interface Section3Props {
  header: string;
  content: string;
  imageSrc: string;
  collectionId: number;
  collectionName: string;
}

const Section3: React.FC<Section3Props> = ({
  header,
  content,
  imageSrc,
  collectionId,
  collectionName
}) => {
  // Parse content into paragraphs (split by double newlines or periods followed by capital letters)
  const paragraphs = content
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0)
    .map(p => p.trim());

  // If no natural paragraphs, try to split by sentences
  const contentParagraphs = paragraphs.length > 1 
    ? paragraphs 
    : content.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(p => p.trim().length > 0);

  return (
    <section className={styles.section3}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Content */}
          <div className={styles.contentColumn}>
            <h2 className={styles.header}>{header}</h2>
            
            <div className={styles.paragraphs}>
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Choose Your Style Link */}
            <Link 
              href={`/products?collectionId=${collectionId}`}
              className={styles.chooseStyleLink}
            >
              Choose Your Style →
            </Link>
          </div>

          {/* Right: Image */}
          <div className={styles.imageColumn}>
            <div className={styles.imageWrapper}>
              <Image
                src={imageSrc}
                alt={`${collectionName} - ${header}`}
                width={800}
                height={600}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section3;

