'use client';

import React, { useState } from 'react';
import styles from './Clients.module.css';

// --- TSX TYPES & INTERFACES ---
type ClientStatus = 'active' | 'inactive' | 'new';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  petsCount: number;
  upcomingBooking: string;
  status: ClientStatus;
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

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function Clients() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'new' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Seed list matching screenshot values
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'active',
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'inactive',
    },
    {
      id: '4',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'new',
    },
    {
      id: '5',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'active',
    },
    {
      id: '6',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'active',
    },
    {
      id: '7',
      name: 'Sarah Johnson',
      email: 'sarahjohnson@gmail.com',
      phone: '555 2564 2648',
      petsCount: 2,
      upcomingBooking: 'Dog Walking · Aug 10, 9:00 AM',
      status: 'active',
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newPetsCount, setNewPetsCount] = useState<number>(1);
  const [newStatus, setNewStatus] = useState<ClientStatus>('active');

  // --- HANDLERS ---
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

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newPhone) {
      alert('Please fill out all required fields.');
      return;
    }

    const newClient: Client = {
      id: String(clients.length + 1),
      name: newName,
      email: newEmail,
      phone: newPhone,
      petsCount: Number(newPetsCount),
      upcomingBooking: 'None',
      status: newStatus,
    };

    setClients((prev) => [newClient, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPetsCount(1);
    setNewStatus('active');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredClients = clients
    .filter((c) => {
      // Tab filter
      if (activeTab === 'active') return c.status === 'active';
      if (activeTab === 'new') return c.status === 'new';
      if (activeTab === 'inactive') return c.status === 'inactive';
      return true;
    })
    .filter((c) => {
      // Search filter
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
      );
    })
    .sort((a, b) => {
      // Sorting
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'pets-desc') return b.petsCount - a.petsCount;
      if (sortBy === 'pets-asc') return a.petsCount - b.petsCount;
      return 0;
    });

  const allSelected =
    filteredClients.length > 0 && filteredClients.every((c) => selectedIds.includes(c.id));

  return (
    <div className={styles.clientsContainer}>
      {/* Title Subheader */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Clients</h1>
        <span className="dashboard-breadcrumb">Home &gt; Clients</span>
      </div>

      <div className={styles.clientsCard}>
        {/* Card Title Block */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Clients</h2>
          <p className={styles.cardSubtitle}>Review and manage your clients</p>
        </div>

        {/* Tab row */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'active' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'new' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'inactive' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              In Active
            </button>
          </div>
        </div>

        {/* Search and Secondary Action Buttons */}
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
                // simple cycle filter toggler
                setActiveTab((prev) => {
                  if (prev === 'all') return 'active';
                  if (prev === 'active') return 'new';
                  if (prev === 'new') return 'inactive';
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
                setSortBy((prev) => (prev === 'name-asc' ? 'name-desc' : 'name-asc'));
              }}
            >
              <SortIcon />
              Sort By: {sortBy === 'name-asc' ? 'A-Z' : 'Z-A'}
            </button>

            <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
              <PlusIcon />
              Add New Client
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
                <th className={styles.th}>Client name</th>
                <th className={styles.th}>Email address</th>
                <th className={styles.th}>Phone number</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Number of pets
                </th>
                <th className={styles.th}>Upcoming Booking</th>
                <th className={styles.th}>Client Status</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => {
                  const isChecked = selectedIds.includes(c.id);

                  return (
                    <tr
                      key={c.id}
                      style={{
                        backgroundColor: isChecked ? 'rgba(177, 138, 69, 0.03)' : 'transparent',
                      }}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`} data-label="Select">
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(c.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td} data-label="Client name">
                        <span
                          className={styles.clientLink}
                          onClick={() => alert(`View details profile for client: ${c.name}`)}
                        >
                          {c.name}
                        </span>
                      </td>

                      <td className={styles.td} data-label="Email address">
                        {c.email}
                      </td>

                      <td className={styles.td} data-label="Phone number">
                        {c.phone}
                      </td>

                      <td
                        className={styles.td}
                        data-label="Number of pets"
                        style={{ textAlign: 'center', fontWeight: 600 }}
                      >
                        {c.petsCount}
                      </td>

                      <td className={styles.td} data-label="Upcoming Booking">
                        {c.upcomingBooking}
                      </td>

                      <td className={styles.td} data-label="Client Status">
                        {c.status === 'active' && (
                          <span className={`${styles.statusTag} ${styles.statusActive}`}>
                            Active
                          </span>
                        )}
                        {c.status === 'inactive' && (
                          <span className={`${styles.statusTag} ${styles.statusInactive}`}>
                            In Active
                          </span>
                        )}
                        {c.status === 'new' && (
                          <span className={`${styles.statusTag} ${styles.statusNew}`}>New</span>
                        )}
                      </td>

                      <td className={styles.td} data-label="Action">
                        <button
                          className={styles.btnActionEllipsis}
                          onClick={() => {
                            if (window.confirm(`Delete client record ${c.name}?`)) {
                              setClients((prev) => prev.filter((item) => item.id !== c.id));
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

      {/* Add New Client Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Client</h3>
              <button className={styles.btnCloseModal} onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddClient} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  className={styles.formInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  className={styles.formInput}
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="555 2564 2648"
                  className={styles.formInput}
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Number of Pets</label>
                <input
                  type="number"
                  min="0"
                  className={styles.formInput}
                  value={newPetsCount}
                  onChange={(e) => setNewPetsCount(Number(e.target.value))}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Client Status</label>
                <select
                  className={styles.formSelect}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ClientStatus)}
                >
                  <option value="active">Active</option>
                  <option value="new">New</option>
                  <option value="inactive">In Active</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
