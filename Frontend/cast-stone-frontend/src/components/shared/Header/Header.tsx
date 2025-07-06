'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { collectionGetService } from '../../../services/api/collections';
import { CollectionHierarchy } from '../../../services/types/entities';
import { DropdownItem } from '../../../types';
import styles from './header.module.css';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Cast Stone" }) => {
  const { getCartSummary } = useCart();
  const [collections, setCollections] = useState<CollectionHierarchy[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Company dropdown items
  const companyItems: DropdownItem[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Retail Locator', href: '/retail-locator' },
    { label: 'Wholesale Signup', href: '/wholesale-signup' }
  ];

  // Discover dropdown items
  const discoverItems: DropdownItem[] = [
    { label: 'Catalog', href: '/catalog' },
    { label: 'Finishes', href: '/finishes' },
    { label: 'Videos', href: '/videos' },
    { label: 'Technical Info', href: '/technical-info' },
    { label: 'FAQ', href: '/faq' }
  ];

  // Fetch collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setIsLoading(true);
        const hierarchyData = await collectionGetService.getHierarchy();
        setCollections(hierarchyData);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideDropdown = Object.values(dropdownRefs.current).some(
        ref => ref && ref.contains(target)
      );

      if (!isClickInsideDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Convert collections to dropdown items
  const collectionsToDropdownItems = (collections: CollectionHierarchy[]): DropdownItem[] => {
    return collections.map(collection => ({
      label: collection.name,
      href: `/collections/${collection.id}`,
      children: collection.children.length > 0
        ? collectionsToDropdownItems(collection.children)
        : undefined
    }));
  };

  const collectionItems = collectionsToDropdownItems(collections);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <span className={styles.logoText}>{title}</span>
            <span className={styles.logoSubtext}>Interiors & Decorations</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {/* Company Dropdown */}
            <li className={styles.navItem}>
              <div
                className={styles.dropdownContainer}
                ref={el => { dropdownRefs.current['company'] = el; }}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === 'company' ? styles.active : ''}`}
                  onClick={() => handleDropdownToggle('company')}
                  aria-expanded={activeDropdown === 'company'}
                >
                  Company
                  <span className={`${styles.dropdownIcon} ${activeDropdown === 'company' ? styles.rotated : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                {activeDropdown === 'company' && (
                  <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                      {companyItems.map((item, index) => (
                        <li key={index} className={styles.dropdownItem}>
                          <Link href={item.href} className={styles.dropdownLink}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* Products */}
            <li className={styles.navItem}>
              <Link href="/products" className={styles.navLink}>
                Products
              </Link>
            </li>

            {/* Collections Dropdown */}
            <li className={styles.navItem}>
              <div
                className={styles.dropdownContainer}
                ref={el => {dropdownRefs.current['collections'] = el}}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === 'collections' ? styles.active : ''}`}
                  onClick={() => handleDropdownToggle('collections')}
                  aria-expanded={activeDropdown === 'collections'}
                  disabled={isLoading}
                >
                  Collections
                  {isLoading ? (
                    <span className={styles.loadingIcon}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    </span>
                  ) : (
                    <span className={`${styles.dropdownIcon} ${activeDropdown === 'collections' ? styles.rotated : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
                {activeDropdown === 'collections' && !isLoading && (
                  <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                      {collectionItems.map((item, index) => (
                        <li key={index} className={styles.dropdownItem}>
                          <Link href={item.href} className={styles.dropdownLink}>
                            {item.label}
                          </Link>
                          {item.children && item.children.length > 0 && (
                            <ul className={styles.subDropdownList}>
                              {item.children.map((child, childIndex) => (
                                <li key={childIndex} className={styles.subDropdownItem}>
                                  <Link href={child.href} className={styles.subDropdownLink}>
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* Completed Projects */}
            <li className={styles.navItem}>
              <Link href="/completed-projects" className={styles.navLink}>
                Completed Projects
              </Link>
            </li>

            {/* Discover Dropdown */}
            <li className={styles.navItem}>
              <div
                className={styles.dropdownContainer}
                ref={el => {dropdownRefs.current['discover'] = el}}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === 'discover' ? styles.active : ''}`}
                  onClick={() => handleDropdownToggle('discover')}
                  aria-expanded={activeDropdown === 'discover'}
                >
                  Discover
                  <span className={`${styles.dropdownIcon} ${activeDropdown === 'discover' ? styles.rotated : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>
                {activeDropdown === 'discover' && (
                  <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                      {discoverItems.map((item, index) => (
                        <li key={index} className={styles.dropdownItem}>
                          <Link href={item.href} className={styles.dropdownLink}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </nav>

        {/* Cart Icon */}
        <div className={styles.cartContainer}>
          <Link href="/cart" className={styles.cartLink}>
            <div className={styles.cartIconWrapper}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"/>
              </svg>
              {getCartSummary().totalItems > 0 && (
                <span className={styles.cartBadge}>
                  {getCartSummary().totalItems}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
