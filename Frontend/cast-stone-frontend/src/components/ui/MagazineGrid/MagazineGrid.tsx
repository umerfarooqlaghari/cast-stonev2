'use client';

import React from 'react';
import styles from './magazineGrid.module.css';

interface MagazineGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  className?: string;
}

const MagazineGrid: React.FC<MagazineGridProps> = ({
  children,
  columns = 3,
  gap = 'medium',
  className = ''
}) => {
  const gridClass = `${styles.magazineGrid} ${styles[`columns${columns}`]} ${styles[`gap${gap}`]} ${className}`;

  return (
    <div className={gridClass}>
      {children}
    </div>
  );
};

export default MagazineGrid;
