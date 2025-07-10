'use client';

import React, { useState } from 'react';
import { Product } from '@/services/types/entities';
import styles from './productSpecifications.module.css';

interface ProductSpecificationsProps {
  product: Product;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ product }) => {
  const [activeSection, setActiveSection] = useState<string | null>('specifications');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const formatDimensions = () => {
    // This would typically come from product data
    // For now, using placeholder data based on the reference design
    return "40\" W x 31.5\" H";
  };

  const formatWeight = () => {
    // This would typically come from product data
    return "333 lbs";
  };

  return (
    <div className={styles.specificationsContainer}>
      {/* Product Specifications Section */}
      <div className={styles.section}>
        <button
          className={`${styles.sectionHeader} ${
            activeSection === 'specifications' ? styles.active : ''
          }`}
          onClick={() => toggleSection('specifications')}
        >
          <span>Product Specifications</span>
          <span className={styles.toggleIcon}>
            {activeSection === 'specifications' ? '−' : '+'}
          </span>
        </button>
        
        {activeSection === 'specifications' && (
          <div className={styles.sectionContent}>
            <div className={styles.specGrid}>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Material:</span>
                <span className={styles.specValue}>Cast Stone</span>
              </div>
              
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Dimensions:</span>
                <span className={styles.specValue}>{formatDimensions()}</span>
              </div>
              
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Total Weight:</span>
                <span className={styles.specValue}>{formatWeight()}</span>
              </div>
              
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Collection:</span>
                <span className={styles.specValue}>
                  {product.collection?.name || 'Not specified'}
                </span>
              </div>
              
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Product Code:</span>
                <span className={styles.specValue}>
                  P-{product.id.toString().padStart(3, '0')}-AS
                </span>
              </div>
              
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Stock Status:</span>
                <span className={`${styles.specValue} ${
                  product.stock > 0 ? styles.inStock : styles.outOfStock
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
              
              {product.tags && product.tags.length > 0 && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Tags:</span>
                  <span className={styles.specValue}>
                    <div className={styles.tagContainer}>
                      {product.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className={styles.section}>
        <button
          className={`${styles.sectionHeader} ${
            activeSection === 'details' ? styles.active : ''
          }`}
          onClick={() => toggleSection('details')}
        >
          <span>Product Details</span>
          <span className={styles.toggleIcon}>
            {activeSection === 'details' ? '−' : '+'}
          </span>
        </button>
        
        {activeSection === 'details' && (
          <div className={styles.sectionContent}>
            <div className={styles.detailsContent}>
              {product.description ? (
                <p className={styles.description}>{product.description}</p>
              ) : (
                <p className={styles.description}>
                  This premium cast stone piece combines durability with elegant design. 
                  Crafted with attention to detail, it&apos;s perfect for both indoor and outdoor use. 
                  Each piece is individually cast and finished to ensure the highest quality.
                </p>
              )}
              
              <div className={styles.featureList}>
                <h4>Key Features:</h4>
                <ul>
                  <li>Premium cast stone construction</li>
                  <li>Weather-resistant finish</li>
                  <li>Handcrafted quality</li>
                  <li>Multiple patina options available</li>
                  <li>Suitable for indoor and outdoor use</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Care Section */}
      <div className={styles.section}>
        <button
          className={`${styles.sectionHeader} ${
            activeSection === 'care' ? styles.active : ''
          }`}
          onClick={() => toggleSection('care')}
        >
          <span>Product Care and Downloadable Content</span>
          <span className={styles.toggleIcon}>
            {activeSection === 'care' ? '−' : '+'}
          </span>
        </button>
        
        {activeSection === 'care' && (
          <div className={styles.sectionContent}>
            <div className={styles.careContent}>
              <div className={styles.careSection}>
                <h4>Care Instructions:</h4>
                <ul>
                  <li>Clean with mild soap and water</li>
                  <li>Avoid harsh chemicals or abrasive cleaners</li>
                  <li>For outdoor pieces, periodic sealing is recommended</li>
                  <li>Store indoors during extreme weather conditions</li>
                </ul>
              </div>
              
              <div className={styles.downloadSection}>
                <h4>Downloadable Resources:</h4>
                <div className={styles.downloadLinks}>
                  <a href="#" className={styles.downloadLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Product Specification Sheet (PDF)
                  </a>
                  
                  <a href="#" className={styles.downloadLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Care & Maintenance Guide (PDF)
                  </a>
                  
                  <a href="#" className={styles.downloadLink}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Installation Instructions (PDF)
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Share Section */}
      <div className={styles.shareSection}>
        <span className={styles.shareLabel}>Share</span>
        <div className={styles.shareButtons}>
          <button className={styles.shareButton} aria-label="Share on Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          <button className={styles.shareButton} aria-label="Share on Pinterest">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-12.014C24.007 5.36 18.641.001 12.017.001z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecifications;
