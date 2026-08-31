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
  const bookings = initialBookings || [];

  return (
    <div className="dashboard-card upcoming-bookings-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <CalendarCheck size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Upcoming Bookings</h2>
        </div>
        <button
          className="card-header-link"
          onClick={() => onViewAll?.()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="upcoming-bookings-list">
        {bookings.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              backgroundColor: 'var(--warm-ivory, #fbf9f4)',
              borderRadius: '12px',
              border: '1px dashed var(--card-border, #efe7d8)',
              margin: '8px 0',
            }}
          >
            <CalendarCheck size={28} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13.5px', color: 'var(--foreground)' }}>
              No upcoming bookings found
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Future appointments booked by customers will show up here.
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="upcoming-booking-item"
              onClick={() => onViewAll?.()}
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
          ))
        )}
      </div>
    </div>
  );
}
