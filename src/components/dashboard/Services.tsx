'use client';

import React, { useState } from 'react';
import styles from './Services.module.css';

// --- TSX TYPES & INTERFACES ---
interface Service {
  id: string;
  name: string;
  category: string;
  duration: string;
  price: string;
  status: 'active' | 'inactive';
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

export default function Services() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');

  // Seed list matching screenshot values
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'active',
    },
    {
      id: '2',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'active',
    },
    {
      id: '3',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'inactive',
    },
    {
      id: '4',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'active',
    },
    {
      id: '5',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'active',
    },
    {
      id: '6',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'inactive',
    },
    {
      id: '7',
      name: '30-Minute Drop-In Visit',
      category: 'Drop-In Visits',
      duration: '30 Minutes',
      price: '$34',
      status: 'active',
    },
  ]);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Drop-In Visits');
  const [newDuration, setNewDuration] = useState<string>('30 Minutes');
  const [newPrice, setNewPrice] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');

  // --- HANDLERS ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredServices.map((s) => s.id));
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

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) {
      alert('Please fill out all required fields.');
      return;
    }

    const newService: Service = {
      id: String(services.length + 1),
      name: newName,
      category: newCategory,
      duration: newDuration,
      price: newPrice.startsWith('$') ? newPrice : `$${newPrice}`,
      status: newStatus,
    };

    setServices((prev) => [newService, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setNewName('');
    setNewCategory('Drop-In Visits');
    setNewDuration('30 Minutes');
    setNewPrice('');
    setNewStatus('active');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredServices = services
    .filter((s) => {
      if (activeTab === 'active') return s.status === 'active';
      if (activeTab === 'inactive') return s.status === 'inactive';
      return true;
    })
    .filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.duration.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'price-desc') {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        return priceB - priceA;
      }
      if (sortBy === 'price-asc') {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        return priceA - priceB;
      }
      return 0;
    });

  const allSelected =
    filteredServices.length > 0 && filteredServices.every((s) => selectedIds.includes(s.id));

  return (
    <div className={styles.servicesContainer}>
      {/* Dynamic titles bar */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Services & Pricing</h1>
        <span className="dashboard-breadcrumb">Home &gt; Services & Pricing</span>
      </div>

      <div className={styles.servicesCard}>
        {/* Card Header title */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Services & Pricing</h2>
          <p className={styles.cardSubtitle}>Review and manage your services & pricing</p>
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
              className={`${styles.tabButton} ${activeTab === 'active' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'inactive' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              In Active
            </button>
          </div>
        </div>

        {/* Actions Row */}
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
                  if (prev === 'all') return 'active';
                  if (prev === 'active') return 'inactive';
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
                setSortBy((prev) => (prev === 'name-asc' ? 'price-desc' : 'name-asc'));
              }}
            >
              <SortIcon />
              Sort By: {sortBy === 'name-asc' ? 'A-Z' : 'Price'}
            </button>

            <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
              <PlusIcon />
              Add New Service
            </button>
          </div>
        </div>

        {/* Services Table */}
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
                <th className={styles.th}>Service name</th>
                <th className={styles.th}>Service category</th>
                <th className={styles.th}>Duration</th>
                <th className={styles.th}>Price</th>
                <th className={styles.th}>Service Status</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => {
                  const isChecked = selectedIds.includes(s.id);

                  return (
                    <tr
                      key={s.id}
                      style={{
                        backgroundColor: isChecked ? 'rgba(177, 138, 69, 0.03)' : 'transparent',
                      }}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`} data-label="Select">
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(s.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td} data-label="Service name">
                        <span
                          className={styles.serviceLink}
                          onClick={() => alert(`View detail details for: ${s.name}`)}
                        >
                          {s.name}
                        </span>
                      </td>

                      <td className={styles.td} data-label="Service category">
                        {s.category}
                      </td>

                      <td className={styles.td} data-label="Duration">
                        {s.duration}
                      </td>

                      <td className={styles.td} data-label="Price" style={{ fontWeight: 700 }}>
                        {s.price}
                      </td>

                      <td className={styles.td} data-label="Service Status">
                        {s.status === 'active' ? (
                          <span className={`${styles.statusTag} ${styles.statusActive}`}>
                            Active
                          </span>
                        ) : (
                          <span className={`${styles.statusTag} ${styles.statusInactive}`}>
                            In Active
                          </span>
                        )}
                      </td>

                      <td className={styles.td} data-label="Action">
                        <button
                          className={styles.btnActionEllipsis}
                          onClick={() => {
                            if (window.confirm(`Delete service: ${s.name}?`)) {
                              setServices((prev) => prev.filter((item) => item.id !== s.id));
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

      {/* Add New Service Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Service</h3>
              <button className={styles.btnCloseModal} onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddService} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="30-Minute Drop-In Visit"
                  className={styles.formInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Category *</label>
                <select
                  className={styles.formSelect}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Drop-In Visits">Drop-In Visits</option>
                  <option value="Dog Walking">Dog Walking</option>
                  <option value="Cat Care">Cat Care</option>
                  <option value="Pet Sitting">Pet Sitting</option>
                  <option value="Grooming & Baths">Grooming & Baths</option>
                  <option value="Training Programs">Training Programs</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Duration *</label>
                <select
                  className={styles.formSelect}
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                >
                  <option value="15 Minutes">15 Minutes</option>
                  <option value="30 Minutes">30 Minutes</option>
                  <option value="45 Minutes">45 Minutes</option>
                  <option value="60 Minutes">60 Minutes</option>
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours">2 Hours</option>
                  <option value="Full Day">Full Day</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Price *</label>
                <input
                  type="text"
                  required
                  placeholder="34"
                  className={styles.formInput}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Service Status</label>
                <select
                  className={styles.formSelect}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as 'active' | 'inactive')}
                >
                  <option value="active">Active</option>
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
