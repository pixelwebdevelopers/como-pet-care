'use client';

import React, { useState, useEffect } from 'react';
import styles from './Bookings.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  User,
  PawPrint,
  X,
  RefreshCw,
  CreditCard,
  Tag,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

// --- TSX TYPES & INTERFACES ---
export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'in_progress';

export type PaymentStatus = 'paid' | 'unpaid';

export interface Booking {
  id: string;
  reference: string;
  clientName: string;
  petName: string;
  service: string;
  duration: string;
  date: string;
  time: string;
  status: BookingStatus;
  payment: PaymentStatus;
  preferredDays?: string;
  subscriptionPlan?: string;
  intakeStatus?: 'completed' | 'pending';
  meetStatus?: 'completed' | 'pending';
  petType?: string;
  breed?: string;
  age?: string;
  notes?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
}

export default function Bookings() {
  // --- STATE ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reference-desc');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch live bookings from database
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(
          data.bookings.map((b: any) => {
            const pet = b.customer?.pets?.[0];
            let mappedStatus: BookingStatus = 'confirmed';
            const s = (b.status || '').toLowerCase();
            if (s.includes('pending')) mappedStatus = 'pending';
            else if (s.includes('cancel')) mappedStatus = 'cancelled';
            else if (s.includes('complete')) mappedStatus = 'completed';
            else if (s.includes('progress')) mappedStatus = 'in_progress';
            else if (s.includes('upcoming')) mappedStatus = 'upcoming';

            return {
              id: String(b.id),
              reference: b.reference,
              clientName: `${b.customer.firstName} ${b.customer.lastName}`,
              petName: pet?.name || 'Pet',
              service: b.serviceName,
              duration: b.serviceId === '2' || b.planTitle?.includes('60') ? '60 min' : '30 min',
              date: b.bookingDate,
              time: `${b.startTime || '9:00 AM'}${b.endTime ? `–${b.endTime}` : ''}`,
              status: mappedStatus,
              payment: b.paymentStatus === 'PAID' ? 'paid' : 'unpaid',
              preferredDays: b.preferredWeekdays || 'N/A',
              subscriptionPlan: b.planTitle || 'Standard Booking',
              intakeStatus: b.intakeProfiles?.length > 0 ? 'completed' : 'pending',
              meetStatus: b.meetAndGreet ? 'completed' : 'pending',
              petType: pet?.type || 'Dog',
              breed: pet?.breed || 'Mixed',
              age: pet?.age || 'Adult',
              notes: b.specialNotes || 'No special instructions',
              customerEmail: b.customer.email,
              customerPhone: b.customer.phone || 'N/A',
              customerAddress: `${b.customer.address || ''}${b.customer.city ? `, ${b.customer.city}` : ''}`,
            };
          }),
        );
      }
    } catch {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Update status
  const handleUpdateBookingStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: newStatus.toLowerCase() as BookingStatus } : b,
          ),
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) =>
            prev ? { ...prev, status: newStatus.toLowerCase() as BookingStatus } : null,
          );
        }
      } else {
        alert(data.message || 'Failed to update booking status');
      }
    } catch {
      alert('Network error updating booking status');
    }
  };

  // Row selection
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredBookings.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Filter & Sort
  const filteredBookings = bookings
    .filter((booking) => {
      if (activeTab !== 'all') {
        if (activeTab === 'upcoming' && booking.status !== 'upcoming') return false;
        if (activeTab === 'confirmed' && booking.status !== 'confirmed') return false;
        if (activeTab === 'pending' && booking.status !== 'pending') return false;
        if (activeTab === 'completed' && booking.status !== 'completed') return false;
        if (activeTab === 'cancelled' && booking.status !== 'cancelled') return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesRef = booking.reference.toLowerCase().includes(query);
        const matchesClient = booking.clientName.toLowerCase().includes(query);
        const matchesPet = booking.petName.toLowerCase().includes(query);
        const matchesService = booking.service.toLowerCase().includes(query);

        if (!matchesRef && !matchesClient && !matchesPet && !matchesService) return false;
      }

      if (paymentFilter !== 'all') {
        if (paymentFilter === 'paid' && booking.payment !== 'paid') return false;
        if (paymentFilter === 'unpaid' && booking.payment !== 'unpaid') return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'reference-asc') return a.reference.localeCompare(b.reference);
      if (sortBy === 'reference-desc') return b.reference.localeCompare(a.reference);
      if (sortBy === 'client-a-z') return a.clientName.localeCompare(b.clientName);
      return 0;
    });

  const allFilteredSelected =
    filteredBookings.length > 0 && filteredBookings.every((b) => selectedIds.includes(b.id));

  // --- DETAILS VIEW RENDERING ---
  if (viewMode === 'details' && selectedBooking) {
    return (
      <div className={styles.bookingsContainer}>
        {/* Back navigation and breadcrumb */}
        <div className="dashboard-title-bar">
          <button
            className={styles.backTitleButton}
            onClick={() => setViewMode('list')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ChevronLeft size={18} />
            <span>Booking Details</span>
          </button>
          <span className="dashboard-breadcrumb">Home &gt; Bookings &gt; Booking Details</span>
        </div>

        {/* 3-Column details layout */}
        <div className={styles.detailsGrid}>
          {/* COLUMN 1: Booking Summary */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Booking Summary</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Booking Reference</span>
                <span className={styles.metaValueHighlight}>{selectedBooking.reference}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Requested Service</span>
                <span className={styles.metaValue}>{selectedBooking.service}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Plan / Duration</span>
                <span className={styles.metaValue}>
                  {selectedBooking.subscriptionPlan} • {selectedBooking.duration}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Scheduled Date</span>
                <span className={styles.metaValue}>{selectedBooking.date}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Appointment Time</span>
                <span className={styles.metaValue}>{selectedBooking.time}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Payment Status</span>
                <span
                  className={`${styles.paymentTag} ${
                    selectedBooking.payment === 'paid' ? styles.paidTag : styles.unpaidTag
                  }`}
                >
                  {selectedBooking.payment === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Booking Status</span>
                <span
                  className={`${styles.statusTag} ${
                    selectedBooking.status === 'confirmed'
                      ? styles.statusConfirmed
                      : selectedBooking.status === 'pending'
                        ? styles.statusPending
                        : selectedBooking.status === 'completed'
                          ? styles.statusCompleted
                          : selectedBooking.status === 'cancelled'
                            ? styles.statusCancelled
                            : styles.statusInProgress
                  }`}
                >
                  {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Actions for this booking */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'COMPLETED')}
                style={{ fontSize: '12.5px', padding: '6px 12px' }}
              >
                Mark Completed
              </button>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'CANCELLED')}
                style={{ fontSize: '12.5px', padding: '6px 12px', color: '#b91c1c' }}
              >
                Cancel Booking
              </button>
            </div>
          </div>

          {/* COLUMN 2: Customer Information */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <User size={18} style={{ color: 'var(--primary)' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Customer Information</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Client Full Name</span>
                <span className={styles.metaValue}>{selectedBooking.clientName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Email Address</span>
                <span className={styles.metaValue}>{selectedBooking.customerEmail || 'N/A'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Phone Number</span>
                <span className={styles.metaValue}>{selectedBooking.customerPhone || 'N/A'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Service Address</span>
                <span className={styles.metaValue}>{selectedBooking.customerAddress || 'N/A'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Intake Form</span>
                <span
                  className={`${styles.statusTag} ${
                    selectedBooking.intakeStatus === 'completed'
                      ? styles.statusCompleted
                      : styles.statusPending
                  }`}
                >
                  {selectedBooking.intakeStatus === 'completed' ? 'Submitted' : 'Pending'}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Meet &amp; Greet</span>
                <span
                  className={`${styles.statusTag} ${
                    selectedBooking.meetStatus === 'completed'
                      ? styles.statusCompleted
                      : styles.statusPending
                  }`}
                >
                  {selectedBooking.meetStatus === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Pet Details */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <PawPrint size={18} style={{ color: 'var(--primary)' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Pet Information</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Pet Name</span>
                <span className={styles.metaValue}>{selectedBooking.petName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Pet Species / Breed</span>
                <span className={styles.metaValue}>
                  {selectedBooking.petType || 'Dog'} • {selectedBooking.breed || 'Mixed'}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Age</span>
                <span className={styles.metaValue}>{selectedBooking.age || 'Adult'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Care / Feeding Notes</span>
                <span className={styles.metaValue} style={{ fontSize: '12.5px', lineHeight: 1.4 }}>
                  {selectedBooking.notes}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW RENDERING ---
  return (
    <div className={styles.bookingsContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Bookings Management</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Bookings</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={loadBookings}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={loading ? styles.spinIcon : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className={styles.bookingsCard}>
        {/* Navigation Tabs Header */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'confirmed' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'pending' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({bookings.filter((b) => b.status === 'pending').length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'completed' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({bookings.filter((b) => b.status === 'completed').length})
            </button>
            <button
              className={`${styles.tabButton} ${
                activeTab === 'cancelled' ? styles.tabButtonActive : ''
              }`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
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
              placeholder="Search by reference, client, pet, service..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Payment: All</option>
              <option value="paid">Payment: Paid</option>
              <option value="unpaid">Payment: Unpaid</option>
            </select>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setSortBy((prev) =>
                  prev === 'reference-desc' ? 'reference-asc' : 'reference-desc',
                );
              }}
            >
              <ArrowUpDown size={15} />
              <span>Sort: {sortBy === 'reference-desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>

            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setActiveTab('all');
                setPaymentFilter('all');
                setSearchQuery('');
              }}
            >
              <Filter size={15} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.tableResponsive}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.thCheckbox}`}>
                  <input
                    type="checkbox"
                    className={styles.customCheckbox}
                    checked={allFilteredSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className={styles.th}>Booking Ref</th>
                <th className={styles.th}>Client Name</th>
                <th className={styles.th}>Pet</th>
                <th className={styles.th}>Service</th>
                <th className={styles.th}>Duration</th>
                <th className={styles.th}>Date &amp; Time</th>
                <th className={styles.th}>Payment</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <RefreshCw size={26} className={styles.spinIcon} style={{ color: '#123f3c' }} />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#123f3c' }}>Loading bookings from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={10} className={styles.emptyTd}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '16px', backgroundColor: '#f5eee3', color: '#b18a45', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Calendar size={26} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#1c2524' }}>No Bookings Found</span>
                      <span style={{ fontSize: '13px', color: 'rgba(28, 37, 36, 0.6)', maxWidth: '340px' }}>
                        No appointments match your active tab or search criteria. Try adjusting your filters.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isChecked = selectedIds.includes(b.id);

                  return (
                    <tr
                      key={b.id}
                      className={`${styles.tr} ${isChecked ? styles.trSelected : ''}`}
                    >
                      <td className={`${styles.td} ${styles.tdCheckbox}`}>
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(b.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td}>
                        <span
                          className={styles.refLink}
                          onClick={() => {
                            setSelectedBooking(b);
                            setViewMode('details');
                          }}
                        >
                          {b.reference}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span style={{ fontWeight: 600 }}>{b.clientName}</span>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PawPrint size={14} style={{ color: '#b45309' }} />
                          <span>{b.petName}</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText}>{b.service}</span>
                      </td>

                      <td className={styles.td}>{b.duration}</td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{b.date}</span>
                          <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.55)' }}>
                            {b.time}
                          </span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span
                          className={`${styles.paymentTag} ${
                            b.payment === 'paid' ? styles.paidTag : styles.unpaidTag
                          }`}
                        >
                          {b.payment === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span
                          className={`${styles.statusTag} ${
                            b.status === 'confirmed'
                              ? styles.statusConfirmed
                              : b.status === 'pending'
                                ? styles.statusPending
                                : b.status === 'completed'
                                  ? styles.statusCompleted
                                  : b.status === 'cancelled'
                                    ? styles.statusCancelled
                                    : styles.statusInProgress
                          }`}
                        >
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          style={{ padding: '6px 12px', fontSize: '12.5px' }}
                          onClick={() => {
                            setSelectedBooking(b);
                            setViewMode('details');
                          }}
                        >
                          View Details
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
