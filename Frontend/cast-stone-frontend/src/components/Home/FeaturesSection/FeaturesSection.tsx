import React from 'react';
import styles from './featuresSection.module.css';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface FeaturesSectionProps {
  title?: string;
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  {
    id: '1',
    title: 'Modern Architecture',
    description: 'Built with the latest technologies and best practices for scalability and performance.',
    icon: '🏗️'
  },
  {
    id: '2',
    title: 'Responsive Design',
    description: 'Fully responsive design that works seamlessly across all devices and screen sizes.',
    icon: '📱'
  },
  {
    id: '3',
    title: 'Fast Performance',
    description: 'Optimized for speed with efficient code and modern development practices.',
    icon: '⚡'
  }
];

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  title = "Why Choose Cast Stone?",
  features = defaultFeatures
}) => {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature) => (
            <div key={feature.id} className={styles.featureCard}>
              {feature.icon && (
                <div className={styles.icon}>{feature.icon}</div>
              )}
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
