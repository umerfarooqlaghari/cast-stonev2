'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductModal from '@/components/admin/ProductModal';
import StockUpdateModal from '@/components/admin/StockUpdateModal';
import { productService, collectionService } from '@/services';
import { Product, Collection } from '@/services/types/entities';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdateProduct, setStockUpdateProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<number | ''>('');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsData, collectionsData] = await Promise.all([
        productService.get.getAll(),
        collectionService.get.getAll(),
      ]);
      setProducts(productsData);
      setCollections(collectionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleUpdateStock = (product: Product) => {
    setStockUpdateProduct(product);
    setIsStockModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete.deleteById(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleStockModalClose = () => {
    setIsStockModalOpen(false);
    setStockUpdateProduct(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleStockUpdateSuccess = () => {
    setIsStockModalOpen(false);
    setStockUpdateProduct(null);
    fetchData();
  };

  const getCollectionName = (collectionId: number) => {
    const collection = collections.find(c => c.id === collectionId);
    return collection?.name || 'Unknown';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCollection = collectionFilter === '' || product.collectionId === collectionFilter;
    
    let matchesStock = true;
    switch (stockFilter) {
      case 'inStock':
        matchesStock = product.stock > 10;
        break;
      case 'lowStock':
        matchesStock = product.stock > 0 && product.stock <= 10;
        break;
      case 'outOfStock':
        matchesStock = product.stock === 0;
        break;
    }
    
    return matchesSearch && matchesCollection && matchesStock;
  });

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600">Manage your product catalog and inventory</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Products
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Collection
                </label>
                <select
                  id="collection"
                  value={collectionFilter}
                  onChange={(e) => setCollectionFilter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">All Collections</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name} (Level {collection.level})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Stock
                </label>
                <select
                  id="stock"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Products</option>
                  <option value="inStock">In Stock (>10)</option>
                  <option value="lowStock">Low Stock (1-10)</option>
                  <option value="outOfStock">Out of Stock (0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              {product.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {product.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getCollectionName(product.collectionId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900 mr-2">{product.stock}</span>
                              <button
                                onClick={() => handleUpdateStock(product)}
                                className="text-amber-600 hover:text-amber-900 text-xs"
                                title="Update stock"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                              {stockStatus.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-amber-600 hover:text-amber-900 mr-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredProducts.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No products found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Product Modal */}
        {isModalOpen && (
          <ProductModal
            product={editingProduct}
            collections={collections}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}

        {/* Stock Update Modal */}
        {isStockModalOpen && stockUpdateProduct && (
          <StockUpdateModal
            product={stockUpdateProduct}
            onClose={handleStockModalClose}
            onSuccess={handleStockUpdateSuccess}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
