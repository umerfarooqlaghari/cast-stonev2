'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './testimonialsSection.module.css';

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  project: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    title: 'Interior Designer',
    company: 'Mitchell Design Studio',
    content: 'Cast Stone has transformed our projects with their exquisite craftsmanship. The attention to detail and quality of their architectural elements is unmatched. Our clients are consistently amazed by the timeless elegance these pieces bring to their spaces.',
    image: '/images/testimonials/sarah-mitchell.jpg',
    rating: 5,
    project: 'Luxury Residential Project'
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Architect',
    company: 'Chen Architecture Group',
    content: 'Working with Cast Stone has been a game-changer for our firm. Their ability to create custom pieces that perfectly match our architectural vision is remarkable. The durability and beauty of their cast stone elements make them our go-to choice for premium projects.',
    image: '/images/testimonials/michael-chen.jpg',
    rating: 5,
    project: 'Commercial Heritage Building'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    title: 'Project Manager',
    company: 'Elite Construction',
    content: 'The professionalism and expertise of the Cast Stone team is exceptional. From initial consultation to final installation, every step was handled with precision. The end result exceeded our expectations and our client\'s vision was brought to life beautifully.',
    image: '/images/testimonials/emma-rodriguez.jpg',
    rating: 5,
    project: 'Boutique Hotel Renovation'
  }
];

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials = defaultTestimonials
}) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => 
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const handleTestimonialChange = (index: number) => {
    setActiveTestimonial(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={index < rating ? "#d4af8c" : "none"}
        stroke={index < rating ? "#d4af8c" : "#e5e5e5"}
        strokeWidth="1"
      >
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ));
  };

  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Client Testimonials</span>
          <h2 className={styles.title}>What Our Clients Say</h2>
          <p className={styles.description}>
            Discover why architects, designers, and homeowners trust Cast Stone 
            for their most important projects.
          </p>
        </div>

        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialContent}>
            <div className={styles.quoteIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M3 21C3 17.5 5.5 15 9 15C9.5 15 10 15.1 10.5 15.2C10.2 14.2 10 13.1 10 12C10 8.7 12.7 6 16 6V4C11.6 4 8 7.6 8 12C8 12.4 8 12.7 8.1 13.1C6.8 13.6 5.7 14.4 4.9 15.5C3.8 17.1 3 19 3 21Z" fill="currentColor"/>
                <path d="M13 21C13 17.5 15.5 15 19 15C19.5 15 20 15.1 20.5 15.2C20.2 14.2 20 13.1 20 12C20 8.7 22.7 6 26 6V4C21.6 4 18 7.6 18 12C18 12.4 18 12.7 18.1 13.1C16.8 13.6 15.7 14.4 14.9 15.5C13.8 17.1 13 19 13 21Z" fill="currentColor"/>
              </svg>
            </div>

            <div className={styles.testimonialText}>
              <p className={styles.testimonialContent}>
                "{testimonials[activeTestimonial].content}"
              </p>
              
              <div className={styles.rating}>
                {renderStars(testimonials[activeTestimonial].rating)}
              </div>
              
              <div className={styles.projectInfo}>
                <span className={styles.projectLabel}>Project:</span>
                <span className={styles.projectName}>
                  {testimonials[activeTestimonial].project}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.testimonialMeta}>
            <div className={styles.authorInfo}>
              <div className={styles.authorImage}>
                <Image
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  fill
                  className={styles.authorPhoto}
                  sizes="80px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-avatar.jpg';
                  }}
                />
              </div>
              
              <div className={styles.authorDetails}>
                <h4 className={styles.authorName}>
                  {testimonials[activeTestimonial].name}
                </h4>
                <p className={styles.authorTitle}>
                  {testimonials[activeTestimonial].title}
                </p>
                <p className={styles.authorCompany}>
                  {testimonials[activeTestimonial].company}
                </p>
              </div>
            </div>

            <div className={styles.navigation}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.navDot} ${
                    index === activeTestimonial ? styles.active : ''
                  }`}
                  onClick={() => handleTestimonialChange(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>25+</span>
            <span className={styles.statLabel}>Years Experience</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1000+</span>
            <span className={styles.statLabel}>Projects Completed</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Client Satisfaction</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Awards Won</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
