'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ourStory.module.css';

const OurStoryPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Banner images array
  const bannerImages = [
    '/images/CollectionBackground.jpg',
    '/images/CollectionBackground2.jpg',
    '/images/CollectionBackground3.jpg',
    '/images/catalog-banner-bg.jpg'
  ];

  // Auto-rotate banner images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % bannerImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  // Timeline data
  const timelineData = [
    {
      year: '2010',
      title: 'Foundation',
      description: 'Cast Stone was founded with a vision to revolutionize architectural stone design and manufacturing.'
    },
    {
      year: '2012',
      title: 'First Major Project',
      description: 'Completed our first large-scale commercial project, establishing our reputation in the industry.'
    },
    {
      year: '2015',
      title: 'Innovation Breakthrough',
      description: 'Developed proprietary casting techniques that enhanced durability and aesthetic appeal.'
    },
    {
      year: '2018',
      title: 'International Expansion',
      description: 'Expanded operations internationally, bringing our expertise to global markets.'
    },
    {
      year: '2020',
      title: 'Sustainable Practices',
      description: 'Implemented eco-friendly manufacturing processes and sustainable material sourcing.'
    },
    {
      year: '2023',
      title: 'Digital Innovation',
      description: 'Launched advanced digital design tools and virtual consultation services.'
    },
    {
      year: '2024',
      title: 'Industry Leadership',
      description: 'Recognized as industry leader with over 500 successful projects worldwide.'
    }
  ];

  return (
    <div className={styles.storyPage}>
      {/* Hero Banner Section */}
      <section className={styles.heroSection}>
        <div className={styles.bannerContainer}>
          {bannerImages.map((image, index) => (
            <motion.div
              key={index}
              className={styles.bannerImage}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1.05 : 1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                backgroundImage: `url(${image})`,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: index === currentImageIndex ? 1 : 0
              }}
            />
          ))}

          <div className={styles.heroOverlay}>
            <div className={styles.heroContainer}>
              <motion.h1
                className={styles.heroTitle}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                Our Story
              </motion.h1>
              <motion.p
                className={styles.heroSubtitle}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                In 2010, the world of architectural stone made the discovery of a new brand.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Breadcrumb */}
      <section className={styles.breadcrumbSection}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <span>The Company</span>
            <span>•</span>
            <span className={styles.currentPage}>Our Story</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.container}>

          {/* Timeline Section */}
          <section className={styles.timelineSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Our Journey</h2>
            </div>

            <div className={styles.timelineContainer}>
              {timelineData.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={styles.timelineYear}>
                    <span>{item.year}</span>
                  </div>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                    <p className={styles.timelineDescription}>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Vision Section */}
          <section className={styles.visionSection}>
            <motion.div
              className={styles.visionContent}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.visionTitle}>A vision of architectural excellence</h2>
              <p className={styles.visionText}>
                At Cast Stone, we believe that exceptional architecture begins with exceptional materials.
                Our journey started with a simple yet profound vision: to create cast stone products that
                not only meet the highest standards of quality and durability but also inspire architects
                and designers to push the boundaries of what&apos;s possible.
              </p>
              <p className={styles.visionText}>
                From our humble beginnings to becoming an industry leader, we have remained committed to
                innovation, craftsmanship, and sustainability. Every piece we create tells a story of
                dedication, precision, and artistic vision.
              </p>
            </motion.div>
          </section>

          {/* Expertise Section */}
          <section className={styles.expertiseSection}>
            <motion.div
              className={styles.expertiseContent}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.expertiseTitle}>The fruition of decades of experience</h2>
              <p className={styles.expertiseText}>
                Our expertise in cast stone manufacturing represents the culmination of years of research,
                development, and hands-on experience. We have mastered the art of combining traditional
                craftsmanship with cutting-edge technology to create products that stand the test of time.
              </p>
              <p className={styles.expertiseText}>
                This deep understanding of materials, combined with our passion for architectural innovation
                and our commitment to excellence, means that every Cast Stone product exceeds expectations
                in both form and function.
              </p>
            </motion.div>
          </section>

          {/* Partnership Section */}
          <section className={styles.partnershipSection}>
            <motion.div
              className={styles.partnershipContent}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.partnershipTitle}>Building lasting partnerships</h2>
              <p className={styles.partnershipText}>
                Our success is built on strong partnerships with architects, designers, contractors, and
                clients who share our vision for excellence. We work closely with each partner to understand
                their unique requirements and deliver solutions that exceed expectations.
              </p>
              <p className={styles.partnershipText}>
                These collaborative relationships have been the foundation of our growth and continue to
                drive innovation in everything we do. Together, we create architectural masterpieces that
                define skylines and inspire communities.
              </p>
            </motion.div>
          </section>

          {/* Success Formula Section */}
          <section className={styles.successSection}>
            <motion.div
              className={styles.successContent}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className={styles.successTitle}>A successful formula</h2>
              <p className={styles.successText}>
                Those who understand the uncompromising quality of our visionary products have made Cast Stone
                an unequivocal success. Today, over a decade later, our product portfolio comprises more than
                200 unique designs, each crafted with the same passion and uncompromising principles that
                guided our first creation.
              </p>
            </motion.div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OurStoryPage;
