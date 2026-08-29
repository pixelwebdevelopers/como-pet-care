'use client';

import React, { useState, useEffect } from 'react';
import styles from './WaitlistPage.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  RefreshCw,
} from 'lucide-react';

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
  email?: string;
  phone?: string;
}

export default function WaitlistPage() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<
    'all' | 'waiting' | 'availability_sent' | 'confirmed' | 'expired' | 'removed'
  >('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [waitlist, setWaitlist] = useState<WaitlistRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  // Fetch waitlist from live API
  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/waitlist?status=${activeTab}&search=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.waitlist)) {
        setWaitlist(
          data.waitlist.map((item: any) => ({
            id: String(item.id),
            customerName: `${item.firstName} ${item.lastName || ''}`.trim(),
            requestedService: item.serviceName,
            preferredDate: item.preferredDate,
            preferredTime: item.preferredTime,
            requestDate: new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            status: item.status as WaitlistStatus,
            email: item.email,
            phone: item.phone,
          })),
        );
      }
    } catch {
      console.error('Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWaitlist();
  }, [activeTab, searchQuery]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: WaitlistStatus) => {
    try {
      const res = await fetch('/api/waitlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlist((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w)),
        );
        setActionMenuOpenId(null);
      } else {
        alert(data.message || 'Failed to update waitlist entry status.');
      }
    } catch {
      alert('Network error updating status.');
    }
  };

  // Select all / row
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

  // Filter & Sort
  const filteredWaitlist = waitlist.filter((record) => {
    const matchSearch =
      record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.requestedService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.preferredDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.email && record.email.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeTab === 'all') return matchSearch;
    return record.status === activeTab && matchSearch;
  });

  filteredWaitlist.sort((a, b) => {
    if (sortBy === 'name-asc') return a.customerName.localeCompare(b.customerName);
    if (sortBy === 'name-desc') return b.customerName.localeCompare(a.customerName);
    return 0;
  });

  const allSelected =
    filteredWaitlist.length > 0 && selectedIds.length === filteredWaitlist.length;

  return (
    <div className={styles.waitlistContainer}>
      {/* Breadcrumbs & Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Waitlist Management</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Waitlist</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#fff9ee',
              color: '#b45309',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid #f6d29b',
            }}
          >
            <Clock size={15} />
            <span>Total Requests: {waitlist.length}</span>
          </div>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadWaitlist}
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.waitlistCard}>
        {/* Navigation Tabs Header */}
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
              className={`${styles.tabButton} ${
                activeTab === 'availability_sent' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('availability_sent')}
            >
              Availability Sent
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'confirmed' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'expired' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('expired')}
            >
              Expired
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'removed' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('removed')}
            >
              Removed
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
              placeholder="Search by customer, service, date..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterSortRow}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setSortBy((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'));
              }}
            >
              <ArrowUpDown size={15} />
              <span>Sort: {sortBy === 'name-asc' ? 'Name A-Z' : 'Name Z-A'}</span>
            </button>

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

        {/* Waitlist Data Table Viewport */}
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
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading waitlist records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredWaitlist.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Waitlist Requests Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No clients are currently on the waitlist for the selected tab or criteria.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWaitlist.map((w) => {
                  const isChecked = selectedIds.includes(w.id);
                  const isMenuOpen = actionMenuOpenId === w.id;

                  return (
                    <tr
                      key={w.id}
                      className={`${styles.tr} ${isChecked ? styles.trSelected : ''}`}
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
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span
                            className={styles.clientLink}
                            onClick={() =>
                              alert(
                                `Customer: ${w.customerName}\nEmail: ${w.email || 'N/A'}\nPhone: ${w.phone || 'N/A'}`,
                              )
                            }
                          >
                            {w.customerName}
                          </span>
                          {w.email && (
                            <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.5)' }}>
                              {w.email}
                            </span>
                          )}
                        </div>
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

                      <td className={styles.td} data-label="Action" style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className={styles.btnActionEllipsis}
                          onClick={() =>
                            setActionMenuOpenId(isMenuOpen ? null : w.id)
                          }
                          title="Actions menu"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {isMenuOpen && (
                          <div
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '40px',
                              backgroundColor: '#ffffff',
                              borderRadius: '10px',
                              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                              border: '1px solid #efe7d8',
                              zIndex: 100,
                              minWidth: '170px',
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '6px 0',
                            }}
                          >
                            <button
                              type="button"
                              style={{
                                padding: '8px 14px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onClick={() => handleUpdateStatus(w.id, 'availability_sent')}
                            >
                              <Send size={14} color="#b45309" />
                              <span>Send Availability</span>
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '8px 14px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onClick={() => handleUpdateStatus(w.id, 'confirmed')}
                            >
                              <CheckCircle2 size={14} color="#15803d" />
                              <span>Mark Confirmed</span>
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '8px 14px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '13px',
                                color: '#b91c1c',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onClick={() => handleUpdateStatus(w.id, 'removed')}
                            >
                              <Trash2 size={14} color="#b91c1c" />
                              <span>Remove</span>
                            </button>
                          </div>
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
