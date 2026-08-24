'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './Pets.module.css';

// --- TSX TYPES & INTERFACES ---
interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  ownerName: string;
  upcomingService: string;
  avatar: string;
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

export default function Pets() {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [petTypeFilter, setPetTypeFilter] = useState<string>('all');

  // Seed list matching screenshot values
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '2',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '3',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '4',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '5',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '6',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
    {
      id: '7',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Siberian Husky',
      age: '5 Years Old',
      ownerName: 'Sarah Micheal',
      upcomingService: 'Dog Walking · Aug 10, 9:00 AM',
      avatar: '/assets/dog-avatar.jpg',
    },
  ]);

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newType, setNewType] = useState<string>('Dog');
  const [newBreed, setNewBreed] = useState<string>('');
  const [newAge, setNewAge] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');

  // --- HANDLERS ---
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

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBreed || !newAge || !newOwner) {
      alert('Please fill out all fields.');
      return;
    }

    const newPet: Pet = {
      id: String(pets.length + 1),
      name: newName,
      type: newType,
      breed: newBreed,
      age: newAge.includes('Years') || newAge.includes('Months') ? newAge : `${newAge} Years Old`,
      ownerName: newOwner,
      upcomingService: 'None',
      avatar: '/assets/dog-avatar.jpg', // Seed default avatar
    };

    setPets((prev) => [newPet, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setNewName('');
    setNewType('Dog');
    setNewBreed('');
    setNewAge('');
    setNewOwner('');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredPets = pets
    .filter((p) => {
      // Type filter
      if (petTypeFilter === 'all') return true;
      return p.type.toLowerCase() === petTypeFilter.toLowerCase();
    })
    .filter((p) => {
      // Search query
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.breed.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'breed') return a.breed.localeCompare(b.breed);
      return 0;
    });

  const allSelected =
    filteredPets.length > 0 && filteredPets.every((p) => selectedIds.includes(p.id));

  return (
    <div className={styles.petsContainer}>
      {/* Subheader titles */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Pets</h1>
        <span className="dashboard-breadcrumb">Home &gt; Pets</span>
      </div>

      <div className={styles.petsCard}>
        {/* Card Header Title and Description */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Pets</h2>
          <p className={styles.cardSubtitle}>Review and manage your pets</p>
        </div>

        {/* Tab Header row */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${petTypeFilter === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setPetTypeFilter('all')}
            >
              All
            </button>
            <button
              className={`${styles.tabButton} ${petTypeFilter === 'dog' ? styles.tabButtonActive : ''}`}
              onClick={() => setPetTypeFilter('dog')}
            >
              Dogs
            </button>
            <button
              className={`${styles.tabButton} ${petTypeFilter === 'cat' ? styles.tabButtonActive : ''}`}
              onClick={() => setPetTypeFilter('cat')}
            >
              Cats
            </button>
          </div>
        </div>

        {/* Actions row */}
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
                setPetTypeFilter((prev) => {
                  if (prev === 'all') return 'dog';
                  if (prev === 'dog') return 'cat';
                  return 'all';
                });
              }}
            >
              <FilterIcon />
              Filters: {petTypeFilter.toUpperCase()}
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
              Add New Pet
            </button>
          </div>
        </div>

        {/* Pets Table */}
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
                <th className={styles.th}>Pet Name</th>
                <th className={styles.th}>Pet Type</th>
                <th className={styles.th}>Breed</th>
                <th className={styles.th}>Age</th>
                <th className={styles.th}>Owner name</th>
                <th className={styles.th}>Upcoming service</th>
                <th className={styles.th} style={{ textAlign: 'center' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPets.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                    No pets found.
                  </td>
                </tr>
              ) : (
                filteredPets.map((p) => {
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

                      <td className={styles.td} data-label="Pet Name">
                        <div className={styles.petInfoCell}>
                          <div className={styles.avatarFrame}>
                            <Image
                              src={p.avatar}
                              alt={`Pet face profile avatar ${p.name}`}
                              fill
                              sizes="36px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <span
                            className={styles.petLink}
                            onClick={() => alert(`View details profile for pet: ${p.name}`)}
                          >
                            {p.name}
                          </span>
                        </div>
                      </td>

                      <td className={styles.td} data-label="Pet Type">
                        <span className={styles.boldText}>{p.type}</span>
                      </td>

                      <td className={styles.td} data-label="Breed">
                        {p.breed}
                      </td>

                      <td className={styles.td} data-label="Age">
                        {p.age}
                      </td>

                      <td className={styles.td} data-label="Owner name">
                        {p.ownerName}
                      </td>

                      <td className={styles.td} data-label="Upcoming service">
                        {p.upcomingService}
                      </td>

                      <td className={styles.td} data-label="Action">
                        <button
                          className={styles.btnActionEllipsis}
                          onClick={() => {
                            if (window.confirm(`Delete pet record ${p.name}?`)) {
                              setPets((prev) => prev.filter((item) => item.id !== p.id));
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

      {/* Add New Pet Modal Overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Pet</h3>
              <button className={styles.btnCloseModal} onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddPet} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Buddy"
                  className={styles.formInput}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pet Type</label>
                <select
                  className={styles.formSelect}
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Breed *</label>
                <input
                  type="text"
                  required
                  placeholder="Siberian Husky"
                  className={styles.formInput}
                  value={newBreed}
                  onChange={(e) => setNewBreed(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Age *</label>
                <input
                  type="text"
                  required
                  placeholder="5 Years Old"
                  className={styles.formInput}
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Owner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Sarah Micheal"
                  className={styles.formInput}
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                />
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
                  Save Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
