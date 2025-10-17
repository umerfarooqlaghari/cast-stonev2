/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { WholesaleUserMenu } from '../../wholesale/WholesaleUserMenu';
import { Collection } from '../../../services/types/entities';
import { DropdownItem } from '../../../types';
import { useCollectionsByLevel } from '@/hooks/useCollections';
import styles from './header.module.css';
import { usePathname } from 'next/navigation';


const Header: React.FC = () => {

  const { getCartSummary } = useCart();

  // Use React Query hook for cached collections
  const { data: collections = [], isLoading } = useCollectionsByLevel(1);

  const [childCollections, setChildCollections] = useState<{ [key: number]: Collection[] }>({});
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // const [setHoveredCollection] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pathname = usePathname();


     if (pathname.startsWith('/admin')) {
    return null;
  }


  // Hide header on admin dashboard routes
 
  
  // Company dropdown items
  const companyItems: DropdownItem[] = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Retail Locator', href: '/retail-locator' },
    { label: 'Wholesale Signup', href: '/wholesale-signup' }
  ];

  // Collections dropdown items (static list)
  const collectionsItems: DropdownItem[] = [
    { label: 'Mykonos Collection', href: '#' },
    { label: 'Italia Collection', href: '#' },
    { label: 'Oceanic Collection', href: '#' },
    { label: 'Pacifica Collection', href: '#' },
    { label: 'Petra Collection', href: '#' }
  ];

  // Discover dropdown items
  const discoverItems: DropdownItem[] = [
    // { label: 'Catalog', href: '/catalog' },
    { label: 'Finishes', href: '/finishes' },
    { label: 'Videos', href: '/videos' },
    { label: 'Technical Info', href: '/technical-info' },
    { label: 'FAQ', href: '/faq' }
  ];

  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch child collections for a parent collection (still using direct API call for dynamic loading)
  const fetchChildCollections = async (parentId: number) => {
    try {
      if (!childCollections[parentId]) {
        // Import the service dynamically to avoid circular dependencies
        const { collectionService } = await import('@/services');
        const children = await collectionService.get.getChildren(parentId);
        setChildCollections(prev => ({
          ...prev,
          [parentId]: children
        }));
      }
    } catch (error) {
      console.error('Failed to fetch child collections:', error);
    }
  };

  // Handle dropdown hover (for desktop)
  const handleDropdownEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileActiveDropdown(null); // Reset mobile dropdowns when closing menu
  };

  const handleMobileDropdownToggle = (dropdownName: string) => {
    setMobileActiveDropdown(mobileActiveDropdown === dropdownName ? null : dropdownName);
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

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  // Handle collection hover to load child collections
  const handleCollectionHover = async (collectionId: number) => {
    // setHoveredCollection(collectionId);
    await fetchChildCollections(collectionId);
  };

  // Render hierarchical collections dropdown
  // const renderCollectionsDropdown = () => {
  //   if (isLoading) {
  //     return (
  //       <div className={styles.dropdownContent}>
  //         <div className={styles.dropdownItem}>Loading...</div>
  //       </div>
  //     );
  //   }

  const renderCollectionsDropdown = () => {
  if (isLoading) {
    return (
      <div className={styles.dropdownItem}>Loading...</div>
    );
  }

    return (
      <div className={styles.dropdownContent}>
        {collections.map(collection => (
          <div
            key={collection.id}
            className={styles.hierarchicalDropdownItem}
            onMouseEnter={() => handleCollectionHover(collection.id)}
          >
            <Link
              href={`/collections/${collection.id}`}
              className={styles.dropdownLink}
              onClick={() => setActiveDropdown(null)}
            >
              {collection.name}
              {/* {childCollections[collection.id] && childCollections[collection.id].length > 0 && (
                <span className={styles.dropdownArrow}>→</span>
              )} */}
            </Link>

            {/* {hoveredCollection === collection.id && childCollections[collection.id] && childCollections[collection.id].length > 0 && (
              <div className={styles.submenu}>
                {childCollections[collection.id].map(level2Collection => (
                  <div
                    key={level2Collection.id}
                    className={styles.submenuItem}
                    onMouseEnter={() => handleCollectionHover(level2Collection.id)}
                  >
                    <Link
                      href={`/collections/${level2Collection.id}`}
                      className={styles.submenuLink}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {level2Collection.name}
                      {childCollections[level2Collection.id] && childCollections[level2Collection.id].length > 0 && (
                        <span className={styles.dropdownArrow}>→</span>
                      )}
                    </Link>

                    {hoveredCollection === level2Collection.id && childCollections[level2Collection.id] && childCollections[level2Collection.id].length > 0 && (
                      <div className={styles.subSubmenu}>
                        {childCollections[level2Collection.id].map(level3Collection => (
                          <Link
                            key={level3Collection.id}
                            href={`/collections/${level3Collection.id}`}
                            className={styles.subSubmenuLink}
                            onClick={() => setActiveDropdown(null)}
                          >
                            {level3Collection.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return () => {
    document.body.style.overflow = 'auto'; // Reset on unmount
  };
}, [isMobileMenuOpen]);



  // Check if we're on the home page
  const isHomePage = pathname === '/';
  // Check if we're on the retail locator page (dark background)
  const isRetailLocatorPage = pathname === '/retail-locator';

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''} ${!isHomePage ? styles.nonHomePage : ''} ${isRetailLocatorPage ? styles.retailLocatorPage : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoImageWrapper}>
              <Image
                src="/medusa-logo.png"
                alt="Cast Stone International Logo"
                width={50}
                height={30}
                className={styles.logoImage}
                priority
              />
            </div>
            <div className={styles.logoContent}>
              <span className={styles.logoText}>Cast Stone International</span>
              <span className={styles.logoSubtext}>Manufacturing and Distributing World-Class Products.</span>
            </div>
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
                onMouseEnter={() => handleDropdownEnter('company')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === 'company' ? styles.active : ''}`}
                  aria-expanded={activeDropdown === 'company'}
                >
                  Company
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

            {/* Products Dropdown with Link */}
            <li className={styles.navItem}>
              <div
                className={styles.dropdownContainer}
                ref={el => {dropdownRefs.current['products'] = el}}
                onMouseEnter={() => handleDropdownEnter('products')}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/products"
                  className={`${styles.navLink} ${activeDropdown === 'products' ? styles.active : ''}`}
                >
                  Products
                </Link>
                {activeDropdown === 'products' && (
                  <div className={`${styles.dropdown} ${styles.dropdownOpen}`}>
                    {renderCollectionsDropdown()}
                  </div>
                )}
              </div>
            </li>

            {/* Collections Dropdown (formerly Products) */}
            <li className={styles.navItem}>
              <div
                className={styles.dropdownContainer}
                ref={el => {dropdownRefs.current['collections'] = el}}
                onMouseEnter={() => handleDropdownEnter('collections')}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href="/collections"
                  className={`${styles.navLink} ${activeDropdown === 'collections' ? styles.active : ''}`}
                >
                  Collections
                </Link>
                {activeDropdown === 'collections' && (
                  <div className={styles.dropdown}>
                    <ul className={styles.dropdownList}>
                      {collectionsItems.map((item, index) => (
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
                onMouseEnter={() => handleDropdownEnter('discover')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`${styles.navButton} ${activeDropdown === 'discover' ? styles.active : ''}`}
                  aria-expanded={activeDropdown === 'discover'}
                >
                  Discover
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

        {/* Wholesale User Menu */}
        <WholesaleUserMenu />

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

        {/* Mobile Menu Hamburger Icon */}
        <button
          className={styles.mobileMenuButton}
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`${styles.hamburgerIcon} ${isMobileMenuOpen ? styles.open : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenuOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.mobileMenuContent} onClick={(e) => e.stopPropagation()}>
            <nav className={styles.mobileNav}>
              <ul className={styles.mobileNavList}>
                {/* Company Section */}
                <li className={styles.mobileNavItem}>
                  <button
                    className={`${styles.mobileNavButton} ${mobileActiveDropdown === 'company' ? styles.active : ''}`}
                    onClick={() => handleMobileDropdownToggle('company')}
                  >
                    Company
                    <span className={`${styles.mobileDropdownIcon} ${mobileActiveDropdown === 'company' ? styles.rotated : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  {mobileActiveDropdown === 'company' && (
                    <ul className={styles.mobileSubMenu}>
                      {companyItems.map((item, index) => (
                        <li key={index} className={styles.mobileSubMenuItem}>
                          <Link href={item.href} className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Products Section with Dropdown */}
                <li className={styles.mobileNavItem}>
                  <button
                    className={`${styles.mobileNavButton} ${mobileActiveDropdown === 'products' ? styles.active : ''}`}
                    onClick={() => handleMobileDropdownToggle('products')}
                  >
                    Products
                    <span className={`${styles.mobileDropdownIcon} ${mobileActiveDropdown === 'products' ? styles.rotated : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  {mobileActiveDropdown === 'products' && (
                    <ul className={styles.mobileSubMenu}>
                      <li className={styles.mobileSubMenuItem}>
                        <Link href="/products" className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                          All Products
                        </Link>
                      </li>
                      {collections.map((collection) => (
                        <li key={collection.id} className={styles.mobileSubMenuItem}>
                          <Link href={`/collections/${collection.id}`} className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                            {collection.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Collections Section (formerly Products) */}
                <li className={styles.mobileNavItem}>
                  <button
                    className={`${styles.mobileNavButton} ${mobileActiveDropdown === 'collections' ? styles.active : ''}`}
                    onClick={() => handleMobileDropdownToggle('collections')}
                  >
                    Collections
                    <span className={`${styles.mobileDropdownIcon} ${mobileActiveDropdown === 'collections' ? styles.rotated : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  {mobileActiveDropdown === 'collections' && (
                    <ul className={styles.mobileSubMenu}>
                      {collectionsItems.map((item, index) => (
                        <li key={index} className={styles.mobileSubMenuItem}>
                          <Link href={item.href} className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                {/* Completed Projects Section */}
                <li className={styles.mobileNavItem}>
                  <Link href="/completed-projects" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>
                    Completed Projects
                  </Link>
                </li>

                {/* Discover Section */}
                <li className={styles.mobileNavItem}>
                  <button
                    className={`${styles.mobileNavButton} ${mobileActiveDropdown === 'discover' ? styles.active : ''}`}
                    onClick={() => handleMobileDropdownToggle('discover')}
                  >
                    Discover
                    <span className={`${styles.mobileDropdownIcon} ${mobileActiveDropdown === 'discover' ? styles.rotated : ''}`}>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  {mobileActiveDropdown === 'discover' && (
                    <ul className={styles.mobileSubMenu}>
                      {discoverItems.map((item, index) => (
                        <li key={index} className={styles.mobileSubMenuItem}>
                          <Link href={item.href} className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li className={styles.mobileSubMenuItem}>
                        <Link href="/about" className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                          About
                        </Link>
                      </li>
                      <li className={styles.mobileSubMenuItem}>
                        <Link href="/contact" className={styles.mobileSubMenuLink} onClick={() => setIsMobileMenuOpen(false)}>
                          Contact
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>

    
  );
};

export default Header;
