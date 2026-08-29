'use client';

import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';

export interface WaitlistItem {
  id: string;
  name: string;
  petType: string;
  service: string;
  date: string;
  status: string;
}

interface WaitlistProps {
  items?: WaitlistItem[];
  onViewAll?: () => void;
}

export default function Waitlist({ items: initialItems, onViewAll }: WaitlistProps) {
  const defaultWaitlist: WaitlistItem[] = [
    {
      id: '1',
      name: 'Michael Scott',
      petType: 'Dog (Puppy)',
      service: 'Pet Sitting',
      date: 'Aug 24, 2026',
      status: 'Meet & Greet',
    },
    {
      id: '2',
      name: 'Elizabeth Swan',
      petType: 'Cat',
      service: 'Drop-In Visits',
      date: 'Aug 26, 2026',
      status: 'Requested',
    },
  ];

  const waitlist = initialItems && initialItems.length > 0 ? initialItems : defaultWaitlist;

  return (
    <div className="dashboard-card waitlist-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <Clock size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Pending Queue &amp; Waitlist</h2>
        </div>
        <button
          className="card-header-link"
          onClick={() => onViewAll?.() || alert('View all pending queue requests')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="waitlist-items-list">
        {waitlist.map((item) => (
          <div key={item.id} className="waitlist-item-row">
            {/* User Avatar Icon Badge */}
            <div
              className="waitlist-user-avatar-frame"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e6edea',
                color: '#123f3c',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                flexShrink: 0,
              }}
            >
              <User size={16} />
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
