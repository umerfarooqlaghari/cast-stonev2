'use client';

import React from 'react';
import styles from './collectionPage.module.css';

export interface StaticContentProps {
  header?: string | null;
  paragraph1?: string | null;
  paragraph2?: string | null;
  paragraph3?: string | null;
}

const StaticContentSection: React.FC<StaticContentProps> = ({ header, paragraph1, paragraph2, paragraph3 }) => {
  // Render nothing if no content provided
  if (!header && !paragraph1 && !paragraph2 && !paragraph3) return null;

  return (
    <section className={styles.staticContentSection}>
      <div className={styles.container}>
        <div className={styles.staticContentWrap}>
          <article className={styles.staticBlock}>
            {header && <h3 className={styles.staticHeader}>{header}</h3>}
            {paragraph1 && <p className={styles.staticParagraph}>{paragraph1}</p>}
            {paragraph2 && <p className={styles.staticParagraph}>{paragraph2}</p>}
            {paragraph3 && <p className={styles.staticParagraph}>{paragraph3}</p>}
          </article>
        </div>
      </div>
    </section>
  );
};

export default StaticContentSection;
