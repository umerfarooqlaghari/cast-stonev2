'use client';

import React from 'react';
import { WorkerMessage } from '@/services/types/entities';
import styles from './WorkerMessageSection.module.css';

interface WorkerMessageSectionProps {
  message: WorkerMessage;
}

export default function WorkerMessageSection({ message }: WorkerMessageSectionProps) {
  return (
    <div
      className={styles.parallaxSection}
      style={{
        backgroundImage: `url(${message.imageUrl})`,
      }}
    >
      {/* Subtle overlay */}
      <div className={styles.parallaxOverlay}></div>

      {/* Text box overlay in top-left */}
      <div className={styles.contentBox}>
        <h2 className={styles.heading}>{message.heading}</h2>
        <p className={styles.description}>{message.description}</p>
      </div>
    </div>
  );
}

