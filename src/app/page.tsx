'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    database: string;
    smtp: string;
    timestamp: string;
  } | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  // Email form state
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResponse, setEmailResponse] = useState<{
    success: boolean;
    message: string;
    errors?: string[];
  } | null>(null);

  // Fetch health status
  const fetchHealth = async (showLoading = false) => {
    if (showLoading) {
      setHealthLoading(true);
    }
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthStatus(data);
    } catch {
      setHealthStatus({
        status: 'ERROR',
        database: 'unreachable',
        smtp: 'unreachable',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (active) {
          setHealthStatus(data);
        }
      } catch {
        if (active) {
          setHealthStatus({
            status: 'ERROR',
            database: 'unreachable',
            smtp: 'unreachable',
            timestamp: new Date().toISOString(),
          });
        }
      } finally {
        if (active) {
          setHealthLoading(false);
        }
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // Handle email send submission
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailResponse(null);

    try {
      const res = await fetch('/api/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setEmailResponse({
          success: false,
          message: data.error || 'Failed to send email.',
          errors: data.details
            ? data.details.map((d: { message: string }) => d.message)
            : undefined,
        });
      } else {
        setEmailResponse({
          success: true,
          message: data.message || 'Test email sent successfully!',
        });
        setEmail('');
        setName('');
        setMessage('');
      }
    } catch {
      setEmailResponse({
        success: false,
        message: 'An unexpected error occurred while sending the email.',
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <a href="#" className="logo">
            Como <span>Pet Care</span>
          </a>
          <button
            className="btn btn-secondary"
            onClick={() => fetchHealth(true)}
            disabled={healthLoading}
          >
            {healthLoading ? 'Checking Status...' : 'Refresh Health Check'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <header className="hero">
          <span className="badge badge-success">Production Ready Setup</span>
          <h1 className="hero-title">Como Pet Care Starter Project</h1>
          <p className="hero-subtitle">
            A production-ready Next.js boilerplate structured with TypeScript, ESLint, Prettier,
            Prisma (MySQL), Nodemailer, environment validation, Docker, and PM2 deployment.
          </p>
        </header>

        {/* Dashboard Grid */}
        <section className="card-grid">
          {/* Health Status Card */}
          <div className="card">
            <h2 className="card-title">System Health & Connectivity</h2>
            <p className="card-description">
              Checks DB connection pool limits and SMTP transporter settings instantly from
              `/api/health`.
            </p>

            <div style={{ marginTop: '1rem' }}>
              {healthLoading ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Loading system health check...
                </p>
              ) : healthStatus ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Overall Status:</span>
                    <span
                      className={`badge ${healthStatus.status === 'OK' ? 'badge-success' : 'badge-error'}`}
                    >
                      {healthStatus.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>MySQL Database:</span>
                    <span
                      className={`badge ${healthStatus.database === 'CONNECTED' ? 'badge-success' : 'badge-error'}`}
                    >
                      {healthStatus.database}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>SMTP Mail Server:</span>
                    <span
                      className={`badge ${healthStatus.smtp === 'CONNECTED' ? 'badge-success' : 'badge-error'}`}
                    >
                      {healthStatus.smtp}
                    </span>
                  </div>

                  <p
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}
                  >
                    Last checked: {new Date(healthStatus.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ) : (
                <p style={{ color: 'var(--error)' }}>Could not load health check data.</p>
              )}
            </div>
          </div>

          {/* Nodemailer Demo Card */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h2 className="card-title">Nodemailer SMTP Demonstration</h2>
            <p className="card-description">
              Send a test email using Nodemailer with structured HTML templates. Input is validated
              using Zod.
            </p>

            {emailResponse && (
              <div
                className={`alert ${emailResponse.success ? 'alert-success' : 'alert-error'}`}
                style={{ marginTop: '0.5rem' }}
              >
                <div>
                  <strong>{emailResponse.message}</strong>
                  {emailResponse.errors && (
                    <ul
                      style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem' }}
                    >
                      {emailResponse.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSendEmail} style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="client-name">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="client-name"
                    className="form-control"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="client-email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="client-email"
                    className="form-control"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="client-message">
                  Message Template Content
                </label>
                <textarea
                  id="client-message"
                  className="form-control"
                  rows={3}
                  placeholder="Welcome to Como Pet Care! Write a customizable message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={emailLoading}
              >
                {emailLoading ? 'Sending Email...' : 'Send Test Welcome Email'}
              </button>
            </form>
          </div>
        </section>

        {/* Database Quick Actions */}
        <section className="card-grid" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h2 className="card-title">Production Migrations</h2>
            <p className="card-description">
              Migrations run automatically on deployment. `start` command triggers `prisma migrate
              deploy` automatically.
            </p>
          </div>
          <div className="card">
            <h2 className="card-title">Rate Limiting Protection</h2>
            <p className="card-description">
              Public routes (/api/send-test-email) are secured with in-memory sliding-window rate
              limiters to deter spamming and abuse.
            </p>
          </div>
          <div className="card">
            <h2 className="card-title">Deployment Options</h2>
            <p className="card-description">
              Fully optimized for Hostinger Node Apps panel, VPS with PM2 ecosystem config, and
              containerized architectures via Docker.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Como Pet Care. Built for production durability.</p>
      </footer>
    </div>
  );
}
