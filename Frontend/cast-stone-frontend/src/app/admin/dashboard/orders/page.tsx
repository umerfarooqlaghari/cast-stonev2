'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import OrderStatusModal from '@/components/admin/OrderStatusModal';
import { orderService } from '@/services';
import { Order, Status } from '@/services/types/entities';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | ''>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersData, statusesData] = await Promise.all([
        orderService.get.getAll(),
        // We'll need to get statuses from a status endpoint or hardcode common ones
        Promise.resolve([
          { id: 1, statusName: 'Pending' },
          { id: 2, statusName: 'Processing' },
          { id: 3, statusName: 'Shipped' },
          { id: 4, statusName: 'Delivered' },
          { id: 5, statusName: 'Cancelled' },
        ] as Status[])
      ]);
      setOrders(ordersData);
      setStatuses(statusesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleChangeStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleQuickStatusChange = async (orderId: number, statusId: number) => {
    try {
      await orderService.update.updateStatus(orderId, statusId);
      await fetchData();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusModalClose = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdateSuccess = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
    fetchData();
  };

  const getStatusName = (statusId: number) => {
    const status = statuses.find(s => s.id === statusId);
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

  const filterOrdersByDate = (order: Order) => {
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return orderDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orderDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === '' || order.statusId === statusFilter;
    const matchesDate = filterOrdersByDate(order);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
              <p className="text-gray-600">Manage customer orders and update their status</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleQuickStatusChange(0, 2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled
              >
                Bulk Actions
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Orders
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email or order ID..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.statusName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Date
                </label>
                <select
                  id="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.email}</div>
                            {order.phoneNumber && (
                              <div className="text-sm text-gray-500">{order.phoneNumber}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(order.statusId)}`}>
                            {getStatusName(order.statusId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.orderItems?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-amber-600 hover:text-amber-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleChangeStatus(order)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Status
                          </button>
                          {order.statusId === 1 && (
                            <>
                              <button
                                onClick={() => handleQuickStatusChange(order.id, 2)}
                                className="text-green-600 hover:text-green-900 mr-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleQuickStatusChange(order.id, 5)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Decline
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredOrders.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No orders found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {isDetailsModalOpen && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={handleDetailsModalClose}
          />
        )}

        {/* Order Status Modal */}
        {isStatusModalOpen && selectedOrder && (
          <OrderStatusModal
            order={selectedOrder}
            statuses={statuses}
            onClose={handleStatusModalClose}
            onSuccess={handleStatusUpdateSuccess}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
