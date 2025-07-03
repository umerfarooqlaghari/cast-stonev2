import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Cast Stone" }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            {title}
          </Link>
        </div>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link href="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className={styles.navLink}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={styles.navLink}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
