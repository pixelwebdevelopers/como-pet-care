'use client';

import React from 'react';
import { Plus, CreditCard, CalendarOff, Sparkles, UserPlus, Dog } from 'lucide-react';

interface QuickActionsProps {
  onNewBooking?: () => void;
  onNewClient?: () => void;
  onNewPet?: () => void;
  onRecordPayment?: () => void;
  onBlockAvailability?: () => void;
}

export default function QuickActions({
  onNewBooking,
  onNewClient,
  onNewPet,
  onRecordPayment,
  onBlockAvailability,
}: QuickActionsProps) {
  return (
    <div className="dashboard-card quick-actions-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <Sparkles size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Quick Actions</h2>
        </div>
      </div>

      <div className="quick-actions-grid">
        <button
          className="quick-action-btn"
          onClick={() => (onNewBooking ? onNewBooking() : (window.location.href = '/booking'))}
        >
          <Plus size={16} />
          <span>New Booking</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => onNewClient?.() || alert('New Client modal opened')}
        >
          <UserPlus size={16} />
          <span>New Client</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => onNewPet?.() || alert('New Pet registration opened')}
        >
          <Dog size={16} />
          <span>New Pet</span>
        </button>

        <button
          className="quick-action-btn"
          onClick={() => onRecordPayment?.() || alert('Record Payment modal opened')}
        >
          <CreditCard size={16} />
          <span>Record Payment</span>
        </button>

        <button
          className="quick-action-btn block-btn"
          onClick={() => onBlockAvailability?.() || alert('Block dates / slots modal opened')}
        >
          <CalendarOff size={16} />
          <span>Block Availability</span>
        </button>
      </div>
    </div>
  );
}
