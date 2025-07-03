import React from 'react';
import styles from './footer.module.css';

interface FooterProps {
  companyName?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({ 
  companyName = "Cast Stone", 
  year = new Date().getFullYear() 
}) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.copyright}>
            © {year} {companyName}. All rights reserved.
          </p>
          <div className={styles.links}>
            <a href="/privacy" className={styles.link}>Privacy Policy</a>
            <a href="/terms" className={styles.link}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
