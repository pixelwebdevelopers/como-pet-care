'use client';

import React, { useState, useEffect } from 'react';
import styles from './Payments.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  CreditCard,
  DollarSign,
  Receipt,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// --- TSX TYPES & INTERFACES ---
type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface PaymentRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  bookingRef: string;
  service: string;
  amount: string;
  refundedAmount?: string;
  paymentMethod: string;
  paymentDate: string;
  status: PaymentStatus;
  subscriptionIndicator: string;
  paymentIntentId?: string;
}

export default function Payments() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  // Fetch live payments from API
  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/payments?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
      }
    } catch {
      console.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [activeTab, searchQuery]);

  // Handle Refund
  const handleRefund = async (payment: PaymentRecord) => {
    const reason = prompt(
      `Issue refund for ${payment.customerName} (${payment.bookingRef}) - Amount: ${payment.amount}?\nEnter reason:`,
      'Customer requested cancellation',
    );
    if (!reason) return;

    setRefundingId(payment.id);
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: payment.paymentIntentId,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Refund processed successfully!');
        loadPayments();
      } else {
        alert(data.message || 'Refund failed');
      }
    } catch {
      alert('Network error processing refund');
    } finally {
      setRefundingId(null);
    }
  };

  // Select all / row
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPayments.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Filter & Sort
  const filteredPayments = payments.filter((payment) => {
    const matchSearch =
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.amount.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchSearch;
    return payment.status === activeTab && matchSearch;
  });

  const totalCollected = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + parseFloat(p.amount.replace(/[^0-9.]/g, '') || '0'), 0);

  return (
    <div className={styles.paymentsContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Transactions &amp; Payments</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Payments</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#e6edea',
              color: '#123f3c',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            <DollarSign size={15} />
            <span>Total Collected: ${totalCollected.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadPayments}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.paymentsCard}>
        {/* Navigation Tabs Header */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Payments ({payments.length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'paid' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('paid')}
            >
              Succeeded ({payments.filter((p) => p.status === 'paid').length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'refunded' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('refunded')}
            >
              Refunded ({payments.filter((p) => p.status === 'refunded').length})
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className={styles.actionsRow}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by customer, booking ref, or service..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterSortRow}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => setActiveTab('all')}
            >
              <Filter size={15} />
              <span>Reset Filter</span>
            </button>
          </div>
        </div>

        {/* Payments Data Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                  <input
                    type="checkbox"
                    className={styles.customCheckbox}
                    checked={
                      filteredPayments.length > 0 && selectedIds.length === filteredPayments.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className={styles.th}>Customer Name</th>
                <th className={styles.th}>Booking Ref</th>
                <th className={styles.th}>Service Booked</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Payment Method</th>
                <th className={styles.th}>Transaction Date</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading transactions from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CreditCard size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Transactions Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No payment records match your active tab or search criteria.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isChecked = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`${styles.tr} ${isChecked ? styles.trSelected : ''}`}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`}>
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{p.customerName}</span>
                          <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.5)' }}>
                            {p.customerEmail}
                          </span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText} style={{ color: 'var(--primary)' }}>
                          {p.bookingRef}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span>{p.service}</span>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText}>{p.amount}</span>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CreditCard size={14} style={{ color: 'rgba(28,37,36,0.5)' }} />
                          <span style={{ textTransform: 'capitalize' }}>{p.paymentMethod}</span>
                        </div>
                      </td>

                      <td className={styles.td}>{p.paymentDate}</td>

                      <td className={styles.td}>
                        <span
                          className={`${styles.statusTag} ${
                            p.status === 'paid'
                              ? styles.statusPaid
                              : p.status === 'refunded'
                                ? styles.statusRefunded
                                : styles.statusPending
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>

                      <td className={styles.td}>
                        {p.status === 'paid' ? (
                          <button
                            type="button"
                            className={styles.btnSecondary}
                            style={{ padding: '5px 10px', fontSize: '12px', gap: '4px', color: '#b91c1c' }}
                            disabled={refundingId === p.id}
                            onClick={() => handleRefund(p)}
                            title="Refund customer payment"
                          >
                            <RotateCcw size={13} />
                            <span>{refundingId === p.id ? 'Refunding...' : 'Refund'}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'rgba(28,37,36,0.4)' }}>
                            Refunded
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
