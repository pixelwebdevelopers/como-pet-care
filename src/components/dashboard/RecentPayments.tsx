'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowRight, DollarSign, CheckCircle2, RotateCcw } from 'lucide-react';

interface PaymentItem {
  id: string;
  customerName: string;
  bookingRef: string;
  service: string;
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
}

interface RecentPaymentsProps {
  onViewAll?: () => void;
}

export default function RecentPayments({ onViewAll }: RecentPaymentsProps) {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/admin/payments?status=all')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments.slice(0, 5));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-card recent-payments-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <CreditCard size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} />
          <h2 className="card-title">Recent Payments</h2>
        </div>
        <button
          type="button"
          className="card-header-link"
          onClick={() => onViewAll?.()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          View all <ArrowRight size={14} />
        </button>
      </div>

      <div className="recent-payments-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
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
            <DollarSign size={28} style={{ color: 'var(--primary)', opacity: 0.4, marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 600, fontSize: '13.5px', color: 'var(--foreground)' }}>
              No payments recorded yet
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Incoming transaction records will appear here in real time.
            </p>
          </div>
        ) : (
          payments.map((p) => {
            const isPaid = p.status === 'paid';
            const isRefunded = p.status === 'refunded';

            return (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  backgroundColor: 'var(--warm-ivory, #fbf9f4)',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border, #efe7d8)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onClick={() => onViewAll?.()}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      color: isPaid ? '#059669' : '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isPaid ? <CheckCircle2 size={16} /> : <RotateCcw size={16} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--foreground)' }}>
                      {p.customerName}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {p.service} • {p.paymentDate}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: isRefunded ? '#dc2626' : 'var(--primary)',
                      display: 'block',
                    }}
                  >
                    {isRefunded ? `-${p.amount}` : p.amount}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: isPaid ? '#059669' : isRefunded ? '#dc2626' : '#b45309',
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
