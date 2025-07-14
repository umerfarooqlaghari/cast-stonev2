'use client';

import React from 'react';
import styles from './completedProjects.module.css';

export default function CompletedProjectsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Completed Projects</h1>
        <p className={styles.subtitle}>
          Explore our portfolio of stunning cast stone installations and transformations
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.comingSoon}>
          <div className={styles.icon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2>Coming Soon</h2>
          <p>
            We&apos;re currently curating our most impressive completed projects to showcase here.
            Check back soon to see beautiful installations, before & after transformations,
            and customer success stories.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <h4>Project Galleries</h4>
              <p>High-quality photos of completed installations</p>
            </div>
            <div className={styles.feature}>
              <h4>Case Studies</h4>
              <p>Detailed project breakdowns and customer testimonials</p>
            </div>
            <div className={styles.feature}>
              <h4>Before & After</h4>
              <p>Transformation stories showcasing our craftsmanship</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
