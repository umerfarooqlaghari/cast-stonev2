'use client';

import React from 'react';
import HeroSection from './HeroSection/HeroSection';
import CategoriesSection from './CategoriesSection/CategoriesSection';
import CatalogBanner from './CatalogBanner/CatalogBanner';
import CollectionsCarousel from './CollectionsCarousel/CollectionsCarousel';
import TestimonialsSection from './TestimonialsSection/TestimonialsSection';
import styles from './homeComponent.module.css';

interface HomeComponentProps {
  title?: string;
  subtitle?: string;
}

const HomeComponent: React.FC<HomeComponentProps> = ({
  title = "Timeless Elegance in Cast Stone",
  subtitle = "Discover our exquisite collection of handcrafted cast stone interiors, fireplaces, and decorative elements that transform spaces into works of art."
}) => {
  return (
    <main className={styles.homeComponent}>
      {/* Hero Section with Image Carousel */}
      <HeroSection
        title={title}
        subtitle={subtitle}
      />

      {/* Categories Grid Section */}
      <CategoriesSection />

      {/* Catalog Banner */}
      <CatalogBanner />

      {/* Collections Carousel */}
      <CollectionsCarousel />

      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  );
};

export default HomeComponent;
