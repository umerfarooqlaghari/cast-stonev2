'use client';

import React from 'react';
import HeroSection from './HeroSection/HeroSection';
import FeaturesSection from './FeaturesSection/FeaturesSection';
import styles from './homeComponent.module.css';

const HomeComponent: React.FC = () => {
  const handleGetStarted = () => {
    // Navigate to getting started page or scroll to features
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.homeComponent}>
      <HeroSection 
        title="Welcome to Cast Stone"
        subtitle="Building the future with modern technology and innovative solutions"
        ctaText="Explore Features"
        onCtaClick={handleGetStarted}
      />
      <div id="features">
        <FeaturesSection />
      </div>
    </div>
  );
};

export default HomeComponent;
