'use client';

import React from 'react';

// --- QUICK ACTIONS SVG ICONS ---
const GridHeaderIcon = () => (
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
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const PaymentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6.187-8.25a18.09 18.09 0 0 0-1.122 0A1.5 1.5 0 0 0 1.5 9.5v8A1.5 1.5 0 0 0 3 19h18a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 21 8.25h-17.813Z"
    />
  </svg>
);

const BlockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

export default function QuickActions() {
  return (
    <div className="dashboard-card quick-actions-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <GridHeaderIcon />
          <h2 className="card-title">Quick Actions</h2>
        </div>
      </div>

      <div className="quick-actions-grid">
        <button className="quick-action-btn" onClick={() => alert('New Booking')}>
          <PlusIcon />
          <span>New Booking</span>
        </button>

        <button className="quick-action-btn" onClick={() => alert('New Client')}>
          <PlusIcon />
          <span>New Client</span>
        </button>

        <button className="quick-action-btn" onClick={() => alert('New Pet')}>
          <PlusIcon />
          <span>New Pet</span>
        </button>

        <button className="quick-action-btn" onClick={() => alert('Record Payment')}>
          <PaymentIcon />
          <span>Record Payment</span>
        </button>

        <button className="quick-action-btn block-btn" onClick={() => alert('Block Availability')}>
          <BlockIcon />
          <span>Block Availability</span>
        </button>
      </div>
    </div>
  );
}
