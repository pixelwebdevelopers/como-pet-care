'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Settings.module.css';
import {
  Building2,
  Clock,
  Bell,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Sun,
  Sunset,
  Moon,
  User,
  Upload,
  Trash2,
  Camera,
  Sparkles,
} from 'lucide-react';
import { parseTimeToMinutes, formatMinutesToTime } from '@/lib/availability';

// --- TYPES ---
type SettingsTab = 'profile' | 'business' | 'schedule' | 'notification' | 'policies';

const TIME_OPTIONS = [
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
];

const ALL_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [compressing, setCompressing] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  // Admin Profile Fields
  const [adminName, setAdminName] = useState<string>('Como Admin');
  const [adminEmail, setAdminEmail] = useState<string>('admin@comopetcare.com');
  const [adminRole, setAdminRole] = useState<string>('ADMIN');
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Business Information Fields
  const [businessName, setBusinessName] = useState<string>('CoMo Pet Care');
  const [businessEmail, setBusinessEmail] = useState<string>('info@comopetcare.com');
  const [businessPhone, setBusinessPhone] = useState<string>('(555) 256-2648');
  const [businessAddress, setBusinessAddress] = useState<string>('123 Main St, Columbia, MO 65201');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://comopetcare.com');
  const [serviceArea, setServiceArea] = useState<string>(
    'Columbia metro area and surrounding county areas.',
  );

  // Operating Schedule Fields
  const [openingTime, setOpeningTime] = useState<string>('7:00 AM');
  const [closingTime, setClosingTime] = useState<string>('7:00 PM');
  const [slotInterval, setSlotInterval] = useState<number>(30);
  const [enabledDays, setEnabledDays] = useState<string[]>(ALL_WEEKDAYS);
  const [customSlots, setCustomSlots] = useState<string[]>([]);
  const [enabledSections, setEnabledSections] = useState<string[]>(['morning', 'afternoon', 'evening']);

  // Notification Preferences
  const [adminNotificationEmail, setAdminNotificationEmail] = useState<string>('info@comopetcare.com');
  const [sendCustomerConfirmation, setSendCustomerConfirmation] = useState<boolean>(true);
  const [sendAdminNotification, setSendAdminNotification] = useState<boolean>(true);

  // Booking Policies
  const [minAdvanceHours, setMinAdvanceHours] = useState<number>(2);
  const [requireMeetAndGreet, setRequireMeetAndGreet] = useState<boolean>(true);
  const [cancellationPolicy, setCancellationPolicy] = useState<string>(
    'Cancellations made within 24 hours of appointment may incur a 50% cancellation fee.'
  );

  // Client-side HTML5 Canvas Image Compression (resizes to max 400x400 @ 0.82 JPEG)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Return compressed JPEG data URL
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressedDataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image into canvas for compression'));
        img.src = e.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle Photo File Selection with 2MB Restriction & Canvas Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // 1. Strict 2MB size restriction check
    const maxSizeBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(`Selected file is too large (${sizeMB} MB). Upload limit is 2.0 MB maximum.`);
      e.target.value = '';
      return;
    }

    // 2. MIME type check
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Please upload a valid image file (JPG, PNG, WEBP, GIF).');
      e.target.value = '';
      return;
    }

    try {
      setCompressing(true);
      const compressedBase64 = await compressImage(file);
      setAvatarPreview(compressedBase64);
      setAdminAvatar(compressedBase64);
    } catch (err) {
      setUploadError('Failed to process image. Please try a different photo.');
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  };

  // Handle Remove Photo
  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    setAdminAvatar('');
    setUploadError(null);
  };

  // Load Settings & Admin Profile from API
  const loadSettings = async () => {
    setLoading(true);
    try {
      const [settingsRes, profileRes] = await Promise.all([
        fetch('/api/admin/settings'),
        fetch('/api/admin/profile'),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success && profileData.user) {
          setAdminName(profileData.user.name || 'Como Admin');
          setAdminEmail(profileData.user.email || 'admin@comopetcare.com');
          setAdminRole(profileData.user.role || 'ADMIN');
          if (profileData.user.image) {
            setAdminAvatar(profileData.user.image);
            setAvatarPreview(profileData.user.image);
          }
        }
      }

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.success && data.settings) {
          const s = data.settings;
          setBusinessName(s.businessName || 'CoMo Pet Care');
          setBusinessEmail(s.businessEmail || 'info@comopetcare.com');
          setBusinessPhone(s.businessPhone || '(555) 256-2648');
          setBusinessAddress(s.businessAddress || '123 Main St, Columbia, MO 65201');
          setWebsiteUrl(s.websiteUrl || 'https://comopetcare.com');
          setServiceArea(s.serviceArea || '');

          setOpeningTime(s.openingTime || '7:00 AM');
          setClosingTime(s.closingTime || '7:00 PM');
          setSlotInterval(s.slotInterval || 30);

          if (s.enabledDays) {
            setEnabledDays(s.enabledDays.split(',').map((d: string) => d.trim()));
          }

          if (s.customSlots) {
            try {
              const parsed = JSON.parse(s.customSlots);
              if (Array.isArray(parsed)) setCustomSlots(parsed);
            } catch {
              // fallback
            }
          }

          if (s.enabledSections) {
            setEnabledSections(s.enabledSections.split(',').map((sec: string) => sec.trim()));
          }

          setAdminNotificationEmail(s.adminNotificationEmail || 'info@comopetcare.com');
          setSendCustomerConfirmation(s.sendCustomerConfirmation ?? true);
          setSendAdminNotification(s.sendAdminNotification ?? true);

          setMinAdvanceHours(s.minAdvanceHours ?? 2);
          setRequireMeetAndGreet(s.requireMeetAndGreet ?? true);
          setCancellationPolicy(s.cancellationPolicy || '');
        }
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load settings from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Helper: Generate candidate slots based on opening and closing times
  const generateSlotsForWindow = (start: string, end: string, interval: number): string[] => {
    const startM = parseTimeToMinutes(start);
    const endM = parseTimeToMinutes(end);
    if (endM <= startM) return [start];

    const slots: string[] = [];
    for (let m = startM; m <= endM; m += interval) {
      slots.push(formatMinutesToTime(m));
    }
    return slots;
  };

  // Current window slots
  const availableWindowSlots = generateSlotsForWindow(openingTime, closingTime, slotInterval);

  // Toggle day
  const toggleDay = (day: string) => {
    setEnabledDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Toggle individual custom slot
  const toggleSlot = (slot: string) => {
    setCustomSlots((prev) => {
      const activeList = prev.length > 0 ? prev : availableWindowSlots;
      return activeList.includes(slot)
        ? activeList.filter((s) => s !== slot)
        : [...activeList, slot];
    });
  };

  // Toggle section
  const toggleSection = (section: string) => {
    setEnabledSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Save changes to database
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setFeedback(null);

    // If customSlots is empty, initialize it with all availableWindowSlots
    const finalSlots = customSlots.length > 0 ? customSlots : availableWindowSlots;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessEmail,
          businessPhone,
          businessAddress,
          businessHours: `${openingTime} - ${closingTime}`,
          websiteUrl,
          serviceArea,
          openingTime,
          closingTime,
          slotInterval,
          enabledDays: enabledDays.join(','),
          customSlots: JSON.stringify(finalSlots),
          enabledSections: enabledSections.join(','),
          adminNotificationEmail,
          sendCustomerConfirmation,
          sendAdminNotification,
          minAdvanceHours,
          requireMeetAndGreet,
          cancellationPolicy,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Settings saved successfully! Booking form and availability are now synced.',
        });
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to save settings.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error occurred while saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  // Save Admin Profile
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingProfile(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
          image: adminAvatar === '' ? null : adminAvatar,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: 'success',
          message: 'Admin profile & avatar photo saved successfully!',
        });
        // Dispatch custom event for immediate header sync
        window.dispatchEvent(
          new CustomEvent('admin-profile-updated', {
            detail: {
              name: adminName,
              email: adminEmail,
              image: adminAvatar || null,
            },
          }),
        );
        setTimeout(() => setFeedback(null), 5000);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to save profile.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Network error occurred while saving profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Subheader Title */}
      <div className="dashboard-title-bar">
        <div className="dashboard-title-group">
          <h1 className="dashboard-overview-title">Business Settings</h1>
          <span className="dashboard-breadcrumb">Dashboard &gt; Settings</span>
        </div>
      </div>

      <div className={styles.settingsCard}>
        {/* Card Header */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Platform Configurations</h2>
          <p className={styles.cardSubtitle}>
            {loading
              ? 'Loading active business settings...'
              : 'Configure admin profile, operational hours, availability slots, notifications, and business policies.'}
          </p>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`${styles.alertBanner} ${
              feedback.type === 'success' ? styles.alertBannerSuccess : styles.alertBannerError
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'profile' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Admin Profile
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'business' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <Building2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Business Info
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'schedule' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Operating Hours &amp; Slots
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notification' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('notification')}
            >
              <Bell size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Notifications &amp; Email
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'policies' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('policies')}
            >
              <FileCheck size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Booking Policies
            </button>
          </div>
        </div>

        {/* TAB 0: ADMIN PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Administrator Profile &amp; Avatar</h3>

            {/* Profile Picture Upload Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileCardHeader}>
                <h4 className={styles.profileCardTitle}>Profile Picture</h4>
                <p className={styles.profileCardDesc}>
                  Upload a custom avatar for the administrator dashboard. Photos are automatically compressed client-side.
                </p>
              </div>

              {uploadError && (
                <div className={styles.uploadErrorBanner}>
                  <AlertCircle size={16} />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className={styles.profileAvatarSection}>
                <div className={styles.profileAvatarWrapper}>
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Administrator Avatar Preview"
                      className={styles.profileAvatarImg}
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>

                <div className={styles.profileAvatarActions}>
                  <div className={styles.profileButtonRow}>
                    <label className={styles.btnUploadPhoto}>
                      <Camera size={15} />
                      <span>{compressing ? 'Compressing...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                        disabled={compressing}
                      />
                    </label>

                    {avatarPreview && (
                      <button
                        type="button"
                        className={styles.btnRemovePhoto}
                        onClick={handleRemovePhoto}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <p className={styles.profileHelpText}>
                    Allowed formats: JPG, PNG, WEBP, or GIF. Max upload size is <strong>2.0 MB</strong>.
                  </p>

                  <div className={styles.badgeCompressed}>
                    <Sparkles size={12} />
                    <span>Auto-compressed for instant loading &amp; small database size</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Profile Details */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admin Display Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  required
                  className={styles.formInput}
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>User Role</label>
                <input
                  type="text"
                  disabled
                  className={styles.formInput}
                  value={adminRole}
                  style={{ backgroundColor: 'var(--soft-cream)', opacity: 0.8 }}
                />
                <span className={styles.formHelper}>Standard administrator system role.</span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={savingProfile || compressing}>
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 1: BUSINESS INFORMATION */}
        {activeTab === 'business' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Business Profile</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business Name</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Public Business Email</label>
                <input
                  type="email"
                  required
                  className={styles.formInput}
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business Phone Number</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website URL</label>
                <input
                  type="url"
                  className={styles.formInput}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Physical Office / Service Address</label>
                <input
                  type="text"
                  required
                  className={styles.formInput}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Service Area Coverage</label>
                <textarea
                  className={styles.formTextarea}
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Shown to clients during booking to confirm they are within service boundaries (e.g. Columbia, MO).
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Business Info'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: OPERATING HOURS & TIME SLOTS */}
        {activeTab === 'schedule' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Operating Hours &amp; Booking Slots</h3>
            <p style={{ textAlign: 'center', fontSize: '13.5px', color: 'var(--text-muted)', margin: '-12px 0 12px 0' }}>
              Set starting and ending times or pick specific active operation slots. Configure sections to show in the client booking form.
            </p>

            {/* Operating Window & Interval */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Daily Starting Time</label>
                <select
                  className={styles.formInput}
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`start-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className={styles.formHelper}>Earliest available appointment slot</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Daily Ending Time</label>
                <select
                  className={styles.formInput}
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={`end-${t}`} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <span className={styles.formHelper}>Latest available appointment slot</span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Slot Duration / Interval</label>
                <select
                  className={styles.formInput}
                  value={slotInterval}
                  onChange={(e) => setSlotInterval(parseInt(e.target.value, 10))}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes (Recommended)</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1 Hour)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Quick Slot Actions</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button
                    type="button"
                    className={styles.dayPill}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setCustomSlots([...availableWindowSlots])}
                  >
                    Select All Slots
                  </button>
                  <button
                    type="button"
                    className={styles.dayPill}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setCustomSlots([])}
                  >
                    Reset to Window
                  </button>
                </div>
              </div>

              {/* Operating Days */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Operating Days of the Week</label>
                <div className={styles.daysContainer}>
                  {ALL_WEEKDAYS.map((day) => {
                    const active = enabledDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`${styles.dayPill} ${active ? styles.dayPillActive : ''}`}
                        onClick={() => toggleDay(day)}
                      >
                        {day} {active ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
                <span className={styles.formHelper}>Select days when pet care services are available for booking.</span>
              </div>

              {/* Booking Form Sections Sync */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>
                  Booking Form Filter Sections (Shown to Clients in Booking Form)
                </label>
                <div className={styles.sectionsContainer}>
                  {/* Morning */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('morning') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('morning')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sun size={18} style={{ color: '#d97706' }} />
                        <span className={styles.sectionTitleBadge}>Morning Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('morning')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times between 7:00 AM – 11:30 AM. Visible in client booking flow.
                    </p>
                  </div>

                  {/* Afternoon */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('afternoon') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('afternoon')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sunset size={18} style={{ color: '#b45309' }} />
                        <span className={styles.sectionTitleBadge}>Afternoon Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('afternoon')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times between 12:00 PM – 4:30 PM. Visible in client booking flow.
                    </p>
                  </div>

                  {/* Evening */}
                  <div
                    className={`${styles.sectionCard} ${
                      enabledSections.includes('evening') ? styles.sectionCardActive : ''
                    }`}
                    onClick={() => toggleSection('evening')}
                  >
                    <div className={styles.sectionCardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Moon size={18} style={{ color: '#4338ca' }} />
                        <span className={styles.sectionTitleBadge}>Evening Section</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={enabledSections.includes('evening')}
                        onChange={() => {}}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <p className={styles.sectionCardDesc}>
                      Times from 5:00 PM onwards. Visible in client booking flow.
                    </p>
                  </div>
                </div>
              </div>

              {/* Multi-slot Matrix Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.formLabel}>
                    Active Time Slots ({customSlots.length > 0 ? customSlots.length : availableWindowSlots.length} active)
                  </label>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Click any slot to enable/disable it
                  </span>
                </div>

                <div className={styles.slotsGridContainer}>
                  {availableWindowSlots.map((slot) => {
                    const isActive =
                      customSlots.length === 0 || customSlots.includes(slot);
                    return (
                      <div
                        key={slot}
                        className={`${styles.slotChip} ${isActive ? styles.slotChipActive : ''}`}
                        onClick={() => toggleSlot(slot)}
                      >
                        {slot}
                      </div>
                    );
                  })}
                </div>
                <span className={styles.formHelper}>
                  Clients will only be able to book the slots highlighted in dark green above.
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Schedule & Slots'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: NOTIFICATIONS & EMAIL */}
        {activeTab === 'notification' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Email &amp; Notification Preferences</h3>

            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Admin Alert Notification Email(s)</label>
                <input
                  type="text"
                  required
                  placeholder="admin@comopetcare.com, staff@comopetcare.com"
                  className={styles.formInput}
                  value={adminNotificationEmail}
                  onChange={(e) => setAdminNotificationEmail(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Comma-separated emails that receive instant booking alert notifications.
                </span>
              </div>

              {/* Customer Booking Confirmation Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Send Customer Booking Confirmation Email</span>
                    <span className={styles.toggleSubtitle}>
                      Automatically sends a branded, professional receipt &amp; intake instructions to the client.
                    </span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      sendCustomerConfirmation ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setSendCustomerConfirmation(!sendCustomerConfirmation)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>

              {/* Admin Alert Email Toggle */}
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Send Admin Notification Email on New Bookings</span>
                    <span className={styles.toggleSubtitle}>
                      Alerts operations immediately with customer details, pet care routine, and payment status.
                    </span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      sendAdminNotification ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setSendAdminNotification(!sendAdminNotification)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Notifications'}
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: BOOKING POLICIES */}
        {activeTab === 'policies' && (
          <form onSubmit={handleSave} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Booking &amp; Service Policies</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Minimum Advance Notice (Hours)</label>
                <input
                  type="number"
                  min={0}
                  max={72}
                  className={styles.formInput}
                  value={minAdvanceHours}
                  onChange={(e) => setMinAdvanceHours(parseInt(e.target.value, 10) || 0)}
                />
                <span className={styles.formHelper}>
                  Prevents same-day last-minute bookings without prior notice.
                </span>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.toggleRow} style={{ marginTop: '18px' }}>
                  <div className={styles.toggleLabelGroup}>
                    <span className={styles.toggleTitle}>Require Meet &amp; Greet</span>
                    <span className={styles.toggleSubtitle}>For all first-time clients</span>
                  </div>
                  <div
                    className={`${styles.toggleSwitch} ${
                      requireMeetAndGreet ? styles.toggleSwitchOn : ''
                    }`}
                    onClick={() => setRequireMeetAndGreet(!requireMeetAndGreet)}
                  >
                    <div className={styles.toggleKnob} />
                  </div>
                </div>
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Cancellation Policy Statement</label>
                <textarea
                  className={styles.formTextarea}
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                />
                <span className={styles.formHelper}>
                  Shown on booking confirmation and email receipts.
                </span>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={loadSettings}>
                Reset
              </button>
              <button type="submit" className={styles.btnSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Policies'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
