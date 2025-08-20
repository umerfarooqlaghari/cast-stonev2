'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ElegantDescriptionSection.module.css';

interface ElegantDescriptionSectionProps {
  title?: string;
  description: string;
  className?: string;
}

const ElegantDescriptionSection: React.FC<ElegantDescriptionSectionProps> = ({
  title,
  description,
  className = ''
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Split description into paragraphs if it contains line breaks or is very long
  const paragraphs = description.split('\n').filter(p => p.trim().length > 0);
  
  // If no line breaks, split long descriptions into logical paragraphs
  const processedParagraphs = paragraphs.length === 1 && paragraphs[0].length > 300
    ? [paragraphs[0].substring(0, paragraphs[0].length / 2), paragraphs[0].substring(paragraphs[0].length / 2)]
    : paragraphs;

  return (
    <section className={`${styles.descriptionSection} ${className}`} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title && (
            <motion.div
              className={styles.titleContainer}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <h2 className={styles.title}>{title}</h2>
            </motion.div>
          )}

          <div className={styles.descriptionContainer}>
            {processedParagraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className={styles.descriptionText}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ 
                  duration: 0.6, 
                  delay: title ? 0.4 + (index * 0.1) : 0.2 + (index * 0.1), 
                  ease: "easeOut" 
                }}
              >
                {paragraph.trim()}
              </motion.p>
            ))}
          </div>

          {/* Decorative elements */}
          <motion.div
            className={styles.decorativeElements}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <div className={styles.decorativeCircle}></div>
            <div className={styles.decorativeLine}></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ElegantDescriptionSection;
