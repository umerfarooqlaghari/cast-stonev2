'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { collectionService, productService, orderService, userService } from '@/services';

interface DashboardStats {
  totalCollections: number;
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCollections: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [collections, products, orders, users] = await Promise.all([
          collectionService.get.getAll(),
          productService.get.getAll(),
          orderService.get.getAll(),
          userService.get.getAll(),
        ]);

        // Calculate low stock products (stock < 10)
        const lowStockProducts = products.filter(product => product.stock < 10).length;

        // Calculate pending orders (assuming statusId 1 is pending)
        const pendingOrders = orders.filter(order => order.statusId === 1).length;

        setStats({
          totalCollections: collections.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          lowStockProducts,
          pendingOrders,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Total Collections',
      value: stats.totalCollections,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      href: '/admin/dashboard/collections',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      href: '/admin/dashboard/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      bgColor: 'bg-purple-50',
      href: '/admin/dashboard/orders',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: (
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Low Stock Products',
      value: stats.lowStockProducts,
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      href: '/admin/dashboard/products?filter=lowStock',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-orange-50',
      href: '/admin/dashboard/orders?filter=pending',
    },
  ];

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-3">Welcome to Cast Stone Admin</h1>
            <p className="text-amber-700 text-lg">
              Manage your collections, products, and orders from this comprehensive dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} rounded-lg border border-amber-200 p-6 hover:shadow-lg transition-all duration-200 ${card.href ? 'cursor-pointer hover:scale-105' : ''}`}
                onClick={() => card.href && (window.location.href = card.href)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-800">{card.title}</p>
                    <p className="text-3xl font-bold text-amber-900 mt-2">
                      {isLoading ? (
                        <div className="animate-pulse bg-amber-300 h-8 w-16 rounded"></div>
                      ) : (
                        card.value
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <h2 className="text-xl font-bold text-amber-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a
                href="/admin/dashboard/collections"
                className="flex items-center p-6 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all duration-200 border border-amber-200 hover:shadow-md"
              >
                <svg className="w-8 h-8 text-amber-700 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-semibold text-amber-900">Add Collection</span>
              </a>

              <a
                href="/admin/dashboard/products"
                className="flex items-center p-6 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all duration-200 border border-amber-200 hover:shadow-md"
              >
                <svg className="w-8 h-8 text-amber-700 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-semibold text-amber-900">Add Product</span>
              </a>

              <a
                href="/admin/dashboard/orders"
                className="flex items-center p-6 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all duration-200 border border-amber-200 hover:shadow-md"
              >
                <svg className="w-8 h-8 text-amber-700 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-semibold text-amber-900">Manage Orders</span>
              </a>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
