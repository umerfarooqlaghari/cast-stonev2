import React from 'react';
import styles from './heroSection.module.css';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Welcome to Cast Stone",
  subtitle = "Building the future with modern technology",
  ctaText = "Get Started",
  onCtaClick
}) => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          {onCtaClick && (
            <button 
              className={styles.ctaButton}
              onClick={onCtaClick}
            >
              {ctaText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
