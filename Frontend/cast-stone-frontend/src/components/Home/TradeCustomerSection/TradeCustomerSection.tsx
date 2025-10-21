'use client';

import React from 'react';
import Link from 'next/link';
import styles from './tradeCustomerSection.module.css';

const TradeCustomerSection: React.FC = () => {
  return (
    <section className={styles.tradeCustomerSection}>
      <div className={styles.backgroundImage} />
      
      <div className={styles.contentOverlay}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>Become a Trade Customer</h2>
          
          <p className={styles.description}>
            Become a trade customer and gain access to detailed pricing, 
            online ordering, personalized quotes, and more! Click the button 
            below to begin the process!
          </p>
          
          <p className={styles.description}>
            Visit our Project Gallery page where you&apos;ll find beautiful 
            photographs of the commercial and residential jobs we&apos;ve been 
            involved in over the years!
          </p>
          
          <div className={styles.buttonGroup}>
            <Link href="/wholesale-signup" className={styles.secondaryButton}>
              Create an Account
            </Link>
            
            <Link href="/collections" className={styles.secondaryButton}>
              View Project Gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeCustomerSection;

