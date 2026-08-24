'use client';

import React, { useState } from 'react';
import styles from './Settings.module.css';

// --- TSX TYPES & INTERFACES ---
type SettingsTab = 'business' | 'booking' | 'notification' | 'service' | 'admin';

export default function Settings() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');

  // Business Information Fields
  const [businessName, setBusinessName] = useState<string>('CoMo Pet Care');
  const [businessEmail, setBusinessEmail] = useState<string>('info@comopetcare.com');
  const [businessPhone, setBusinessPhone] = useState<string>('(555) 256-2648');
  const [businessAddress, setBusinessAddress] = useState<string>('123 Main St, Columbia, MO 65201');
  const [businessHours, setBusinessHours] = useState<string>('8:00 AM - 6:00 PM');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://comopetcare.com');
  const [serviceArea, setServiceArea] = useState<string>(
    'Columbia metro area and surrounding county areas.',
  );

  // --- ACTIONS ---
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Settings updated successfully!\n\nBusiness: ${businessName}\nEmail: ${businessEmail}\nPhone: ${businessPhone}\nHours: ${businessHours}`,
    );
  };

  const handleCancel = () => {
    // Reset values to seeded defaults
    setBusinessName('CoMo Pet Care');
    setBusinessEmail('info@comopetcare.com');
    setBusinessPhone('(555) 256-2648');
    setBusinessAddress('123 Main St, Columbia, MO 65201');
    setBusinessHours('8:00 AM - 6:00 PM');
    setWebsiteUrl('https://comopetcare.com');
    setServiceArea('Columbia metro area and surrounding county areas.');
    alert('Changes discarded and reset to defaults.');
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Subheader Title */}
      <div className="dashboard-title-bar">
        <h1 className="dashboard-overview-title">Settings</h1>
        <span className="dashboard-breadcrumb">Home &gt; Settings</span>
      </div>

      <div className={styles.settingsCard}>
        {/* Card titles */}
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Settings</h2>
          <p className={styles.cardSubtitle}>Review and manage your settings.</p>
        </div>

        {/* Settings Tab row */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button
              className={`${styles.tabButton} ${activeTab === 'business' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('business')}
            >
              Business Information
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'booking' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('booking')}
            >
              Booking Preferences
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'notification' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('notification')}
            >
              Notification Preferences
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'service' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('service')}
            >
              Service Settings
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'admin' ? styles.tabButtonActive : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Profile
            </button>
          </div>
        </div>

        {/* Tab contents */}
        {activeTab === 'business' ? (
          <form onSubmit={handleSaveChanges} className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Business Information</h3>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business phone number</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business address</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Business hours</label>
                <input
                  type="text"
                  required
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Website URL</label>
                <input
                  type="url"
                  placeholder="Enter here"
                  className={styles.formInput}
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.formLabel}>Service area description</label>
                <textarea
                  placeholder="Enter here"
                  className={styles.formTextarea}
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnCancel} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={styles.btnSave}>
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div
            style={{
              padding: '64px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--warm-ivory, #f7f4ed)',
              borderRadius: 'var(--radius-md, 12px)',
              border: '1px dashed var(--card-border, #efe7d8)',
            }}
          >
            <h3 style={{ color: 'var(--primary)', margin: '0 0 8px 0', fontSize: '18px' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              This section is currently under construction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
