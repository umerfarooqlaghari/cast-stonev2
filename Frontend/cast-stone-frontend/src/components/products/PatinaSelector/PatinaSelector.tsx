'use client';

import React, { useState } from 'react';
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
  const [zoomedPatina, setZoomedPatina] = useState<string | null>(null);

  const handlePatinaClick = (patinaName: string) => {
    onPatinaChange(patinaName);
    setZoomedPatina(patinaName);
  };

  const closeZoom = () => {
    setZoomedPatina(null);
  };

  const zoomedOption = PATINA_OPTIONS.find(p => p.name === zoomedPatina);

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
            onClick={() => handlePatinaClick(option.name)}
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

      {/* Zoomed Patina Modal */}
      {zoomedPatina && zoomedOption && (
        <div className={styles.zoomOverlay} onClick={closeZoom}>
          <div className={styles.zoomModal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={closeZoom}
              aria-label="Close zoom view"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className={styles.zoomContent}>
              <div className={styles.zoomedLogoContainer}>
                <Image
                  src="/PatinaLogo.png"
                  alt={zoomedOption.name}
                  width={300}
                  height={300}
                  className={styles.zoomedLogo}
                />
                <div
                  className={styles.zoomedColorOverlay}
                  style={{ backgroundColor: zoomedOption.color }}
                />
              </div>

              <div className={styles.zoomInfo}>
                <h3 className={styles.zoomTitle}>{zoomedOption.name}</h3>
                {zoomedOption.description && (
                  <p className={styles.zoomDescription}>{zoomedOption.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
