'use client';

import React, { useState } from 'react';
import { productService } from '@/services';
import { Product } from '@/services/types/entities';

interface StockUpdateModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockUpdateModal({ product, onClose, onSuccess }: StockUpdateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [updateType, setUpdateType] = useState<'set' | 'increase' | 'decrease'>('set');
  const [amount, setAmount] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let newStock: number;
    
    switch (updateType) {
      case 'set':
        newStock = amount;
        break;
      case 'increase':
        newStock = product.stock + amount;
        break;
      case 'decrease':
        newStock = product.stock - amount;
        break;
      default:
        newStock = product.stock;
    }

    if (newStock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await productService.update.updateStock(product.id, newStock);
      onSuccess();
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNewStockValue = () => {
    switch (updateType) {
      case 'set':
        return amount;
      case 'increase':
        return product.stock + amount;
      case 'decrease':
        return Math.max(0, product.stock - amount);
      default:
        return product.stock;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Update Stock
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="font-medium text-gray-900">{product.name}</h4>
          <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{product.stock}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Update Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="set"
                  checked={updateType === 'set'}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Set to specific amount</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="increase"
                  checked={updateType === 'increase'}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Increase by amount</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="decrease"
                  checked={updateType === 'decrease'}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Decrease by amount</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              {updateType === 'set' ? 'New Stock Amount' : 'Amount to ' + updateType}
            </label>
            <input
              type="number"
              id="amount"
              min="0"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Preview */}
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              <span className="font-medium">New stock will be: </span>
              <span className="font-bold">{getNewStockValue()}</span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
