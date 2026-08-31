'use client';

import React, { useState, useEffect } from 'react';
import styles from './CalendarPage.module.css';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  PawPrint,
  CheckCircle2,
  DollarSign,
  Filter,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { parseDateString, normalizeDateKey } from '@/lib/availability';

// --- TSX TYPES & INTERFACES ---
type CalendarView = 'day' | 'week' | 'month';

interface CalendarBooking {
  id: string;
  reference: string;
  clientName: string;
  petName: string;
  service: string;
  duration: string;
  date: string; // "YYYY-MM-DD"
  time: string;
  status:
    | 'confirmed'
    | 'pending'
    | 'upcoming'
    | 'completed'
    | 'cancelled'
    | 'in_progress'
    | 'unavailable';
}

export default function CalendarPage() {
  // --- STATE ---
  const [viewMode, setViewMode] = useState<CalendarView>('month');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load bookings from live database API
  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        const mapped: CalendarBooking[] = data.bookings.map((b: any) => {
          const pet = b.customer?.pets?.[0];
          const parsed = parseDateString(b.bookingDate);
          const dateNormalized = parsed ? normalizeDateKey(parsed) : '2026-08-10';

          let mappedStatus: CalendarBooking['status'] = 'confirmed';
          const s = (b.status || '').toLowerCase();
          if (s.includes('pending')) mappedStatus = 'pending';
          else if (s.includes('cancel')) mappedStatus = 'cancelled';
          else if (s.includes('complete')) mappedStatus = 'completed';
          else if (s.includes('progress')) mappedStatus = 'in_progress';
          else if (s.includes('upcoming')) mappedStatus = 'upcoming';

          const custName = b.customer
            ? `${b.customer.firstName || ''} ${b.customer.lastName || ''}`.trim()
            : 'Customer';

          return {
            id: String(b.id),
            reference: b.reference,
            clientName: custName || 'Client',
            petName: pet?.name || 'Pet',
            service: b.serviceName,
            duration: b.serviceId === '2' || b.planTitle?.includes('60') ? '60 min' : '30 min',
            date: dateNormalized,
            time: b.startTime || '9:00 AM',
            status: mappedStatus,
          };
        });
        setBookings(mapped);
      }
    } catch {
      console.error('Failed to load calendar bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // --- CALENDAR WIDGET GENERATION ---
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const totalSlots: (Date | null)[] = [];

    // Add empty/previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      totalSlots.push(null);
    }

    // Add month days
    for (let d = 1; d <= daysInMonth; d++) {
      totalSlots.push(new Date(year, month, d));
    }

    return totalSlots;
  };

  const formatDateString = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const formatHeaderDate = (d: Date): string => {
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get bookings for a particular date
  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter((b) => {
      const matchDate = b.date === dateStr;
      if (statusFilter === 'all') return matchDate;
      return matchDate && b.status === statusFilter;
    });
  };

  const getBookingsCountForDate = (dateStr: string) => {
    return bookings.filter((b) => b.date === dateStr).length;
  };

  // 1. Day View
  const renderDayView = () => {
    const selectedDateStr = formatDateString(selectedDate);
    const dayBookings = getBookingsForDate(selectedDateStr);

    const hours = [
      '7:00 AM',
      '8:00 AM',
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
      '6:00 PM',
    ];

    return (
      <div className={styles.dayTimeline}>
        <div className={styles.dayTimelineHeader}>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>

        {hours.map((hr, idx) => {
          const matchingEvents = dayBookings.filter((b) =>
            b.time.includes(hr.replace(':00', '')),
          );

          return (
            <div key={idx} className={styles.dayTimelineRow}>
              <div className={styles.dayTimeLabel}>{hr}</div>
              <div className={styles.daySlotContent}>
                {matchingEvents.length === 0 ? (
                  <div className={styles.emptySlot}>No scheduled appointments</div>
                ) : (
                  matchingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`${styles.dayEventCard} ${styles[`status_${evt.status}`] || ''}`}
                      onClick={() =>
                        alert(
                          `Booking: ${evt.reference}\nClient: ${evt.clientName}\nPet: ${evt.petName}\nService: ${evt.service}\nTime: ${evt.time}`,
                        )
                      }
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px' }}>
                          🐾 {evt.petName} — {evt.service}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(28,37,36,0.6)' }}>
                          Client: {evt.clientName} • Ref: {evt.reference}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 600, fontSize: '12.5px', color: '#123f3c' }}>
                          {evt.time}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            backgroundColor: '#efe7d8',
                            color: '#123f3c',
                            textTransform: 'uppercase',
                          }}
                        >
                          {evt.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 2. Week View
  const renderWeekView = () => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(new Date(curr.setDate(first + i)));
    }

    return (
      <div className={styles.weekGrid}>
        {weekDays.map((day, idx) => {
          const dateStr = formatDateString(day);
          const dayEvents = getBookingsForDate(dateStr);
          const isToday =
            new Date().getDate() === day.getDate() &&
            new Date().getMonth() === day.getMonth() &&
            new Date().getFullYear() === day.getFullYear();

          return (
            <div key={idx} className={styles.weekCol}>
              <div className={`${styles.weekColHeader} ${isToday ? styles.weekColHeaderToday : ''}`}>
                <span className={styles.weekDayName}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className={styles.weekDayNumber}>{day.getDate()}</span>
              </div>

              <div className={styles.weekColEvents}>
                {dayEvents.length === 0 ? (
                  <span style={{ fontSize: '11px', color: 'rgba(28,37,36,0.4)', fontStyle: 'italic', padding: '8px 0', textAlign: 'center' }}>
                    No visits
                  </span>
                ) : (
                  dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={styles.weekCardMini}
                      onClick={() =>
                        alert(
                          `Booking: ${evt.reference}\nClient: ${evt.clientName}\nPet: ${evt.petName}\nService: ${evt.service}\nTime: ${evt.time}`,
                        )
                      }
                    >
                      <span className={styles.weekCardTitle}>🐾 {evt.petName}</span>
                      <span className={styles.weekCardDesc}>{evt.service}</span>
                      <span className={styles.weekCardDesc} style={{ fontWeight: 700, color: '#123f3c' }}>
                        {evt.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 3. Month View
  const renderMonthView = () => {
    const days = generateCalendarDays();
    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div style={{ width: '100%' }}>
        <div className={styles.monthHeaderRow}>
          {weekLabels.map((lbl, idx) => (
            <span key={idx} className={styles.monthHeaderCell}>
              {lbl}
            </span>
          ))}
        </div>

        <div className={styles.monthGrid}>
          {days.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className={`${styles.monthDayBox} ${styles.monthDayBoxEmpty}`}
                />
              );
            }

            const dateStr = formatDateString(day);
            const dayEvents = getBookingsForDate(dateStr);
            const isActiveDay =
              selectedDate.getDate() === day.getDate() &&
              selectedDate.getMonth() === day.getMonth() &&
              selectedDate.getFullYear() === day.getFullYear();

            return (
              <div
                key={idx}
                className={`${styles.monthDayBox} ${isActiveDay ? styles.monthDayBoxActive : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={styles.monthDayHeader}>
                  <span className={styles.monthDayNum}>{day.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <span className={styles.monthDayCountBadge}>{dayEvents.length}</span>
                  )}
                </div>

                <div className={styles.monthEventsList}>
                  {dayEvents.slice(0, 2).map((evt) => (
                    <div
                      key={evt.id}
                      className={styles.monthEventPill}
                      title={`${evt.petName} - ${evt.service} (${evt.time})`}
                    >
                      <span>🐾 {evt.petName}: {evt.service}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className={styles.monthMoreEvents}>+{dayEvents.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Title Bar */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Appointments Calendar</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Calendar</span>
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

      {/* Main Grid: Calendar Left, Side Panel Right */}
      <div className={styles.calendarLayout}>
        {/* Left: Interactive Calendar */}
        <div className={styles.mainCard}>
          {/* Controls Bar */}
          <div className={styles.controlsRow}>
            {/* View Mode Toggle */}
            <div className={styles.viewModeToggle}>
              {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`${styles.viewModeBtn} ${viewMode === v ? styles.viewModeBtnActive : ''}`}
                  onClick={() => setViewMode(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>

            {/* Month / Period Navigation */}
            <div className={styles.navGroup}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handlePrevMonth}
                title="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.periodLabel}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handleNextMonth}
                title="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                className={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Status: All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Active Calendar View */}
          {loading ? (
            <div className={styles.emptyStateContainer}>
              <div className={styles.emptyStateIconBadge}>
                <RefreshCw size={24} className={styles.spinIcon} />
              </div>
              <h3 className={styles.emptyStateTitle}>Loading Appointments</h3>
              <p className={styles.emptyStateSubtitle}>
                Fetching scheduled visits and appointments from the database...
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'day' && renderDayView()}
              {viewMode === 'week' && renderWeekView()}
              {viewMode === 'month' && renderMonthView()}
            </>
          )}
        </div>

        {/* Right: Sidebar Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Mini Calendar Widget */}
          <div className={styles.sidebarCard}>
            <div className={styles.miniCalendar}>
              <div className={styles.miniCalHeader}>
                <div className={styles.miniCalTitleCol}>
                  <span className={styles.miniCalMonth}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <span className={styles.miniCalSub}>
                    {formatHeaderDate(selectedDate)}
                  </span>
                </div>
                <div className={styles.miniCalNavGroup}>
                  <button className={styles.miniCalNavBtn} onClick={handlePrevMonth}>
                    &lt;
                  </button>
                  <button className={styles.miniCalNavBtn} onClick={handleNextMonth}>
                    &gt;
                  </button>
                </div>
              </div>

              {/* Mini Calendar Grid */}
              <div className={styles.miniCalGrid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((lbl, idx) => (
                  <span key={idx} className={styles.miniCalHeaderCell}>
                    {lbl}
                  </span>
                ))}

                {generateCalendarDays().map((day, idx) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className={`${styles.miniCalCell} ${styles.miniCalCellEmpty}`}
                      />
                    );
                  }

                  const isActive =
                    selectedDate.getDate() === day.getDate() &&
                    selectedDate.getMonth() === day.getMonth() &&
                    selectedDate.getFullYear() === day.getFullYear();

                  const dayCount = getBookingsCountForDate(formatDateString(day));

                  return (
                    <div
                      key={idx}
                      className={`${styles.miniCalCell} ${isActive ? styles.miniCalCellActive : ''}`}
                      onClick={() => setSelectedDate(day)}
                      style={{
                        position: 'relative',
                        fontWeight: dayCount > 0 ? 700 : 500,
                      }}
                    >
                      {day.getDate()}
                      {dayCount > 0 && !isActive && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#123f3c',
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments Summary */}
          <div className={styles.sidebarCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Clock size={16} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Upcoming Visits</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className={styles.upcomingCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#1c2524' }}>
                      🐾 {b.petName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#123f3c', fontWeight: 700 }}>
                      {b.time}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(28,37,36,0.7)' }}>{b.service}</span>
                  <span style={{ fontSize: '11.5px', color: 'rgba(28,37,36,0.5)' }}>Client: {b.clientName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
