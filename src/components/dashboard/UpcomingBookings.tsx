'use client';

import React from 'react';
import Image from 'next/image';

// --- UPCOMING BOOKINGS SVG ICONS ---
const BookingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{
      width: '18px',
      height: '18px',
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: '4px',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3m-3-6h5.25m-6.75 3h.008v.008H6V12Zm0 3h.008v.008H6V15Zm0-6h.008v.008H6V9m.75-3h10.5a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 16.5 21h-10.5A2.25 2.25 0 0 1 3.75 18.75V8.25A2.25 2.25 0 0 1 6 6Z"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '16px', height: '16px', color: 'rgba(28, 37, 36, 0.4)' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

interface UpcomingItem {
  id: string;
  clientName: string;
  petName: string;
  date: string;
  time: string;
  service: string;
  duration: string;
  avatar: string;
}

export default function UpcomingBookings() {
  const bookings: UpcomingItem[] = Array(5)
    .fill({
      clientName: 'Michael',
      petName: 'Buddy',
      date: 'May 24, 2026',
      time: '8:00 AM',
      service: 'Dog Walking',
      duration: '30 min',
      avatar: '/assets/dog-avatar.jpg',
    })
    .map((item, idx) => ({ ...item, id: String(idx + 1) }));

  return (
    <div className="dashboard-card upcoming-bookings-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <BookingIcon />
          <h2 className="card-title">Upcoming Booking</h2>
        </div>
        <button className="card-header-link" onClick={() => alert('View all bookings')}>
          View all →
        </button>
      </div>

      <div className="upcoming-bookings-list">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="upcoming-booking-item"
            onClick={() => alert(`Details for booking ${booking.id}`)}
          >
            <div className="booking-pet-avatar-frame">
              <Image
                src={booking.avatar}
                alt={`${booking.clientName}'s pet ${booking.petName}`}
                fill
                sizes="36px"
                className="booking-pet-avatar-img"
              />
            </div>
            <div className="booking-info-cell client-info">
              <span className="booking-client-name">{booking.clientName}</span>
              <span className="booking-pet-name">{booking.petName}</span>
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
              <ChevronRightIcon />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
