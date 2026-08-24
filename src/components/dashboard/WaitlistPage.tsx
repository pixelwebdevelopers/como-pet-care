'use client';

import React, { useState } from 'react';
import styles from './WaitlistPage.module.css';

// --- TSX TYPES & INTERFACES ---
type WaitlistStatus = 'waiting' | 'availability_sent' | 'confirmed' | 'expired' | 'removed';

interface WaitlistRecord {
  id: string;
  customerName: string;
  requestedService: string;
  preferredDate: string;
  preferredTime: string;
  requestDate: string;
  status: WaitlistStatus;
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

export default function WaitlistPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<
    'all' | 'waiting' | 'availability_sent' | 'confirmed' | 'expired' | 'removed'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Seed list matching screenshot values
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>([
    {
      id: '1',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '3',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '4',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '5',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '6',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '7',
      customerName: 'Sarah Johnson',
      requestedService: 'Dog Walking',
      preferredDate: 'May 20, 2026',
      preferredTime: '08:00 AM',
      requestDate: 'May 18, 2026',
      status: 'confirmed',
    },
    {
      id: '8',
      customerName: 'John Doe',
      requestedService: 'Pet Sitting',
      preferredDate: 'May 24, 2026',
      preferredTime: '10:00 AM',
      requestDate: 'May 22, 2026',
      status: 'waiting',
    },
    {
      id: '9',
      customerName: 'Elizabeth Watson',
      requestedService: 'Grooming',
      preferredDate: 'May 25, 2026',
      preferredTime: '02:00 PM',
      requestDate: 'May 23, 2026',
      status: 'availability_sent',
    },
    {
      id: '10',
      customerName: 'Lisa Miller',
      requestedService: 'Training Program',
      preferredDate: 'May 26, 2026',
      preferredTime: '09:00 AM',
      requestDate: 'May 20, 2026',
      status: 'expired',
    },
  ]);

  // --- HANDLERS ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredWaitlist.map((w) => w.id));
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
  const filteredWaitlist = waitlist
    .filter((w) => {
      if (activeTab === 'waiting') return w.status === 'waiting';
      if (activeTab === 'availability_sent') return w.status === 'availability_sent';
      if (activeTab === 'confirmed') return w.status === 'confirmed';
      if (activeTab === 'expired') return w.status === 'expired';
      if (activeTab === 'removed') return w.status === 'removed';
      return true;
    })
    .filter((w) => {
      const q = searchQuery.toLowerCase();
      return (
        w.customerName.toLowerCase().includes(q) ||
        w.requestedService.toLowerCase().includes(q) ||
        w.status.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.customerName.localeCompare(b.customerName);
      if (sortBy === 'name-desc') return b.customerName.localeCompare(a.customerName);
      if (sortBy === 'date-desc') {
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
      }
      return 0;
    });

  const allSelected =
    filteredWaitlist.length > 0 && filteredWaitlist.every((w) => selectedIds.includes(w.id));

  return (
    <div className={styles.waitlistContainer}>
      {/* Title Subheader */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Waitlist</h1>
        <span className="dashboard-breadcrumb">Home &gt; Waitlist</span>
      </div>

      <div className={styles.waitlistCard}>
        {/* Card Titles Block */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Waitlist</h2>
          <p className={styles.cardSubtitle}>Review and manage your payments record.</p>
        </div>

        {/* Tab switcher row */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'waiting' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('waiting')}
            >
              Waiting
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'availability_sent' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('availability_sent')}
            >
              Availability Sent
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'confirmed' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'expired' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('expired')}
            >
              Expired
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'removed' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('removed')}
            >
              Removed
            </button>
          </div>
        </div>

        {/* Action Row */}
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
                  if (prev === 'all') return 'waiting';
                  if (prev === 'waiting') return 'availability_sent';
                  if (prev === 'availability_sent') return 'confirmed';
                  if (prev === 'confirmed') return 'expired';
                  if (prev === 'expired') return 'removed';
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
                setSortBy((prev) => (prev === 'name-asc' ? 'date-desc' : 'name-asc'));
              }}
            >
              <SortIcon />
              Sort By: {sortBy === 'name-asc' ? 'A-Z' : 'Request Date'}
            </button>
          </div>
        </div>

        {/* Waitlist Table */}
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
                <th className={styles.th}>Requested Service</th>
                <th className={styles.th}>Preferred Date</th>
                <th className={styles.th}>Preferred Time</th>
                <th className={styles.th}>Request Date</th>
                <th className={styles.th}>Current Status</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWaitlist.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                    No waitlist records found.
                  </td>
                </tr>
              ) : (
                filteredWaitlist.map((w) => {
                  const isChecked = selectedIds.includes(w.id);

                  return (
                    <tr
                      key={w.id}
                      style={{
                        backgroundColor: isChecked ? 'rgba(177, 138, 69, 0.03)' : 'transparent',
                      }}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`} data-label="Select">
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(w.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td} data-label="Customer Name">
                        <span
                          className={styles.clientLink}
                          onClick={() =>
                            alert(`View details profile for customer: ${w.customerName}`)
                          }
                        >
                          {w.customerName}
                        </span>
                      </td>

                      <td className={styles.td} data-label="Requested Service">
                        <span className={styles.boldText}>{w.requestedService}</span>
                      </td>

                      <td className={styles.td} data-label="Preferred Date">
                        {w.preferredDate}
                      </td>

                      <td className={styles.td} data-label="Preferred Time">
                        {w.preferredTime}
                      </td>

                      <td className={styles.td} data-label="Request Date">
                        {w.requestDate}
                      </td>

                      <td className={styles.td} data-label="Current Status">
                        {w.status === 'confirmed' && (
                          <span className={`${styles.statusTag} ${styles.statusConfirmed}`}>
                            Confirmed
                          </span>
                        )}
                        {w.status === 'waiting' && (
                          <span className={`${styles.statusTag} ${styles.statusWaiting}`}>
                            Waiting
                          </span>
                        )}
                        {w.status === 'availability_sent' && (
                          <span className={`${styles.statusTag} ${styles.statusAvailabilitySent}`}>
                            Availability Sent
                          </span>
                        )}
                        {w.status === 'expired' && (
                          <span className={`${styles.statusTag} ${styles.statusExpired}`}>
                            Expired
                          </span>
                        )}
                        {w.status === 'removed' && (
                          <span className={`${styles.statusTag} ${styles.statusRemoved}`}>
                            Removed
                          </span>
                        )}
                      </td>

                      <td className={styles.td} data-label="Action">
                        <button
                          className={styles.btnActionEllipsis}
                          onClick={() => {
                            if (window.confirm(`Remove entry from waitlist?`)) {
                              setWaitlist((prev) =>
                                prev.map((item) =>
                                  item.id === w.id ? { ...item, status: 'removed' } : item,
                                ),
                              );
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
