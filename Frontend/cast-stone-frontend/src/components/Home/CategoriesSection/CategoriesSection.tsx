'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './categoriesSection.module.css';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  stats: {
    projects: number;
    label: string;
  };
}

interface CategoriesSectionProps {
  categories?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: '911',
    title: '911',
    subtitle: 'ARCHITECTURAL',
    description: 'Timeless architectural elements that define spaces with classical elegance and modern sophistication.',
    image: '/images/categories/architectural.jpg',
    href: '/collections/architectural',
    stats: {
      projects: 911,
      label: 'Projects'
    }
  },
  {
    id: '718',
    title: '718',
    subtitle: 'DESIGNER',
    description: 'Curated designer pieces that blend contemporary aesthetics with traditional craftsmanship.',
    image: '/images/categories/designer.jpg',
    href: '/collections/designer',
    stats: {
      projects: 718,
      label: 'Projects'
    }
  },
  {
    id: 'taycan',
    title: 'Taycan',
    subtitle: 'OUTDOOR',
    description: 'Weather-resistant outdoor elements designed to enhance exterior spaces with lasting beauty.',
    image: '/images/categories/outdoor.jpg',
    href: '/collections/outdoor',
    stats: {
      projects: 156,
      label: 'Projects'
    }
  },
  {
    id: 'panamera',
    title: 'Panamera',
    subtitle: 'INTERIOR',
    description: 'Sophisticated interior accents that transform living spaces into works of art.',
    image: '/images/categories/interior.jpg',
    href: '/collections/interior',
    stats: {
      projects: 342,
      label: 'Projects'
    }
  }
];

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ 
  categories = defaultCategories 
}) => {
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Our Collections</h2>
          <p className={styles.sectionSubtitle}>
            Explore our diverse range of handcrafted cast stone elements, 
            each designed to bring timeless elegance to your space.
          </p>
        </div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className={`${styles.categoryCard} ${styles[`card${index + 1}`]}`}
            >
              <Link href={category.href} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className={styles.categoryImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className={styles.imageOverlay}></div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.stats}>
                      <span className={styles.statsNumber}>{category.stats.projects}</span>
                      <span className={styles.statsLabel}>{category.stats.label}</span>
                    </div>
                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                    <p className={styles.categorySubtitle}>{category.subtitle}</p>
                  </div>

                  <p className={styles.categoryDescription}>
                    {category.description}
                  </p>

                  <div className={styles.cardActions}>
                    <button className={styles.actionButton}>
                      <span>Shop Now</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className={styles.secondaryButton}>
                      <span>All Projects</span>
                    </button>
                  </div>
                </div>

                <div className={styles.hoverEffect}></div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
