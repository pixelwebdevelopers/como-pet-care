'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, ArrowLeft, X, Mail, ShieldCheck, RefreshCw } from 'lucide-react';


// Dashboard Modular Components
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import MetricCards from '@/components/dashboard/MetricCards';
import TodaySchedule from '@/components/dashboard/TodaySchedule';
import UpcomingBookings from '@/components/dashboard/UpcomingBookings';
import CalendarOverview from '@/components/dashboard/CalendarOverview';
import RecentActivity from '@/components/dashboard/RecentActivity';
import Waitlist from '@/components/dashboard/Waitlist';
import RecentPayments from '@/components/dashboard/RecentPayments';
import Bookings from '@/components/dashboard/Bookings';
import CalendarPage from '@/components/dashboard/CalendarPage';
import Clients from '@/components/dashboard/Clients';
import Pets from '@/components/dashboard/Pets';
import Services from '@/components/dashboard/Services';
import Payments from '@/components/dashboard/Payments';
import WaitlistPage from '@/components/dashboard/WaitlistPage';
import Settings from '@/components/dashboard/Settings';

// --- ICON COMPONENTS ---
const EyeIcon = () => <Eye size={20} />;
const EyeSlashIcon = () => <EyeOff size={20} />;
const ArrowLeftIcon = () => <ArrowLeft size={16} />;
const CloseIcon = () => <X size={18} />;
const MailIcon = () => <Mail size={22} />;
const CheckShieldIcon = () => <ShieldCheck size={28} />;

// --- TYPES ---
type ActiveView = 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFY_OTP' | 'RESET_PASSWORD' | 'ADMIN_PORTAL';

interface AdminStats {
  users: number;
  logs: number;
  activeOtps: number;
}

export default function AuthControllerPage() {
  // Navigation State
  const [view, setView] = useState<ActiveView>('LOGIN');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);

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
  const [dashboardData, setDashboardData] = useState<{
    metrics?: {
      bookingsToday: number;
      visitsThisWeek: number;
      revenueThisWeek: string;
      activeClients: number;
      activePets: number;
    };
    todaySchedule?: any[];
    upcomingBookings?: any[];
    recentActivity?: any[];
    waitlist?: any[];
  } | null>(null);

  // OTP inputs references for auto-focusing
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

  // Fetch admin stats from MySQL database
  const loadAdminDashboardData = async () => {
    try {
      const [logsRes, dashRes] = await Promise.all([
        fetch('/api/admin/logs'),
        fetch('/api/admin/dashboard'),
      ]);
      if (logsRes.ok) {
        const data = await logsRes.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
      if (dashRes.ok) {
        const dash = await dashRes.json();
        if (dash.success) {
          setDashboardData(dash);
        }
      }
    } catch {
      console.error('Failed to load database stats.');
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
            await loadAdminDashboardData();
            setView('ADMIN_PORTAL');
          }
        }
      } catch {
        // Safe to ignore, session is expired or not set
      } finally {
        setSessionChecking(false);
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

  // Render loading skeleton/spinner while checking active sessions on mount
  if (sessionChecking) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf8f5',
        }}
      >
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <div
            className="spinner"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '3px solid #efe7d8',
              borderTopColor: '#123f3c',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#123f3c' }}>
            Loading your space...
          </span>
        </div>
      </div>
    );
  }

  // Render Admin Portal dashboard
  if (view === 'ADMIN_PORTAL') {
    return (
      <div className="dashboard-layout">
        {/* Sidebar Panel */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Content Wrapper */}
        <div className="dashboard-content">
          {/* Header Panel */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onLogoutClick={handleLogout}
            adminName={userProfile?.name || 'Como Admin'}
            onNavigateTab={setActiveTab}
          />

          {/* Main Content Area */}
          <main className="dashboard-main-area">
            {activeTab === 'dashboard' && (
              <>
                {/* Dashboard Sub-Header */}
                <div className="dashboard-title-bar">
                  <div className="dashboard-title-group">
                    <h1 className="dashboard-overview-title">Dashboard Overview</h1>
                    <span className="dashboard-breadcrumb">Home &gt; Dashboard</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={loadAdminDashboardData}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #efe7d8',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--foreground)',
                      }}
                    >
                      <RefreshCw size={14} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Metrics cards grid */}
                <MetricCards
                  bookingsToday={dashboardData?.metrics?.bookingsToday ?? 0}
                  visitsThisWeek={dashboardData?.metrics?.visitsThisWeek ?? 0}
                  revenueThisWeek={dashboardData?.metrics?.revenueThisWeek ?? '$0.00'}
                  activeClients={dashboardData?.metrics?.activeClients ?? (stats.users || 0)}
                />

                {/* Columns Dashboard Grid Layout */}
                <div className="dashboard-columns-grid">
                  <TodaySchedule
                    items={dashboardData?.todaySchedule}
                    onViewAll={() => setActiveTab('bookings')}
                  />
                  <UpcomingBookings
                    bookings={dashboardData?.upcomingBookings}
                    onViewAll={() => setActiveTab('bookings')}
                  />
                  <CalendarOverview />
                  <RecentActivity
                    activities={dashboardData?.recentActivity}
                    onViewAll={() => setActiveTab('bookings')}
                  />
                  <Waitlist
                    items={dashboardData?.waitlist}
                    onViewAll={() => setActiveTab('waitlist')}
                  />
                  <RecentPayments
                    onViewAll={() => setActiveTab('payments')}
                  />
                </div>
              </>
            )}

            {activeTab === 'bookings' && <Bookings />}

            {activeTab === 'calendar' && <CalendarPage />}

            {activeTab === 'clients' && <Clients />}

            {activeTab === 'pets' && <Pets />}

            {activeTab === 'services' && <Services />}

            {activeTab === 'payments' && <Payments />}

            {activeTab === 'waitlist' && <WaitlistPage />}

            {activeTab === 'settings' && <Settings />}

            {activeTab !== 'dashboard' &&
              activeTab !== 'bookings' &&
              activeTab !== 'calendar' &&
              activeTab !== 'clients' &&
              activeTab !== 'pets' &&
              activeTab !== 'services' &&
              activeTab !== 'payments' &&
              activeTab !== 'waitlist' &&
              activeTab !== 'settings' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 24px',
                    textAlign: 'center',
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <h2 style={{ color: 'var(--foreground)', marginBottom: '8px' }}>
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
                    This screen is currently under construction.
                  </p>
                </div>
              )}
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

              <div
                className="login-signup-text"
                style={{
                  marginTop: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div>
                  {"Don't have an account yet? "}
                  <a
                    href="#"
                    className="login-signup-link"
                    onClick={() => alert('Feature coming soon!')}
                  >
                    Register
                  </a>
                </div>
                <div>
                  {'Looking to book a service? '}
                  <a
                    href="/booking"
                    className="login-signup-link"
                    style={{ fontWeight: '700', color: 'var(--primary, #123f3c)' }}
                  >
                    Go to Customer Booking Flow →
                  </a>
                </div>
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
