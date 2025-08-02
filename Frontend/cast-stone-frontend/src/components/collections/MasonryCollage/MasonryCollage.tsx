/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Collection } from '@/services/types/entities';
import { getOptimizedImageUrl } from '@/utils/cloudinaryUtils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
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
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={Math.floor(collections.length / 2)}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            spaceBetween={30}
            loop={false}
            speed={800}
            autoplay={{
              delay: 4000,
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
            {collections.map((collection, index) => {
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
                      <span className={`${styles.categoryTag} ${styles[`category-${index % 5}`]}`}>
                        Collection
                      </span>

                      <div className={styles.slideContent}>
                        <h3 className={styles.collectionTitle}>{collection.name}</h3>
                        <p className={styles.collectionLocation}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={styles.locationIcon}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {collection.description || 'Premium Cast Stone Collection'}
                        </p>
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
