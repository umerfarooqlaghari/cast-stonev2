'use client';

import React, { useState } from 'react';
import { orderService } from '@/services';
import { Order, Status } from '@/services/types/entities';

interface OrderStatusModalProps {
  order: Order;
  statuses: Status[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function OrderStatusModal({ order, statuses, onClose, onSuccess }: OrderStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState(order.statusId);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedStatusId === order.statusId) {
      setError('Please select a different status to update.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await orderService.update.updateStatus(order.id, selectedStatusId);
      onSuccess();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentStatusName = () => {
    const status = statuses.find(s => s.id === order.statusId);
    return status?.statusName || 'Unknown';
  };

  const getNewStatusName = () => {
    const status = statuses.find(s => s.id === selectedStatusId);
    return status?.statusName || 'Unknown';
  };

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

  const getStatusDescription = (statusId: number) => {
    const descriptions: Record<number, string> = {
      1: 'Order is waiting for review and processing.',
      2: 'Order is being prepared and processed.',
      3: 'Order has been shipped and is on its way.',
      4: 'Order has been successfully delivered.',
      5: 'Order has been cancelled.'
    };
    return descriptions[statusId] || '';
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Update Order Status
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
          <h4 className="font-medium text-gray-900">Order #{order.id}</h4>
          <p className="text-sm text-gray-600">{order.email}</p>
          <p className="text-sm text-gray-600">Total: ${order.totalAmount.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.statusId)}`}>
                {getCurrentStatusName()}
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {getStatusDescription(order.statusId)}
              </p>
            </div>
          </div>

          {/* New Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              New Status *
            </label>
            <select
              id="status"
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              required
            >
              {statuses.map(status => (
                <option key={status.id} value={status.id}>
                  {status.statusName}
                </option>
              ))}
            </select>
            {selectedStatusId !== order.statusId && (
              <p className="text-sm text-gray-600 mt-1">
                {getStatusDescription(selectedStatusId)}
              </p>
            )}
          </div>

          {/* Status Change Preview */}
          {selectedStatusId !== order.statusId && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Status will change from: </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.statusId)} mr-2`}>
                  {getCurrentStatusName()}
                </span>
                <span className="font-medium">to: </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedStatusId)}`}>
                  {getNewStatusName()}
                </span>
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              placeholder="Add any notes about this status change..."
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setSelectedStatusId(2)}
              className={`px-3 py-2 text-sm rounded-md border ${
                selectedStatusId === 2 
                  ? 'bg-blue-100 border-blue-300 text-blue-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Approve (Processing)
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusId(5)}
              className={`px-3 py-2 text-sm rounded-md border ${
                selectedStatusId === 5 
                  ? 'bg-red-100 border-red-300 text-red-800' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel Order
            </button>
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
              disabled={isSubmitting || selectedStatusId === order.statusId}
              className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
