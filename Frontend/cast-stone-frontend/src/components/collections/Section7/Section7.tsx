'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './section7.module.css';

interface Section7Props {
  header: string;
  content: string;
  imageSrc: string;
  collectionName: string;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
}

const Section7: React.FC<Section7Props> = ({
  header,
  content,
  imageSrc,
  collectionName,
  ctaButtonText,
  ctaButtonLink
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
    <section className={styles.section7}>
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

            {/* Dynamic CTA Button */}
            {ctaButtonText && ctaButtonLink && (
              <Link 
                href={ctaButtonLink}
                className={styles.ctaLink}
              >
                {ctaButtonText} →
              </Link>
            )}
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

export default Section7;

