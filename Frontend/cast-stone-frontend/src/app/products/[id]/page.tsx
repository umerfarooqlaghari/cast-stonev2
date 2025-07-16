/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product } from '@/services/types/entities';
import { productService } from '@/services';
import { useCart } from '@/contexts/CartContext';
import ProductImageGallery from '@/components/products/ProductImageGallery/ProductImageGallery';
import ProductSpecifications from '@/components/products/ProductSpecifications/ProductSpecifications';
import PatinaSelector from '@/components/products/PatinaSelector/PatinaSelector';
import RelatedProducts from '@/components/products/RelatedProducts/RelatedProducts';
import styles from './productPage.module.css';

export default function ProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPatina, setSelectedPatina] = useState<string>('Alpine Stone');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [productData, relatedData] = await Promise.all([
        productService.get.getById(productId),
        productService.get.getRecommendations(productId, 6)
      ]);

      setProduct(productData);
      setRelatedProducts(relatedData);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      setIsAddingToCart(true);
      await addToCart(product.id, quantity);
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
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Product Details */}
          <div className={styles.detailsSection}>
            <h1 className={styles.productTitle}>{product.name}</h1>
            
            {/* Product Code */}
            <div className={styles.productCode}>
              Product Code: {product.productCode || `P-${product.id.toString().padStart(3, '0')}-AS`}
            </div>

            {/* Key Specifications - Styled Table Look */}
            {product.productSpecifications && (
              <>{console.log("Full productSpecifications object:", product.productSpecifications)}
              <div className={styles.keySpecsTable}>
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
             <div className={styles.productInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Availability:</span>
                <span className={styles.infoValue}>
                  {isInStock ? 
                    `In Stock` : 
                    'Out of Stock'
                  }
                </span>
              </div> 
              </div>
               
                         


            <div className={styles.priceSection}>
                <div className={styles.priceRow}>
    
              <span className={styles.price}>
                {formatPrice(product.price)}</span>
            

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
                  disabled={isAddingToCart}
                  className={styles.addToCartBtn}
                >
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
            </div>     
            </div>

              <PatinaSelector 
              selectedPatina={selectedPatina}
              onPatinaChange={setSelectedPatina}
            />


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
