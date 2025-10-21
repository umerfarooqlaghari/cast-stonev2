'use client';

import React from 'react';
import Image from 'next/image';
import { PATINA_OPTIONS } from '@/utils/patinaOptions';
import styles from './patinaSelector.module.css';

interface PatinaSelectorProps {
  selectedPatina: string;
  onPatinaChange: (patina: string) => void;
}

const PatinaSelector: React.FC<PatinaSelectorProps> = ({
  selectedPatina,
  onPatinaChange
}) => {

  return (
    <div className={styles.patinaSelector}>
      <div className={styles.selectorHeader}>
        <h3 className={styles.selectorTitle}>Select Patina</h3>
        <span className={styles.selectedPatina}>{selectedPatina}</span>
      </div>

      <div className={styles.patinaGrid}>
        {PATINA_OPTIONS.map((option) => (
          <button
            key={option.name}
            className={`${styles.patinaOption} ${
              selectedPatina === option.name ? styles.selected : ''
            }`}
            onClick={() => onPatinaChange(option.name)}
            title={`${option.name} - ${option.description}`}
            aria-label={`Select ${option.name} patina`}
          >
            <div className={styles.patinaLogoContainer}>
              <Image
                src="/PatinaLogo.png"
                alt={option.name}
                width={140}
                height={140}
                className={styles.medusaLogo}
              />
              <div
                className={styles.colorOverlay}
                style={{ backgroundColor: option.color }}
              />
            </div>
            <span className={styles.patinaName}>{option.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.patinaNote}>
        <p>
          <strong>Note:</strong> Patina colors are representative. Actual finish may vary
          due to the handcrafted nature of cast stone. Contact us for physical samples.
        </p>
      </div>
    </div>
  );
};

export default PatinaSelector;
