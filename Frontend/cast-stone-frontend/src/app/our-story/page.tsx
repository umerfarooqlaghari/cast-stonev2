'use client';

import React from 'react';
import styles from './ourStory.module.css';

const OurStoryPage: React.FC = () => {
  return (
    <div className={styles.storyPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>Our Story</h1>
          <p className={styles.heroSubtitle}>
            A legacy of craftsmanship, artistry, and timeless elegance spanning generations of master artisans.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          
          {/* Introduction */}
          <div className={styles.introSection}>
            <div className={styles.introContent}>
              <h2 className={styles.sectionTitle}>Crafting Timeless Beauty Since 1952</h2>
              <p className={styles.introText}>
                What began as a small family workshop in the heart of New England has evolved into one of the most 
                respected names in cast stone artistry. For over seven decades, Cast Stone has been dedicated to 
                creating architectural elements that transform spaces into works of art.
              </p>
              <p className={styles.introText}>
                Our journey started with a simple belief: that every space deserves to be extraordinary. This 
                philosophy continues to guide us today as we blend traditional craftsmanship with modern innovation 
                to create pieces that stand the test of time.
              </p>
            </div>
            <div className={styles.introImage}>
              <div className={styles.imagePlaceholder}>
                <span className={styles.imageText}>Historic Workshop 1952</span>
              </div>
            </div>
          </div>

          {/* Heritage Section */}
          <div className={styles.heritageSection}>
            <h2 className={styles.sectionTitle}>A Heritage of Excellence</h2>
            <div className={styles.heritageGrid}>
              <div className={styles.heritageCard}>
                <div className={styles.heritageIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className={styles.heritageTitle}>Master Craftsmanship</h3>
                <p className={styles.heritageText}>
                  Our artisans undergo years of training to master the ancient techniques of cast stone creation, 
                  ensuring every piece meets our exacting standards.
                </p>
              </div>

              <div className={styles.heritageCard}>
                <div className={styles.heritageIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h3 className={styles.heritageTitle}>Premium Materials</h3>
                <p className={styles.heritageText}>
                  We source only the finest natural materials, from limestone aggregates to specialized binders, 
                  creating pieces that age beautifully over time.
                </p>
              </div>

              <div className={styles.heritageCard}>
                <div className={styles.heritageIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <h3 className={styles.heritageTitle}>Custom Design</h3>
                <p className={styles.heritageText}>
                  Every project is unique. Our design team works closely with clients to create bespoke pieces 
                  that perfectly complement their architectural vision.
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Our Journey Through Time</h2>
            <div className={styles.timeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1952</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>The Beginning</h3>
                  <p className={styles.timelineText}>
                    Founded by master craftsman William Stone in a small workshop in Vermont, 
                    focusing on traditional limestone carving techniques.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1967</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>Innovation Era</h3>
                  <p className={styles.timelineText}>
                    Pioneered new cast stone techniques that allowed for more intricate designs 
                    while maintaining the durability of natural stone.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>1985</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>National Recognition</h3>
                  <p className={styles.timelineText}>
                    Expanded operations nationwide and received the National Craftsmanship Award 
                    for excellence in architectural stonework.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>2010</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>Modern Renaissance</h3>
                  <p className={styles.timelineText}>
                    Integrated cutting-edge technology with traditional methods, enabling 
                    precision casting and sustainable production practices.
                  </p>
                </div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineYear}>Today</div>
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>Legacy Continues</h3>
                  <p className={styles.timelineText}>
                    Now in our third generation of family ownership, we continue to push the 
                    boundaries of what&apos;s possible in cast stone artistry.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className={styles.valuesSection}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>Quality First</h3>
                <p className={styles.valueText}>
                  We never compromise on quality. Every piece undergoes rigorous testing and 
                  inspection to ensure it meets our exacting standards.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>Sustainable Practices</h3>
                <p className={styles.valueText}>
                  We&apos;re committed to environmental responsibility, using eco-friendly materials 
                  and processes that minimize our ecological footprint.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>Client Partnership</h3>
                <p className={styles.valueText}>
                  We believe in building lasting relationships with our clients, working as 
                  partners to bring their architectural visions to life.
                </p>
              </div>

              <div className={styles.valueCard}>
                <h3 className={styles.valueTitle}>Innovation</h3>
                <p className={styles.valueText}>
                  While honoring traditional techniques, we continuously innovate to create 
                  new possibilities in cast stone design and application.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>Ready to Create Something Extraordinary?</h2>
              <p className={styles.ctaText}>
                Let&apos;s discuss how our expertise and passion can bring your vision to life.
              </p>
              <div className={styles.ctaButtons}>
                <a href="/contact" className={styles.primaryButton}>
                  Start Your Project
                </a>
                <a href="/collections" className={styles.secondaryButton}>
                  View Our Work
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
