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
  const activities = initialActivities || [];

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
          onClick={() => onViewAll?.()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="activity-timeline-container">
        {activities.length === 0 ? (
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
            <Activity size={28} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13.5px', color: 'var(--foreground)' }}>
              No recent audit activity
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Actions like new bookings and payments will be logged here.
            </p>
          </div>
        ) : (
          activities.map((item) => (
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
          ))
        )}
      </div>
    </div>
  );
}
