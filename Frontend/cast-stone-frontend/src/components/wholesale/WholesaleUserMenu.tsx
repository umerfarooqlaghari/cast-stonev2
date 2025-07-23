'use client';

import React, { useState } from 'react';
import { useWholesaleAuth } from '../../contexts/WholesaleAuthContext';
import styles from './WholesaleUserMenu.module.css';

export const WholesaleUserMenu: React.FC = () => {
  const { user, isApprovedWholesaleBuyer, logout, isLoading } = useWholesaleAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Don't render anything if user is not logged in as wholesale buyer
  if (isLoading || !user || !isApprovedWholesaleBuyer) {
    return null;
  }

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  return (
    <div className={styles.wholesaleUserMenu}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.userButton}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <div className={styles.userInfo}>
          <span className={styles.wholesaleLabel}>Wholesale</span>
          <span className={styles.userName}>
            {user.name}
          </span>
        </div>
        <svg 
          className={`${styles.chevron} ${isMenuOpen ? styles.open : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M4.427 9.573L8 6l3.573 3.573a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708z"/>
        </svg>
      </button>

      {isMenuOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            <div className={styles.userDetails}>
              <div className={styles.userEmail}>{user.email}</div>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                 Approved WholeSale Buyer
              </div>
            </div>
            
            <div className={styles.divider}></div>
            
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close menu when clicking outside */}
      {isMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};
