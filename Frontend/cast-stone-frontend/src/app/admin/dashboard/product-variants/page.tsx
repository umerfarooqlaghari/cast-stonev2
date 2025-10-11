/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductVariantModal from '@/components/admin/ProductVariantModal';
import { productService, productVariantService } from '@/services';
import { Product, ProductVariant } from '@/services/types/entities';

export default function ProductVariantsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVariantsLoading, setIsVariantsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await productService.get.getAll();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVariants = async (productId: number) => {
    try {
      setIsVariantsLoading(true);
      const variantsData = await productVariantService.get.getByProductId(productId);
      setVariants(variantsData);
    } catch (error) {
      console.error('Error fetching variants:', error);
      setVariants([]);
    } finally {
      setIsVariantsLoading(false);
    }
  };

  const handleProductSelect = async (product: Product) => {
    setSelectedProduct(product);
    await fetchVariants(product.id);
  };

  const handleAddVariant = () => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }
    setEditingVariant(null);
    setIsModalOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
  };

  const handleDeleteVariant = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      try {
        await productVariantService.delete.delete(id);
        if (selectedProduct) {
          await fetchVariants(selectedProduct.id);
        }
      } catch (error) {
        console.error('Error deleting variant:', error);
        alert('Error deleting variant. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingVariant(null);
  };

  const handleModalSuccess = async () => {
    setIsModalOpen(false);
    setEditingVariant(null);
    if (selectedProduct) {
      await fetchVariants(selectedProduct.id);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Variants Management</h1>
              <p className="text-gray-600">Manage product variants and their properties</p>
            </div>
            {selectedProduct && (
              <button
                onClick={handleAddVariant}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Variant
              </button>
            )}
          </div>

          {/* Product Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search and Select Product
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name or code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {selectedProduct && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Selected Product:</p>
                      <p className="text-lg font-semibold text-blue-900">{selectedProduct.name}</p>
                      {selectedProduct.productCode && (
                        <p className="text-sm text-gray-600">Code: {selectedProduct.productCode}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setVariants([]);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Change Product
                    </button>
                  </div>
                </div>
              )}

              {!selectedProduct && (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Loading products...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No products found
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              {product.productCode && (
                                <p className="text-sm text-gray-500">Code: {product.productCode}</p>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">${product.price.toFixed(2)}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Variants Table */}
          {selectedProduct && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Variants for {selectedProduct.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {variants.length} variant{variants.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {isVariantsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading variants...</p>
                </div>
              ) : variants.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No variants found for this product.</p>
                  <button
                    onClick={handleAddVariant}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Add your first variant
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variant Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Identity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Wholesale Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {variant.variantImages && variant.variantImages.length > 0 ? (
                              <img
                                src={variant.variantImages[0]}
                                alt={variant.variantName || 'Variant'}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-400">No image</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {variant.variantName || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {variant.productCode || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {variant.variantIdentity || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${variant.variantPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {variant.variantWholesalePrice ? `$${variant.variantWholesalePrice.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {variant.variantTags && variant.variantTags.length > 0 ? (
                                variant.variantTags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-sm text-gray-400">No tags</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditVariant(variant)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVariant(variant.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedProduct && (
          <ProductVariantModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            variant={editingVariant}
            productId={selectedProduct.id}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

