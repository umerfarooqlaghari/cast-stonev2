'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import styles from './ZigzagContentSection.module.css';

export interface ZigzagContentItem {
  id: string;
  title: string;
  content: string[];
  imageSrc: string;
  imageAlt: string;
}

interface ZigzagContentSectionProps {
  items: ZigzagContentItem[];
  className?: string;
  maxItems?: number; // Limit to maximum number of items (default: 3)
}

// Letter Container Component with folding animation (similar to Our Story)
const LetterContainer: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={styles.letterWrapper}>
      <motion.div
        className={styles.letterContainer}
        initial={{
          rotateX: -90,
          transformOrigin: "top center",
          opacity: 0,
          scale: 0.8
        }}
        animate={isInView ? {
          rotateX: 0,
          opacity: 1,
          scale: 1
        } : {}}
        transition={{
          duration: 1.2,
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: 0.6, delay: delay + 0.3 }
        }}
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Letter fold line effect */}
        <motion.div
          className={styles.letterFoldLine}
          initial={{ scaleX: 1, opacity: 0.8 }}
          animate={isInView ? { scaleX: 0, opacity: 0 } : {}}
          transition={{ duration: 0.8, delay: delay + 0.4 }}
        />
        {children}
      </motion.div>
    </div>
  );
};

const ZigzagContentSection: React.FC<ZigzagContentSectionProps> = ({ 
  items, 
  className = '',
  maxItems = 3 
}) => {
  // Limit items to maxItems
  const limitedItems = items.slice(0, maxItems);

  if (limitedItems.length === 0) {
    return null;
  }

  return (
    <section className={`${styles.zigzagSection} ${className}`}>
      <div className={styles.container}>
        {limitedItems.map((item, index) => {
          const isReverse = index % 2 === 1; // Alternate layout: even indices = normal, odd indices = reverse
          
          return (
            <LetterContainer key={item.id} delay={index * 0.3}>
              <div className={`${styles.contentItem} ${isReverse ? styles.contentItemReverse : ''}`}>
                {/* Image Container */}
                <div className={styles.imageContainer}>
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    className={styles.contentImage}
                    width={600}
                    height={400}
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Content Container */}
                <div className={styles.contentContainer}>
                  <h2 className={styles.contentTitle}>{item.title}</h2>
                  {item.content.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className={styles.contentText}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </LetterContainer>
          );
        })}
      </div>
    </section>
  );
};

export default ZigzagContentSection;
