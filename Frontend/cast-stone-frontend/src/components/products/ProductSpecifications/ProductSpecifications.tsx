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

const hasSpecifications = product.productSpecifications &&
  Object.values(product.productSpecifications).some(
    value => typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
  );

const hasDetails = product.productDetails &&
  Object.values(product.productDetails).some(
    value => typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
  );

const hasDownloadableContent = product.downloadableContent &&
  Object.values(product.downloadableContent).some(
    value => typeof value === 'string' ? value.trim() !== '' : value !== null && value !== undefined
  );


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
        
        {activeSection === 'specifications' && hasSpecifications && (

          <div className={styles.sectionContent}>
            <div className={styles.specGrid}>
              {/* Availability - Show stock status */}
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Availability:</span>
                <span className={styles.specValue}>
                  {product.stock > 0
                    ? `Limited Inventory. (Ships within 13 weeks of order placement.)`
                    : 'Out of Stock'
                  }
                </span>
              </div>

              {/* Pieces */}
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Pieces:</span>
                <span className={styles.specValue}>Multiple Piece Item</span>
              </div>

              {product.productSpecifications?.material && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Material:</span>
                  <span className={styles.specValue}>{product.productSpecifications.material}</span>
                </div>
              )}

              {product.productSpecifications?.dimensions && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Dimensions:</span>
                  <span className={styles.specValue}>{product.productSpecifications.dimensions}</span>
                </div>
              )}

              {product.productSpecifications?.totalWeight && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Total Weight:</span>
                  <span className={styles.specValue}>{product.productSpecifications.totalWeight}</span>
                </div>
              )}

              {/* Photographed In */}
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Photographed In:</span>
                <span className={styles.specValue}>Nero Nuovo</span>
              </div>

              {/* Base Dimensions */}
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Base Dimensions:</span>
                <span className={styles.specValue}>83" W</span>
              </div>

              {product.productSpecifications?.weightWithWater && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Weight With Water:</span>
                  <span className={styles.specValue}>{product.productSpecifications.weightWithWater}</span>
                </div>
              )}
{/* ---- -------------------------------------------------------------------------------------------------- */}

              {/* {product.productSpecifications?.base_Dimensions && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Base Dimensions:</span>
                  <span className={styles.specValue}>{product.productSpecifications.base_Dimensions}</span>
                </div>
              )} */}

              {/* {product.productSpecifications?.photographed_In && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Photographed In:</span>
                  <span className={styles.specValue}>{product.productSpecifications.photographed_In}</span>
                </div>
              )} */}

              {/* {product.productSpecifications?.pieces && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Pieces:</span>
                  <span className={styles.specValue}>{product.productSpecifications.pieces}</span>
                </div>
              )} */}
              {product.productSpecifications?.waterVolume && (
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Water Volume:</span>
                  <span className={styles.specValue}>{product.productSpecifications.waterVolume}</span>
                </div>
              )}

              {/* <div className={styles.specRow}>
                <span className={styles.specLabel}>Collection:</span>
                <span className={styles.specValue}>
                  {product.collection?.name || 'Not specified'}
                </span>
              </div> */}

              {/* <div className={styles.specRow}>
                <span className={styles.specLabel}>Product Code:</span>
                <span className={styles.specValue}>
                  {product.productCode || `P-${product.id.toString().padStart(3, '0')}-AS`}
                </span>
              </div> */}
              
              {/* <div className={styles.specRow}>
                <span className={styles.specLabel}>Stock Status:</span>
                <span className={`${styles.specValue} ${
                  product.stock > 0 ? styles.inStock : styles.outOfStock
                }`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div> */}
              
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
              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              {hasDetails && (
                <div className={styles.specGrid}>
                  {product.productDetails?.upc && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>UPC:</span>
                      <span className={styles.specValue}>{product.productDetails.upc}</span>
                    </div>
                  )}

                  {product.productDetails?.indoorUseOnly && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Indoor Use Only:</span>
                      <span className={styles.specValue}>{product.productDetails.indoorUseOnly}</span>
                    </div>
                  )}

                  {product.productDetails?.assemblyRequired && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Assembly Required:</span>
                      <span className={styles.specValue}>{product.productDetails.assemblyRequired}</span>
                    </div>
                  )}

                  {product.productDetails?.easeOfAssembly && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Ease of Assembly:</span>
                      <span className={styles.specValue}>{product.productDetails.easeOfAssembly}</span>
                    </div>
                  )}

                  {product.productDetails?.assistanceRequired && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Assistance Required:</span>
                      <span className={styles.specValue}>{product.productDetails.assistanceRequired}</span>
                    </div>
                  )}

                  {product.productDetails?.splashLevel && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Splash Level:</span>
                      <span className={styles.specValue}>{product.productDetails.splashLevel}</span>
                    </div>
                  )}

                  {product.productDetails?.soundLevel && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Sound Level:</span>
                      <span className={styles.specValue}>{product.productDetails.soundLevel}</span>
                    </div>
                  )}

                  {product.productDetails?.soundType && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Sound Type:</span>
                      <span className={styles.specValue}>{product.productDetails.soundType}</span>
                    </div>
                  )}

                  {product.productDetails?.replacementPumpKit && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Replacement Pump Kit:</span>
                      <span className={styles.specValue}>{product.productDetails.replacementPumpKit}</span>
                    </div>
                  )}

                  {product.productDetails?.electricalCordLength && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Electrical Cord Length:</span>
                      <span className={styles.specValue}>{product.productDetails.electricalCordLength}</span>
                    </div>
                  )}

                  {product.productDetails?.pumpSize && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Pump Size:</span>
                      <span className={styles.specValue}>{product.productDetails.pumpSize}</span>
                    </div>
                  )}

                  {product.productDetails?.shipMethod && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Ship Method:</span>
                      <span className={styles.specValue}>{product.productDetails.shipMethod}</span>
                    </div>
                  )}
                  {product.productDetails?.drainage_Info && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Drainage Info:</span>
                      <span className={styles.specValue}>{product.productDetails.drainage_Info}</span>
                    </div>
                  )}

                  {product.productDetails?.inside_Top && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Inside Top:</span>
                      <span className={styles.specValue}>{product.productDetails.inside_Top}</span>
                    </div>
                  )}

                  {product.productDetails?.inside_Bottom && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Inside Bottom:</span>
                      <span className={styles.specValue}>{product.productDetails.inside_Bottom}</span>
                    </div>
                  )}

                  {product.productDetails?.inside_Height && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Inside Height:</span>
                      <span className={styles.specValue}>{product.productDetails.inside_Height}</span>
                    </div>
                  )}

                  {product.productDetails?.factory_Code && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Factory Code:</span>
                      <span className={styles.specValue}>{product.productDetails.factory_Code}</span>
                    </div>
                  )}
                  {product.productDetails?.catalogPage && (
                    <div className={styles.specRow}>
                      <span className={styles.specLabel}>Catalog Page:</span>
                      <span className={styles.specValue}>{product.productDetails.catalogPage}</span>
                    </div>
                  )}
                </div>
              )}
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
              {hasDownloadableContent && (
                <div className={styles.downloadSection}>
                  <h4>Downloadable Content:</h4>
                  <div className={styles.downloadLinks}>
                    {product.downloadableContent?.care && (
                      <a
                        href={product.downloadableContent.care}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadLink}
                      >
                        📄 Care Instructions
                      </a>
                    )}

                    {product.downloadableContent?.productInstructions && (
                      <a
                        href={product.downloadableContent.productInstructions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadLink}
                      >
                        📋 Product Instructions
                      </a>
                    )}

                    {product.downloadableContent?.cad && (
                      <a
                        href={product.downloadableContent.cad}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadLink}
                      >
                        📐 CAD Files
                      </a>
                    )}
                  </div>
                </div>
              )}              
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
