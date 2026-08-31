'use client';

import React, { useState, useEffect } from 'react';
import styles from './Bookings.module.css';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  DollarSign,
  CheckCircle2,
  Clock,
  User,
  PawPrint,
  X,
  RefreshCw,
  FileText,
  Phone,
  Mail,
  Key,
  ShieldAlert,
  HeartPulse,
  Printer,
  Copy,
  CalendarClock,
  RotateCcw,
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

export interface FullIntakeProfile {
  id: number;
  takesMedication?: string;
  medicationName?: string;
  dosageInstructions?: string;
  knownAllergies?: string;
  medicalConditions?: string;
  veterinarianName?: string;
  veterinaryClinic?: string;
  veterinaryPhone?: string;
  additionalHealthNotes?: string;
  primaryEntryMethod?: string;
  secondaryEntryMethod?: string;
  entryInstructions?: string;
  doorCode?: string;
  garageCode?: string;
  alarmCode?: string;
  keyLockboxLocation?: string;
  parkingInstructions?: string;
  additionalHomeNotes?: string;
  primaryName?: string;
  primaryRelationship?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  secondaryName?: string;
  secondaryRelationship?: string;
  secondaryPhone?: string;
  vetAuthorization?: string;
  altKeyHolder?: string;
  emergencyNotes?: string;
  status?: string;
}

export interface MeetAndGreetInfo {
  date: string;
  time: string;
  address: string;
  status: string;
  notes?: string;
}

export interface TransactionInfo {
  id: number;
  paymentIntentId: string;
  paymentMethod: string;
  amount: number;
  status: string;
  refundedAmount?: number;
  refundReason?: string;
  createdAt: string;
}

export interface PetDetail {
  id: number;
  name: string;
  type: string;
  breed?: string;
  age?: string;
  isPuppy: boolean;
  careInstructions?: string;
  feedingRoutine?: string;
  exerciseRoutine?: string;
  temperamentNotes?: string;
}

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
  isNewCustomer?: boolean;
  isColumbiaResident?: boolean;
  basePrice?: string;
  additionalPetFee?: string;
  puppySurcharge?: string;
  holidaySurcharge?: string;
  totalPrice?: string;
  intakeProfile?: FullIntakeProfile | null;
  meetAndGreet?: MeetAndGreetInfo | null;
  transactions?: TransactionInfo[];
  allPets?: PetDetail[];
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
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Reschedule Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState<boolean>(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('');
  const [rescheduling, setRescheduling] = useState<boolean>(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  // Fetch live bookings from database
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedList = data.bookings.map((b: any) => {
          const primaryPet = b.customer?.pets?.[0];
          let mappedStatus: BookingStatus = 'confirmed';
          const s = (b.status || '').toLowerCase();
          if (s.includes('pending')) mappedStatus = 'pending';
          else if (s.includes('cancel')) mappedStatus = 'cancelled';
          else if (s.includes('complete')) mappedStatus = 'completed';
          else if (s.includes('progress')) mappedStatus = 'in_progress';
          else if (s.includes('upcoming')) mappedStatus = 'upcoming';

          const intake = b.intakeProfiles?.[0] || null;

          return {
            id: String(b.id),
            reference: b.reference,
            clientName: `${b.customer?.firstName || ''} ${b.customer?.lastName || ''}`.trim(),
            petName: primaryPet?.name || 'Pet',
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
            petType: primaryPet?.type || 'Dog',
            breed: primaryPet?.breed || 'Mixed',
            age: primaryPet?.age || 'Adult',
            notes: b.specialNotes || 'No special instructions',
            customerEmail: b.customer?.email,
            customerPhone: b.customer?.phone || 'N/A',
            customerAddress: `${b.customer?.address || ''}${b.customer?.city ? `, ${b.customer.city}` : ''}${b.customer?.state ? `, ${b.customer.state}` : ''}`,
            isNewCustomer: b.isNewCustomer,
            isColumbiaResident: b.customer?.isColumbiaResident,
            basePrice: b.basePrice ? `$${Number(b.basePrice).toFixed(2)}` : '$0.00',
            additionalPetFee: b.additionalPetFee ? `$${Number(b.additionalPetFee).toFixed(2)}` : '$0.00',
            puppySurcharge: b.puppySurcharge ? `$${Number(b.puppySurcharge).toFixed(2)}` : '$0.00',
            holidaySurcharge: b.holidaySurcharge ? `$${Number(b.holidaySurcharge).toFixed(2)}` : '$0.00',
            totalPrice: b.totalPrice ? `$${Number(b.totalPrice).toFixed(2)}` : '$0.00',
            intakeProfile: intake,
            meetAndGreet: b.meetAndGreet || null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transactions: b.transactions || [],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allPets: b.customer?.pets || [],
          };
        });

        setBookings(mappedList);
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

  // Update Payment Status
  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: 'PAID' | 'UNPAID') => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paymentStatus: newPaymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        const mapped = newPaymentStatus === 'PAID' ? 'paid' : 'unpaid';
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, payment: mapped } : b)),
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) =>
            prev ? { ...prev, payment: mapped } : null,
          );
        }
      } else {
        alert(data.message || 'Failed to update payment status');
      }
    } catch {
      alert('Network error updating payment status');
    }
  };

  // Handle Refund
  const handleIssueRefund = async (booking: Booking) => {
    const tx = booking.transactions?.[0];
    if (!tx || !tx.paymentIntentId) {
      alert('No electronic transaction record found on this booking.');
      return;
    }

    const reason = prompt(
      `Issue refund for ${booking.clientName} (${booking.reference})?\nEnter refund reason:`,
      'Customer requested cancellation',
    );
    if (!reason) return;

    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: tx.paymentIntentId,
          reason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Refund processed successfully!');
        handleUpdatePaymentStatus(booking.id, 'UNPAID');
        handleUpdateBookingStatus(booking.id, 'CANCELLED');
        loadBookings();
      } else {
        alert(data.message || 'Refund failed');
      }
    } catch {
      alert('Network error processing refund');
    }
  };

  // Handle Reschedule
  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setRescheduling(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedBooking.id,
          bookingDate: rescheduleDate || selectedBooking.date,
          startTime: rescheduleTime || selectedBooking.time.split('–')[0],
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Booking rescheduled successfully!');
        setRescheduleModalOpen(false);
        loadBookings();
        if (selectedBooking) {
          setSelectedBooking((prev) =>
            prev
              ? {
                  ...prev,
                  date: rescheduleDate || prev.date,
                  time: rescheduleTime || prev.time,
                }
              : null,
          );
        }
      } else {
        alert(data.message || 'Reschedule failed');
      }
    } catch {
      alert('Network error rescheduling appointment');
    } finally {
      setRescheduling(false);
    }
  };

  // Dispatch Customer Reminders (Intake Form or Meet & Greet)
  const handleSendReminder = async (type: 'INTAKE_REMINDER' | 'MEET_GREET_RESCHEDULE', b: Booking) => {
    setSendingReminder(b.id);
    try {
      const res = await fetch('/api/admin/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          bookingId: b.id,
          bookingRef: b.reference,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Notification sent successfully!');
      } else {
        alert(data.message || 'Failed to send notification.');
      }
    } catch {
      alert('Network error sending notification.');
    } finally {
      setSendingReminder(null);
    }
  };

  // Copy Full Customer Info to Clipboard
  const handleCopyCustomerSummary = (b: Booking) => {
    const intake = b.intakeProfile;
    const summary = `
COMO PET CARE — BOOKING SUMMARY
Reference: ${b.reference}
Client: ${b.clientName}
Phone: ${b.customerPhone}
Email: ${b.customerEmail}
Address: ${b.customerAddress}
Service: ${b.service} (${b.duration})
Date: ${b.date} at ${b.time}
Pet(s): ${b.allPets?.map((p) => `${p.name} (${p.breed || p.type})`).join(', ') || b.petName}
Care Notes: ${b.notes}

ACCESS & SECURITY CODES:
Primary Entry: ${intake?.primaryEntryMethod || 'N/A'}
Door Code: ${intake?.doorCode || 'None'}
Garage Code: ${intake?.garageCode || 'None'}
Alarm Code: ${intake?.alarmCode || 'None'}
Lockbox Location: ${intake?.keyLockboxLocation || 'None'}
Entry Notes: ${intake?.entryInstructions || 'None'}

EMERGENCY & VET:
Vet Clinic: ${intake?.veterinaryClinic || 'N/A'} (${intake?.veterinaryPhone || 'N/A'})
Emergency Contact: ${intake?.primaryName || 'N/A'} (${intake?.primaryPhone || 'N/A'})
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
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
    const intake = selectedBooking.intakeProfile;
    const mg = selectedBooking.meetAndGreet;

    return (
      <div className={styles.bookingsContainer}>
        {/* Back navigation and breadcrumb */}
        <div className="dashboard-title-bar">
          <button
            className={styles.backTitleButton}
            onClick={() => setViewMode('list')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--primary)',
            }}
          >
            <ChevronLeft size={20} />
            <span>Booking #{selectedBooking.reference}</span>
          </button>
          <span className="dashboard-breadcrumb">Dashboard &gt; Bookings &gt; Details</span>
        </div>

        {/* Action Toolbar for Operations */}
        <div className={styles.customerActionBar}>
          <div className={styles.actionBarGroup}>
            {/* Status Change Buttons */}
            {selectedBooking.status !== 'confirmed' && (
              <button
                type="button"
                className={styles.btnActionPrimary}
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'CONFIRMED')}
              >
                <CheckCircle2 size={14} />
                <span>Confirm Booking</span>
              </button>
            )}

            {selectedBooking.status !== 'in_progress' && (
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'IN_PROGRESS')}
              >
                <Clock size={14} />
                <span>In Progress</span>
              </button>
            )}

            {selectedBooking.status !== 'completed' && (
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'COMPLETED')}
              >
                <CheckCircle2 size={14} />
                <span>Mark Completed</span>
              </button>
            )}

            {selectedBooking.status !== 'cancelled' && (
              <button
                type="button"
                className={styles.btnActionDanger}
                onClick={() => {
                  if (confirm(`Are you sure you want to cancel booking ${selectedBooking.reference}?`)) {
                    handleUpdateBookingStatus(selectedBooking.id, 'CANCELLED');
                  }
                }}
              >
                <X size={14} />
                <span>Cancel</span>
              </button>
            )}

            {/* Reschedule Button */}
            <button
              type="button"
              className={styles.btnActionSecondary}
              onClick={() => {
                setRescheduleDate(selectedBooking.date);
                setRescheduleTime(selectedBooking.time.split('–')[0]);
                setRescheduleModalOpen(true);
              }}
            >
              <CalendarClock size={14} />
              <span>Reschedule</span>
            </button>

            {/* Payment Toggle */}
            {selectedBooking.payment === 'unpaid' ? (
              <button
                type="button"
                className={styles.btnActionPrimary}
                style={{ backgroundColor: '#059669' }}
                onClick={() => handleUpdatePaymentStatus(selectedBooking.id, 'PAID')}
              >
                <DollarSign size={14} />
                <span>Mark Paid</span>
              </button>
            ) : (
              <button
                type="button"
                className={styles.btnActionSecondary}
                onClick={() => handleIssueRefund(selectedBooking)}
              >
                <RotateCcw size={14} />
                <span>Issue Refund</span>
              </button>
            )}

            {/* Send Intake Form Link Reminder */}
            {selectedBooking.intakeStatus !== 'completed' && (
              <button
                type="button"
                className={styles.btnActionSecondary}
                style={{
                  borderColor: '#b18a45',
                  color: '#b18a45',
                  backgroundColor: '#faf6ee',
                }}
                onClick={() => handleSendReminder('INTAKE_REMINDER', selectedBooking)}
                disabled={sendingReminder === selectedBooking.id}
                title="Send customer an email with their unique Intake Form link"
              >
                <FileText size={14} />
                <span>{sendingReminder === selectedBooking.id ? 'Sending...' : 'Send Intake Link'}</span>
              </button>
            )}

            {/* Missed Meet & Greet Notice */}
            <button
              type="button"
              className={styles.btnActionSecondary}
              style={{
                borderColor: '#3b82f6',
                color: '#1d4ed8',
                backgroundColor: '#eff6ff',
              }}
              onClick={() => handleSendReminder('MEET_GREET_RESCHEDULE', selectedBooking)}
              disabled={sendingReminder === selectedBooking.id}
              title="Send courteous Missed Meet & Greet email with reschedule link"
            >
              <CalendarClock size={14} />
              <span>{sendingReminder === selectedBooking.id ? 'Sending...' : 'Missed Meet & Greet'}</span>
            </button>

            {/* Divider between Operations and Contact */}
            {(selectedBooking.customerPhone || selectedBooking.customerEmail) && (
              <div className={styles.actionBarDivider} />
            )}

            {/* Direct Contact actions */}
            {selectedBooking.customerPhone && (
              <a
                href={`tel:${selectedBooking.customerPhone}`}
                className={styles.btnActionSecondary}
                title="Call customer"
              >
                <Phone size={14} />
                <span>Call</span>
              </a>
            )}

            {selectedBooking.customerEmail && (
              <a
                href={`mailto:${selectedBooking.customerEmail}?subject=Regarding Your Como Pet Care Booking (${selectedBooking.reference})`}
                className={styles.btnActionSecondary}
                title="Email customer"
              >
                <Mail size={14} />
                <span>Email</span>
              </a>
            )}
          </div>
        </div>

        {/* Reschedule Modal */}
        {rescheduleModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setRescheduleModalOpen(false)}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Reschedule Booking {selectedBooking.reference}</h3>
                <button
                  type="button"
                  className={styles.modalCloseBtn}
                  onClick={() => setRescheduleModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    New Scheduled Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. August 15, 2026 or 2026-08-15"
                    className={styles.searchInput}
                    style={{ width: '100%' }}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    New Appointment Start Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    className={styles.searchInput}
                    style={{ width: '100%' }}
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    className={styles.btnActionSecondary}
                    onClick={() => setRescheduleModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.btnActionPrimary}
                    disabled={rescheduling}
                  >
                    {rescheduling ? 'Updating...' : 'Confirm Reschedule'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3-Column details layout */}
        <div className={styles.detailsGrid}>
          {/* COLUMN 1: Booking & Financial Overview */}
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
                <span className={styles.metaLabel}>Scheduled Date &amp; Time</span>
                <span className={styles.metaValue}>
                  {selectedBooking.date} at {selectedBooking.time}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Booking Status</span>
                <div>
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
                    {selectedBooking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div
                style={{
                  marginTop: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid #efe7d8',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Base Price</span>
                  <span style={{ fontWeight: 600 }}>{selectedBooking.basePrice}</span>
                </div>
                {selectedBooking.additionalPetFee !== '$0.00' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Additional Pet Fee</span>
                    <span>{selectedBooking.additionalPetFee}</span>
                  </div>
                )}
                {selectedBooking.puppySurcharge !== '$0.00' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Puppy Surcharge</span>
                    <span>{selectedBooking.puppySurcharge}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    paddingTop: '6px',
                    borderTop: '1px dashed #efe7d8',
                  }}
                >
                  <span>Total Amount</span>
                  <span>{selectedBooking.totalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Payment</span>
                  <span
                    className={`${styles.paymentTag} ${
                      selectedBooking.payment === 'paid' ? '' : styles.paymentUnpaid
                    }`}
                  >
                    <span className={styles.dot} />
                    {selectedBooking.payment.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Customer Information */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <User size={18} style={{ color: 'var(--primary)' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Customer Profile</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Client Full Name</span>
                <span className={styles.metaValue}>{selectedBooking.clientName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Email Address</span>
                <span className={styles.metaValue}>
                  <a href={`mailto:${selectedBooking.customerEmail}`} style={{ color: 'var(--primary)' }}>
                    {selectedBooking.customerEmail || 'N/A'}
                  </a>
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Phone Number</span>
                <span className={styles.metaValue}>
                  <a href={`tel:${selectedBooking.customerPhone}`} style={{ color: 'var(--primary)' }}>
                    {selectedBooking.customerPhone || 'N/A'}
                  </a>
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Service Address</span>
                <span className={styles.metaValue}>{selectedBooking.customerAddress || 'Columbia, MO'}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Client Classification</span>
                <span className={styles.metaValue}>
                  {selectedBooking.isNewCustomer ? 'New Client (First Booking)' : 'Returning Client'} •{' '}
                  {selectedBooking.isColumbiaResident ? 'Columbia Resident ✓' : 'Out of Area'}
                </span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Intake Form Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    className={`${styles.statusTag} ${
                      selectedBooking.intakeStatus === 'completed'
                        ? styles.statusConfirmed
                        : styles.statusPending
                    }`}
                  >
                    {selectedBooking.intakeStatus === 'completed' ? 'Completed ✓' : 'Pending Client Submission'}
                  </span>
                  {selectedBooking.intakeStatus !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleSendReminder('INTAKE_REMINDER', selectedBooking)}
                      disabled={sendingReminder === selectedBooking.id}
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: 600,
                        borderRadius: '6px',
                        border: '1px solid #b18a45',
                        backgroundColor: '#faf6ee',
                        color: '#b18a45',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Send customer an email with their unique Intake Form link"
                    >
                      <FileText size={12} />
                      <span>{sendingReminder === selectedBooking.id ? 'Sending...' : 'Email Intake Link'}</span>
                    </button>
                  )}
                </div>
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
              {selectedBooking.allPets && selectedBooking.allPets.length > 0 ? (
                selectedBooking.allPets.map((p, idx) => (
                  <div
                    key={p.id || idx}
                    style={{
                      padding: '10px',
                      backgroundColor: 'var(--warm-ivory, #fbf9f4)',
                      borderRadius: '8px',
                      border: '1px solid #efe7d8',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '15px' }}>
                        🐾 {p.name}
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {p.type} {p.isPuppy ? '• Puppy 🐶' : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', marginTop: '4px', color: 'var(--foreground)' }}>
                      <strong>Breed:</strong> {p.breed || 'Mixed'} | <strong>Age:</strong> {p.age || 'Adult'}
                    </div>
                    {p.feedingRoutine && (
                      <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-muted)' }}>
                        <strong>Feeding:</strong> {p.feedingRoutine}
                      </div>
                    )}
                    {p.careInstructions && (
                      <div style={{ fontSize: '12px', marginTop: '2px', color: 'var(--text-muted)' }}>
                        <strong>Care:</strong> {p.careInstructions}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Pet Name</span>
                    <span className={styles.metaValue}>{selectedBooking.petName}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span className={styles.metaLabel}>Species &amp; Breed</span>
                    <span className={styles.metaValue}>
                      {selectedBooking.petType || 'Dog'} • {selectedBooking.breed || 'Mixed'}
                    </span>
                  </div>
                </>
              )}

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Special Booking Notes</span>
                <span className={styles.metaValue} style={{ fontSize: '13px', lineHeight: 1.4 }}>
                  {selectedBooking.notes}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 4: Home Access & Entry Codes (Collected from Customer) */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <Key size={18} style={{ color: '#b45309' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Home Access &amp; Entry Security</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Primary Entry Method</span>
                <span className={styles.metaValue}>
                  {intake?.primaryEntryMethod || 'Front Door Key / Lockbox'}
                </span>
              </div>

              {intake?.doorCode && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Door Access Code</span>
                  <span className={styles.codeChip}>{intake.doorCode}</span>
                </div>
              )}

              {intake?.garageCode && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Garage Keypad Code</span>
                  <span className={styles.codeChip}>{intake.garageCode}</span>
                </div>
              )}

              {intake?.alarmCode && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Security Alarm Code / Disarm Instructions</span>
                  <span className={styles.codeChip}>{intake.alarmCode}</span>
                </div>
              )}

              {intake?.keyLockboxLocation && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Key Lockbox Location</span>
                  <span className={styles.metaValue}>{intake.keyLockboxLocation}</span>
                </div>
              )}

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Entry &amp; Parking Instructions</span>
                <span className={styles.metaValue} style={{ fontSize: '12.5px', lineHeight: 1.4 }}>
                  {intake?.entryInstructions || intake?.parkingInstructions || 'Standard driveway / street parking.'}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 5: Medical, Health & Veterinary Profile */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <HeartPulse size={18} style={{ color: '#b91c1c' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Medical &amp; Veterinary Info</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Veterinary Clinic</span>
                <span className={styles.metaValue}>
                  {intake?.veterinaryClinic || 'Horton Animal Hospital (Columbia, MO)'}
                </span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Vet Doctor &amp; Emergency Phone</span>
                <span className={styles.metaValue}>
                  {intake?.veterinarianName || 'Staff Veterinarian'} •{' '}
                  {intake?.veterinaryPhone ? (
                    <a href={`tel:${intake.veterinaryPhone}`} style={{ color: 'var(--primary)' }}>
                      {intake.veterinaryPhone}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Takes Medications</span>
                <span className={styles.metaValue}>
                  {intake?.takesMedication || 'None declared'}
                  {intake?.medicationName ? ` (${intake.medicationName}: ${intake.dosageInstructions || ''})` : ''}
                </span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Known Allergies &amp; Health Conditions</span>
                <span className={styles.metaValue} style={{ fontSize: '12.5px' }}>
                  {intake?.knownAllergies || intake?.medicalConditions || 'No known allergies or medical issues.'}
                </span>
              </div>
            </div>
          </div>

          {/* COLUMN 6: Emergency Contacts & Authorization */}
          <div className={styles.detailsCard}>
            <div className={styles.detailsCardHeader}>
              <span className={styles.detailsCardIcon}>
                <ShieldAlert size={18} style={{ color: '#4338ca' }} />
              </span>
              <h3 className={styles.detailsCardTitle}>Emergency Contacts &amp; Visits</h3>
            </div>

            <div className={styles.detailsMetaList}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Primary Emergency Contact</span>
                <span className={styles.metaValue}>
                  {intake?.primaryName || selectedBooking.clientName}{' '}
                  {intake?.primaryRelationship ? `(${intake.primaryRelationship})` : ''} •{' '}
                  {intake?.primaryPhone || selectedBooking.customerPhone}
                </span>
              </div>

              {intake?.secondaryName && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Secondary Emergency Contact</span>
                  <span className={styles.metaValue}>
                    {intake.secondaryName}{' '}
                    {intake.secondaryRelationship ? `(${intake.secondaryRelationship})` : ''} •{' '}
                    {intake.secondaryPhone || 'N/A'}
                  </span>
                </div>
              )}

              {/* Meet and Greet */}
              {mg && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#e6edea',
                    border: '1px solid rgba(18, 63, 60, 0.2)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13.5px' }}>
                    🤝 Meet &amp; Greet Appointment
                  </div>
                  <div style={{ fontSize: '12.5px', marginTop: '3px' }}>
                    Scheduled for: <strong>{mg.date} at {mg.time}</strong>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Address: {mg.address} | Status: <strong>{mg.status}</strong>
                  </div>
                </div>
              )}

              <div className={styles.metaRow} style={{ marginTop: '6px' }}>
                <span className={styles.metaLabel}>Vet Care Medical Authorization</span>
                <span className={styles.metaValue}>
                  {intake?.vetAuthorization ? 'Authorized by Owner ✓' : 'Standard Authorization'}
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
            className={styles.btnActionSecondary}
            onClick={loadBookings}
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
              className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Bookings ({bookings.length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'confirmed' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({bookings.filter((b) => b.status === 'pending').length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'completed' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({bookings.filter((b) => b.status === 'completed').length})
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'cancelled' ? styles.activeTabButton : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
            </button>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className={styles.actionBar}>
          <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search reference, client, pet, service..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterActions}>
            {/* Payment Filter */}
            <select
              className={styles.btnSecondary}
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
                setSortBy((prev) => (prev === 'reference-asc' ? 'reference-desc' : 'reference-asc'));
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
                setSearchQuery('');
                setPaymentFilter('all');
              }}
            >
              <Filter size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className={styles.tableWrapper}>
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
                <th className={styles.th}>Booking Ref</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Pet</th>
                <th className={styles.th}>Service &amp; Time</th>
                <th className={styles.th}>Total</th>
                <th className={styles.th}>Payment</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                    <RefreshCw size={24} className={styles.spinIcon} style={{ margin: '0 auto 8px auto' }} />
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Loading live bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px 16px' }}>
                    <FileText size={32} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ fontWeight: 600, margin: '0 0 4px 0', color: 'var(--foreground)' }}>
                      No bookings found
                    </p>
                    <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-muted)' }}>
                      Customer appointments placed online will automatically appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isChecked = selectedIds.includes(b.id);

                  return (
                    <tr key={b.id} className={isChecked ? styles.trSelected : ''}>
                      <td className={`${styles.td} ${styles.tdCheckbox}`}>
                        <input
                          type="checkbox"
                          className={styles.customCheckbox}
                          checked={isChecked}
                          onChange={(e) => handleSelectRow(b.id, e.target.checked)}
                        />
                      </td>

                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.refLink}
                          onClick={() => {
                            setSelectedBooking(b);
                            setViewMode('details');
                          }}
                          style={{ border: 'none', background: 'none', padding: 0 }}
                        >
                          {b.reference}
                        </button>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText}>{b.clientName}</span>
                        <span className={styles.subtext}>{b.customerPhone}</span>
                      </td>

                      <td className={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PawPrint size={14} style={{ color: '#b45309' }} />
                          <span style={{ fontWeight: 600 }}>{b.petName}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({b.breed})</span>
                        </div>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText}>{b.service}</span>
                        <span className={styles.subtext}>
                          {b.date} • {b.time}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span className={styles.boldText} style={{ color: 'var(--primary)' }}>
                          {b.totalPrice}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <span
                          className={`${styles.paymentTag} ${
                            b.payment === 'paid' ? '' : styles.paymentUnpaid
                          }`}
                        >
                          <span className={styles.dot} />
                          {b.payment.toUpperCase()}
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
                          {b.status.toUpperCase()}
                        </span>
                      </td>

                      <td className={styles.td}>
                        <button
                          type="button"
                          className={styles.btnActionSecondary}
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                          onClick={() => {
                            setSelectedBooking(b);
                            setViewMode('details');
                          }}
                        >
                          View Details &gt;
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
