'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// --- SVG ICON COMPONENTS ---
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const EyeSlashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
    style={{ width: '20px', height: '20px' }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2.25}
    stroke="currentColor"
    style={{ width: '16px', height: '16px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    style={{ width: '18px', height: '18px' }}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const CheckShieldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </svg>
);

// Sidebar Icons
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
    />
  </svg>
);

const PetsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 12 20c-1.077 0-2.115-.15-3.097-.432v-.109m0 .109a11.386 11.386 0 0 1-3-3.872v-.109m0 .109a9.147 9.147 0 0 1-1.688-4.56c0-1.12.3-2.17.828-3.07M2.625 19.5a4.125 4.125 0 0 1 7.533-2.493M15 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Zm1.625-3a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z"
    />
  </svg>
);

const ClipboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 0A48.536 48.536 0 0 1 12 3c1.2 0 2.392.05 3.576.15M3 18.75V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 0 1 1.123-.08M3 18.75a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25M3 18.75V9.75M16.5 9.75V18.75"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.75}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);

// --- TYPES ---
type ActiveView = 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFY_OTP' | 'RESET_PASSWORD' | 'ADMIN_PORTAL';

interface AdminStats {
  users: number;
  logs: number;
  activeOtps: number;
}

interface SystemLogEntry {
  id: number;
  action: string;
  details: string;
  ipAddress: string | null;
  createdAt: string;
}

export default function AuthControllerPage() {
  // Navigation State
  const [view, setView] = useState<ActiveView>('LOGIN');

  // Modals Visibility
  const [showResendModal, setShowResendModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form Fields Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  // Utility states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Authenticated Profile
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // Admin Data Dashboard
  const [stats, setStats] = useState<AdminStats>({ users: 0, logs: 0, activeOtps: 0 });
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  // OTP inputs references for auto-focusing
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

  // Fetch admin logs and stats from MySQL database
  const loadAdminDashboardData = async () => {
    setAdminLoading(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (res.ok && data.success) {
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch {
      console.error('Failed to load database logs.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Check if session ID cookie already exists on load
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const res = await fetch('/api/admin/logs');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setUserProfile({
              name: 'Como Admin',
              email: 'admin@comopetcare.com',
              role: 'ADMIN',
            });
            setStats(data.stats);
            setLogs(data.logs);
            setView('ADMIN_PORTAL');
          }
        }
      } catch {
        // Safe to ignore, session is expired or not set
      }
    };
    checkActiveSession();
  }, []);

  // --- OTP Focus Transitions Handlers ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next digit field
    if (val !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputsRef.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // --- API HANDLERS ---

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Authentication failed.');
      } else {
        setUserProfile(data.user);
        await loadAdminDashboardData();
        setView('ADMIN_PORTAL');
        // Reset form inputs
        setPassword('');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to request reset code.');
      } else {
        setSuccessMessage(data.message);
        setOtp(Array(6).fill('')); // Reset OTP boxes
        setView('VERIFY_OTP');
      }
    } catch {
      setErrorMessage('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification submission
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit code.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Verification code check failed.');
      } else {
        setSuccessMessage(data.message || 'Code verified successfully.');
        setView('RESET_PASSWORD');
      }
    } catch {
      setErrorMessage('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP code handler
  const handleResendCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to resend code.');
      } else {
        setShowResendModal(true); // Open the Modal confirmation
        setOtp(Array(6).fill(''));
      }
    } catch {
      setErrorMessage('Network connection lost.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Reset submission
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    const otpCode = otp.join('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
          password: newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to reset password.');
      } else {
        setShowSuccessModal(true); // Open the congratulations modal!
      }
    } catch {
      setErrorMessage('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      console.error('Logout error occurred on server.');
    } finally {
      // Clear client session states
      setUserProfile(null);
      setEmail('');
      setView('LOGIN');
    }
  };

  // Render Admin Portal dashboard
  if (view === 'ADMIN_PORTAL') {
    return (
      <div className="admin-layout">
        {/* Sidebar Panel */}
        <aside className="admin-sidebar">
          <div>
            <a href="#" className="admin-brand">
              Como <span>Pet Care</span>
            </a>
            <ul className="admin-menu">
              <li>
                <button className="admin-menu-item active">
                  <DashboardIcon />
                  Dashboard
                </button>
              </li>
              <li>
                <button className="admin-menu-item" onClick={() => alert('Feature coming soon!')}>
                  <PetsIcon />
                  Pets Manager
                </button>
              </li>
              <li>
                <button className="admin-menu-item" onClick={() => alert('Feature coming soon!')}>
                  <CalendarIcon />
                  Bookings
                </button>
              </li>
              <li>
                <button className="admin-menu-item" onClick={() => alert('Feature coming soon!')}>
                  <UsersIcon />
                  Clients
                </button>
              </li>
              <li>
                <button className="admin-menu-item" onClick={() => alert('Feature coming soon!')}>
                  <ClipboardIcon />
                  Logs Audit
                </button>
              </li>
            </ul>
          </div>

          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            Sign Out
          </button>
        </aside>

        {/* Content Wrapper */}
        <div className="admin-content">
          {/* Header Panel */}
          <header className="admin-header">
            <h1 className="admin-header-title">Dashboard</h1>
            <div className="admin-profile">
              <button
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={loadAdminDashboardData}
                disabled={adminLoading}
              >
                {adminLoading ? 'Refreshing...' : 'Refresh Logs'}
              </button>
              <div className="admin-profile-info">
                <span className="admin-profile-name">{userProfile?.name || 'Como Admin'}</span>
                <span className="admin-profile-role">{userProfile?.role || 'Administrator'}</span>
              </div>
              <div className="admin-avatar">
                {(userProfile?.name || 'A').substring(0, 1).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="admin-main">
            {/* Metrics cards grid */}
            <section className="admin-metrics-grid">
              <div className="admin-metric-card">
                <div className="admin-metric-icon">
                  <UsersIcon />
                </div>
                <div className="admin-metric-details">
                  <span className="admin-metric-val">{stats.users}</span>
                  <span className="admin-metric-lbl">Total Users</span>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-icon">
                  <ClipboardIcon />
                </div>
                <div className="admin-metric-details">
                  <span className="admin-metric-val">{stats.logs}</span>
                  <span className="admin-metric-lbl">Audit Logs</span>
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-icon">
                  <MailIcon />
                </div>
                <div className="admin-metric-details">
                  <span className="admin-metric-val">{stats.activeOtps}</span>
                  <span className="admin-metric-lbl">Active OTP Requests</span>
                </div>
              </div>
            </section>

            {/* Database Logs Audit table */}
            <section className="admin-table-container">
              <div className="admin-table-header">
                <h2 className="admin-table-title">System Audit Log Trail (Live MySQL)</h2>
              </div>
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Details</th>
                      <th>IP Address</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <span
                              className={`badge ${
                                log.action.includes('SUCCESS') || log.action.includes('SEED')
                                  ? 'badge-success'
                                  : log.action.includes('FAIL') || log.action.includes('ERROR')
                                    ? 'badge-error'
                                    : 'badge-warning'
                              }`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {log.action.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{log.details}</td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {log.ipAddress || '127.0.0.1'}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No audit logs found in the database.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  // Render Authentication Splits Screens (LOGIN, FORGOT_PASSWORD, VERIFY_OTP, RESET_PASSWORD)
  return (
    <div className="login-page">
      {/* Decorative Grid Image Overlay Sidebar */}
      <div className="login-left">
        <Image
          src="/assets/login-image.jpg"
          alt="Welcome pet image"
          fill
          sizes="(max-width: 900px) 0vw, 55vw"
          className="login-image"
          priority
        />
        <div className="login-grid-overlay" />
        <div className="login-overlay" />
        <div className="login-left-content">
          <h2 className="login-left-title">Welcome to CoMo Pet Care</h2>
          <p className="login-left-desc">
            Manage your bookings, clients, pets, payments, and daily schedule from one simple place.
          </p>
        </div>
      </div>

      {/* Action Forms Column Panel */}
      <div className="login-right">
        <div className="login-form-container">
          {/* Back Button (Only on Reset Password and OTP screens) */}
          {view !== 'LOGIN' && (
            <button
              className="back-button"
              onClick={() => {
                setErrorMessage('');
                setSuccessMessage('');
                if (view === 'FORGOT_PASSWORD') setView('LOGIN');
                else if (view === 'VERIFY_OTP') setView('FORGOT_PASSWORD');
                else if (view === 'RESET_PASSWORD') setView('VERIFY_OTP');
              }}
            >
              <ArrowLeftIcon /> Back
            </button>
          )}

          {/* Logo brand frame (Only on Login screen) */}
          {view === 'LOGIN' && (
            <div className="login-logo-wrapper">
              <Image
                src="/assets/como-logo.png"
                alt="CoMo Pet Care Logo"
                width={160}
                height={44}
                className="login-logo"
                priority
              />
            </div>
          )}

          {/* Alert Message Banner */}
          {errorMessage && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && view !== 'VERIFY_OTP' && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
              <span>{successMessage}</span>
            </div>
          )}

          {/* VIEW: LOGIN FORM */}
          {view === 'LOGIN' && (
            <>
              <div className="login-header">
                <h1 className="login-title">Login into your account</h1>
                <p className="login-subtitle">
                  Glad to see you again. Log in to pick up where you left off.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="login-form-row">
                  <label className="remember-me-label" htmlFor="remember-checkbox">
                    <input
                      type="checkbox"
                      id="remember-checkbox"
                      className="remember-me-checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="forgot-password-link"
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      setErrorMessage('');
                      setSuccessMessage('');
                      setView('FORGOT_PASSWORD');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="login-signup-text">
                {"Don't have an account yet?"}
                <a
                  href="#"
                  className="login-signup-link"
                  onClick={() => alert('Feature coming soon!')}
                >
                  Signup
                </a>
              </div>
            </>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'FORGOT_PASSWORD' && (
            <>
              <div className="login-header" style={{ textAlign: 'left' }}>
                <h1 className="login-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Forgot Password
                </h1>
                <p className="login-subtitle" style={{ textAlign: 'left' }}>
                  Please enter your email address and we&apos;ll send you a verification code to
                  reset your password.
                </p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-login"
                  style={{ marginTop: '1.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Sending code...' : 'Send Code'}
                </button>
              </form>
            </>
          )}

          {/* VIEW: VERIFY OTP CODE */}
          {view === 'VERIFY_OTP' && (
            <>
              <div className="login-header" style={{ textAlign: 'left' }}>
                <h1 className="login-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Email Verification
                </h1>
                <p className="login-subtitle" style={{ textAlign: 'left' }}>
                  Please enter the 6 digit verification code that was sent to your email.
                </p>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="login-form">
                <div className="otp-container">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        if (el) otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      maxLength={1}
                      className="otp-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      required
                    />
                  ))}
                </div>

                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>

              <div className="login-signup-text" style={{ marginTop: '2rem' }}>
                {"Didn't receive an email?"}
                <button
                  type="button"
                  className="login-signup-link"
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Resend
                </button>
              </div>
            </>
          )}

          {/* VIEW: RESET NEW PASSWORD */}
          {view === 'RESET_PASSWORD' && (
            <>
              <div className="login-header" style={{ textAlign: 'left' }}>
                <h1 className="login-title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Set your New Password
                </h1>
                <p className="login-subtitle" style={{ textAlign: 'left' }}>
                  Your code has been verified! Please set your new password
                </p>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="new-password"
                      className="form-control"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-login"
                  style={{ marginTop: '1.5rem' }}
                  disabled={loading}
                >
                  {loading ? 'Updating password...' : 'Update Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* --- MODAL DIALOGS OVERLAYS --- */}

      {/* MODAL 1: Resend OTP Code Dialog */}
      {showResendModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="modal-close-btn" onClick={() => setShowResendModal(false)}>
              <CloseIcon />
            </button>
            <div className="modal-icon-wrapper">
              <MailIcon />
            </div>
            <h3 className="modal-title">Resend verification code</h3>
            <p className="modal-subtitle">
              We have just sent an email with a new verification code to <strong>{email}</strong>
            </p>
            <div className="modal-actions">
              <button
                className="modal-btn modal-btn-primary"
                onClick={() => setShowResendModal(false)}
              >
                Got it
              </button>
              <button
                className="modal-btn modal-btn-secondary"
                onClick={() => {
                  setShowResendModal(false);
                  handleResendCode();
                }}
              >
                Send again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Congratulations Success Dialog */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-icon-wrapper">
              <CheckShieldIcon />
            </div>
            <h3 className="modal-title">Congratulations!</h3>
            <p className="modal-subtitle">
              Password Reset successful. You&apos;ll be redirected to the login screen now.
            </p>
            <button
              className="modal-btn modal-btn-primary"
              style={{ width: '100%' }}
              onClick={() => {
                setShowSuccessModal(false);
                setNewPassword('');
                setConfirmPassword('');
                setView('LOGIN');
              }}
            >
              Login Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
