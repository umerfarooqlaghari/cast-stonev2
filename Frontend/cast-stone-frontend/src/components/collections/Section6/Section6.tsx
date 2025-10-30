/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './section6.module.css';

interface Section6Props {
  header: string;
  content: string;
  imageSrc: string;
  collectionName: string;
  ctaButtonText?: string | null;
  ctaButtonLink?: string | null;
}

const Section6: React.FC<Section6Props> = ({
  header,
  content,
  imageSrc,
  collectionName,
  ctaButtonText,
  ctaButtonLink
}) => {
  // Parse content into paragraphs or bullet points
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Check if content contains bullet points or list items
  const isList = lines.some(line => 
    line.trim().startsWith('•') || 
    line.trim().startsWith('-') || 
    line.trim().startsWith('*') ||
    /^\d+\./.test(line.trim())
  );

  // Parse into structured content
  let mainParagraph = '';
  let listItems: string[] = [];
  const subheadings: { title: string; content: string }[] = [];

  if (isList) {
    // Find the main paragraph (before list items)
    const firstListIndex = lines.findIndex(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') || 
      line.trim().startsWith('*') ||
      /^\d+\./.test(line.trim())
    );
    
    if (firstListIndex > 0) {
      mainParagraph = lines.slice(0, firstListIndex).join(' ');
    }
    
    // Extract list items
    listItems = lines
      .slice(firstListIndex >= 0 ? firstListIndex : 0)
      .filter(line => 
        line.trim().startsWith('•') || 
        line.trim().startsWith('-') || 
        line.trim().startsWith('*') ||
        /^\d+\./.test(line.trim())
      )
      .map(line => line.replace(/^[•\-*\d.]\s*/, '').trim());
  } else {
    // Check for subheadings (lines ending with ? or :)
    let currentSubheading = '';
    let currentContent = '';
    
    lines.forEach((line, index) => {
      if (line.trim().endsWith('?') || line.trim().endsWith(':')) {
        if (currentSubheading) {
          subheadings.push({ title: currentSubheading, content: currentContent.trim() });
        }
        currentSubheading = line.trim();
        currentContent = '';
      } else {
        if (currentSubheading) {
          currentContent += line + ' ';
        } else {
          mainParagraph += line + ' ';
        }
      }
    });
    
    if (currentSubheading) {
      subheadings.push({ title: currentSubheading, content: currentContent.trim() });
    }
  }

  return (
    <section className={styles.section6}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left: Image */}
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

          {/* Right: Content */}
          <div className={styles.contentColumn}>
            <h2 className={styles.header}>{header}</h2>
            
            {mainParagraph && (
              <p className={styles.mainParagraph}>{mainParagraph.trim()}</p>
            )}

            {/* Render list items if present */}
            {listItems.length > 0 && (
              <ul className={styles.list}>
                {listItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {/* Render subheadings if present */}
            {subheadings.length > 0 && (
              <div className={styles.subheadings}>
                {subheadings.map((section, index) => (
                  <div key={index} className={styles.subheadingSection}>
                    <h3 className={styles.subheadingTitle}>{section.title}</h3>
                    <p className={styles.subheadingContent}>{section.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dynamic CTA Button or Default */}
            {ctaButtonText && ctaButtonLink ? (
              <Link
                href={ctaButtonLink}
                className={styles.contactButton}
              >
                {ctaButtonText}
              </Link>
            ) : (
              <Link
                href="/contact"
                className={styles.contactButton}
              >
                Contact Us
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section6;

