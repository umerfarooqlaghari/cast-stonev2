'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import styles from './CompletedProjectsCarousel.module.css';

export interface CompletedProject {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  location?: string;
  completedDate?: string;
  projectType?: string;
}

interface CompletedProjectsCarouselProps {
  projects: CompletedProject[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const CompletedProjectsCarousel: React.FC<CompletedProjectsCarouselProps> = ({
  projects,
  title = "Completed Projects",
  subtitle = "Discover our stunning architectural stone installations",
  className = ''
}) => {
  const swiperRef = useRef<any>(null);

  if (!projects || projects.length === 0) {
    return (
      <section className={`${styles.projectsCarousel} ${className}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>No completed projects to display at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.projectsCarousel} ${className}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={Math.floor(projects.length / 2)}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            spaceBetween={30}
            loop={projects.length > 3}
            speed={800}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            allowTouchMove={true}
            simulateTouch={true}
            watchSlidesProgress={true}
            modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
            className={styles.swiper}
          >
            {projects.map((project) => {
              const optimizedImageSrc = getOptimizedImageUrl(project.imageSrc, 'hero');

              return (
                <SwiperSlide key={project.id} className={styles.slide}>
                  <div className={styles.projectCard}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={optimizedImageSrc}
                        alt={project.imageAlt}
                        fill
                        className={styles.projectImage}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                      <div className={styles.imageOverlay}></div>
                    </div>
                    
                    <div className={styles.projectInfo}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectDescription}>{project.description}</p>
                      
                      <div className={styles.projectMeta}>
                        {project.location && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Location:</span>
                            <span className={styles.metaValue}>{project.location}</span>
                          </div>
                        )}
                        {project.projectType && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Type:</span>
                            <span className={styles.metaValue}>{project.projectType}</span>
                          </div>
                        )}
                        {project.completedDate && (
                          <div className={styles.metaItem}>
                            <span className={styles.metaLabel}>Completed:</span>
                            <span className={styles.metaValue}>{project.completedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CompletedProjectsCarousel;
