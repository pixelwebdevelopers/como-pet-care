import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPublishedLegalDocuments, DEFAULT_PET_CARE_WAIVER } from '@/lib/legal-defaults';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Pet Care Waiver & Release of Liability | CoMo Pet Care',
  description: 'Official Pet Care Waiver and Release of Liability for CoMo Pet Care services in Columbia, Missouri.',
};

import LegalDocumentViewer from '@/components/legal/LegalDocumentViewer';

export default async function WaiverPage() {
  const { waiver } = await getPublishedLegalDocuments();
  const content = waiver?.content || DEFAULT_PET_CARE_WAIVER;
  const version = waiver?.version || 'v1.0';
  const effectiveDate = waiver?.effectiveDate || 'September 1, 2026';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#1e293b' }}>
      {/* Top Header Navigation */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#059669',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                src="/assets/como-logo.png"
                alt="CoMo Pet Care"
                width={130}
                height={38}
                style={{ objectFit: 'contain' }}
              />
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              href="/terms"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#475569',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
              }}
            >
              <FileText size={15} /> View Terms &amp; Conditions
            </Link>
            <Link
              href="/booking"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                backgroundColor: '#059669',
              }}
            >
              Book Service
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
        <LegalDocumentViewer
          title="Pet Care Waiver & Release of Liability (35 Sections)"
          version={version}
          effectiveDate={effectiveDate}
          content={content}
          showTableOfContents={true}
        />
      </main>
    </div>
  );
}
