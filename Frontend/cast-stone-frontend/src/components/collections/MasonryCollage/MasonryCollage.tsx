/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Collection } from '@/services/types/entities';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './MasonryCollage.module.css';

interface MasonryCollageProps {
  collections: Collection[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const MasonryCollage: React.FC<MasonryCollageProps> = ({
  collections,
  title = "Explore Collections",
  subtitle = "Discover our curated selection of cast stone collections",
  className = ''
}) => {
  const swiperRef = useRef<any>(null);

  if (!collections || collections.length === 0) {
    return (
      <section className={`${styles.collectionsCarousel} ${className}`}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.emptyState}>
            <p>No collections available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.collectionsCarousel} ${className}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        <div className={styles.swiperContainer}>
          <Swiper
            ref={swiperRef}
            slidesPerView={3}
            spaceBetween={0}
            loop={false}
            speed={800}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={true}
            allowTouchMove={true}
            simulateTouch={true}
            modules={[Navigation, Autoplay]}
            className={styles.swiper}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 0,
              },
            }}
          >
            {collections.map((collection) => {
              const imageSrc = collection.images && collection.images.length > 0
                ? collection.images[0]
                : "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&h=800&fit=crop&crop=center&q=90";

              const optimizedImageSrc = getOptimizedImageUrl(imageSrc, 'hero');

              return (
                <SwiperSlide key={collection.id} className={styles.swiperSlide}>
                  <Link href={`/collections/${collection.id}`} className={styles.slideLink}>
                    <div
                      className={styles.slideBackground}
                      style={{
                        backgroundImage: `url(${optimizedImageSrc})`
                      }}
                    >
                      <div className={styles.overlay}>
                        <div className={styles.overlayContent}>
                          <div className={styles.divider}></div>
                          <h3 className={styles.collectionTitle}>{collection.name}</h3>
                          <p className={styles.collectionDescription}>
                            {collection.description || 'Premium Cast Stone Collection'}
                          </p>
                          <div className={styles.ctaButton}>
                            TAKE ME THERE
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default MasonryCollage;
