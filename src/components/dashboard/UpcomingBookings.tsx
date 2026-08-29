'use client';

import React from 'react';
import { CalendarCheck, ChevronRight, PawPrint, ArrowRight } from 'lucide-react';

export interface UpcomingItem {
  id: string;
  clientName: string;
  petName: string;
  date: string;
  time: string;
  service: string;
  duration: string;
  status?: string;
  reference?: string;
}

interface UpcomingBookingsProps {
  bookings?: UpcomingItem[];
  onViewAll?: () => void;
}

export default function UpcomingBookings({ bookings: initialBookings, onViewAll }: UpcomingBookingsProps) {
  const defaultBookings: UpcomingItem[] = [
    {
      id: '1',
      clientName: 'Sarah John',
      petName: 'Bella',
      date: 'Aug 10, 2026',
      time: '9:00 AM',
      service: 'Drop-In Visits',
      duration: '30 min',
      status: 'CONFIRMED',
    },
    {
      id: '2',
      clientName: 'Clark Kent',
      petName: 'Krypto',
      date: 'Aug 12, 2026',
      time: '11:00 AM',
      service: 'Dog Walking',
      duration: '30 min',
      status: 'CONFIRMED',
    },
  ];

  const bookings = initialBookings && initialBookings.length > 0 ? initialBookings : defaultBookings;

  return (
    <div className="dashboard-card upcoming-bookings-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <CalendarCheck size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Upcoming Bookings</h2>
        </div>
        <button
          className="card-header-link"
          onClick={() => onViewAll?.() || alert('Showing all bookings')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="upcoming-bookings-list">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="upcoming-booking-item"
            onClick={() => alert(`Booking ${booking.reference || booking.id}: ${booking.clientName} - ${booking.service}`)}
          >
            {/* Pet Avatar Icon Frame */}
            <div
              className="booking-pet-avatar-frame"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5eee3',
                color: '#b18a45',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                flexShrink: 0,
              }}
            >
              <PawPrint size={18} />
            </div>

            <div className="booking-info-cell client-info">
              <span className="booking-client-name">{booking.clientName}</span>
              <span className="booking-pet-name">🐾 {booking.petName}</span>
            </div>

            <div className="booking-info-cell date-info">
              <span className="booking-date">{booking.date}</span>
              <span className="booking-time">{booking.time}</span>
            </div>

            <div className="booking-info-cell service-info">
              <span className="booking-service">{booking.service}</span>
              <span className="booking-duration">{booking.duration}</span>
            </div>

            <div className="booking-action-cell">
              <ChevronRight size={16} style={{ color: 'rgba(28, 37, 36, 0.4)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
