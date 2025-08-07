'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './ourStory.module.css';

const OurStoryPage: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedYear, setSelectedYear] = useState(0);

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

  // Timeline data with images
  const timelineData = [
    {
      year: '2010',
      title: 'Foundation',
      description: 'Cast Stone was founded with a vision to revolutionize architectural stone design and manufacturing. Our journey began with a commitment to excellence and innovation in every piece we create.',
      image: '/images/CollectionBackground.jpg'
    },
    {
      year: '2012',
      title: 'First Major Project',
      description: 'Completed our first large-scale commercial project, establishing our reputation in the industry. This milestone project showcased our capabilities and set the foundation for future growth.',
      image: '/images/CollectionBackground2.jpg'
    },
    {
      year: '2015',
      title: 'Innovation Breakthrough',
      description: 'Developed proprietary casting techniques that enhanced durability and aesthetic appeal. Our research and development team achieved breakthrough innovations that set new industry standards.',
      image: '/images/CollectionBackground3.jpg'
    },
    {
      year: '2018',
      title: 'International Expansion',
      description: 'Expanded operations internationally, bringing our expertise to global markets. We established partnerships worldwide and began serving clients across multiple continents.',
      image: '/images/catalog-banner-bg.jpg'
    },
    {
      year: '2020',
      title: 'Sustainable Practices',
      description: 'Implemented eco-friendly manufacturing processes and sustainable material sourcing. Our commitment to environmental responsibility became a cornerstone of our operations.',
      image: '/images/CollectionBackground.jpg'
    },
    {
      year: '2023',
      title: 'Digital Innovation',
      description: 'Launched advanced digital design tools and virtual consultation services. We embraced technology to enhance customer experience and streamline our design process.',
      image: '/images/CollectionBackground2.jpg'
    },
    {
      year: '2024',
      title: 'Industry Leadership',
      description: 'Recognized as industry leader with over 500 successful projects worldwide. Our dedication to quality and innovation has established us as the premier choice for architectural stone solutions.',
      image: '/images/CollectionBackground3.jpg'
    }
  ];

  // Scroll to next section
  const scrollToTimeline = () => {
    const timelineSection = document.getElementById('timeline-section');
    if (timelineSection) {
      timelineSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate timeline
  const navigateTimeline = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedYear > 0) {
      setSelectedYear(selectedYear - 1);
    } else if (direction === 'next' && selectedYear < timelineData.length - 1) {
      setSelectedYear(selectedYear + 1);
    }
  };

  return (
    <div className={styles.storyPage}>
      {/* Section 1: Hero Banner Section */}
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

          <div className={styles.heroContent}>
            <div className={styles.heroTextContainer}>
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

            {/* Scroll Arrow */}
            <motion.div
              className={styles.scrollArrow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              onClick={scrollToTimeline}
            >
              <div className={styles.arrowIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.arrowText}>Explore Our Journey</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Timeline Section */}
      <section id="timeline-section" className={styles.timelineSection}>
        <div className={styles.timelineBackground}>
          <div className={styles.timelineHeader}>
            <h2 className={styles.timelineTitle}>TIMELINE</h2>

            {/* Year Navigation */}
            <div className={styles.yearNavigation}>
              {timelineData.map((item, index) => (
                <button
                  key={item.year}
                  className={`${styles.yearButton} ${index === selectedYear ? styles.yearButtonActive : ''}`}
                  onClick={() => setSelectedYear(index)}
                >
                  {item.year}
                </button>
              ))}
              <button className={styles.moreButton}>
                More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Timeline Content */}
          <div className={styles.timelineContentContainer}>
            <motion.div
              key={selectedYear}
              className={styles.timelineContent}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineImageContainer}>
                <Image
                  src={timelineData[selectedYear].image}
                  alt={timelineData[selectedYear].title}
                  className={styles.timelineImage}
                  width={600}
                  height={400}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className={styles.timelineTextContainer}>
                <div className={styles.timelineYear}>{timelineData[selectedYear].year}</div>
                <h3 className={styles.timelineItemTitle}>{timelineData[selectedYear].title}</h3>
                <p className={styles.timelineDescription}>{timelineData[selectedYear].description}</p>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <div className={styles.timelineNavigation}>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={() => navigateTimeline('prev')}
                disabled={selectedYear === 0}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={() => navigateTimeline('next')}
                disabled={selectedYear === timelineData.length - 1}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Vision & Innovation Section */}
      <section className={styles.visionSection}>
        <div className={styles.visionContainer}>

          {/* First Blog - Image Left, Text Right */}
          <motion.div
            className={styles.blogItem}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className={styles.blogImageContainer}>
              <Image
                src="/images/CollectionBackground.jpg"
                alt="Vision of Architectural Excellence"
                className={styles.blogImage}
                width={600}
                height={400}
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className={styles.blogContent}>
              <h2 className={styles.blogTitle}>A VISION OF ARCHITECTURAL EXCELLENCE</h2>
              <p className={styles.blogText}>
                At the age of fifty, Cast Stone decided to create its own brand, with the
                idea of pushing watchmaking beyond anything that existed at the time,
                with a new contemporary approach to horology. We was planning to
                develop one product: the watch of his dreams, an approach that involved
                operating with little regard for production costs, which were excessive.
              </p>
              <p className={styles.blogText}>
                When released in 2001, this extraordinary timepiece with its ergonomic
                tonneau case design punctuated with distinctive torque screws and a
                compelling six-digit price tag, immediately placed the fledgling brand at
                the highest summit of the entire luxury watch market.
              </p>
            </div>
          </motion.div>

          {/* Second Blog - Text Left, Image Right */}
          <motion.div
            className={`${styles.blogItem} ${styles.blogItemReverse}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className={styles.blogContent}>
              <h2 className={styles.blogTitle}>INNOVATION THROUGH CRAFTSMANSHIP</h2>
              <p className={styles.blogText}>
                Our commitment to innovation extends beyond traditional boundaries. Each piece
                we create represents a perfect fusion of time-honored craftsmanship techniques
                and cutting-edge technology. This approach allows us to achieve unprecedented
                levels of precision and aesthetic refinement.
              </p>
              <p className={styles.blogText}>
                The result is a collection of architectural stone products that not only meet
                the most demanding technical specifications but also inspire architects and
                designers to explore new possibilities in their creative endeavors. Every
                project becomes a testament to our unwavering pursuit of excellence.
              </p>
            </div>

            <div className={styles.blogImageContainer}>
              <Image
                src="/images/CollectionBackground2.jpg"
                alt="Innovation Through Craftsmanship"
                className={styles.blogImage}
                width={600}
                height={400}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </motion.div>

          {/* Third Blog - Quote Section with Dark Background */}
          <motion.div
            className={styles.quoteSection}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className={styles.quoteContainer}>
              <div className={styles.quoteContent}>
                <blockquote className={styles.quote}>
                  &ldquo;For a long time, I wished to create something extraordinary in architectural stone. I wanted to develop a new approach, far removed
                  from traditional manufacturing methods, something totally innovative.
                  My goal was to establish a new standard of excellence within the architectural stone industry, and I was
                  very eager to see what could be achieved!&rdquo;
                </blockquote>
                <cite className={styles.quoteAuthor}>CAST STONE FOUNDER</cite>
              </div>

              <div className={styles.quoteTextContent}>
                <h2 className={styles.quoteTitle}>THE FRUITION OF DECADES OF EXPERIENCE</h2>
                <p className={styles.quoteText}>
                  For Cast Stone, this was not an impulsive decision quickly taken; it was the direct fruition of decades of experience
                  gained through diverse architectural projects and luxury material development. Our deep fascination for innovative
                  manufacturing techniques, expertise in material science, and personal passion for architectural excellence
                  combined with our extreme sensitivity to design and functionality, meant that no existing stone products could
                  completely meet our vision for perfection.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default OurStoryPage;
