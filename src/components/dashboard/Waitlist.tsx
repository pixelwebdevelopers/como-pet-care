'use client';

import React from 'react';
import Image from 'next/image';

// --- WAITLIST SVG ICONS ---
const WaitlistHeaderIcon = () => (
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
      marginRight: '6px',
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
    />
  </svg>
);

interface WaitlistItem {
  id: string;
  name: string;
  petType: string;
  service: string;
  date: string;
  avatar: string;
  status: 'Requested';
}

export default function Waitlist() {
  const waitlist: WaitlistItem[] = [
    {
      id: '1',
      name: 'Michael',
      petType: 'Puppy',
      service: 'Pet Sitting',
      date: 'May 24, 2026',
      avatar: '/assets/client-avatar.jpg',
      status: 'Requested',
    },
    {
      id: '2',
      name: 'Elizebeth',
      petType: 'Puppy',
      service: 'Pet Sitting',
      date: 'May 24, 2026',
      avatar: '/assets/walker-avatar.jpg',
      status: 'Requested',
    },
    {
      id: '3',
      name: 'Alexa',
      petType: 'Puppy',
      service: 'Pet Sitting',
      date: 'May 24, 2026',
      avatar: '/assets/admin-avatar.jpg',
      status: 'Requested',
    },
  ];

  return (
    <div className="dashboard-card waitlist-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <WaitlistHeaderIcon />
          <h2 className="card-title">Waitlist</h2>
        </div>
        <button className="card-header-link" onClick={() => alert('View all waitlist')}>
          View all →
        </button>
      </div>

      <div className="waitlist-items-list">
        {waitlist.map((item) => (
          <div key={item.id} className="waitlist-item-row">
            {/* User Avatar */}
            <div className="waitlist-user-avatar-frame">
              <Image
                src={item.avatar}
                alt={item.name}
                fill
                sizes="32px"
                className="waitlist-user-avatar-img"
              />
            </div>

            {/* Name/Pet details */}
            <div className="waitlist-details-cell client-info">
              <span className="waitlist-client-name">{item.name}</span>
              <span className="waitlist-pet-type">{item.petType}</span>
            </div>

            {/* Service */}
            <div className="waitlist-details-cell service-info">
              <span className="waitlist-service">{item.service}</span>
            </div>

            {/* Booking Date */}
            <div className="waitlist-details-cell date-info">
              <span className="waitlist-date">{item.date}</span>
            </div>

            {/* Status */}
            <div className="waitlist-action-cell">
              <span className="badge badge-requested">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
