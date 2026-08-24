'use client';

import React, { useState } from 'react';
import styles from './Payments.module.css';

// --- TSX TYPES & INTERFACES ---
type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface PaymentRecord {
  id: string;
  customerName: string;
  bookingRef: string;
  service: string;
  amount: string;
  paymentDate: string;
  status: PaymentStatus;
  subscriptionIndicator: string;
}

// --- SVG ICON COMPONENTS ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
    />
  </svg>
);

const EllipsisIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>
);

export default function Payments() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'failed' | 'refunded'>(
    'all',
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Seed list matching screenshot values
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '3',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '4',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '5',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '6',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '7',
      customerName: 'Sarah Johnson',
      bookingRef: '#CMP-1024',
      service: 'Dog Walking',
      amount: '$34',
      paymentDate: 'May 20, 2026',
      status: 'paid',
      subscriptionIndicator: 'Weekly Subscription',
    },
    {
      id: '8',
      customerName: 'Lisa Carter',
      bookingRef: '#CMP-1025',
      service: 'Cat Care',
      amount: '$45',
      paymentDate: 'May 19, 2026',
      status: 'pending',
      subscriptionIndicator: 'One-time Payment',
    },
    {
      id: '9',
      customerName: 'Michael Green',
      bookingRef: '#CMP-1026',
      service: 'Pet Sitting',
      amount: '$120',
      paymentDate: 'May 18, 2026',
      status: 'failed',
      subscriptionIndicator: 'Monthly Subscription',
    },
    {
      id: '10',
      customerName: 'Emily Watson',
      bookingRef: '#CMP-1027',
      service: 'Training Program',
      amount: '$250',
      paymentDate: 'May 17, 2026',
      status: 'refunded',
      subscriptionIndicator: 'Weekly Subscription',
    },
  ]);

  // --- HANDLERS ---
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

  // --- FILTER & SORT LOGIC ---
  const filteredPayments = payments
    .filter((p) => {
      if (activeTab === 'paid') return p.status === 'paid';
      if (activeTab === 'pending') return p.status === 'pending';
      if (activeTab === 'failed') return p.status === 'failed';
      if (activeTab === 'refunded') return p.status === 'refunded';
      return true;
    })
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.customerName.toLowerCase().includes(q) ||
        p.bookingRef.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'name-desc') return b.customerName.localeCompare(a.customerName);
      if (sortBy === 'amount-desc') {
        const valA = parseFloat(a.amount.replace('$', ''));
        const valB = parseFloat(b.amount.replace('$', ''));
        return valB - valA;
      }
      if (sortBy === 'amount-asc') {
        const valA = parseFloat(a.amount.replace('$', ''));
        const valB = parseFloat(b.amount.replace('$', ''));
        return valA - valB;
      }
      return 0;
    });

  const allSelected =
    filteredPayments.length > 0 && filteredPayments.every((p) => selectedIds.includes(p.id));

  return (
    <div className={styles.paymentsContainer}>
      {/* Title Subheader */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Payments</h1>
        <span className="dashboard-breadcrumb">Home &gt; Payments</span>
      </div>

      <div className={styles.paymentsCard}>
        {/* Card Titles block */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Payments</h2>
          <p className={styles.cardSubtitle}>Review and manage your payments record.</p>
        </div>

        {/* Status Tabs row */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'pending' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'paid' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('paid')}
            >
              Paid
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'failed' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('failed')}
            >
              Failed
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'refunded' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('refunded')}
            >
              Refunded
            </button>
          </div>
        </div>

        {/* Action rows */}
        <div className={styles.actionsRow}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by Booking reference, Customer name, Pet name, Service...."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterSortRow}>
            <button
              className={styles.btnSecondary}
              onClick={() => {
                setActiveTab((prev) => {
                  if (prev === 'all') return 'paid';
                  if (prev === 'paid') return 'pending';
                  if (prev === 'pending') return 'failed';
                  if (prev === 'failed') return 'refunded';
                  return 'all';
                });
              }}
            >
              <FilterIcon />
              Filters: {activeTab.toUpperCase()}
            </button>

            <button
              className={styles.btnSecondary}
              onClick={() => {
                setSortBy((prev) => (prev === 'name-asc' ? 'amount-desc' : 'name-asc'));
              }}
            >
              <SortIcon />
              Sort By: {sortBy === 'name-asc' ? 'A-Z' : 'Amount'}
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                  <input
                    type="checkbox"
                    className={styles.customCheckbox}
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className={styles.th}>Customer Name</th>
                <th className={styles.th}>Booking Reference</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Payment Date</th>
                <th className={styles.th}>Payment Status</th>
                <th className={styles.th}>Subscription indicator</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px' }}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isChecked = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      style={{
                        backgroundColor: isChecked ? 'rgba(177, 138, 69, 0.03)' : 'transparent',
                      }}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`} data-label="Select">
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(p.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td} data-label="Customer Name">
                        <span
                          className={styles.clientLink}
                          onClick={() => alert(`View client details: ${p.customerName}`)}
                        >
                          {p.customerName}
                        </span>
                      </td>

                      <td className={styles.td} data-label="Booking Reference">
                        <span
                          className={styles.refLink}
                          onClick={() => alert(`View booking details: ${p.bookingRef}`)}
                        >
                          {p.bookingRef}
                        </span>
                      </td>

                      <td className={styles.td} data-label="Service">
                        <span className={styles.boldText}>{p.service}</span>
                      </td>

                      <td className={styles.td} data-label="Amount" style={{ fontWeight: 600 }}>
                        {p.amount}
                      </td>

                      <td className={styles.td} data-label="Payment Date">
                        {p.paymentDate}
                      </td>

                      <td className={styles.td} data-label="Payment Status">
                        {p.status === 'paid' && (
                          <span className={`${styles.statusTag} ${styles.statusPaid}`}>
                            <span className={`${styles.statusDot} ${styles.dotPaid}`} />
                            Paid
                          </span>
                        )}
                        {p.status === 'pending' && (
                          <span className={`${styles.statusTag} ${styles.statusPending}`}>
                            <span className={`${styles.statusDot} ${styles.dotPending}`} />
                            Pending
                          </span>
                        )}
                        {p.status === 'failed' && (
                          <span className={`${styles.statusTag} ${styles.statusFailed}`}>
                            <span className={`${styles.statusDot} ${styles.dotFailed}`} />
                            Failed
                          </span>
                        )}
                        {p.status === 'refunded' && (
                          <span className={`${styles.statusTag} ${styles.statusRefunded}`}>
                            <span className={`${styles.statusDot} ${styles.dotRefunded}`} />
                            Refunded
                          </span>
                        )}
                      </td>

                      <td className={styles.td} data-label="Subscription indicator">
                        {p.subscriptionIndicator}
                      </td>

                      <td className={styles.td} data-label="Action">
                        <button
                          className={styles.btnActionEllipsis}
                          onClick={() => {
                            if (p.status === 'paid') {
                              if (
                                window.confirm(`Issue refund for payment record ${p.bookingRef}?`)
                              ) {
                                setPayments((prev) =>
                                  prev.map((item) =>
                                    item.id === p.id ? { ...item, status: 'refunded' } : item,
                                  ),
                                );
                              }
                            } else {
                              alert(`No payment actions available for ${p.status} status.`);
                            }
                          }}
                        >
                          <EllipsisIcon />
                        </button>
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
