'use client';

import React from 'react';
import { Activity, FileText, CheckCircle2, CreditCard, ArrowRight } from 'lucide-react';

export interface ActivityItem {
  id: string;
  action: string;
  details: string;
  time: string;
  themeClass?: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  onViewAll?: () => void;
}

export default function RecentActivity({ activities: initialActivities, onViewAll }: RecentActivityProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      action: 'New Booking Created',
      details: 'Max - Dog Walking (30 min)',
      time: 'Just now',
      themeClass: 'activity-booking',
    },
    {
      id: '2',
      action: 'Intake Form Completed',
      details: 'Luna - Medical & Emergency contacts saved',
      time: '2 hr ago',
      themeClass: 'activity-intake',
    },
    {
      id: '3',
      action: 'Payment Received',
      details: 'Bella - Pet Sitting $280.00',
      time: 'Yesterday',
      themeClass: 'activity-payment',
    },
  ];

  const activities = initialActivities && initialActivities.length > 0 ? initialActivities : defaultActivities;

  const getActivityIcon = (themeClass?: string) => {
    if (themeClass === 'activity-intake') return <CheckCircle2 size={16} />;
    if (themeClass === 'activity-payment') return <CreditCard size={16} />;
    return <FileText size={16} />;
  };

  return (
    <div className="dashboard-card recent-activity-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <Activity size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <button
          className="card-header-link"
          onClick={() => onViewAll?.() || alert('Showing all system audit logs')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="activity-timeline-container">
        {activities.map((item) => (
          <div key={item.id} className="activity-row">
            <div className={`activity-icon-badge ${item.themeClass || 'activity-booking'}`}>
              {getActivityIcon(item.themeClass)}
            </div>
            <div className="activity-content-box">
              <div className="activity-details-text">
                <span className="activity-action-title">{item.action}</span>
                <span className="activity-details-desc">{item.details}</span>
              </div>
              <span className="activity-time-stamp">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
