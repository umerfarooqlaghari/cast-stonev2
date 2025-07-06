'use client';

import React from 'react';
import { Order } from '@/services/types/entities';

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const getStatusBadgeColor = (statusId: number) => {
    switch (statusId) {
      case 1: return 'bg-yellow-100 text-yellow-800'; // Pending
      case 2: return 'bg-blue-100 text-blue-800'; // Processing
      case 3: return 'bg-purple-100 text-purple-800'; // Shipped
      case 4: return 'bg-green-100 text-green-800'; // Delivered
      case 5: return 'bg-red-100 text-red-800'; // Cancelled
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (statusId: number) => {
    const statusNames: Record<number, string> = {
      1: 'Pending',
      2: 'Processing',
      3: 'Shipped',
      4: 'Delivered',
      5: 'Cancelled'
    };
    return statusNames[statusId] || 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Order Details - #{order.id}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Information */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Order Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order ID:</span>
                  <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.statusId)}`}>
                    {getStatusName(order.statusId)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span className="text-sm font-medium text-gray-900">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Payment Method:</span>
                  <span className="text-sm font-medium text-gray-900">{order.paymentMethod || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Order Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium text-gray-900">{order.email}</span>
                </div>
                {order.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium text-gray-900">{order.phoneNumber}</span>
                  </div>
                )}
                {order.country && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Country:</span>
                    <span className="text-sm font-medium text-gray-900">{order.country}</span>
                  </div>
                )}
                {order.city && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">City:</span>
                    <span className="text-sm font-medium text-gray-900">{order.city}</span>
                  </div>
                )}
                {order.zipCode && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Zip Code:</span>
                    <span className="text-sm font-medium text-gray-900">{order.zipCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Order Items</h4>
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">
                            {item.product?.name || `Product ID: ${item.productId}`}
                          </h5>
                          {item.product?.description && (
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {item.product.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${item.priceAtPurchaseTime.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-medium text-gray-900">
                            ${(item.priceAtPurchaseTime * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Order Total */}
                  <div className="bg-white p-3 rounded border border-amber-200 bg-amber-50">
                    <div className="flex justify-between text-base font-medium">
                      <span className="text-gray-900">Order Total:</span>
                      <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No items found for this order.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
