/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductVariant } from '@/services/types/entities';
import { productVariantService } from '@/services';
import { useCart } from '@/contexts/CartContext';
import { useWholesaleAuth } from '@/contexts/WholesaleAuthContext';
import { useProduct, useProductRecommendations } from '@/hooks/useProducts';
import ProductImageGallery from '@/components/products/ProductImageGallery/ProductImageGallery';
import ProductSpecifications from '@/components/products/ProductSpecifications/ProductSpecifications';
import PatinaSelector from '@/components/products/PatinaSelector/PatinaSelector';
import VariantSelector from '@/components/products/VariantSelector/VariantSelector';
import RelatedProducts from '@/components/products/RelatedProducts/RelatedProducts';
import { getPatinaColor } from '@/utils/patinaOptions';
import styles from './productPage.module.css';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart } = useCart();
  const { isApprovedWholesaleBuyer } = useWholesaleAuth();

  // Use React Query hooks for cached data
  const { data: product, isLoading: isLoadingProduct, error: productError } = useProduct(productId);
  const { data: relatedProducts = [], isLoading: isLoadingRelated } = useProductRecommendations(productId, 6);

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPatina, setSelectedPatina] = useState<string>('Alpine Stone');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isLoading = isLoadingProduct || isLoadingRelated;
  const error = productError ? 'Failed to load product details' : null;

  // Fetch variants when product is loaded
  useEffect(() => {
    const fetchVariants = async () => {
      if (!productId) return;

      try {
        const variantsData = await productVariantService.get.getByProductId(productId).catch(() => []);
        setVariants(variantsData);
      } catch (err) {
        console.error('Error fetching variants:', err);
      }
    };

    fetchVariants();
  }, [productId]);

  // Reset selected variant when product changes
  useEffect(() => {
    setSelectedVariantId(null);
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    // If product has variants, require variant selection
    if (variants.length > 0 && !selectedVariantId) {
      alert('Please select a variant before adding to cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity, undefined, selectedVariantId || undefined);
      // You could add a success notification here
    } catch (err) {
      console.error('Error adding to cart:', err);
      // You could add an error notification here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Get selected variant
  const selectedVariant = selectedVariantId ? variants.find(v => v.id === selectedVariantId) : null;

  // Determine which price to display (variant price takes precedence)
  const getDisplayPrice = () => {
    if (selectedVariant) {
      // Use variant pricing with fallback to product pricing
      if (isApprovedWholesaleBuyer && selectedVariant.variantWholesalePrice) {
        return selectedVariant.variantWholesalePrice;
      } else if (isApprovedWholesaleBuyer && product?.wholeSalePrice) {
        return product.wholeSalePrice;
      } else {
        return selectedVariant.variantPrice;
      }
    } else {
      // Use product pricing
      return isApprovedWholesaleBuyer && product?.wholeSalePrice
        ? product.wholeSalePrice
        : product?.price || 0;
    }
  };

  const displayPrice = getDisplayPrice();
  const showWholesaleLabel = isApprovedWholesaleBuyer && (
    (selectedVariant && selectedVariant.variantWholesalePrice) ||
    (!selectedVariant && product?.wholeSalePrice)
  );

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <h1>Product Not Found</h1>
        <p>{error || 'The requested product could not be found.'}</p>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        {/* Main Product Section */}
        <div className={styles.productMain}>
          {/* Product Image Gallery */}
          <div className={styles.imageSection}>
            <ProductImageGallery
              images={selectedVariant && selectedVariant.variantImages && selectedVariant.variantImages.length > 0
                ? selectedVariant.variantImages
                : product.images}
              productName={selectedVariant?.variantName || product.name}
              selectedPatina={selectedPatina}
              patinaColor={getPatinaColor(selectedPatina)}
            />
          </div>

          {/* Product Details */}
          <div className={styles.detailsSection}>
            <h1 className={styles.productTitle}>
              {product.name}
              {selectedVariant && selectedVariant.variantName && (
                <span style={{ fontSize: '0.8em', color: '#6b7280', marginLeft: '0.5rem' }}>
                  - {selectedVariant.variantName}
                </span>
              )}
            </h1>

            {/* Product Code */}
            <div className={styles.productCode}>
              Product Code: {(selectedVariant && selectedVariant.productCode) || product.productCode || `P-${product.id.toString().padStart(3, '0')}-AS`}
            </div>

            {/* Variant Description (if available) */}
            {selectedVariant && selectedVariant.variantDescription && (
              <div className={styles.variantDescription}>
                {selectedVariant.variantDescription}
              </div>
            )}

            {/* Key Specifications - Styled Table Look */}
            {product.productSpecifications && (
              <>{console.log("Full productSpecifications object:", product.productSpecifications)}
              <div className={styles.keySpecsTable}>
              <div className={styles.specRow}>
                <span className={styles.label}>Availability:</span>
                <span className={styles.value}>
                  {isInStock ? 
                    `In Stock` : 
                    'Out of Stock'
                  }
                </span>
              </div> 

                {product.productSpecifications.pieces && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Pieces:</span>
                    <span className={styles.value}>{product.productSpecifications.pieces}</span>
                  </div>
                )}
                {product.productSpecifications.material && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Material:</span>
                    <span className={styles.value}>{product.productSpecifications.material}</span>
                  </div>
                )}
                {product.productSpecifications.dimensions && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Dimensions:</span>
                    <span className={styles.value}>{product.productSpecifications.dimensions}</span>
                  </div>
                )}
                {product.productSpecifications.totalWeight && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Total Weight:</span>
                    <span className={styles.value}>{product.productSpecifications.totalWeight}</span>
                  </div>
                )}
                {product.productSpecifications.photographed_In && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Photographed In:</span>
                    <span className={styles.value}>{product.productSpecifications.photographed_In}</span>
                  </div>
                )}
                {product.productSpecifications.base_Dimensions && (
                  <div className={styles.specRow}>
                    <span className={styles.label}>Base Dimensions:</span>
                    <span className={styles.value}>{product.productSpecifications.base_Dimensions}</span>
                  </div>
                )}
              </div>
              </>
            )}

            {/* Product Info Grid */}
             
               
                         


            <div className={styles.priceSection}>
                <div className={styles.priceRow}>
                  <div className={styles.priceDisplay}>
                    <span className={styles.price}>
                      {formatPrice(displayPrice)}
                    </span>
                    {showWholesaleLabel && (
                      <span className={styles.wholesaleLabel}>Wholesale Price</span>
                    )}
                    {isApprovedWholesaleBuyer && product.wholeSalePrice && (
                      <span className={styles.retailPrice}>
                        Retail: {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
            

            {/* Quantity and Add to Cart */}
              {/* <div className={styles.purchaseSection}> */}
              <span><span></span></span>
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity">Quantity:</label>
                  <div className={styles.quantityControls}>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className={styles.quantityBtn}
                    >
                      -
                    </button>
                    <input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      max={product.stock}
                      className={styles.quantityInput}
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className={styles.quantityBtn}
                    >
                      +
                    </button>
                  </div>
                </div>
                
              <div className={styles.addToCartRow}>
                <div className={styles.addToCartLabel}>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (variants.length > 0 && !selectedVariantId)}
                  className={styles.addToCartBtn}
                  title={variants.length > 0 && !selectedVariantId ? 'Please select a variant first' : ''}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                {variants.length > 0 && !selectedVariantId && (
                  <p style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Please select a variant before adding to cart
                  </p>
                )}
              </div>
            </div>
            </div>     
            </div>

              <PatinaSelector
              selectedPatina={selectedPatina}
              onPatinaChange={setSelectedPatina}
            />

            {/* Variant Selector */}
            {variants.length > 0 && (
              <VariantSelector
                variants={variants}
                selectedVariantId={selectedVariantId}
                onVariantChange={setSelectedVariantId}
                required={true}
              />
            )}

        {/* Product Specifications */}
        <ProductSpecifications product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
