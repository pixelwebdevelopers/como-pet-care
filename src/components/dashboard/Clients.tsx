'use client';

import React, { useState, useEffect } from 'react';
import styles from './Clients.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  User,
  Users,
  Mail,
  Phone,
  MapPin,
  PawPrint,
  RefreshCw,
  MoreVertical,
  Calendar,
} from 'lucide-react';

// --- TSX TYPES & INTERFACES ---
type ClientStatus = 'active' | 'inactive' | 'new';

interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  petsCount: number;
  pets: string;
  totalSpent: string;
  bookingsCount: number;
  upcomingBooking: string;
  status: ClientStatus;
}

export default function Clients() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'new'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch live clients from API
  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.clients)) {
        setClients(data.clients);
      }
    } catch {
      console.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, [searchQuery]);

  // Select all / row
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredClients.map((c) => c.id));
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
  const filteredClients = clients.filter((client) => {
    const matchSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.pets.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchSearch;
    return client.status === activeTab && matchSearch;
  });

  filteredClients.sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const allSelected =
    filteredClients.length > 0 && selectedIds.length === filteredClients.length;

  return (
    <div className={styles.clientsContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Clients Management</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Clients</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadClients}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.clientsCard}>
        {/* Navigation Tabs Header */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Clients ({clients.length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'active' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active ({clients.filter((c) => c.status === 'active').length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'new' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('new')}
            >
              New Clients ({clients.filter((c) => c.status === 'new').length})
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
              placeholder="Search by client name, email, phone, pet..."
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

        {/* Clients Data Table */}
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
                <th className={styles.th}>Client Name</th>
                <th className={styles.th}>Contact Details</th>
                <th className={styles.th}>Address</th>
                <th className={styles.th}>Pets</th>
                <th className={styles.th}>Total Spent</th>
                <th className={styles.th}>Latest Visit</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading client records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Clients Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No client accounts match your active search or filter criteria.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => {
                  const isChecked = selectedIds.includes(c.id);

                  return (
                    <tr
                      key={c.id}
                      className={`${styles.tr} ${isChecked ? styles.trSelected : ''}`}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`}>
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(c.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: '#e6edea',
                              color: '#123f3c',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '13px',
                              flexShrink: 0,
                            }}
                          >
                            <User size={16} />
                          </div>
                          <div>
                            <span className={styles.clientLink}>{c.name}</span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                            <Mail size={13} style={{ color: 'rgba(28,37,36,0.5)' }} />
                            <span>{c.email}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(28,37,36,0.6)' }}>
                            <Phone size={12} style={{ color: 'rgba(28,37,36,0.5)' }} />
                            <span>{c.phone}</span>
                          </div>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', color: 'rgba(28,37,36,0.7)' }}>
                          <MapPin size={13} style={{ flexShrink: 0, color: 'rgba(28,37,36,0.4)' }} />
                          <span>{c.address || 'Columbia, MO'}</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PawPrint size={14} style={{ color: '#b45309' }} />
                          <span style={{ fontWeight: 600 }}>{c.petsCount} {c.petsCount === 1 ? 'pet' : 'pets'}</span>
                          <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.5)' }}>({c.pets})</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText} style={{ color: 'var(--primary)' }}>
                          {c.totalSpent}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontSize: '12.5px' }}>{c.upcomingBooking}</span>
                      </td>

                      <td className={styles.td}>
                        <span
                          className={`${styles.statusTag} ${
                            c.status === 'active'
                              ? styles.statusActive
                              : c.status === 'new'
                                ? styles.statusNew
                                : styles.statusInactive
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
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
