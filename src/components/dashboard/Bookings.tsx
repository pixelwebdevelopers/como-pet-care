'use client';

import React, { useState, useEffect } from 'react';
import styles from './Bookings.module.css';

// --- TSX TYPES & INTERFACES ---
export type BookingStatus =
  'confirmed' | 'pending' | 'upcoming' | 'completed' | 'cancelled' | 'in_progress';

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

// --- SVG ICONS ---
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.searchIcon}
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

const CalendarEmptyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={styles.emptyStateIcon}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

export default function Bookings() {
  // --- STATE ---
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      reference: '#CMP-1024',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: 'August 12, 2026',
      time: '9:00 AM–9:30 AM',
      status: 'confirmed',
      payment: 'paid',
      preferredDays: 'Monday, Wednesday and Friday',
      subscriptionPlan: 'Monthly Subscription',
      intakeStatus: 'completed',
      meetStatus: 'completed',
      petType: 'Dog',
      breed: 'Golden Retriever',
      age: '3 Years',
      notes: 'Friendly, loves treats, and gets along well with other dogs.',
      customerEmail: 'sarahjohnson@gmail.com',
      customerPhone: '(555) 4568 2154',
      customerAddress: '123 Main St, Apt 48, San Diego, CA 92134',
    },
    {
      id: '2',
      reference: '#CMP-1025',
      clientName: 'Michael Green',
      petName: 'Luna',
      service: 'Cat Care',
      duration: '30 Minutes',
      date: 'August 14, 2026',
      time: '11:00 AM–11:30 AM',
      status: 'pending',
      payment: 'paid',
      preferredDays: 'Tuesday and Thursday',
      subscriptionPlan: 'Weekly Subscription',
      intakeStatus: 'completed',
      meetStatus: 'pending',
      petType: 'Cat',
      breed: 'Persian',
      age: '2 Years',
      notes: 'Shy around new people. Likes to hide under the bed.',
      customerEmail: 'mgreen@gmail.com',
      customerPhone: '(555) 2341 5567',
      customerAddress: '789 Elm St, San Diego, CA 92101',
    },
    {
      id: '3',
      reference: '#CMP-1026',
      clientName: 'Emma Watson',
      petName: 'Bella',
      service: 'Pet Sitting',
      duration: '1 Hour',
      date: 'August 15, 2026',
      time: '1:30 PM–2:30 PM',
      status: 'upcoming',
      payment: 'paid',
      preferredDays: 'Saturday and Sunday',
      subscriptionPlan: 'Weekend Care',
      intakeStatus: 'completed',
      meetStatus: 'completed',
      petType: 'Dog',
      breed: 'French Bulldog',
      age: '1 Year',
      notes: 'High energy! Needs lots of active play and fetching.',
      customerEmail: 'ewatson@gmail.com',
      customerPhone: '(555) 8765 4321',
      customerAddress: '101 Pine Rd, Apt A, San Diego, CA 92115',
    },
    {
      id: '4',
      reference: '#CMP-1027',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: 'August 12, 2026',
      time: '9:00 AM–9:30 AM',
      status: 'completed',
      payment: 'paid',
      preferredDays: 'Monday, Wednesday and Friday',
      subscriptionPlan: 'Monthly Subscription',
      intakeStatus: 'completed',
      meetStatus: 'completed',
      petType: 'Dog',
      breed: 'Golden Retriever',
      age: '3 Years',
      notes: 'Intake form complete. Buddy walked well on leash.',
      customerEmail: 'sarahjohnson@gmail.com',
      customerPhone: '(555) 4568 2154',
      customerAddress: '123 Main St, Apt 48, San Diego, CA 92134',
    },
    {
      id: '5',
      reference: '#CMP-1028',
      clientName: 'David Miller',
      petName: 'Charlie',
      service: 'Grooming',
      duration: '1 Hour',
      date: 'August 18, 2026',
      time: '10:00 AM–11:00 AM',
      status: 'cancelled',
      payment: 'unpaid',
      preferredDays: 'Wednesday',
      subscriptionPlan: 'Single Booking',
      intakeStatus: 'pending',
      meetStatus: 'pending',
      petType: 'Dog',
      breed: 'Cocker Spaniel',
      age: '4 Years',
      notes: 'Customer cancelled booking due to travel scheduling.',
      customerEmail: 'dmiller@gmail.com',
      customerPhone: '(555) 6789 1234',
      customerAddress: '234 Maple Dr, San Diego, CA 92120',
    },
    {
      id: '6',
      reference: '#CMP-1029',
      clientName: 'Sarah Johnson',
      petName: 'Buddy',
      service: 'Dog Walking',
      duration: '30 Minutes',
      date: 'August 12, 2026',
      time: '9:00 AM–9:30 AM',
      status: 'in_progress',
      payment: 'paid',
      preferredDays: 'Monday, Wednesday and Friday',
      subscriptionPlan: 'Monthly Subscription',
      intakeStatus: 'completed',
      meetStatus: 'completed',
      petType: 'Dog',
      breed: 'Golden Retriever',
      age: '3 Years',
      notes: 'Friendly, loves treats, and gets along well with other dogs.',
      customerEmail: 'sarahjohnson@gmail.com',
      customerPhone: '(555) 4568 2154',
      customerAddress: '123 Main St, Apt 48, San Diego, CA 92134',
    },
    {
      id: '7',
      reference: '#CMP-1030',
      clientName: 'Linda Carter',
      petName: 'Rocky',
      service: 'Training Session',
      duration: '2 Hours',
      date: 'August 20, 2026',
      time: '2:00 PM–4:00 PM',
      status: 'confirmed',
      payment: 'paid',
      preferredDays: 'Thursday',
      subscriptionPlan: 'Training Program',
      intakeStatus: 'completed',
      meetStatus: 'completed',
      petType: 'Dog',
      breed: 'German Shepherd',
      age: '2 Years',
      notes: 'Intelligent and eager to please. Work on basic recall and stay.',
      customerEmail: 'lcarter@gmail.com',
      customerPhone: '(555) 3456 7890',
      customerAddress: '567 Birch St, San Diego, CA 92104',
    },
  ]);

  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Custom Filters & Sort Toggles
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('reference-desc'); // default sort
  const [paymentFilter, setPaymentFilter] = useState<string>('all'); // all | paid | unpaid

  // Add Booking Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newPetName, setNewPetName] = useState('');
  const [newService, setNewService] = useState('Dog Walking');
  const [newDuration, setNewDuration] = useState('30 Minutes');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newStatus, setNewStatus] = useState<BookingStatus>('confirmed');
  const [newPayment, setNewPayment] = useState<PaymentStatus>('paid');

  // --- OUTSIDE CLICK HANDLERS ---
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Close sort dropdown on clicking outside
      if (isSortDropdownOpen && !target.closest(`.${styles.sortWrapper}`)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isSortDropdownOpen]);

  // --- BULK OPERATIONS ---
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allFilteredIds = filteredBookings.map((b) => b.id);
      setSelectedIds(allFilteredIds);
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

  // --- BOOKING OPERATIONS ---

  const handleBulkDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete the ${selectedIds.length} selected bookings?`)
    ) {
      setBookings((prev) => prev.filter((b) => !selectedIds.includes(b.id)));
      setSelectedIds([]);
    }
  };

  // --- ADD NEW BOOKING ---
  const handleAddNewBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newClientName || !newPetName || !newDate || !newTime) {
      alert('Please fill out all fields.');
      return;
    }

    // Format Date from YYYY-MM-DD to "August 8, 2026"
    const parsedDate = new Date(newDate);
    const formattedDate = parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    // Format Time from 24h to 12h "3:00 PM"
    const [hours, minutes] = newTime.split(':');
    let period = 'AM';
    let formattedHours = parseInt(hours);
    if (formattedHours >= 12) {
      period = 'PM';
      if (formattedHours > 12) formattedHours -= 12;
    }
    if (formattedHours === 0) formattedHours = 12;
    const formattedTime = `${formattedHours}:${minutes} ${period}`;

    // Get highest current reference number
    const maxRef = bookings.reduce((max, curr) => {
      const num = parseInt(curr.reference.replace('#CMP-', ''));
      return num > max ? num : max;
    }, 1023);

    const newBooking: Booking = {
      id: String(Date.now()),
      reference: `#CMP-${maxRef + 1}`,
      clientName: newClientName,
      petName: newPetName,
      service: newService,
      duration: newDuration,
      date: formattedDate,
      time: formattedTime,
      status: newStatus,
      payment: newPayment,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setIsModalOpen(false);

    // Reset Form
    setNewClientName('');
    setNewPetName('');
    setNewService('Dog Walking');
    setNewDuration('30 Minutes');
    setNewDate('');
    setNewTime('');
    setNewStatus('confirmed');
    setNewPayment('paid');
  };

  // --- FILTER & SORT LOGIC ---
  const filteredBookings = bookings
    .filter((booking) => {
      // 1. Tab Status Filter
      if (activeTab !== 'all') {
        if (activeTab === 'upcoming' && booking.status !== 'upcoming') return false;
        if (activeTab === 'confirmed' && booking.status !== 'confirmed') return false;
        if (activeTab === 'pending' && booking.status !== 'pending') return false;
        if (activeTab === 'completed' && booking.status !== 'completed') return false;
        if (activeTab === 'cancelled' && booking.status !== 'cancelled') return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesRef = booking.reference.toLowerCase().includes(query);
        const matchesClient = booking.clientName.toLowerCase().includes(query);
        const matchesPet = booking.petName.toLowerCase().includes(query);
        const matchesService = booking.service.toLowerCase().includes(query);

        if (!matchesRef && !matchesClient && !matchesPet && !matchesService) return false;
      }

      // 3. Payment Filter
      if (paymentFilter !== 'all') {
        if (paymentFilter === 'paid' && booking.payment !== 'paid') return false;
        if (paymentFilter === 'unpaid' && booking.payment !== 'unpaid') return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort Logic
      if (sortBy === 'reference-asc') {
        return a.reference.localeCompare(b.reference);
      }
      if (sortBy === 'reference-desc') {
        return b.reference.localeCompare(a.reference);
      }
      if (sortBy === 'client-a-z') {
        return a.clientName.localeCompare(b.clientName);
      }
      if (sortBy === 'date-asc') {
        return (
          new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime()
        );
      }
      if (sortBy === 'date-desc') {
        return (
          new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime()
        );
      }
      return 0;
    });

  // Check if all filtered rows are selected
  const allFilteredSelected =
    filteredBookings.length > 0 && filteredBookings.every((b) => selectedIds.includes(b.id));

  // --- DETAILS VIEW RENDERING ---
  if (viewMode === 'details' && selectedBooking) {
    return (
      <div className={styles.bookingsContainer}>
        {/* Back navigation and breadcrumb */}
        <div className="dashboard-title-bar">
          <button className={styles.backTitleButton} onClick={() => setViewMode('list')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              style={{
                width: '18px',
                height: '18px',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: '8px',
                marginTop: '-2px',
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Booking Details
          </button>
          <span className="dashboard-breadcrumb">Home &gt; Bookings &gt; Booking Details</span>
        </div>

        {/* 3-Column details layout */}
        <div className={styles.detailsGrid}>
          {/* COLUMN 1: Booking Summary */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5A3.375 3.375 0 0 0 10.125 2.25H3.75A2.25 2.25 0 0 0 1.5 4.5v15a2.25 2.25 0 0 0 2.25 2.25h16.5A2.25 2.25 0 0 0 22.5 19.5v-5.25Z"
                  />
                </svg>
              </span>
              <h3 className={styles.detailsCardTitle}>Booking Summary</h3>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Booking Reference</span>
              <span className={styles.detailValue} style={{ fontWeight: 600 }}>
                {selectedBooking.reference}
              </span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Current Booking Status</span>
              <div className={styles.detailValueCol}>
                {selectedBooking.status === 'confirmed' && (
                  <span className={`${styles.statusTag} ${styles.statusConfirmed}`}>Confirmed</span>
                )}
                {selectedBooking.status === 'pending' && (
                  <span className={`${styles.statusTag} ${styles.statusPending}`}>Pending</span>
                )}
                {selectedBooking.status === 'upcoming' && (
                  <span className={`${styles.statusTag} ${styles.statusUpcoming}`}>Upcoming</span>
                )}
                {selectedBooking.status === 'completed' && (
                  <span className={`${styles.statusTag} ${styles.statusCompleted}`}>Completed</span>
                )}
                {selectedBooking.status === 'cancelled' && (
                  <span className={`${styles.statusTag} ${styles.statusCancelled}`}>Cancelled</span>
                )}
                {selectedBooking.status === 'in_progress' && (
                  <span className={`${styles.statusTag} ${styles.statusInProgress}`}>
                    In Progress
                  </span>
                )}
              </div>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Current Payment Status</span>
              <div className={styles.detailValueCol}>
                <span
                  className={`${styles.paymentTag} ${
                    selectedBooking.payment === 'unpaid' ? styles.paymentUnpaid : ''
                  }`}
                >
                  <span className={styles.dot} />
                  {selectedBooking.payment === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Service Name</span>
              <span className={styles.detailValue}>{selectedBooking.service}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Service Duration</span>
              <span className={styles.detailValue}>{selectedBooking.duration}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Date and Time</span>
              <div className={styles.detailValueCol}>
                <span className={styles.detailValue}>{selectedBooking.date}</span>
                <span className={styles.detailLabelSub}>{selectedBooking.time}</span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Preferred Days</span>
              <span className={styles.detailValue}>{selectedBooking.preferredDays || 'N/A'}</span>
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Subscription Plan</span>
              <span className={styles.detailValue}>
                {selectedBooking.subscriptionPlan || 'N/A'}
              </span>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabelCol}>
                <span className={styles.detailLabel}>Intake Form Status</span>
                <span className={styles.detailLabelSub}>Completed on May 20, 2026</span>
              </div>
              <div className={styles.detailValueCol}>
                <span className={`${styles.statusTag} ${styles.statusCompleted}`}>
                  {selectedBooking.intakeStatus === 'completed' || !selectedBooking.intakeStatus
                    ? 'Completed'
                    : 'Pending'}
                </span>
              </div>
            </div>

            <div className={styles.detailRow}>
              <div className={styles.detailLabelCol}>
                <span className={styles.detailLabel}>Meet & Greet Status</span>
                <span className={styles.detailLabelSub}>Completed on May 20, 2026</span>
              </div>
              <div className={styles.detailValueCol}>
                <span className={`${styles.statusTag} ${styles.statusCompleted}`}>
                  {selectedBooking.meetStatus === 'completed' || !selectedBooking.meetStatus
                    ? 'Completed'
                    : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Customer & Pet Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Customer Info Card */}
            <div className={styles.detailsCard}>
              <div className={styles.detailsCardHeader}>
                <span className={styles.detailsCardIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </span>
                <h3 className={styles.detailsCardTitle}>Customer Information</h3>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Name</span>
                <span className={styles.detailValue}>{selectedBooking.clientName}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Email Address</span>
                <span className={styles.detailValue}>{selectedBooking.customerEmail || 'N/A'}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Phone Number</span>
                <span className={styles.detailValue}>{selectedBooking.customerPhone || 'N/A'}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Service Address</span>
                <span className={styles.detailValue} style={{ maxWidth: '200px' }}>
                  {selectedBooking.customerAddress || 'N/A'}
                </span>
              </div>
            </div>

            {/* Pet Info Card */}
            <div className={styles.detailsCard}>
              <div className={styles.detailsCardHeader}>
                <span className={styles.detailsCardIcon}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
                    />
                  </svg>
                </span>
                <h3 className={styles.detailsCardTitle}>Pet Information</h3>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Pet Name</span>
                <span className={styles.detailValue}>{selectedBooking.petName}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Pet Type</span>
                <span className={styles.detailValue}>{selectedBooking.petType || 'Dog'}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Breed</span>
                <span className={styles.detailValue}>{selectedBooking.breed || 'Mixed'}</span>
              </div>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Age</span>
                <span className={styles.detailValue}>{selectedBooking.age || 'N/A'}</span>
              </div>

              <div className={styles.notesWrapper}>
                <span className={styles.notesLabel}>Basic Care/Special Instruction Notes</span>
                <p className={styles.notesBody}>
                  {selectedBooking.notes ||
                    'Lorem ipsum dolor sit amet consectetur. Odio congue dignissim gravida metus.'}
                </p>
              </div>
            </div>
          </div>

          {/* COLUMN 3: Booking Actions */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <h3 className={styles.detailsCardTitle}>Booking Actions</h3>
            </div>

            <div className={styles.actionsStack}>
              <button
                className={`${styles.btnActionBlock} ${styles.btnActionConfirm}`}
                onClick={() => {
                  const updated: Booking = { ...selectedBooking, status: 'confirmed' };
                  setSelectedBooking(updated);
                  setBookings((prev) =>
                    prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                  );
                  alert('Booking Confirmed successfully!');
                }}
              >
                Confirm Booking
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGold}`}
                onClick={() => {
                  const updated: Booking = { ...selectedBooking, meetStatus: 'completed' };
                  setSelectedBooking(updated);
                  setBookings((prev) =>
                    prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                  );
                  alert('Meet & Greet marked as Complete!');
                }}
              >
                Mark Meet & Greet Complete
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGray}`}
                onClick={() => {
                  const newTimeInput = prompt(
                    'Enter new time slot (e.g. 10:30 AM–11:00 AM):',
                    selectedBooking.time,
                  );
                  if (newTimeInput) {
                    const updated: Booking = { ...selectedBooking, time: newTimeInput };
                    setSelectedBooking(updated);
                    setBookings((prev) =>
                      prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                    );
                  }
                }}
              >
                Edit Date or Time
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGray}`}
                onClick={() => {
                  const newDateInput = prompt(
                    'Enter new date (e.g. August 18, 2026):',
                    selectedBooking.date,
                  );
                  const newTimeInput = prompt(
                    'Enter new time (e.g. 2:00 PM–2:30 PM):',
                    selectedBooking.time,
                  );
                  if (newDateInput && newTimeInput) {
                    const updated: Booking = {
                      ...selectedBooking,
                      date: newDateInput,
                      time: newTimeInput,
                    };
                    setSelectedBooking(updated);
                    setBookings((prev) =>
                      prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                    );
                  }
                }}
              >
                Reschedule Booking
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGray}`}
                onClick={() => {
                  const newStatus = prompt(
                    'Enter status (confirmed, pending, upcoming, completed, cancelled, in_progress):',
                    selectedBooking.status,
                  );
                  if (
                    newStatus &&
                    [
                      'confirmed',
                      'pending',
                      'upcoming',
                      'completed',
                      'cancelled',
                      'in_progress',
                    ].includes(newStatus.toLowerCase())
                  ) {
                    const updated: Booking = {
                      ...selectedBooking,
                      status: newStatus.toLowerCase() as BookingStatus,
                    };
                    setSelectedBooking(updated);
                    setBookings((prev) =>
                      prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                    );
                  } else if (newStatus) {
                    alert('Invalid status. Please enter a valid booking status.');
                  }
                }}
              >
                Update Booking Status
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGray}`}
                onClick={() =>
                  alert(`Navigating to customer profile for ${selectedBooking.clientName}...`)
                }
              >
                View Customer Profile
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionGray}`}
                onClick={() => alert(`Navigating to pet profile for ${selectedBooking.petName}...`)}
              >
                View Pet Profile
              </button>

              <button
                className={`${styles.btnActionBlock} ${styles.btnActionCancel}`}
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this booking?')) {
                    const updated: Booking = { ...selectedBooking, status: 'cancelled' };
                    setSelectedBooking(updated);
                    setBookings((prev) =>
                      prev.map((b) => (b.id === selectedBooking.id ? updated : b)),
                    );
                  }
                }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.bookingsContainer}>
      {/* Dynamic Subheader for Bookings list */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Bookings</h1>
        <span className="dashboard-breadcrumb">Home &gt; Bookings</span>
      </div>

      <div className={styles.bookingsCard}>
        {/* H2 Title and sub */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Your Bookings</h2>
          <p className={styles.cardSubtitle}>Review and manage your bookings</p>
        </div>

        {/* Tabs Row */}
        <div className={styles.tabsContainer}>
          <ul className={styles.tabsList}>
            {[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <li key={tab.id}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.activeTabButton : ''
                  }`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedIds([]);
                  }}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions Bar */}
        <div className={styles.actionBar}>
          {/* Search Box */}
          <div className={styles.searchWrapper}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by Booking reference, Customer name, Pet name, Service..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons Group */}
          <div className={styles.actionButtonsGroup}>
            {/* Bulk Delete Button if items selected */}
            {selectedIds.length > 0 && (
              <button
                className={styles.btnSecondary}
                style={{
                  color: 'var(--error, #ef4444)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                }}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedIds.length})
              </button>
            )}

            {/* Filter Toggle (Paid / All / Unpaid) */}
            <button
              className={`${styles.btnSecondary} ${
                paymentFilter !== 'all' ? styles.btnSecondaryActive : ''
              }`}
              onClick={() => {
                setPaymentFilter((prev) => {
                  if (prev === 'all') return 'paid';
                  if (prev === 'paid') return 'unpaid';
                  return 'all';
                });
              }}
            >
              <FilterIcon />
              Filter:{' '}
              {paymentFilter === 'all'
                ? 'All Payments'
                : paymentFilter === 'paid'
                  ? 'Paid Only'
                  : 'Unpaid Only'}
            </button>

            {/* Sort Toggle wrapper */}
            <div className={styles.sortWrapper} style={{ position: 'relative' }}>
              <button
                className={`${styles.btnSecondary} ${
                  isSortDropdownOpen ? styles.btnSecondaryActive : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                }}
              >
                <SortIcon />
                Sort By
              </button>

              {isSortDropdownOpen && (
                <div
                  className={styles.actionDropdown}
                  style={{ top: '100%', right: 0, marginTop: '4px', minWidth: '180px' }}
                >
                  <button
                    className={`${styles.dropdownItem} ${
                      sortBy === 'reference-desc' ? styles.activeTabButton : ''
                    }`}
                    onClick={() => {
                      setSortBy('reference-desc');
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    Ref: Newest First
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortBy === 'reference-asc' ? styles.activeTabButton : ''
                    }`}
                    onClick={() => {
                      setSortBy('reference-asc');
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    Ref: Oldest First
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortBy === 'date-desc' ? styles.activeTabButton : ''
                    }`}
                    onClick={() => {
                      setSortBy('date-desc');
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    Date: Newest First
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortBy === 'date-asc' ? styles.activeTabButton : ''
                    }`}
                    onClick={() => {
                      setSortBy('date-asc');
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    Date: Oldest First
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${
                      sortBy === 'client-a-z' ? styles.activeTabButton : ''
                    }`}
                    onClick={() => {
                      setSortBy('client-a-z');
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    Customer: A-Z
                  </button>
                </div>
              )}
            </div>

            {/* Add Booking Button */}
            <button className={styles.btnPrimary} onClick={() => setIsModalOpen(true)}>
              <PlusIcon />
              Add New Booking
            </button>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className={styles.tableWrapper}>
          {filteredBookings.length === 0 ? (
            <div className={styles.emptyState}>
              <CalendarEmptyIcon />
              <h3 style={{ margin: 0, color: 'var(--foreground)' }}>No Bookings Found</h3>
              <p style={{ margin: 0, fontSize: '13px' }}>
                Try adjusting your search filters or add a new booking to get started.
              </p>
            </div>
          ) : (
            <table className={styles.bookingsTable}>
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
                  <th className={styles.th}>Booking Reference</th>
                  <th className={styles.th}>Customer Name</th>
                  <th className={styles.th}>Pet Name</th>
                  <th className={styles.th}>Service</th>
                  <th className={styles.th}>Date and Time</th>
                  <th className={styles.th}>Booking Status</th>
                  <th className={styles.th}>Payment Status</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const isChecked = selectedIds.includes(booking.id);

                  return (
                    <tr
                      key={booking.id}
                      style={{
                        backgroundColor: isChecked ? 'rgba(177, 138, 69, 0.03)' : 'transparent',
                      }}
                    >
                      {/* Checkbox */}
                      <td className={`${styles.td} ${styles.tdCheckbox}`} data-label="Select">
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(booking.id, e.target.checked)}
                        />
                      </td>

                      {/* Booking Reference */}
                      <td className={styles.td} data-label="Booking Reference">
                        <span
                          className={styles.refLink}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setViewMode('details');
                          }}
                        >
                          {booking.reference}
                        </span>
                      </td>

                      {/* Customer Name */}
                      <td className={styles.td} data-label="Customer Name">
                        <span className={styles.boldText} style={{ fontWeight: 500 }}>
                          {booking.clientName}
                        </span>
                      </td>

                      {/* Pet Name */}
                      <td className={styles.td} data-label="Pet Name">
                        <span>{booking.petName}</span>
                      </td>

                      {/* Service */}
                      <td className={styles.td} data-label="Service">
                        <span className={styles.boldText}>{booking.service}</span>
                        <span className={styles.subtext}>{booking.duration}</span>
                      </td>

                      {/* Date & Time */}
                      <td className={styles.td} data-label="Date and Time">
                        <span className={styles.boldText}>{booking.date}</span>
                        <span className={styles.subtext}>{booking.time}</span>
                      </td>

                      {/* Booking Status Badge */}
                      <td className={styles.td} data-label="Booking Status">
                        {booking.status === 'confirmed' && (
                          <span className={`${styles.statusTag} ${styles.statusConfirmed}`}>
                            Confirmed
                          </span>
                        )}
                        {booking.status === 'pending' && (
                          <span className={`${styles.statusTag} ${styles.statusPending}`}>
                            Pending
                          </span>
                        )}
                        {booking.status === 'upcoming' && (
                          <span className={`${styles.statusTag} ${styles.statusUpcoming}`}>
                            Upcoming
                          </span>
                        )}
                        {booking.status === 'completed' && (
                          <span className={`${styles.statusTag} ${styles.statusCompleted}`}>
                            Completed
                          </span>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className={`${styles.statusTag} ${styles.statusCancelled}`}>
                            Cancelled
                          </span>
                        )}
                        {booking.status === 'in_progress' && (
                          <span className={`${styles.statusTag} ${styles.statusInProgress}`}>
                            In Progress
                          </span>
                        )}
                      </td>

                      {/* Payment Status Badge */}
                      <td className={styles.td} data-label="Payment Status">
                        <span
                          className={`${styles.paymentTag} ${
                            booking.payment === 'unpaid' ? styles.paymentUnpaid : ''
                          }`}
                        >
                          <span className={styles.dot} />
                          {booking.payment === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>

                      {/* Action View Button */}
                      <td className={styles.td} style={{ textAlign: 'center' }} data-label="Action">
                        <button
                          className={styles.btnTableView}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setViewMode('details');
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- ADD BOOKING DIALOG MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Booking</h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleAddNewBooking} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Customer Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Sarah Johnson"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Pet Name</label>
                  <input
                    type="text"
                    className={styles.formInput}
                    placeholder="Buddy"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Service Type</label>
                  <select
                    className={styles.formSelect}
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                  >
                    <option value="Dog Walking">Dog Walking</option>
                    <option value="Pet Sitting">Pet Sitting</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Cat Care">Cat Care</option>
                    <option value="Training Session">Training Session</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duration</label>
                  <select
                    className={styles.formSelect}
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                  >
                    <option value="30 Minutes">30 Minutes</option>
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Booking Status</label>
                  <select
                    className={styles.formSelect}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Payment Status</label>
                  <select
                    className={styles.formSelect}
                    value={newPayment}
                    onChange={(e) => setNewPayment(e.target.value as PaymentStatus)}
                  >
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary}>
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
