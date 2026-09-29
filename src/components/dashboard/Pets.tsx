'use client';

import React, { useState, useEffect } from 'react';
import styles from './Pets.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  PawPrint,
  User,
  RefreshCw,
  Heart,
  Calendar,
  Info,
} from 'lucide-react';

// --- TSX TYPES & INTERFACES ---
interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  isPuppy: boolean;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  careInstructions?: string;
  upcomingService: string;
}

export default function Pets() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'dog' | 'cat'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPetModal, setSelectedPetModal] = useState<Pet | null>(null);

  // Fetch live pets from API
  const loadPets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pets?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.pets)) {
        setPets(data.pets);
      }
    } catch {
      console.error('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, [searchQuery]);

  // Select all / row
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredPets.map((p) => p.id));
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
  const filteredPets = pets.filter((pet) => {
    const matchSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchSearch;
    return pet.type.toLowerCase().includes(activeTab) && matchSearch;
  });

  filteredPets.sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  const allSelected =
    filteredPets.length > 0 && selectedIds.length === filteredPets.length;

  return (
    <div className={styles.petsContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Pets Directory</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Pets</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadPets}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.petsCard}>
        {/* Navigation Tabs Header */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Pets ({pets.length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'dog' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('dog')}
            >
              Dogs ({pets.filter((p) => p.type.toLowerCase().includes('dog')).length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'cat' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('cat')}
            >
              Cats ({pets.filter((p) => p.type.toLowerCase().includes('cat')).length})
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
              placeholder="Search by pet name, breed, or owner..."
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

        {/* Pets Data Table */}
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
                <th className={styles.th}>Pet Profile</th>
                <th className={styles.th}>Breed &amp; Species</th>
                <th className={styles.th}>Age</th>
                <th className={styles.th}>Owner Name</th>
                <th className={styles.th}>Care / Feeding Notes</th>
                <th className={styles.th}>Latest / Upcoming Visit</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading pet records from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PawPrint size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Pets Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No pet profiles match your active search or filter criteria.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPets.map((p) => {
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#f5eee3',
                              color: '#b18a45',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <PawPrint size={18} />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedPetModal(p)}
                              className={styles.petLink}
                              style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', textAlign: 'left' }}
                            >
                              {p.name}
                            </button>
                            {p.isPuppy && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  marginLeft: '6px',
                                  fontSize: '10.5px',
                                  color: '#b45309',
                                  backgroundColor: '#fef3c7',
                                  padding: '1px 6px',
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                }}
                              >
                                Puppy
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className={styles.boldText}>{p.breed}</span>
                          <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.5)' }}>
                            {p.type}
                          </span>
                        </div>
                      </td>

                      <td className={styles.td}>{p.age}</td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={13} style={{ color: 'rgba(28,37,36,0.45)' }} />
                          <span style={{ fontWeight: 600 }}>{p.ownerName}</span>
                        </div>
                      </td>

                      <td className={styles.td} style={{ maxWidth: '240px' }}>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(28,37,36,0.7)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.35,
                          }}
                        >
                          {p.careInstructions}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontSize: '12.5px' }}>{p.upcomingService}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pet Profile Details Modal */}
      {selectedPetModal && (
        <div className={styles.modalOverlay} onClick={() => setSelectedPetModal(null)}>
          <div
            className={styles.modalContent}
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#f5eee3',
                    color: '#b18a45',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PawPrint size={22} />
                </div>
                <div>
                  <h3 className={styles.modalTitle} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedPetModal.name}
                    {selectedPetModal.isPuppy && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#b45309',
                          backgroundColor: '#fef3c7',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: 600,
                        }}
                      >
                        Puppy
                      </span>
                    )}
                  </h3>
                  <span style={{ fontSize: '12px', color: 'rgba(28,37,36,0.6)' }}>
                    {selectedPetModal.breed} &bull; {selectedPetModal.type}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.btnCloseModal}
                onClick={() => setSelectedPetModal(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  backgroundColor: '#fbf9f5',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #efe7d8',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(28,37,36,0.5)', fontWeight: 600 }}>
                    Age / Life Stage
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: '#1c2524' }}>
                    {selectedPetModal.age}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(28,37,36,0.5)', fontWeight: 600 }}>
                    Owner
                  </span>
                  <p style={{ margin: '2px 0 0', fontSize: '14px', fontWeight: 600, color: '#1c2524', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#b18a45" /> {selectedPetModal.ownerName}
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #efe7d8', padding: '16px', borderRadius: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#123f3c', display: 'block', marginBottom: '6px' }}>
                  Care &amp; Feeding Instructions
                </span>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#1c2524', lineHeight: 1.5 }}>
                  {selectedPetModal.careInstructions || 'No specific care instructions provided.'}
                </p>
              </div>

              {selectedPetModal.upcomingService && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#166534', fontWeight: 700 }}>
                    Latest / Upcoming Service
                  </span>
                  <p style={{ margin: '3px 0 0', fontSize: '13.5px', fontWeight: 600, color: '#14532d' }}>
                    {selectedPetModal.upcomingService}
                  </p>
                </div>
              )}
            </div>

            <div className={styles.modalActions} style={{ marginTop: '16px' }}>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => setSelectedPetModal(null)}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
