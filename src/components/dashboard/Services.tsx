'use client';

import React, { useState, useEffect } from 'react';
import styles from './Services.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit3,
  Clock,
  DollarSign,
  CheckCircle2,
  X,
  RefreshCw,
  Tag,
  AlertCircle,
} from 'lucide-react';

// --- TSX TYPES & INTERFACES ---
export interface ServiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  title: string;
  description: string;
  duration: string;
  basePrice: number | string;
  priceText: string;
  savingText?: string;
  badge?: string;
  status: 'active' | 'inactive';
}

export default function Services() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('service-asc');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editDuration, setEditDuration] = useState<string>('');
  const [editBasePrice, setEditBasePrice] = useState<string>('');
  const [editPriceText, setEditPriceText] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [editBadge, setEditBadge] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string>('');

  // Fetch services from live database API
  const loadServices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServices(
          data.services.map((s: any) => ({
            ...s,
            basePrice: Number(s.basePrice),
          })),
        );
      }
    } catch (err) {
      console.error('Failed to load services from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  // Open Edit Modal
  const handleOpenEdit = (s: ServiceItem) => {
    setEditingService(s);
    setEditTitle(s.title);
    setEditDescription(s.description || '');
    setEditDuration(s.duration || '');
    setEditBasePrice(String(s.basePrice));
    setEditPriceText(s.priceText || '');
    setEditStatus(s.status);
    setEditBadge(s.badge || '');
    setSaveSuccessNotice('');
  };

  // Submit Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setSavingEdit(true);
    try {
      const res = await fetch('/api/services', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingService.id,
          title: editTitle,
          description: editDescription,
          duration: editDuration,
          basePrice: parseFloat(editBasePrice) || 0,
          priceText: editPriceText,
          status: editStatus,
          badge: editBadge.trim() || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.service) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === editingService.id
              ? {
                  ...s,
                  ...data.service,
                  basePrice: Number(data.service.basePrice),
                }
              : s,
          ),
        );
        setSaveSuccessNotice('Pricing & details updated successfully! Changes reflect on customer booking.');
        setTimeout(() => {
          setEditingService(null);
          setSaveSuccessNotice('');
        }, 1800);
      } else {
        alert(data.message || 'Failed to update service');
      }
    } catch {
      alert('Network error saving service updates');
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter & Sort
  const filteredServices = services.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.priceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.duration.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchSearch;
    return s.status === activeTab && matchSearch;
  });

  filteredServices.sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.basePrice) - Number(b.basePrice);
    if (sortBy === 'price-desc') return Number(b.basePrice) - Number(a.basePrice);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    return a.serviceName.localeCompare(b.serviceName);
  });

  return (
    <div className={styles.servicesContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Services &amp; Pricing Management</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Services &amp; Pricing</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadServices}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.servicesCard}>
        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Plans ({services.length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'active' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active ({services.filter((s) => s.status === 'active').length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'inactive' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive ({services.filter((s) => s.status === 'inactive').length})
            </button>
          </div>
        </div>

        {/* Actions Row */}
        <div className={styles.actionsRow}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search services, plans, or prices..."
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
                setSortBy((prev) => (prev === 'price-asc' ? 'price-desc' : 'price-asc'));
              }}
            >
              <ArrowUpDown size={15} />
              <span>Sort: {sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}</span>
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

        {/* Services Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Service Category</th>
                <th className={styles.th}>Plan Title</th>
                <th className={styles.th}>Duration</th>
                <th className={styles.th}>Display Price</th>
                <th className={styles.th}>Base Rate</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading services from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Services Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No service plans match your active category or search query.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((s) => (
                  <tr key={s.id} className={styles.tr}>
                    <td className={styles.td} data-label="Category">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={15} style={{ color: 'var(--primary)' }} />
                        <span className={styles.boldText}>{s.serviceName}</span>
                      </div>
                    </td>

                    <td className={styles.td} data-label="Plan Title">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{s.title}</span>
                        {s.badge && (
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#b45309',
                              backgroundColor: '#fef3c7',
                              padding: '1px 6px',
                              borderRadius: '10px',
                              width: 'fit-content',
                              marginTop: '2px',
                            }}
                          >
                            {s.badge}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className={styles.td} data-label="Duration">
                      <span style={{ color: 'rgba(28,37,36,0.7)' }}>{s.duration}</span>
                    </td>

                    <td className={styles.td} data-label="Display Price">
                      <span className={styles.boldText} style={{ color: 'var(--primary)' }}>
                        {s.priceText}
                      </span>
                    </td>

                    <td className={styles.td} data-label="Base Rate">
                      <span>${Number(s.basePrice).toFixed(2)}</span>
                    </td>

                    <td className={styles.td} data-label="Status">
                      <span
                        className={`${styles.statusTag} ${
                          s.status === 'active' ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {s.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className={styles.td} data-label="Action">
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        style={{ padding: '6px 12px', fontSize: '12.5px', gap: '6px' }}
                        onClick={() => handleOpenEdit(s)}
                        title="Edit price & details"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT SERVICE PRICING MODAL */}
      {editingService && (
        <div className={styles.modalOverlay} onClick={() => setEditingService(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleGroup}>
                <div className={styles.modalIconBadge}>
                  <Edit3 size={20} />
                </div>
                <div className={styles.modalTitleText}>
                  <h3 className={styles.modalTitle}>Edit Service &amp; Pricing</h3>
                  <p className={styles.modalSubtitle}>
                    Adjust pricing, duration, and customer-facing details
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setEditingService(null)}
                title="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {saveSuccessNotice && (
              <div
                style={{
                  backgroundColor: '#edf7ed',
                  color: '#1e4620',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #c8e6c9',
                }}
              >
                <CheckCircle2 size={18} color="#2e7d32" />
                <span>{saveSuccessNotice}</span>
              </div>
            )}

            <div className={styles.metaBanner}>
              <div className={styles.metaBannerItem}>
                <span className={styles.metaBannerLabel}>Category:</span>
                <span className={styles.metaBannerValue}>{editingService.serviceName}</span>
              </div>
              <div className={styles.metaBannerItem}>
                <span className={styles.metaBannerLabel}>Plan Key:</span>
                <code
                  style={{
                    fontSize: '12px',
                    backgroundColor: '#efe7d8',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    color: '#123f3c',
                    fontWeight: 600,
                  }}
                >
                  {editingService.id}
                </code>
              </div>
            </div>

            <form onSubmit={handleSaveEdit} className={styles.modalForm}>
              {/* Row 1: Plan Title + Duration (2 inputs) */}
              <div className={styles.formRowTwoCol}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Plan Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Minute Visit"
                    className={styles.formInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duration / Schedule Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. 30 min, Overnight"
                    className={styles.formInput}
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 2: Base Price + Display Price (2 inputs) */}
              <div className={styles.formRowTwoCol}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Base Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="34.00"
                    className={styles.formInput}
                    value={editBasePrice}
                    onChange={(e) => setEditBasePrice(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Display Price Label</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $34 / walk"
                    className={styles.formInput}
                    value={editPriceText}
                    onChange={(e) => setEditPriceText(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Status + Highlight Badge (2 inputs) */}
              <div className={styles.formRowTwoCol}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Availability Status</label>
                  <select
                    className={styles.formSelect}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                  >
                    <option value="active">Active (Available)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Badge / Highlight (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Most popular"
                    className={styles.formInput}
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                  />
                </div>
              </div>

              {/* Row 4: Description (compact) */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Plan Description</label>
                <textarea
                  className={styles.formTextarea}
                  rows={2}
                  placeholder="Describe the plan benefits and what is included..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>

              <div className={styles.infoNotice}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>
                  Price and title updates will immediately reflect across customer booking forms and checkout summaries.
                </span>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnModalCancel}
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className={styles.btnModalSave}
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
