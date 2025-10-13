'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { WholesaleBuyer } from '@/services/types/entities';
import { wholesaleBuyerService } from '@/services';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import styles from './page.module.css';

// Dynamically import AddLocationModal to avoid SSR issues with Leaflet
const AddLocationModal = dynamic(() => import('@/components/admin/AddLocationModal'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export default function WholesaleBuyersPage() {
  const [buyers, setBuyers] = useState<WholesaleBuyer[]>([]);
  const [filteredBuyers, setFilteredBuyers] = useState<WholesaleBuyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState<WholesaleBuyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationBuyer, setLocationBuyer] = useState<WholesaleBuyer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { admin } = useAdminAuth();

  const fetchBuyers = async () => {
    try {
      setIsLoading(true);
      const response = await wholesaleBuyerService.get.getAll();
      if (response.success && response.data) {
        setBuyers(response.data);
      } else {
        setError(response.message || 'Failed to fetch wholesale buyers');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBuyers = useCallback(() => {
    let filtered = buyers;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(buyer =>
        buyer.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(buyer =>
        buyer.firstName.toLowerCase().includes(term) ||
        buyer.lastName.toLowerCase().includes(term) ||
        buyer.email.toLowerCase().includes(term) ||
        buyer.companyName.toLowerCase().includes(term)
      );
    }

    setFilteredBuyers(filtered);
  }, [buyers, filterStatus, searchTerm]);

  useEffect(() => {
    fetchBuyers();
  }, []);

  useEffect(() => {
    filterBuyers();
  }, [filterBuyers]);

  const handleApprove = async (buyer: WholesaleBuyer) => {
    if (!admin?.id) return;

    try {
      setIsProcessing(true);
      const response = await wholesaleBuyerService.post.approveApplication(buyer.id, {
        adminUserId: admin.id,
        adminNotes: 'Approved by admin'
      });

      if (response.success) {
        await fetchBuyers();
        setIsModalOpen(false);
        setSelectedBuyer(null);
      } else {
        setError(response.message || 'Failed to approve application');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (buyer: WholesaleBuyer, reason: string) => {
    if (!admin?.id) return;

    try {
      setIsProcessing(true);
      const response = await wholesaleBuyerService.post.rejectApplication(buyer.id, {
        adminUserId: admin.id,
        adminNotes: reason
      });

      if (response.success) {
        await fetchBuyers();
        setIsModalOpen(false);
        setSelectedBuyer(null);
      } else {
        setError(response.message || 'Failed to reject application');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClass = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      rejected: styles.statusRejected
    }[status.toLowerCase()] || styles.statusPending;

    return (
      <span className={`${styles.statusBadge} ${statusClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    return {
      all: buyers.length,
      pending: buyers.filter(b => b.status.toLowerCase() === 'pending').length,
      approved: buyers.filter(b => b.status.toLowerCase() === 'approved').length,
      rejected: buyers.filter(b => b.status.toLowerCase() === 'rejected').length
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading wholesale buyers...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Wholesale Buyers</h1>
            <p>Manage wholesale buyer applications and approvals</p>
          </div>

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => setError('')} className={styles.closeError}>×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Applications</h3>
          <p className={styles.statNumber}>{statusCounts.all}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Pending Review</h3>
          <p className={`${styles.statNumber} ${styles.pending}`}>{statusCounts.pending}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Approved</h3>
          <p className={`${styles.statNumber} ${styles.approved}`}>{statusCounts.approved}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Rejected</h3>
          <p className={`${styles.statNumber} ${styles.rejected}`}>{statusCounts.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="search">Search:</label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or company..."
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className={styles.statusFilter}
          >
            <option value="all">All ({statusCounts.all})</option>
            <option value="pending">Pending ({statusCounts.pending})</option>
            <option value="approved">Approved ({statusCounts.approved})</option>
            <option value="rejected">Rejected ({statusCounts.rejected})</option>
          </select>
        </div>
      </div>

      {/* Buyers Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Business Type</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer) => (
              <tr key={buyer.id}>
                <td>{buyer.firstName} {buyer.lastName}</td>
                <td>{buyer.email}</td>
                <td>{buyer.companyName}</td>
                <td>{buyer.businessType}</td>
                <td>{getStatusBadge(buyer.status)}</td>
                <td>{formatDate(buyer.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedBuyer(buyer);
                        setIsModalOpen(true);
                      }}
                      className={styles.viewButton}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setLocationBuyer(buyer);
                        setIsLocationModalOpen(true);
                      }}
                      className={styles.viewButton}
                      style={{ backgroundColor: '#16a34a' }}
                    >
                      Add Location
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBuyers.length === 0 && (
          <div className={styles.emptyState}>
            <p>No wholesale buyers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Modal for buyer details */}
      {isModalOpen && selectedBuyer && (
        <BuyerDetailsModal
          buyer={selectedBuyer}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBuyer(null);
          }}
          onApprove={() => handleApprove(selectedBuyer)}
          onReject={(reason) => handleReject(selectedBuyer, reason)}
          isProcessing={isProcessing}
        />
      )}

      {/* Modal for adding location */}
      {isLocationModalOpen && locationBuyer && (
        <AddLocationModal
          buyer={locationBuyer}
          onClose={() => {
            setIsLocationModalOpen(false);
            setLocationBuyer(null);
          }}
          onSuccess={() => {
            // Optionally refresh the buyers list or show a success message
            fetchBuyers();
          }}
        />
      )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

// Modal component for buyer details
interface BuyerDetailsModalProps {
  buyer: WholesaleBuyer;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
  isProcessing: boolean;
}

function BuyerDetailsModal({ buyer, onClose, onApprove, onReject, isProcessing }: BuyerDetailsModalProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Wholesale Buyer Application</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.buyerInfo}>
            <h3>Personal Information</h3>
            <div className={styles.infoGrid}>
              <div><strong>Name:</strong> {buyer.firstName} {buyer.lastName}</div>
              <div><strong>Email:</strong> {buyer.email}</div>
              <div><strong>Phone:</strong> {buyer.phone}</div>
            </div>

            <h3>Business Information</h3>
            <div className={styles.infoGrid}>
              <div><strong>Company:</strong> {buyer.companyName}</div>
              <div><strong>Business Type:</strong> {buyer.businessType}</div>
              {buyer.otherBusinessType && (
                <div><strong>Other Business Type:</strong> {buyer.otherBusinessType}</div>
              )}
              {buyer.taxNumber && (
                <div><strong>Tax Number:</strong> {buyer.taxNumber}</div>
              )}
            </div>

            <h3>Address</h3>
            <div className={styles.address}>
              <p>{buyer.businessAddress}</p>
              <p>{buyer.city}, {buyer.state} {buyer.zipCode}</p>
            </div>

            <h3>How They Heard About Us</h3>
            <div className={styles.hearAbout}>
              {buyer.howDidYouHear.map((item, index) => (
                <span key={index} className={styles.tag}>{item}</span>
              ))}
              {buyer.otherHowDidYouHear && (
                <p><strong>Other:</strong> {buyer.otherHowDidYouHear}</p>
              )}
            </div>

            {buyer.comments && (
              <>
                <h3>Comments</h3>
                <p className={styles.comments}>{buyer.comments}</p>
              </>
            )}

            <h3>Application Status</h3>
            <div className={styles.statusInfo}>
              <p><strong>Status:</strong> {buyer.status}</p>
              <p><strong>Applied:</strong> {new Date(buyer.createdAt).toLocaleString()}</p>
              {buyer.approvedAt && (
                <p><strong>Processed:</strong> {new Date(buyer.approvedAt).toLocaleString()}</p>
              )}
              {buyer.adminNotes && (
                <p><strong>Admin Notes:</strong> {buyer.adminNotes}</p>
              )}
            </div>
          </div>
        </div>

        {buyer.status.toLowerCase() === 'pending' && (
          <div className={styles.modalActions}>
            {!showRejectForm ? (
              <>
                <button
                  onClick={onApprove}
                  disabled={isProcessing}
                  className={styles.approveButton}
                >
                  {isProcessing ? 'Processing...' : 'Approve Application'}
                </button>
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                  className={styles.rejectButton}
                >
                  Reject Application
                </button>
              </>
            ) : (
              <div className={styles.rejectForm}>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className={styles.rejectTextarea}
                  rows={3}
                />
                <div className={styles.rejectActions}>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={isProcessing || !rejectReason.trim()}
                    className={styles.confirmRejectButton}
                  >
                    {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectReason('');
                    }}
                    disabled={isProcessing}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
